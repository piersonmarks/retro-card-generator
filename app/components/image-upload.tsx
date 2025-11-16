"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { decodeXPaymentResponse, wrapFetchWithPayment } from "x402-fetch";
import { z } from "zod";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Label } from "@/components/ui/8bit/label";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { getClientWallet } from "@/lib/wallet/client";
import { useWallet } from "../hooks/use-wallet";

// Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  birthday: z.string().min(1, { message: "Birthday is required" }),
  image: z
    .union([
      z.instanceof(File, { message: "Please select a file to upload" }),
      z.undefined(),
    ])
    .refine((file): file is File => file instanceof File, {
      message: "Please select a file to upload",
    })
    .refine((file) => file instanceof File && file.type.startsWith("image/"), {
      message: "Please upload a valid image file",
    })
    .refine(
      (file) => file instanceof File && file.size <= 10 * 1024 * 1024, // 10MB
      { message: "Image size must be less than 10MB" }
    ),
});

type FormValues = z.infer<typeof formSchema>;

function handleMessage(
  data: { type: string; message?: string; url?: string },
  onProgress: (msg: string) => void,
  onSuccess: (url: string) => void
) {
  if (data.type === "progress") {
    onProgress(data.message || "");
  } else if (data.type === "success") {
    onSuccess(data.url || "");
  } else if (data.type === "error") {
    throw new Error(data.message);
  }
}

async function readStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onProgress: (msg: string) => void,
  onSuccess: (url: string) => void
) {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }
      handleMessage(JSON.parse(line), onProgress, onSuccess);
    }
  }
}

async function submitFormData(
  formData: FormData,
  onProgress: (msg: string) => void,
  onSuccess: (url: string) => void
) {
  // Get the user's wallet for payment
  const walletClient = await getClientWallet();

  // Wrap fetch with x402 payment functionality
  // biome-ignore lint/suspicious/noExplicitAny: viem WalletClient type compatibility with x402-fetch
  const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient as any);

  const response = await fetchWithPayment("/api/generate-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to process image");
  }

  // Log payment response if available
  const paymentResponseHeader = response.headers.get("x-payment-response");
  if (paymentResponseHeader) {
    const paymentResponse = decodeXPaymentResponse(paymentResponseHeader);
    console.log("Payment successful:", paymentResponse);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response stream available");
  }

  await readStream(reader, onProgress, onSuccess);
}

export default function ImageUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isConnected, connect } = useWallet();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthday: "",
      image: undefined,
    },
    mode: "onChange",
  });

  const watchedFile = form.watch("image");
  const isSubmitting = form.formState.isSubmitting;

  // Sync preview with form value
  useEffect(() => {
    if (watchedFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(watchedFile);
    } else {
      setUploadedImage(null);
    }
  }, [watchedFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, onChange: (file: File) => void) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onChange(droppedFile);
      }
    },
    []
  );

  const handleRemove = useCallback(() => {
    form.reset();
    setGeneratedCardUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [form]);

  const handleDownload = useCallback(async () => {
    if (!generatedCardUrl) {
      return;
    }

    try {
      // Fetch the image as a blob to force download
      const response = await fetch(generatedCardUrl);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create and click download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "pokemon-card.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }, [generatedCardUrl]);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!(data.image && data.image instanceof File)) {
        form.setError("image", {
          type: "manual",
          message: "Please select an image file",
        });
        return;
      }

      // Check if wallet is connected, if not, prompt connection
      if (!isConnected) {
        try {
          await connect();
        } catch {
          form.setError("image", {
            type: "manual",
            message: "Please connect your wallet to generate a card",
          });
          return;
        }
      }

      const file = data.image;

      try {
        setProgressMessage("Starting...");
        setGeneratedCardUrl(null);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("name", data.name);
        formData.append("birthday", data.birthday);

        await submitFormData(
          formData,
          (msg) => setProgressMessage(msg),
          (url) => {
            setProgressMessage("");
            setGeneratedCardUrl(url);
          }
        );
      } catch (err) {
        setProgressMessage("");
        setGeneratedCardUrl(null);
        form.setError("image", {
          type: "manual",
          message: err instanceof Error ? err.message : "An error occurred",
        });
      }
    },
    [form, isConnected, connect]
  );

  // If card is generated, show the result view instead of the form
  if (generatedCardUrl) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div
          className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
          style={{ aspectRatio: "5/7", maxWidth: "500px" }}
        >
          <Image
            alt="Generated Pokemon card"
            className="h-full w-full object-contain"
            fill
            src={generatedCardUrl}
            unoptimized
          />
        </div>
        <div className="flex w-full max-w-[500px] gap-4">
          <Button className="flex-1" onClick={handleDownload} type="button">
            Download Card
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setGeneratedCardUrl(null);
              setUploadedImage(null);
              form.reset();
            }}
            type="button"
            variant="outline"
          >
            Create Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Card Details</FieldLegend>
          <FieldDescription>
            Enter the details for your card and upload an image.
          </FieldDescription>

          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter name"
                type="text"
                {...form.register("name")}
                aria-invalid={!!form.formState.errors.name}
              />
              {form.formState.errors.name && (
                <FieldError errors={[form.formState.errors.name]} />
              )}
            </Field>

            <Field>
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                {...form.register("birthday")}
                aria-invalid={!!form.formState.errors.birthday}
              />
              {form.formState.errors.birthday && (
                <FieldError errors={[form.formState.errors.birthday]} />
              )}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Controller
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="image-upload">Select Image</FieldLabel>
                  {uploadedImage ? (
                    <>
                      <div className="relative aspect-square max-w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                        <Image
                          alt="Uploaded image preview"
                          className="h-full w-full object-cover object-center"
                          height={800}
                          src={uploadedImage}
                          unoptimized
                          width={800}
                        />
                        <Button
                          className="absolute top-2 right-2"
                          onClick={handleRemove}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Remove
                        </Button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          id="image-upload-error"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {/* biome-ignore lint: This is a standard file upload pattern */}
                      <div
                        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
                          isDragging
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
                        }
                        `}
                        onClick={() => fileInputRef.current?.click()}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, field.onChange)}
                      >
                        <input
                          accept="image/*"
                          aria-describedby={
                            fieldState.invalid
                              ? "image-upload-error"
                              : undefined
                          }
                          aria-invalid={fieldState.invalid}
                          className="hidden"
                          id="image-upload"
                          name={field.name}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                            }
                          }}
                          ref={fileInputRef}
                          type="file"
                        />
                        <div className="pointer-events-none flex flex-col items-center gap-4 text-center">
                          <FieldContent>
                            <p className="font-medium text-lg text-zinc-900 dark:text-zinc-100">
                              Drag and drop an image here
                            </p>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                              or click to browse
                            </p>
                          </FieldContent>
                        </div>
                      </div>
                      {!fieldState.invalid && (
                        <FieldDescription>
                          Supports PNG, JPG, GIF, and other image formats (max
                          10MB)
                        </FieldDescription>
                      )}
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          id="image-upload-error"
                        />
                      )}
                    </>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        {uploadedImage && (
          <FieldSet>
            <FieldGroup>
              <Field>
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? progressMessage || "Processing..."
                    : "Generate Card"}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        )}
      </FieldGroup>
    </form>
  );
}

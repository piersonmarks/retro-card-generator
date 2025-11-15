"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/8bit/button";
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

// Zod schema for form validation
const formSchema = z.object({
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

export default function ImageUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [form]);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!(data.image && data.image instanceof File)) {
        form.setError("image", {
          type: "manual",
          message: "Please select an image file",
        });
        return;
      }

      const file = data.image;

      try {
        // Create FormData to send the file
        const formData = new FormData();
        formData.append("image", file);

        // Submit to API endpoint
        const response = await fetch("/api/generate-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to process image");
        }

        // Handle success - you can process the response here
        const result = await response.text();
        console.log("Image processed:", result);
      } catch (err) {
        form.setError("image", {
          type: "manual",
          message: err instanceof Error ? err.message : "An error occurred",
        });
      }
    },
    [form]
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Image Upload</FieldLegend>
          <FieldDescription>
            Upload an image to generate your Pokemon card. All images are
            processed securely.
          </FieldDescription>

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
                  {isSubmitting ? "Processing..." : "Generate Card"}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        )}
      </FieldGroup>
    </form>
  );
}

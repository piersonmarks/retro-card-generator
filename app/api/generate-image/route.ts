import type { NextRequest } from "next/server";
import { start } from "workflow/api";
import { withPayment } from "@/app/handlers/with-payment";
import { generateCardWorkflow } from "@/app/workflows/generate-card";

export const POST = withPayment(
  async (request: NextRequest) => {
    const formData = await request.formData();

    const imageFile = formData.get("image") as File;
    const name = formData.get("name") as string;
    const birthday = formData.get("birthday") as string;

    const arrayBuffer = await imageFile.arrayBuffer();
    const imageData = new Uint8Array(arrayBuffer);

    const run = await start(generateCardWorkflow, [
      {
        image: imageData,
        name,
        birthday,
      },
    ]);

    // Get the readable stream and return it as a response
    const stream = run.getReadable();
    return new Response(stream, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
  },
  {
    price: "$0.01",
    network: "base-sepolia",
    payTo: "0x716650ba0c23A6bA536ca0b74d89e903F0F673e1",
    description:
      "Generate a custom Pokemon card with AI-generated artwork from an uploaded image",
  }
);

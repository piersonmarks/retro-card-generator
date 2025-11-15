"use step";

import { fal } from "@ai-sdk/fal";
import { fal as falClient } from "@fal-ai/client";
import { experimental_generateImage as generateImage } from "ai";

export async function generateImageStep(imageFile: File) {
  // Upload the file to fal.ai storage to get a URL
  const imageUrl = await falClient.storage.upload(imageFile);

  const { image } = await generateImage({
    model: fal.image("fal-ai/nano-banana/edit"),
    prompt: "Edit the image to make it a retro Pokemon card",
    providerOptions: {
      fal: {
        num_images: 1,
        aspect_ratio: "auto",
        output_format: "jpeg",
        image_urls: [imageUrl],
      },
    },
  });

  return image.uint8Array;
}

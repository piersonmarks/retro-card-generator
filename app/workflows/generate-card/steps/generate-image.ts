"use step";

import { fal } from "@ai-sdk/fal";
import { fal as falClient } from "@fal-ai/client";
import { experimental_generateImage as generateImage } from "ai";
import { getWritable } from "workflow";
import type { PokemonType } from "@/app/types";

export async function generateImageStep(
  imageData: Uint8Array,
  type: PokemonType
) {
  const writable = getWritable();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  try {
    await writer.write(
      encoder.encode(
        `${JSON.stringify({ type: "progress", message: "Generating retro image..." })}\n`
      )
    );

    // Convert Uint8Array to Blob for fal.ai storage upload
    const buffer = new Uint8Array(imageData).buffer;
    const imageBlob = new Blob([buffer]);

    // Upload the blob to fal.ai storage to get a URL
    const imageUrl = await falClient.storage.upload(imageBlob);

    const { image } = await generateImage({
      model: fal.image("fal-ai/nano-banana/edit"),
      prompt: `Edit this image so its Retro 90s Pokémon character art style, soft pixel art aesthetic,
        Ken Sugimori watercolor painting with subtle pixelation, gentle dithered shading, pastel color palette,
         thick black outlines, centered composition, minimal background with light gradient,
         vintage Pokémon TCG meets Game Boy Color graphics, Generation 1 illustration style with light pixel texture,
         semi-pixelated details. It should be 32-bit soft pixel art.

         The main character should be in the center of the image, full body, and then based on the provided type,
         design the background and other details around the character.

         The type is ${type}.`,
      providerOptions: {
        fal: {
          num_images: 1,
          aspect_ratio: "1:1",
          output_format: "jpeg",
          image_urls: [imageUrl],
        },
      },
    });

    return image.base64;
  } finally {
    writer.releaseLock();
  }
}

import React from "react";
import satori from "satori";
import { getWritable } from "workflow";
import { PokemonCard } from "@/app/templates/pokemon-card";
import type { PokemonType } from "@/app/types";
import { loadFonts } from "@/app/utils/fonts";
import { saveBlob } from "@/app/utils/save-blob";
import { svgToImage } from "@/app/utils/svg-to-image";

export async function generateCardStep({
  image,
  name,
  birthday,
  type,
  specialAbility,
  specialAbilityDescription,
}: {
  image: string;
  name: string;
  birthday: string;
  type: PokemonType;
  specialAbility: string;
  specialAbilityDescription: string;
}) {
  "use step";

  const writable = getWritable();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  try {
    await writer.write(
      encoder.encode(
        `${JSON.stringify({ type: "progress", message: "Creating Pokemon card..." })}\n`
      )
    );

    // Load the pixel font
    const fontData = await loadFonts([
      {
        name: "Press+Start+2P",
        weight: 400,
        style: "normal",
      },
    ]);

    // Card dimensions: Standard Pokemon card ratio is 5:7 (2.5" x 3.5")
    const imageWidth = 500;
    const imageHeight = 700;

    // Ensure the image is a proper data URI for Satori
    const imageDataUri = image.startsWith("data:")
      ? image
      : `data:image/jpeg;base64,${image}`;

    const svg = await satori(
      React.createElement(PokemonCard, {
        imageUrl: imageDataUri,
        name,
        birthday,
        type,
        specialAbility,
        specialAbilityDescription,
      }),
      {
        width: imageWidth,
        height: imageHeight,
        fonts: fontData,
      }
    );

    // Convert the SVG to a PNG image
    const blob = svgToImage(svg, imageWidth);

    // Save the image to the blob storage
    const url = await saveBlob(blob, "card.png");

    await writer.write(
      encoder.encode(`${JSON.stringify({ type: "success", url })}\n`)
    );

    return url;
  } catch (error) {
    await writer.write(
      encoder.encode(
        `${JSON.stringify({
          type: "error",
          message: error instanceof Error ? error.message : "An error occurred",
        })}\n`
      )
    );
    throw error;
  } finally {
    writer.releaseLock();
  }
}

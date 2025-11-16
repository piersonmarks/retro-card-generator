import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { getWritable } from "workflow";
import { z } from "zod";
import type { PokemonAnalysis } from "@/app/types";

export async function analyzeImageStep(
  image: Uint8Array
): Promise<PokemonAnalysis> {
  "use step";

  const writable = getWritable();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  try {
    await writer.write(
      encoder.encode(
        `${JSON.stringify({ type: "progress", message: "Analyzing image..." })}\n`
      )
    );

    // Use AI SDK to analyze the image
    const result = await generateObject({
      model: openai("gpt-5-mini"),
      schema: z.object({
        type: z
          .enum([
            "Fire",
            "Water",
            "Grass",
            "Electric",
            "Psychic",
            "Dark",
            "Fairy",
            "Fighting",
            "Normal",
            "Dragon",
            "Ice",
            "Rock",
            "Ground",
            "Flying",
            "Bug",
            "Poison",
            "Ghost",
            "Steel",
          ])
          .describe(
            "The Pokemon type based on the person's appearance, background, clothing, age, and overall vibe. Consider elements like: Fire (passionate, energetic, warm colors), Water (calm, flowing, blue tones), Grass (natural, green, outdoorsy), Electric (energetic, bright, tech-savvy), Psychic (mysterious, intelligent, purple/pink tones), Dark (edgy, mysterious, dark colors), Fairy (whimsical, pink, magical), Fighting (athletic, strong, determined), Normal (balanced, everyday), Dragon (powerful, majestic), Ice (cool, calm, winter vibes), Rock (solid, grounded), Ground (earthy, practical), Flying (free-spirited, light), Bug (quirky, small details), Poison (alternative, bold), Ghost (mysterious, pale), Steel (sleek, modern, metallic)"
          ),
        specialAbility: z
          .string()
          .describe(
            "A creative and fun special ability name for this person as a Pokemon. Make it clever, punny, or related to their personality, appearance, or what makes them unique. Keep it short and catchy (2-4 words max)."
          ),
        specialAbilityDescription: z
          .string()
          .describe(
            "A creative description of the special ability that fits the person's characteristics. Be playful, fun, and make it sound like a real Pokemon ability. Max 200 characters. Include what the ability does and why it suits this person."
          ),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image,
            },
            {
              type: "text",
              text: "Analyze this person and imagine them as a Pokemon. Determine their Pokemon type based on their appearance, background, clothing, personality vibes, and any other visual cues. Then create a unique special ability name and description that captures their essence. Be creative, fun, and make it feel authentic to the Pokemon universe!",
            },
          ],
        },
      ],
    });

    return {
      type: result.object.type,
      specialAbility: result.object.specialAbility,
      specialAbilityDescription: result.object.specialAbilityDescription,
    };
  } catch (error) {
    await writer.write(
      encoder.encode(
        `${JSON.stringify({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to analyze image",
        })}\n`
      )
    );
    throw error;
  } finally {
    writer.releaseLock();
  }
}

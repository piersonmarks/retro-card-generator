import { analyzeImageStep } from "./steps/analyze-image";
import { generateCardStep } from "./steps/generate-card";
import { generateImageStep } from "./steps/generate-image";

export async function generateCardWorkflow({
  image,
  name,
  birthday,
}: {
  image: Uint8Array;
  name: string;
  birthday: string;
}) {
  "use workflow";

  // Analyze the image to determine Pokemon characteristics
  const analysis = await analyzeImageStep(image);

  const retroImage = await generateImageStep(image, analysis.type);
  const url = await generateCardStep({
    image: retroImage,
    name,
    birthday,
    type: analysis.type,
    specialAbility: analysis.specialAbility,
    specialAbilityDescription: analysis.specialAbilityDescription,
  });

  return { url };
}

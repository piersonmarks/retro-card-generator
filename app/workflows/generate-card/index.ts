import { generateImageStep } from "./steps/generate-image";

export const generateCardWorkflow = async ({ image }: { image: File }) => {
  "use workflow";

  // Always use the provided image with nano-banana/edit
  // Generate edited image using AI SDK with nano-banana/edit
  const retroImage = await generateImageStep(image);

  // Analyze the edited image to get the data

  // Create the card using satori and the data

  // Save the card to blob storage
  const url = "https://example.com/card.png";

  return {
    url,
  };
};

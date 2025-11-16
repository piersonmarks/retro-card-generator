import { start } from "workflow/api";
import { generateCardWorkflow } from "@/app/workflows/generate-card";

export async function POST(request: Request) {
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
}

import { start } from "workflow/api";
import { generateCardWorkflow } from "@/app/workflows/generate-card";

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image") as File;

  if (!(image && image instanceof File)) {
    return Response.json({ error: "Image file is required" }, { status: 400 });
  }

  const run = await start(generateCardWorkflow, [{ image }]);

  // Get the readable stream and return it as a response
  const stream = run.getReadable();
  return new Response(stream, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
}

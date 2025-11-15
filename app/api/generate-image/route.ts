import { start } from 'workflow/api';
import { generateCardWorkflow } from '@/app/workflows/generate-card';

export async function POST(request: Request) {
  const { image, fileName, prompt } = await request.json();

  // Use image data if provided, otherwise fall back to prompt
  const workflowInput = image ? { image, fileName } : prompt;

  const run = await start(generateCardWorkflow, [workflowInput]);

  // Get the readable stream and return it as a response
  const stream = run.getReadable();
  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });
};
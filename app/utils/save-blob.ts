import { put } from "@vercel/blob";

export async function saveBlob(blob: Blob, path: string) {
  const { url } = await put(path, blob, {
    access: "public",
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return url;
}

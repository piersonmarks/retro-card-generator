import type { FontWeight } from "satori";

export type Font = {
  name: string;
  weight: FontWeight;
  style: "normal" | "italic";
};

export type FontData = Font & {
  data: Buffer;
};

const fontUrlRegex = /url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/;

export async function loadGoogleFont(
  name: string,
  weight: FontWeight = 400,
  style: "normal" | "italic" = "normal"
): Promise<FontData> {
  const fontUrl = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, "+")}:ital,wght@${style === "italic" ? 1 : 0},${weight}&display=swap`;

  const cssResponse = await fetch(fontUrl);
  const css = await cssResponse.text();

  const fontUrlMatch = css.match(fontUrlRegex);
  if (!fontUrlMatch) {
    throw new Error(
      `Could not find font URL for ${name} with weight ${weight} and style ${style}`
    );
  }

  const fontResponse = await fetch(fontUrlMatch[1]);
  const arrayBuffer = await fontResponse.arrayBuffer();
  return {
    name,
    weight,
    style,
    data: Buffer.from(arrayBuffer),
  };
}

export async function loadFonts(fonts: Font[]): Promise<FontData[]> {
  const fontData: FontData[] = [];
  for (const font of fonts) {
    const data = await loadGoogleFont(font.name, font.weight, font.style);
    fontData.push(data);
  }
  return fontData;
}

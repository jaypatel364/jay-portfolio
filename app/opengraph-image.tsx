import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { OgShareCard } from "@/lib/og-share-card";
import { siteConfig } from "@/settings";

export const runtime = "nodejs";
export const alt = `${siteConfig.fullName} — Full Stack Developer in India`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const photo = await readFile(join(process.cwd(), "public/images/avatar.png"));
  const photoSrc = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(<OgShareCard photoSrc={photoSrc} variant="opengraph" />, { ...size });
}

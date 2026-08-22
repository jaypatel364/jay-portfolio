import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/settings";

export const runtime = "nodejs";
export const alt = `${siteConfig.fullName} — Full Stack Developer in India`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const photo = await readFile(join(process.cwd(), "public/images/avatar.png"));
  const photoSrc = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0e0f17",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -60,
            width: 480,
            height: 480,
            borderRadius: 999,
            background: "rgba(224, 138, 44, 0.16)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            maxWidth: 620,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#e08a2c",
              fontWeight: 600,
            }}
          >
            JAY.DEV
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "flex",
                fontSize: 80,
                fontWeight: 800,
                color: "#fafaf8",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              Jay Patel
            </div>
            <div
              style={{
                display: "flex",
                width: 120,
                height: 4,
                borderRadius: 4,
                background: "#e08a2c",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: "#c4c6ce",
                marginTop: 8,
              }}
            >
              Full Stack Developer in India
            </div>
          </div>
          <div
            style={{
              display: "flex",
              color: "#8b8e99",
              fontSize: 22,
            }}
          >
            React · Next.js · Node.js · TypeScript
          </div>
        </div>
        <img
          src={photoSrc}
          width={400}
          height={400}
          alt=""
          style={{
            borderRadius: 28,
            objectFit: "cover",
            border: "3px solid rgba(224, 138, 44, 0.55)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}

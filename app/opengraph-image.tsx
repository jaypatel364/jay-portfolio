import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/settings";
import { BASE_URL } from "@/settings/seo";

export const runtime = "nodejs";
export const alt = `${siteConfig.fullName} — Full Stack Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DOMAIN = new URL(BASE_URL).hostname;

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
          background: "linear-gradient(135deg, #0e0f17 0%, #141622 55%, #0e0f17 100%)",
          padding: "64px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: 80,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: "rgba(224, 138, 44, 0.14)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: 999,
            background: "rgba(224, 138, 44, 0.06)",
            display: "flex",
          }}
        />

        {/* Copy block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            flex: 1,
            maxWidth: 640,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#e08a2c",
              fontWeight: 700,
            }}
          >
            {siteConfig.title.toUpperCase()}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "flex",
                fontSize: 76,
                fontWeight: 800,
                color: "#fafaf8",
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
              }}
            >
              {siteConfig.fullName}
            </div>
            <div
              style={{
                display: "flex",
                width: 96,
                height: 4,
                borderRadius: 4,
                background: "#e08a2c",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: "#c4c6ce",
                lineHeight: 1.35,
                maxWidth: 520,
              }}
            >
              Full Stack Developer · {siteConfig.location}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#8b8e99",
              fontSize: 20,
              width: "100%",
            }}
          >
            <span>React · Next.js · Node.js · TypeScript</span>
            <span style={{ color: "#e08a2c", fontWeight: 600 }}>{DOMAIN}</span>
          </div>
        </div>

        {/* Portrait — soft rounded rect (matches site rounded-3xl), not a circle */}
        <div
          style={{
            display: "flex",
            position: "relative",
            marginLeft: 48,
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -12,
              borderRadius: 36,
              background: "rgba(224, 138, 44, 0.22)",
              display: "flex",
            }}
          />
          <img
            src={photoSrc}
            width={420}
            height={420}
            alt=""
            style={{
              borderRadius: 28,
              objectFit: "cover",
              border: "3px solid rgba(224, 138, 44, 0.45)",
              boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}

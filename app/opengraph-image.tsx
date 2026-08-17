import { ImageResponse } from "next/og";

export const alt = "Jay Patel — Full Stack Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0f17",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "rgba(224, 138, 44, 0.18)",
            filter: "blur(8px)",
            display: "flex",
          }}
        />
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
              fontSize: 88,
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
              fontSize: 32,
              color: "#c4c6ce",
              marginTop: 8,
            }}
          >
            Full Stack Developer
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#8b8e99",
            fontSize: 22,
          }}
        >
          <span>React · Next.js · Node.js · TypeScript</span>
          <span>jaypateldev.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

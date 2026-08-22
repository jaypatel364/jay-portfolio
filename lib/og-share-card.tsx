import { siteConfig } from "@/settings";
import { BASE_URL } from "@/settings/seo";

export type OgShareVariant = "opengraph" | "twitter";

const DOMAIN = new URL(BASE_URL).hostname;

/** Shared 1200×630 share card — `twitter` variant uses a smaller photo for X crop safe zone. */
export function OgShareCard({
  photoSrc,
  variant = "opengraph",
}: {
  photoSrc: string;
  variant?: OgShareVariant;
}) {
  const compact = variant === "twitter";
  const photoSize = compact ? 300 : 400;
  const padding = compact ? "52px 60px" : "64px 72px";
  const titleSize = compact ? 62 : 76;
  const subtitleSize = compact ? 24 : 28;
  const footerSize = compact ? 18 : 20;
  const ctaSize = compact ? 18 : 20;
  const photoGap = compact ? 32 : 48;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #0e0f17 0%, #141622 55%, #0e0f17 100%)",
        padding,
        position: "relative",
        overflow: "hidden",
      }}
    >
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          flex: 1,
          maxWidth: compact ? 680 : 640,
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: compact ? 18 : 20,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#e08a2c",
            fontWeight: 700,
          }}
        >
          {siteConfig.title.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: compact ? 12 : 14 }}>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
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
              fontSize: subtitleSize,
              color: "#c4c6ce",
              lineHeight: 1.35,
              maxWidth: 520,
            }}
          >
            Full Stack Developer · {siteConfig.location}
          </div>
          {/* <div
            style={{
              display: "flex",
              width: "100%",
              marginTop: compact ? 4 : 8,
              padding: compact ? "10px 22px" : "12px 26px",
              borderRadius: 999,
              background: "#e08a2c",
              color: "#fafaf8",
              fontSize: ctaSize,
              fontWeight: 700,
              letterSpacing: "0.02em",
              boxShadow: "0 8px 24px rgba(224, 138, 44, 0.35)",
            }}
          >
            {"Let's Connect →"}
          </div> */}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#8b8e99",
            fontSize: footerSize,
            width: "100%",
          }}
        >
          <span>React · Next.js · Node.js · TypeScript</span>
          <span style={{ color: "#e08a2c", fontWeight: 600 }}>{DOMAIN}</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          position: "relative",
          marginLeft: photoGap,
          zIndex: 1,
          flexShrink: 0,
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
          width={photoSize}
          height={photoSize}
          alt=""
          style={{
            borderRadius: compact ? 24 : 28,
            objectFit: "cover",
            border: "3px solid rgba(224, 138, 44, 0.45)",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
          }}
        />
      </div>
    </div>
  );
}

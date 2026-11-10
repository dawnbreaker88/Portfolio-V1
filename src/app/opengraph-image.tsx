import { ImageResponse } from "next/og";

export const alt = "Prabhath — Software Developer & AI Enthusiast";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 80% 15%, rgba(79, 70, 229, 0.22) 0%, transparent 60%), radial-gradient(circle at 15% 85%, rgba(2, 132, 199, 0.18) 0%, transparent 55%)",
          padding: "60px 72px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: "#fafafa",
          position: "relative",
        }}
      >
        {/* Subtle decorative inner border */}
        <div
          style={{
            position: "absolute",
            inset: 32,
            border: "1.5px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 20,
            display: "flex",
          }}
        />

        {/* Top Header Pill Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 18px",
              borderRadius: 9999,
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "#a1a1aa",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
              }}
            />
            AVAILABLE FOR COLLABORATIONS
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: 9999,
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              fontSize: 14,
              fontWeight: 600,
              color: "#d4d4d8",
            }}
          >
            prabhath.dev
          </div>
        </div>

        {/* Central Display Typography */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            zIndex: 10,
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 82,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "#ffffff",
            }}
          >
            Prabhath
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 400,
              color: "#f4f4f5",
              lineHeight: 1.25,
            }}
          >
            Building useful software and exploring AI.
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#a1a1aa",
              lineHeight: 1.4,
            }}
          >
            Machine Learning • Full-Stack Systems • Curious Engineering
          </div>
        </div>

        {/* Footer Meta Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 10,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: 24,
            color: "#71717a",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", gap: 20 }}>
            <span>GitHub @dawnbreaker88</span>
            <span>•</span>
            <span>X @dawnbreaker88</span>
            <span>•</span>
            <span>LinkedIn in/vankaprabhath</span>
          </div>
          <div>Portfolio &amp; Engineering Log</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


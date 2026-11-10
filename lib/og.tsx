import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt =
  "Bizar Octo Givardi · Backend Engineer / Full-Stack Developer";

export function createOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#222124",
          color: "#f0f2f0",
          padding: "72px",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -180,
            top: -180,
            width: 560,
            height: 560,
            borderRadius: 9999,
            border: "1px solid rgba(240, 242, 240, 0.14)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -80,
            bottom: -260,
            width: 520,
            height: 520,
            borderRadius: 9999,
            border: "1px solid rgba(55, 151, 119, 0.35)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8b8f8c",
          }}
        >
          <span>Portofolio</span>
          <span>2026</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{ width: 260, height: 4, backgroundColor: "#f4ce15" }}
          />
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Bizar Octo Givardi
          </div>
          <div style={{ fontSize: 34, color: "#8b8f8c" }}>
            Backend Engineer / Full-Stack Developer
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#8b8f8c",
          }}
        >
          <span>Go · Laravel · Next.js · PostgreSQL · Docker</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#379777",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 9999,
                backgroundColor: "#379777",
                display: "flex",
              }}
            />
            Berbasis di Indonesia
          </span>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}

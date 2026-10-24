import { ImageResponse } from "next/og";

export const alt = "AfricaChip: ECU performance and diagnostics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0d1117",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#9aa1ad",
          }}
        >
          Harare workshop
        </div>
        <div style={{ fontSize: 96, marginTop: 24, lineHeight: 1.05 }}>
          AfricaChip
        </div>
        <div style={{ fontSize: 44, marginTop: 16, color: "#9aa1ad" }}>
          ECU performance and diagnostics
        </div>
      </div>
    ),
    size
  );
}
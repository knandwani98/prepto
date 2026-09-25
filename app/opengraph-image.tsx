import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Prepto AI — Interview prep kits";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const logoSrc = `data:image/png;base64,${await readFile(
  join(process.cwd(), "public/brand/logo-only.png"),
  "base64",
)}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#07111f",
          color: "#eaf2ff",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -90,
            right: -60,
            width: 460,
            height: 460,
            borderRadius: 999,
            background: "rgba(99, 230, 190, 0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: 40,
            width: 380,
            height: 380,
            borderRadius: 999,
            background: "rgba(116, 167, 255, 0.12)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 80px",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logoSrc}
              width={92}
              height={92}
              alt=""
              style={{ borderRadius: 20 }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 28,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: -1.4,
                  lineHeight: 1.1,
                }}
              >
                Prepto AI
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 24,
                  color: "#63e6be",
                  fontWeight: 600,
                }}
              >
                Interview prep kits
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 48,
              maxWidth: 880,
              fontSize: 36,
              lineHeight: 1.35,
              color: "#d8e5f3",
              fontWeight: 500,
            }}
          >
            Turn a job description into a personalised interview preparation kit.
          </div>
          <div
            style={{
              marginTop: 40,
              fontSize: 22,
              color: "#9fb0c6",
            }}
          >
            prepto.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

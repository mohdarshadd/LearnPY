import { ImageResponse } from "next/og";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export const socialImageAlt =
  "LearnPY — interactive Python lessons for NumPy, pandas, Matplotlib, and scikit-learn";

const chips = ["NumPy", "pandas", "Matplotlib", "scikit-learn"];

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f6f5ef",
          color: "#10140f",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 18,
                backgroundColor: "#10140f",
                color: "#c9f24d",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              LP
            </div>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
              LearnPY
            </div>
          </div>
          <div style={{ fontSize: 21, color: "#5b6157" }}>
            learnpy-nu.vercel.app
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -3,
            }}
          >
            Learn the Python data stack in your browser.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.3,
              color: "#4b5148",
            }}
          >
            Short lessons, real code, and instant feedback. No installs, no
            accounts.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            {chips.map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  borderRadius: 999,
                  border: "1px solid #d8d6cc",
                  backgroundColor: "#fffdf7",
                  padding: "10px 18px",
                  fontSize: 20,
                  color: "#30362f",
                }}
              >
                {chip}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#5b6157" }}>
            Interactive Python · zero setup
          </div>
        </div>
      </div>
    ),
    socialImageSize,
  );
}

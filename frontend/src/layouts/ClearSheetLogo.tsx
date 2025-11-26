import { Layers } from "lucide-react";

interface LogoProps {
  size?: number;
}

export function ClearSheetLogo({ size = 80 }: LogoProps) {
  const iconSize = size * 0.32;
  const iconPadding = size * 0.18;
  const fontSize = size * 0.28;
  const gap = size * 0.13;

  return (
    <div className="flex items-center select-none" style={{ gap }}>

      <div
        className="
          rounded-2xl shadow-lg border backdrop-blur-xl
          flex items-center justify-center relative
          transition-colors
        "
        style={{
          padding: iconPadding,
        }}
      >

        <div
          className="
            absolute inset-0 rounded-2xl pointer-events-none
            dark:hidden
          "
          style={{
            background:
              "linear-gradient(135deg, rgba(245,242,255,0.85), rgba(230,224,255,0.65))",
            border: "1px solid rgba(210,205,255,0.45)",
          }}
        />

        <div
          className="
            absolute inset-0 rounded-2xl pointer-events-none
            hidden dark:block
          "
          style={{
            background:
              "linear-gradient(135deg, rgba(40,38,52,0.85), rgba(32,30,44,0.65))",
            border: "1px solid rgba(80,78,98,0.45)",
          }}
        />

        <Layers
          size={iconSize}
          className="
            text-[#7B61FF] dark:text-[#B7A5FF]
            drop-shadow-[0_3px_6px_rgba(123,97,255,0.30)]
            transition-colors
          "
        />
      </div>

      <div className="font-display font-semibold tracking-tight select-none flex flex-col leading-none">


        <span
          className="text-[#2F2F36] dark:text-gray-200 transition-colors"
          style={{
            fontSize,
            letterSpacing: "-0.02em",
            textShadow:
              "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          Clear
        </span>

        <span
          className="font-semibold transition-all"
          style={{
            fontSize: fontSize * 0.92,
            marginTop: size * -0.08,
            background:
              "linear-gradient(90deg, #7B61FF 0%, #A680FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.01em",
            textShadow:
              "0 2px 4px rgba(123,97,255,0.23)",
          }}
        >
          Sheet
        </span>
      </div>
    </div>
  );
}

import { Layers } from "lucide-react";

interface LogoProps {
  size?: number;
  forceLight?: boolean;
}


export function ClearSheetLogo({ size = 80, forceLight = false }: LogoProps) {
  const iconSize = size * 0.34;
  const iconPadding = size * 0.2;
  const fontSize = size * 0.28;
  const gap = size * 0.14;

  return (
    <div
      className="flex items-center select-none relative"
      style={{ gap }}
    >

      <div
        className="
          relative rounded-3xl shadow-xl backdrop-blur-2xl 
          overflow-hidden border
          transition-all duration-300 
        "
        style={{
          padding: iconPadding,
        }}
      >
    
        <div
          className={`
            absolute inset-0 rounded-3xl
            ${forceLight ? "" : "dark:hidden"}
          `}
          style={{
            background:
              "linear-gradient(135deg, rgba(247,245,255,0.85), rgba(232,226,255,0.6))",
            border: "1px solid rgba(210,205,255,0.45)",
            boxShadow:
              "0 4px 14px rgba(150,135,255,0.25), inset 0 0 18px rgba(255,255,255,0.35)",
          }}
        />

       
        <div
          className={`
            absolute inset-0 rounded-3xl
            ${forceLight ? "hidden" : "hidden dark:block"}
          `}
          style={{
            background:
              "linear-gradient(140deg, rgba(37,34,48,0.85), rgba(27,25,40,0.55))",
            border: "1px solid rgba(80,78,98,0.45)",
            boxShadow:
              "0 4px 18px rgba(80,78,110,0.45), inset 0 0 18px rgba(0,0,0,0.35)",
          }}
        />

     
        <div
          className="
            absolute inset-0 rounded-3xl pointer-events-none
            opacity-40 blur-xl
          "
          style={{
            background:
              "radial-gradient(circle at 50% 55%, rgba(123,97,255,0.55), transparent 70%)",
          }}
        />

   
        <Layers
          size={iconSize}
          className={`
            relative z-10 transition-colors drop-shadow-xl
            ${forceLight
              ? "text-[#7B61FF]"
              : "text-[#7B61FF] dark:text-[#BFAAFF]"
            }
          `}
          style={{
            filter:
              "drop-shadow(0 2px 6px rgba(123,97,255,0.45)) drop-shadow(0 0 12px rgba(123,97,255,0.35))",
          }}
        />
      </div>


      <div className="flex flex-col leading-none tracking-tight font-display select-none">
        <span
          className={`
            font-semibold transition-colors
            ${forceLight ? "text-[#2F2F36]" : "text-[#2F2F36] dark:text-gray-200"}
          `}
          style={{
            fontSize,
            letterSpacing: "-0.02em",
            textShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          Clear
        </span>

        <span
          className="
            font-semibold bg-gradient-to-r 
            from-[#7B61FF] to-[#A680FF]
            dark:from-[#BFAAFF] dark:to-[#8F74FF]
            bg-clip-text text-transparent
          "
          style={{
            fontSize: fontSize * 0.92,
            marginTop: size * -0.06,
            letterSpacing: "-0.015em",
            textShadow:
              "0 2px 6px rgba(165,140,255,0.35), 0 0 14px rgba(120,85,255,0.3)",
          }}
        >
          Sheet
        </span>
      </div>
    </div>
  );
}

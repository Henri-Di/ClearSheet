// src/components/bankIcons.tsx
import type { JSX } from "react/jsx-runtime";

export interface BankVisual {
  letter: string;
  icon: JSX.Element;
  color: string; // cor para o glow atrás
}

export const BANK_ICONS: Record<string, BankVisual> = {
  nubank: {
    letter: "N",
    color: "#8B5CF6",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <linearGradient id="nuGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#A06BFF" />
            <stop offset="100%" stopColor="#7B2FFF" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#nuGrad)" />
      </svg>
    ),
  },

  bradesco: {
    letter: "B",
    color: "#E4002B",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <linearGradient id="braGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#FF5A5A" />
            <stop offset="100%" stopColor="#E4002B" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#braGrad)" />
      </svg>
    ),
  },

  itau: {
    letter: "I",
    color: "#FF7B00",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="#FF7B00" />
      </svg>
    ),
  },

  inter: {
    letter: "IN",
    color: "#FF8A00",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="#FF8A00" />
      </svg>
    ),
  },

  santander: {
    letter: "S",
    color: "#D00000",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="#D00000" />
      </svg>
    ),
  },

  caixa: {
    letter: "C",
    color: "#007BFF",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="#007BFF" />
      </svg>
    ),
  },

  bb: {
    letter: "BB",
    color: "#FFD400",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="#FFD400" />
      </svg>
    ),
  },
};

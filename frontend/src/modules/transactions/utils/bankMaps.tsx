import type { JSX } from "react";


export function normalizeBankName(value: any): string {
  if (!value) return "default";
  if (typeof value !== "string") return "default";

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}


export type BankKey = string;


function GlassCircle(content: JSX.Element, tint: string): JSX.Element {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={tint}
        fillOpacity="0.20"
        stroke={tint}
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      {content}
    </svg>
  );
}


export const BankIcons: Record<BankKey, JSX.Element> = {
  nubank: GlassCircle(
    <path
      d="M18 16c-3 0-4.5 2.5-4.5 8v8c0 5.5 1.5 8 4.5 8s4.5-2.5 4.5-8v-8c0-5.5-1.5-8-4.5-8zm12 0c-3 0-4.5 2.5-4.5 8v8c0 5.5 1.5 8 4.5 8s4.5-2.5 4.5-8v-8c0-5.5-1.5-8-4.5-8z"
      fill="#A26BFF"
      fillOpacity="0.85"
    />,
    "#A26BFF"
  ),

  inter: GlassCircle(
    <text
      x="20"
      y="30"
      fontSize="24"
      fontFamily="Arial Black"
      fill="#FF8A30"
      fillOpacity="0.95"
    >
      i
    </text>,
    "#FF8A30"
  ),

  itau: GlassCircle(
    <>
      <rect
        x="16"
        y="16"
        width="20"
        height="20"
        rx="6"
        fill="#FF8F00"
        fillOpacity="0.75"
      />
      <text
        x="18"
        y="29"
        fontSize="13"
        fontFamily="Arial Black"
        fill="#002A7A"
        fillOpacity="0.85"
      >
        Itaú
      </text>
    </>,
    "#FF8F00"
  ),

  bradesco: GlassCircle(
    <path
      d="M24 15c-6 0-10 4-10 10v8c0 5 3 8 8 8h4c5 0 8-3 8-8v-8c0-6-4-10-10-10z"
      fill="#E11D48"
      fillOpacity="0.85"
    />,
    "#E11D48"
  ),

  santander: GlassCircle(
    <path d="M24 14c-5 7 5 9 0 15 9-4 5-14 0-15z" fill="#DC2626" fillOpacity="0.9" />,
    "#DC2626"
  ),

  caixa: GlassCircle(
    <>
      <path d="M18 18l6 6-6 6" stroke="#2563EB" strokeWidth="4" />
      <path d="M26 18l6 6-6 6" stroke="#F97316" strokeWidth="4" />
    </>,
    "#2563EB"
  ),

  brasil: GlassCircle(
    <>
      <path d="M16 24l16-10M16 24l16 10" stroke="#0E3A78" strokeWidth="4" />
    </>,
    "#FBBF24"
  ),

  neon: GlassCircle(
    <circle
      cx="24"
      cy="24"
      r="10"
      stroke="#0EA5E9"
      strokeWidth="5"
      strokeOpacity="0.85"
      fill="none"
    />,
    "#0EA5E9"
  ),

  "mercado pago": GlassCircle(
    <>
      <ellipse cx="24" cy="20" rx="12" ry="7" fill="#38BDF8" fillOpacity="0.7" />
      <path
        d="M18 20c3 4 7 4 10 0"
        stroke="#075985"
        strokeWidth="3"
        strokeOpacity="0.75"
      />
    </>,
    "#38BDF8"
  ),

  "c6 bank": GlassCircle(
    <>
      <circle cx="21" cy="26" r="8" fill="#1F2937" fillOpacity="0.45" />
      <circle cx="30" cy="22" r="5" fill="#1F2937" fillOpacity="0.75" />
    </>,
    "#1F2937"
  ),

  original: GlassCircle(
    <rect x="17" y="17" width="16" height="16" rx="6" fill="#10B981" />,
    "#10B981"
  ),

  default: GlassCircle(
    <circle cx="24" cy="24" r="10" fill="#6B7280" fillOpacity="0.5" />,
    "#6B7280"
  ),
};


export const BankBg: Record<BankKey, string> = {
  nubank: "linear-gradient(135deg,#F0E6FF,#DCC5FF)",
  inter: "linear-gradient(135deg,#FFF7ED,#FFEBD8)",
  itau: "linear-gradient(135deg,#FFF5E6,#FFEED6)",
  bradesco: "linear-gradient(135deg,#FFF0F3,#FFE3E7)",
  santander: "linear-gradient(135deg,#FFE7E7,#FFD5D5)",
  caixa: "linear-gradient(135deg,#EFF6FF,#FFF2E7)",
  brasil: "linear-gradient(135deg,#FFF9D9,#FFF1A6)",
  neon: "linear-gradient(135deg,#E0F7FF,#D4F4FF)",
  "mercado pago": "linear-gradient(135deg,#E8F4FF,#DDEEFF)",
  "c6 bank": "linear-gradient(135deg,#F3F4F6,#E5E7EB)",
  original: "linear-gradient(135deg,#E8FFF5,#D7FFEC)",
  default: "linear-gradient(135deg,#F1F1F5,#E6E6EB)",
};


export const BankAlias: Record<BankKey, string> = {
  nubank: "nubank",
  nu: "nubank",
  "nu bank": "nubank",

  inter: "inter",

  itau: "itau",
  "ita u": "itau",
  itaubank: "itau",

  caixa: "caixa",
  cef: "caixa",

  santander: "santander",

  brasil: "brasil",
  bb: "brasil",

  neon: "neon",

  mercado: "mercado pago",
  "mercado pago": "mercado pago",

  c6: "c6 bank",
  c6bank: "c6 bank",
  "c6 bank": "c6 bank",

  original: "original",
};


export function resolveBankKey(name: string | null | undefined): string {
  if (!name) return "default";

  const normalized = normalizeBankName(name);
  const alias = BankAlias[normalized];

  const finalKey = alias || normalized;

  return BankIcons[finalKey] ? finalKey : "default";
}

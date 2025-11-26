// categoryIcons.ts

import {
  Utensils,
  Car,
  Home,
  DollarSign,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  PiggyBank,
  PawPrint,
  ReceiptText,
  Wrench,
  Briefcase,
  Tag,
  FolderTree,
  LayoutGrid,
  ShoppingBag,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { normalize } from "./normalize";


export const CATEGORY_ICONS = [
  { value: "folder", label: "Padrão", Icon: FolderTree },
  { value: "grid", label: "Organização", Icon: LayoutGrid },
  { value: "shopping", label: "Compras", Icon: ShoppingBag },
  { value: "home", label: "Casa", Icon: Home },
  { value: "car", label: "Transporte", Icon: Car },
  { value: "food", label: "Alimentação", Icon: Utensils },
  { value: "savings", label: "Poupança", Icon: PiggyBank },
];


export function getCategoryIconByCode(code?: string | null): LucideIcon {
  if (!code) return Tag;
  const m = CATEGORY_ICONS.find((i) => i.value === code);
  return m ? m.Icon : Tag;
}


export function getCategoryIconComponent(name: string | null | undefined): LucideIcon {
  const n = normalize(name || "");

  if (!n) return Tag;

  if (n.match(/aliment|restaurante|comida|mercado/)) return Utensils;
  if (n.match(/transporte|uber|gasolina|carro/)) return Car;
  if (n.match(/casa|aluguel|condominio/)) return Home;
  if (n.match(/salario|renda|ganho/)) return DollarSign;
  if (n.match(/compra|shopping|roupa/)) return ShoppingCart;
  if (n.match(/saude|remedio|medic|hospital/)) return HeartPulse;
  if (n.match(/educa|estudo|curso/)) return GraduationCap;
  if (n.match(/invest|poupan|bolsa/)) return PiggyBank;
  if (n.match(/pet|cachorro|gato/)) return PawPrint;
  if (n.match(/imposto|taxa|tarifa/)) return ReceiptText;
  if (n.match(/manut|reforma|conserto/)) return Wrench;
  if (n.match(/servico|profissional/)) return Briefcase;

  return Tag;
}


import type { Category } from "../types/sheet";

export function getCategoryIcon(category?: Category | null): LucideIcon {
  if (!category) return Tag;

  const byCode = getCategoryIconByCode(category.icon);
  if (byCode !== Tag) return byCode;

  return getCategoryIconComponent(category.name);
}

// utils/bankIcons.ts
import {
  TrendingUp,
  TrendingDown,
  Wallet2,
  Landmark,
} from "lucide-react";

export const BankIconMap: Record<string, JSX.Element> = {
  entradas: (
    <TrendingUp
      size={28}
      className="text-green-600 dark:text-green-400"
    />
  ),
  saidas: (
    <TrendingDown
      size={28}
      className="text-red-600 dark:text-red-400"
    />
  ),
  saldo: (
    <Wallet2
      size={28}
      className="text-indigo-600 dark:text-indigo-400"
    />
  ),
  default: (
    <Landmark
      size={28}
      className="text-indigo-600 dark:text-indigo-400"
    />
  ),
};

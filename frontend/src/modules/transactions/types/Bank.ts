// frontend/src/modules/transactions/types/Bank.ts

import type { JSX, ReactNode } from "react";
import type { Transaction } from "./Transaction";

export interface Bank {
  // Dados básicos vindos da API
  id: number;
  name: string;
  title: ReactNode;

  // Dados normalizados e enriquecidos
  key: string;               // sempre definido após normalização
  icon: JSX.Element;         // ícone pastel
  bg: string;                // background pastel
  color: string;             // cor principal (para textos / highlights)

  // Cálculos agregados
  income: number;            // total de entradas
  expense: number;           // total de saídas
  balance: number;           // income - expense
  percentage: number;        // % relativo ao total geral

  // Transações pertencentes ao banco
  transactions: Transaction[];
}

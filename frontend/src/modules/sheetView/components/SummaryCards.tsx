import { useMemo, useState, useEffect, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { formatCurrency } from "../utils/currency";



function normalizeName(str: any): string {
  if (!str || typeof str !== "string") return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "");
}

function normalizeDate(value: any): string | null {
  if (!value) return null;
  const clean = String(value).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean)) return null;
  return clean;
}

function addOneDay(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function safeNumber(v: any): number {
  if (v === null || v === undefined) return 0;
  const n = Number(String(v).replace(",", "."));
  return isNaN(n) ? 0 : n;
}

function isOverdue(dateStr: string) {
  if (!dateStr) return false;
  const today = new Date().setHours(0, 0, 0, 0);
  const d = new Date(dateStr).setHours(0, 0, 0, 0);
  return d < today;
}

function Tooltip({ text }: { text: string }) {
  return (
    <div
      className="
        absolute right-0 top-8 z-50
        px-3 py-2 rounded-lg text-xs
        bg-black text-white shadow-lg
        whitespace-nowrap
      "
    >
      {text}
    </div>
  );
}

function BankCardSkeleton() {
  return (
    <div
      className="
        rounded-3xl p-6 relative
        border border-white/40 bg-white/30 backdrop-blur-md shadow-xl
        animate-pulse
      "
    >
      <div className="h-5 w-1/3 bg-white/40 rounded-lg mb-4" />
      <div className="h-8 w-1/2 bg-white/50 rounded-xl mb-6" />
      <div className="h-4 w-full bg-white/40 rounded-lg mb-2" />
      <div className="h-4 w-4/5 bg-white/30 rounded-lg mb-2" />
      <div className="h-4 w-3/5 bg-white/40 rounded-lg" />
    </div>
  );
}



function groupAuto(transactions: any[]) {
  if (!transactions?.length) return [];

  const dates = transactions
    .map((t) => normalizeDate(t.date))
    .filter(Boolean) as string[];

  if (!dates.length) return [];

  const min = new Date(Math.min(...dates.map((d) => +new Date(d))));
  const max = new Date(Math.max(...dates.map((d) => +new Date(d))));
  const diff = (max.getTime() - min.getTime()) / 86400000;

  let mode: "daily" | "weekly" | "monthly";
  if (diff <= 15) mode = "daily";
  else if (diff <= 45) mode = "weekly";
  else mode = "monthly";

  const groups: Record<string, { income: number; expense: number }> = {};

  for (const t of transactions) {
    const d = normalizeDate(t.date);
    if (!d) continue;

    const date = new Date(d);
    let key = "";

    if (mode === "daily") key = d;
    else if (mode === "weekly") key = String(Math.floor(+date / (7 * 86400000)));
    else key = `${date.getFullYear()}-${date.getMonth() + 1}`;

    if (!groups[key]) groups[key] = { income: 0, expense: 0 };

    if (t.type === "income") groups[key].income += safeNumber(t.value);
    else groups[key].expense += safeNumber(t.value);
  }

  return Object.values(groups);
}



function SparklineDual({ transactions }: { transactions: any[] }) {
  const grouped = useMemo(() => groupAuto(transactions), [transactions]);
  if (!grouped.length) return null;

  const valuesIn = grouped.map((g) => g.income);
  const valuesOut = grouped.map((g) => -g.expense);

  const allValues = [...valuesIn, ...valuesOut];
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, -1);
  const range = max - min || 1;

  const height = 48;

  const toPoints = (array: number[]) => {
    if (array.length === 1) {
      return [`0,${height / 2}`, `100,${height / 2}`];
    }
    return array.map((v, i) => {
      const x = (i / (array.length - 1)) * 100;
      const y = ((v - min) / range) * height;
      return `${x},${height - y}`;
    });
  };

  const ptsIn = toPoints(valuesIn);
  const ptsOut = toPoints(valuesOut);

  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverVal, setHoverVal] = useState<{
    type: string;
    value: number;
  } | null>(null);

  const handleMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    setHoverX(xPct);

    const index = Math.round((xPct / 100) * (valuesIn.length - 1));
    if (index >= 0 && index < valuesIn.length) {
      const vin = valuesIn[index];
      const vout = valuesOut[index];
      setHoverVal(
        Math.abs(vin) >= Math.abs(vout)
          ? { type: "Entrada", value: vin }
          : { type: "Saída", value: Math.abs(vout) }
      );
    }
  };

  return (
    <div className="mt-4">
      <svg
        width="100%"
        height={height}
        viewBox="0 0 100 48"
        onMouseMove={handleMove}
        onMouseLeave={() => {
          setHoverX(null);
          setHoverVal(null);
        }}
        style={{ cursor: "crosshair" }}
      >
        <motion.polyline
          points={ptsIn.join(" ")}
          fill="none"
          stroke="rgba(0,160,80,0.55)"
          strokeWidth="2.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9 }}
        />

        <motion.polyline
          points={ptsOut.join(" ")}
          fill="none"
          stroke="rgba(230,70,70,0.55)"
          strokeWidth="2.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        />

        {hoverX !== null && (
          <circle
            cx={hoverX}
            cy={24}
            r="1.8"
            fill="#fff"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="0.8"
          />
        )}
      </svg>

      {hoverVal && (
        <div className="mt-1 text-xs px-2 py-1 bg-black/70 text-white rounded-md w-fit shadow">
          {hoverVal.type}: {formatCurrency(hoverVal.value)}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 text-xs mt-1"
      >
        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
          <span className="w-2 h-2 rounded-full bg-green-600/70" />
          Entradas
        </div>
        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
          <span className="w-2 h-2 rounded-full bg-red-500/70" />
          Saídas
        </div>
      </motion.div>
    </div>
  );
}


const GlassCircle = (content: JSX.Element, tint: string) => (
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



const BankColorLight: Record<string, string> = {
  "banco do brasil": "#F2D201",
  "banco da amazonia": "#0C4B2D",
  "banco do nordeste": "#8C1E5A",
  caixa: "#1D5BBF",
  bradesco: "#E11D48",
  itau: "#FF8F00",
  santander: "#DC2626",
  banrisul: "#1E88E5",
  banestes: "#185ABD",
  brb: "#0033A0",
  nubank: "#820AD1",
  inter: "#FF7A00",
  "c6 bank": "#1F2937",
  original: "#10B981",
  neon: "#0EA5E9",
  next: "#00E676",
  bs2: "#3B82F6",
  pan: "#1565C0",
  pagbank: "#14B8A6",
  "mercado pago": "#38BDF8",
  btg: "#1A3E6E",
  xp: "#FACC15",
  sofisa: "#0033A0",
  daycoval: "#1B3A57",
  abc: "#003366",
  fibra: "#009966",
  safra: "#5D4037",
  pine: "#512DA8",
  modal: "#0D47A1",
  master: "#1A237E",
  industrial: "#374151",
  topazio: "#0EA5E9",
  semear: "#7E22CE",
  cetelem: "#0E9F6E",
  volkswagen: "#003399",
  toyota: "#CC0000",
  honda: "#CC0000",
  renault: "#FFD100",
  psa: "#0A66C2",
  sicoob: "#006241",
  sicredi: "#1A8F2A",
  stone: "#16A34A",
  digio: "#1E3A8A",
  acesso: "#4C1D95",
  crefisa: "#0A3A87",
  "western union": "#FFDC00",
  citibank: "#003B70",
  "jp morgan": "#0A3E59",
  "bnp paribas": "#0BA16C",
  "credit suisse": "#003B73",
};



const BankBg: Record<string, string> = {};

Object.keys(BankColorLight).forEach((k) => {
  const c = BankColorLight[k];

  BankBg[k] = `
    linear-gradient(
      135deg,
      ${c}0A,
      ${c}15
    ),
    linear-gradient(
      135deg,
      #ffffffee 0%,
      #fafaffff 100%
    )
  `;
});



const BankBgDark: Record<string, string> = {};

Object.keys(BankColorLight).forEach((k) => {
  const c = BankColorLight[k];
  BankBgDark[k] = `linear-gradient(135deg,${c}33,${c}77)`;
});


function makeLetterIcon(letter: string, color: string) {
  return GlassCircle(
    <text
      x="17"
      y="30"
      fontSize="20"
      fontFamily="Arial Black"
      fill={color}
      fillOpacity="0.90"
      style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 0.6 }}
    >
      {letter}
    </text>,
    color
  );
}

const BankIcons: Record<string, JSX.Element> = {};

Object.keys(BankColorLight).forEach((k) => {
  const color = BankColorLight[k];
  const letter = k.charAt(0).toUpperCase();
  BankIcons[k] = makeLetterIcon(letter, color);
});



const BankAlias: Record<string, string> = {
  "banco do brasil": "banco do brasil",
  bb: "banco do brasil",

  "banco da amazonia": "banco da amazonia",
  amazonia: "banco da amazonia",

  "banco do nordeste": "banco do nordeste",
  bnb: "banco do nordeste",

  caixa: "caixa",
  cef: "caixa",
  "caixa economica federal": "caixa",

  bradesco: "bradesco",

  itau: "itau",
  "itaú": "itau",

  santander: "santander",

  banrisul: "banrisul",

  banestes: "banestes",

  brb: "brb",
  "banco de brasilia": "brb",

  nubank: "nubank",
  nu: "nubank",

  inter: "inter",

  "c6 bank": "c6 bank",
  c6: "c6 bank",

  original: "original",

  neon: "neon",

  next: "next",

  bs2: "bs2",

  pan: "pan",

  pagbank: "pagbank",
  pagseguro: "pagbank",

  "mercado pago": "mercado pago",

  btg: "btg",

  xp: "xp",

  sofisa: "sofisa",

  daycoval: "daycoval",

  fibra: "fibra",

  safra: "safra",

  pine: "pine",

  modal: "modal",

  master: "master",

  industrial: "industrial",

  topazio: "topazio",

  semear: "semear",

  cetelem: "cetelem",

  volkswagen: "volkswagen",

  toyota: "toyota",

  honda: "honda",

  renault: "renault",

  psa: "psa",

  sicoob: "sicoob",

  sicredi: "sicredi",

  stone: "stone",

  digio: "digio",

  acesso: "acesso",

  crefisa: "crefisa",

  "western union": "western union",

  citibank: "citibank",

  "jp morgan": "jp morgan",

  "bnp paribas": "bnp paribas",

  "credit suisse": "credit suisse",
};



function resolveBankKey(rawName: string): string {
  if (!rawName) return "default";
  const n = normalizeName(rawName);
  return BankAlias[n] || n || "default";
}



function groupBanks(items: any[], dateStart: any, dateEnd: any) {
  const grouped: Record<string, any> = {};

  items.forEach((item) => {
    if (!item.bank) return;

    const date = normalizeDate(item.date);
    if (dateStart && date && date < dateStart) return;
    if (dateEnd && date && date > dateEnd) return;

    const key = resolveBankKey(item.bank.name || "Sem banco");

    if (!grouped[key]) {
      grouped[key] = {
        key,
        title: item.bank.name,
        ids: new Set<number>(),
        income: 0,
        expense: 0,
        transactions: [],
        icon: BankIcons[key] || BankIcons["banco do brasil"],
        bg: BankBg[key] || BankBg["banco do brasil"],
        bgDark: BankBgDark[key] || BankBgDark["banco do brasil"],
        type: "bank",
      };
    }

    grouped[key].ids.add(item.bank.id);

    if (item.type === "income")
      grouped[key].income += safeNumber(item.value);
    else grouped[key].expense += safeNumber(item.value);

    grouped[key].transactions.push(item);
  });

  return Object.values(grouped).sort(
    (a: any, b: any) => (b.income - b.expense) - (a.income - a.expense)
  );
}



export function SummaryCards({
  sheet,
  entradas,
  saidas,
  items,
  dateStart,
  dateEnd,
  loadingBanks = false,
}: any) {
  const saldoFinal = sheet.initial_balance + entradas - saidas;

  const baseCards = [
    { title: "Saldo inicial", value: sheet.initial_balance, type: "base" },
    { title: "Entradas", value: entradas, type: "base" },
    { title: "Saídas", value: saidas, type: "base" },
    { title: "Saldo final", value: saldoFinal, type: "base" },
  ];

  const bankCards = useMemo(
    () => (loadingBanks ? [] : groupBanks(items || [], dateStart, dateEnd)),
    [items, dateStart, dateEnd, loadingBanks]
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
      }}
      className="
        grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 
        gap-6 text-[#2F2F36] dark:text-gray-200
      "
    >
      {baseCards.map((c, i) => (
        <SummaryCard key={`base-${i}`} {...c} />
      ))}

      {loadingBanks &&
        [...Array(2)].map((_, i) => <BankCardSkeleton key={i} />)}

      {!loadingBanks &&
        bankCards.map((c, i) => <SummaryCard key={`bank-${i}`} {...c} />)}
    </motion.div>
  );
}


function SummaryCard(props: any) {
  const isBank = props.type === "bank";
  const saldo = isBank ? props.income - props.expense : 0;

  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showTip, setShowTip] = useState(false);


  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const bg = isBank ? (isDark ? props.bgDark : props.bg) : undefined;


  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      style={{ background: bg }}
      className={`
        rounded-3xl p-6 relative transition-all 
        ${
          isBank
            ? "border border-white/40 backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-[4px]"
            : "bg-[#F5F4FA] border border-[#E1E0EB] shadow-sm dark:bg-[#1A1923] dark:border-[#2A2733] dark:shadow-lg hover:-translate-y-[3px] hover:shadow-md"
        }
      `}
    >
      <div
        className="absolute top-3 right-3 cursor-pointer"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <HelpCircle
          size={19}
          className="text-[#888] dark:text-white/50 transition"
        />
        {showTip && (
          <Tooltip text={isBank ? "Resumo do banco + gráfico" : "Resumo geral"} />
        )}
      </div>

      <div className="flex justify-between items-center">
        <h3
          className="
          text-md font-semibold
          text-[#2F2F36] 
          dark:text-white/90
        "
        >
          {props.title}
        </h3>

        {isBank ? (
          <motion.div whileHover={{ scale: 1.12 }}>{props.icon}</motion.div>
        ) : (
          <button
            className="
              p-2 rounded-xl transition
              hover:bg-black/5 dark:hover:bg-white/10
            "
            onClick={() => setHidden(!hidden)}
          >
            {hidden ? (
              <EyeOff size={22} className="text-[#333] dark:text-gray-300" />
            ) : (
              <Eye size={22} className="text-[#333] dark:text-gray-200" />
            )}
          </button>
        )}
      </div>


      {!isBank && (
        <>
          <p
            className="
              text-3xl font-extrabold mt-4 select-none
              text-[#000] dark:text-white
              transition-all duration-300
            "
            style={{
              filter: hidden ? "blur(7px)" : "none",
              opacity: hidden ? 0.55 : 1,
            }}
          >
            {formatCurrency(props.value)}
          </p>

          <div
            className="h-[4px] rounded-full mt-5 opacity-80"
            style={{
              background:
                props.title === "Saídas"
                  ? "#E63946"
                  : props.title === "Entradas"
                  ? "#28A745"
                  : "#7B61FF",
            }}
          />
        </>
      )}



      {isBank && (
        <>
          <div className="mt-4 space-y-2">
            <Line label="Entradas" v={props.income} color="green" />
            <Line label="Saídas" v={props.expense} color="red" />

            <div className="flex justify-between border-t pt-2 border-white/10">
              <span className="font-semibold text-[#222] dark:text-white/90">
                Saldo
              </span>
              <span
                className={`font-bold ${
                  saldo > 0
                    ? "text-green-400"
                    : saldo < 0
                    ? "text-red-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {formatCurrency(saldo)}
              </span>
            </div>
          </div>

          <SparklineDual transactions={props.transactions} />

          <button
            className="
              mt-4 w-full flex justify-between items-center
              text-[#444] dark:text-gray-200
            "
            onClick={() => setOpen(!open)}
          >
            <span>Transações</span>
            {open ? <ChevronUp /> : <ChevronDown />}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="
                  mt-3 rounded-xl bg-white/20
                  border border-white/10 shadow-inner 
                  backdrop-blur-md
                "
              >
                <div className="p-3 max-h-64 overflow-y-auto space-y-3">
                  {props.transactions.length === 0 && (
                    <p className="text-xs text-gray-700 dark:text-gray-300 text-center py-3">
                      Nenhuma transação neste período.
                    </p>
                  )}

                  {props.transactions.map((t: any, i: number) => (
                    <TransactionRow key={i} t={t} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}


function Line({ label, v, color }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <span
        className={`
          text-sm font-semibold
          ${
            color === "green"
              ? "text-green-500"
              : color === "red"
              ? "text-red-400"
              : "dark:text-white/90 text-gray-800"
          }
        `}
      >
        {formatCurrency(v)}
      </span>
    </div>
  );
}



function TransactionRow({ t }: any) {
  const vencOriginal = normalizeDate(t.date);
  const vencForUser = addOneDay(vencOriginal);

  const vencText =
    vencForUser !== null
      ? new Date(vencForUser).toLocaleDateString("pt-BR")
      : "";

  const pago = !!t.paid_at;

  const atrasado =
    t.type === "expense" && !pago && vencOriginal && isOverdue(vencOriginal);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="
        bg-white/10 border border-white/20
        p-3 rounded-xl shadow-sm relative transition
        hover:shadow-md hover:-translate-y-[2px]
      "
    >
      {pago && (
        <div
          className="
            absolute top-2 right-2 flex items-center gap-1
            bg-green-600 text-white text-[11px]
            px-2 py-1 rounded-md shadow-md
          "
        >
          <CheckCircle2 size={10} /> Pago
        </div>
      )}

      {atrasado && (
        <div
          className="
            absolute top-2 right-2
            text-white text-[11px] px-2 py-1
            rounded-md shadow-md font-semibold
          "
          style={{
            background: "#E63946",
            animation: "pulse-red 1.3s infinite",
          }}
        >
          Atrasado — {vencText}
        </div>
      )}

      <p className="text-xs text-gray-700 dark:text-gray-300">{vencText}</p>

      <p className="font-semibold text-[#47476b] dark:text-white/90 mt-1">
        {t.description || "(Sem descrição)"}
      </p>

      <div className="flex justify-between mt-1">
        <span
          className={`
            font-bold
            ${
              t.type === "income"
                ? "text-green-400"
                : "text-red-400"
            }
          `}
        >
          {formatCurrency(t.value)}
        </span>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {t.type === "income" ? "Entrada" : "Saída"}
        </span>
      </div>
    </motion.div>
  );
}


import { useMemo, useState, type JSX } from "react";
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
  const [hoverVal, setHoverVal] = useState<{ type: string; value: number } | null>(
    null
  );

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
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-600/70" />
          Entradas
        </div>
        <div className="flex items-center gap-1">
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

const BankIcons: Record<string, JSX.Element> = {
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
    <path d="M24 14c-5 7 5 9 0 15 9-4 5-14 0-15z" fill="#DC2626" />,
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
      fill="none"
    />,
    "#0EA5E9"
  ),
  "mercado pago": GlassCircle(
    <>
      <ellipse cx="24" cy="20" rx="12" ry="7" fill="#38BDF8" />
      <path d="M18 20c3 4 7 4 10 0" stroke="#075985" strokeWidth="3" />
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

const BankBg: Record<string, string> = {
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

const BankAlias: Record<string, string> = {
  nubank: "nubank",
  nu: "nubank",
  "nu bank": "nubank",
  inter: "inter",
  itau: "itau",
  caixa: "caixa",
  cef: "caixa",
  santander: "santander",
  brasil: "brasil",
  bb: "brasil",
  neon: "neon",
  "mercado pago": "mercado pago",
  mercado: "mercado pago",
  "c6": "c6 bank",
  original: "original",
};


function resolveBankKey(rawName: string): string {
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
        icon: BankIcons[key] || BankIcons.default,
        bg: BankBg[key] || BankBg.default,
        type: "bank",
      };
    }

    grouped[key].ids.add(item.bank.id);

    if (item.type === "income") grouped[key].income += safeNumber(item.value);
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

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      style={{ background: isBank ? props.bg : undefined }}
      className={`
        rounded-3xl p-6 relative transition-all 
        ${
          isBank
            ? "border border-white/40 bg-white/30 backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-[4px]"
            : "bg-[#F5F4FA] border border-[#E1E0EB] shadow-sm dark:bg-[#1A1923] dark:border-[#2A2733] dark:shadow-lg hover:-translate-y-[3px] hover:shadow-md"
        }
      `}
    >
      <div
        className="absolute top-3 right-3 cursor-pointer"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <HelpCircle size={19} className="text-[#555]" />
        {showTip && (
          <Tooltip text={isBank ? "Resumo do banco + gráfico" : "Resumo geral"} />
        )}
      </div>

      <div className="flex justify-between items-center">
        <h3
          className="text-md font-semibold text-[#222] dark:text-white/80"
        >
          {props.title}
        </h3>

        {isBank ? (
          <motion.div whileHover={{ scale: 1.12 }}>{props.icon}</motion.div>
        ) : (
          <button
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition"
            onClick={() => setHidden(!hidden)}
          >
            {hidden ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        )}
      </div>

      {!isBank && (
        <>
          <p
            className="
              text-3xl font-extrabold mt-4 select-none
              text-[#000] dark:text-white
            "
          >
            {hidden ? "•••••" : formatCurrency(props.value)}
          </p>

          <div
            className="h-[4px] rounded-full mt-5 opacity-70"
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

            <div className="flex justify-between border-t pt-2 border-black/10">
              <span className="font-semibold text-[#222]">Saldo</span>
              <span
                className={`font-bold ${
                  saldo > 0
                    ? "text-green-700"
                    : saldo < 0
                    ? "text-red-600"
                    : "text-gray-700"
                }`}
              >
                {formatCurrency(saldo)}
              </span>
            </div>
          </div>

          <SparklineDual transactions={props.transactions} />

          <button
            className="mt-4 w-full flex justify-between items-center text-[#333]"
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
                  mt-3 rounded-xl bg-white/60
                  border border-black/10 shadow-inner 
                  backdrop-blur-md
                "
              >
                <div className="p-3 max-h-64 overflow-y-auto space-y-3">
                  {props.transactions.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-3">
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
      <span className="text-sm text-gray-700">{label}</span>
      <span
        className={`
          text-sm font-semibold
          ${color === "green" ? "text-green-600" : ""}
          ${color === "red" ? "text-red-600" : ""}
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
        bg-white border border-gray-200
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

      <p className="text-xs text-gray-500">{vencText}</p>

      <p className="font-semibold text-[#222] mt-1">
        {t.description || "(Sem descrição)"}
      </p>

      <div className="flex justify-between mt-1">
        <span
          className={`font-bold ${
            t.type === "income" ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatCurrency(t.value)}
        </span>
        <span className="text-xs text-gray-500">
          {t.type === "income" ? "Entrada" : "Saída"}
        </span>
      </div>
    </motion.div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  TrendingUp,
  TrendingDown,
  Info,
  Flame,
  Sparkles,
  AlertTriangle,
  BarChart2,
  Gauge,
  Activity,
  CalendarCheck,
  FileDown,
  LineChart,
} from "lucide-react";

import { Pie, Bar, Radar, Scatter } from "react-chartjs-2";

import {
  Chart,
  registerables,
  type TooltipItem
} from "chart.js";

Chart.register(...registerables);

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createPortal } from "react-dom";

import type { Bank } from "../types/Bank";
import type { JSX } from "react/jsx-runtime";

import { BANK_ICONS } from "../components/bankIcons";


const pastel = {
  purple: "rgba(124, 58, 237, 0.55)",
  purpleSolid: "rgba(124, 58, 237, 1)",
  green: "rgba(16, 185, 129, 0.65)",
  red: "rgba(239, 68, 68, 0.65)",
  yellow: "rgba(245, 158, 11, 0.55)",
  blue: "rgba(59, 130, 246, 0.55)",
  indigo: "rgba(99, 102, 241, 0.55)",
};

function resolveBankKey(name: string = "") {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace("banco", "")
    .trim();
}

function formatMoney(v: number) {
  if (isNaN(v)) return "R$ 0,00";
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

function safeDate(v?: string | null) {
  return new Date(v ?? "");
}

function getMonthKey(dateStr: string | null) {
  const d = safeDate(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getWeekIndex(dateStr: string | null) {
  const d = safeDate(dateStr);
  const onejan = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - onejan.getTime();
  return Math.ceil((diff / 86400000 + onejan.getDay() + 1) / 7);
}

function getHour(dateStr: string | null) {
  return Number((dateStr ?? "").substring(11, 13));
}

import { easeOut } from "framer-motion";

const cardMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: easeOut },
};


export function BankAnalyticsModal({
  bank,
  onClose,
}: {
  bank: Bank;
  onClose: () => void;
}) {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const tx = bank.transactions || [];

  const totalIncome = sum(tx.filter(t => t.type === "income").map(t => Number(t.value)));
  const totalOutcome = sum(tx.filter(t => t.type === "expense").map(t => Number(t.value)));
  const saldo = totalIncome - totalOutcome;
  const avgValue = tx.length ? sum(tx.map(t => Number(t.value))) / tx.length : 0;

  const catMap: Record<string, number> = {};
  tx.forEach(t => {
    const c = t.category?.name ?? "Sem categoria";
    catMap[c] = (catMap[c] ?? 0) + Number(t.value);
  });

  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
  const maxCat = Math.max(...Object.values(catMap), 1);

  const monthMap: Record<string, { inc: number; out: number }> = {};
  tx.forEach(t => {
    const key = getMonthKey(t.date);
    const v = Number(t.value);
    if (!monthMap[key]) monthMap[key] = { inc: 0, out: 0 };
    if (t.type === "income") monthMap[key].inc += v;
    if (t.type === "expense") monthMap[key].out += v;
  });

  const monthsSorted = Object.entries(monthMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-2);

  const [prevMonth, currMonth] = monthsSorted;
  const prevSaldo = prevMonth ? prevMonth[1].inc - prevMonth[1].out : 0;
  const currSaldo = currMonth ? currMonth[1].inc - currMonth[1].out : 0;

  const momIncome =
    prevMonth && currMonth
      ? ((currMonth[1].inc - prevMonth[1].inc) / (prevMonth[1].inc || 1)) * 100
      : null;

  const momOutcome =
    prevMonth && currMonth
      ? ((currMonth[1].out - prevMonth[1].out) / (prevMonth[1].out || 1)) * 100
      : null;

  const momSaldo =
    prevMonth && currMonth
      ? ((currSaldo - prevSaldo) / (prevSaldo || 1)) * 100
      : null;

  const heatmap: Record<number, Record<number, number>> = {};
  tx.forEach(t => {
    const d = safeDate(t.date);
    const dow = d.getDay();
    const w = getWeekIndex(t.date);
    const v = Number(t.value);
    if (!heatmap[w]) heatmap[w] = {};
    heatmap[w][dow] = (heatmap[w][dow] ?? 0) + v;
  });

  const heatmapWeeks = Object.keys(heatmap)
    .map(Number)
    .sort((a, b) => a - b)
    .slice(-8);

  const scatterData = {
    datasets: [
      {
        label: "Movimentos por Horário",
        data: tx.map(t => ({
          x: getHour(t.date),
          y: Number(t.value),
        })),
        backgroundColor: pastel.purpleSolid,
      },
    ],
  };

  const numericTrend = tx.map(t =>
    Number(t.value) * (t.type === "income" ? 1 : -1)
  );

  function linearRegression(arr: number[]) {
    const n = arr.length;
    if (n < 2) return null;

    const sumX = (n * (n - 1)) / 2;
    const sumY = sum(arr);
    const sumXY = arr.reduce((a, b, i) => a + i * b, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope =
      (n * sumXY - sumX * sumY) /
      (n * sumX2 - sumX ** 2);

    const intercept = (sumY - slope * sumX) / n;

    return slope * n + intercept;
  }

  const forecast = linearRegression(numericTrend);
  const forecastPositive = forecast !== null && forecast >= 0;

  async function handleExportPDF() {
    const modal = document.getElementById("analytics-modal");
    if (!modal) return;
    const canvas = await html2canvas(modal);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save(`Relatorio-${bank.title}.pdf`);
  }


  const key = bank.key ?? resolveBankKey(String(bank.title ?? ""));

  const visual = BANK_ICONS[key];



  return createPortal(
    <AnimatePresence>
      <motion.div
        className="
          fixed inset-0
          backdrop-blur-xl
          bg-black/30 dark:bg-black/50
          flex items-start justify-center
          pt-10
          z-[9999]
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        <motion.div
          id="analytics-modal"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="
            w-[92%] max-w-6xl max-h-[92%]
            overflow-y-auto
            rounded-3xl
            border
            bg-gradient-to-br from-white/90 to-white/80
            dark:from-[#181820]/90 dark:to-[#101016]/90
            border-[#ECE9FF] dark:border-[#30303A]
            shadow-[0_0_45px_-10px_rgba(123,97,255,0.35)]
            p-10
            backdrop-blur-2xl
          "
        >


          <div className="
            flex justify-between items-center mb-10
            bg-white/40 dark:bg-white/5
            p-4 rounded-2xl border border-white/50 dark:border-white/10
            backdrop-blur-xl
            shadow-lg dark:shadow-black/40
          ">

            <div className="flex items-center gap-4">

              <div className="
                w-16 h-16 rounded-2xl
                flex items-center justify-center
                border border-white/60 dark:border-white/10
                shadow-xl dark:shadow-black/50
                bg-white/60 dark:bg-white/[0.04]
                backdrop-blur-xl
                relative
              ">
                
                <div
                  className="
                    absolute inset-0 rounded-2xl
                    blur-xl opacity-50
                  "
                  style={{ backgroundColor: visual?.color ?? "#7B61FF" }}
                />

              
            <div className="
              w-16 h-16 rounded-2xl
              flex items-center justify-center
              border border-white/60 dark:border-white/10
              shadow-xl dark:shadow-black/50
              bg-white/60 dark:bg-white/[0.04]
              backdrop-blur-xl
              relative overflow-hidden
            ">

              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                style={{ backgroundColor: visual?.color ?? "#7B61FF" }}
              />

           
              <div className="relative z-10">
                {visual?.icon ?? <Info size={30} className="text-[#7B61FF]" />}
              </div>

          
              {typeof visual?.letter === "string" && visual.letter.trim() !== "" && (
                <span
                  className="
                    absolute inset-0 z-20 flex items-center justify-center
                    text-white dark:text-white font-extrabold
                    drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)]
                    pointer-events-none
                  "
                  style={{
                    fontSize:
                      (visual.letter ?? "").length === 1
                        ? "28px"
                        : "20px",
                    letterSpacing:
                      (visual.letter ?? "").length === 1
                        ? "0px"
                        : "-1px",
                  }}
                >
                  {visual.letter}
                </span>
              )}
            </div>


              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-[#2F2F36] dark:text-[#F8F7FF] drop-shadow-sm">
                  Visão Financeira — {bank.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uma experiência premium de análise interativa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPDF}
                className="
                  px-5 py-2 rounded-xl
                  bg-white/60 dark:bg-white/10
                  border border-white/50 dark:border-white/10
                  text-[#7B61FF] dark:text-[#BBAAFF]
                  shadow-md hover:shadow-xl
                  backdrop-blur-xl
                  flex items-center gap-2
                  hover:bg-white/80 dark:hover:bg-white/[0.12]
                  transition-all
                "
              >
                <FileDown size={18} />
                Exportar
              </button>

              <button
                onClick={onClose}
                className="
                  p-3 rounded-xl
                  hover:bg-black/10 dark:hover:bg-white/10
                  transition
                "
              >
                <X size={26} className="text-[#333] dark:text-[#F3F1FF]" />
              </button>
            </div>

          </div>



          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            <MetricCard2026
              icon={<TrendingUp className="text-green-500" size={22} />}
              label="Entradas"
              value={formatMoney(totalIncome)}
            />
            <MetricCard2026
              icon={<TrendingDown className="text-red-500" size={22} />}
              label="Saídas"
              value={formatMoney(totalOutcome)}
            />
            <MetricCard2026
              icon={<Gauge className="text-[#7B61FF]" size={22} />}
              label="Saldo Atual"
              value={formatMoney(saldo)}
            />
            <MetricCard2026
              icon={<Activity className="text-indigo-500" size={22} />}
              label="Ticket Médio"
              value={formatMoney(avgValue)}
            />
          </div>



          <PremiumGlassBox>

            <h3 className="
              text-lg font-semibold mb-4 flex items-center gap-2 
              text-[#7B61FF] dark:text-[#B7A4FF]
            ">
              <Sparkles size={18} /> O que este período está dizendo?
            </h3>

            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
              <InsightItem2026
                text="A categoria mais relevante foi "
                strong={topCat ? `${topCat[0]} (${formatMoney(topCat[1])})` : ""}
                icon={<BarChart2 size={16} className="text-[#7B61FF]" />}
              />
              <InsightItem2026
                text="O saldo fechou em "
                strong={formatMoney(saldo)}
                icon={saldo >= 0 ?
                  <TrendingUp size={16} className="text-green-500" /> :
                  <TrendingDown size={16} className="text-red-500" />
                }
              />

              {avgValue > 500 && (
                <InsightItem2026
                  text="Ticket médio elevado — período de alta intensidade."
                  icon={<Flame size={16} className="text-red-500" />}
                />
              )}

              {totalOutcome > totalIncome && (
                <InsightItem2026
                  text="As saídas superaram as entradas — atenção ao fluxo."
                  icon={<AlertTriangle size={16} className="text-orange-500" />}
                />
              )}
            </div>

          </PremiumGlassBox>



          <div className="mb-12">
            <h3 className="
              text-lg font-semibold mb-4 flex items-center gap-2
              text-[#7B61FF] dark:text-[#B7A4FF]
            ">
              <CalendarCheck size={18} /> Balanço Mensal Inteligente
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MoMCard2026 label="Entradas MoM" value={momIncome} />
              <MoMCard2026 label="Saídas MoM" value={momOutcome} />
              <MoMCard2026 label="Saldo MoM" value={momSaldo} />
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

            <ChartCard2026 title="Para Onde o Dinheiro Foi?">
              <Pie
                data={{
                  labels: Object.keys(catMap),
                  datasets: [{
                    data: Object.values(catMap),
                    backgroundColor: [
                      pastel.purple, pastel.blue, pastel.green,
                      pastel.yellow, pastel.red, pastel.indigo,
                    ],
                    borderColor: "#fff",
                    borderWidth: 2,
                  }],
                }}
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (ctx: TooltipItem<"pie">) => {
                          const val = Number(ctx.raw) || 0;
                          return `${ctx.label}: ${formatMoney(val)}`;
                        },
                      },
                    },
                  },
                }}
              />
            </ChartCard2026>

            <ChartCard2026 title="Movimentação Diária — Entradas x Saídas">
              <Bar
                data={{
                  labels: [...new Set(tx.map(t => String(t.date).slice(0, 10)))],
                  datasets: [
                    {
                      label: "Entradas",
                      backgroundColor: pastel.green,
                      data: [...new Set(tx.map(t => String(t.date).slice(0, 10)))].map(d =>
                        tx
                          .filter(t => t.type === "income" && String(t.date).slice(0, 10) === d)
                          .reduce((a, b) => a + Number(b.value), 0)
                      ),
                    },
                    {
                      label: "Saídas",
                      backgroundColor: pastel.red,
                      data: [...new Set(tx.map(t => String(t.date).slice(0, 10)))].map(d =>
                        tx
                          .filter(t => t.type === "expense" && String(t.date).slice(0, 10) === d)
                          .reduce((a, b) => a + Number(b.value), 0)
                      ),
                    },
                  ],
                }}
              />
            </ChartCard2026>

            <ChartCard2026 title="Onde os Gastos Pesam? — Radar">
              <Radar
                data={{
                  labels: Object.keys(catMap),
                  datasets: [{
                    label: "Gastos",
                    data: Object.values(catMap),
                    backgroundColor: "rgba(124,58,237,0.25)",
                    borderColor: pastel.purpleSolid,
                    borderWidth: 2,
                  }],
                }}
              />
            </ChartCard2026>

            <ForecastCard2026 forecast={forecast} positive={forecastPositive} />

          </div>

          <ScatterPlot2026 data={scatterData} />


          <Heatmap2026 data={heatmap} weeks={heatmapWeeks} />


          <PremiumGlassBox>
            <h3 className="
              text-lg font-semibold mb-4 flex items-center gap-2
              text-[#7B61FF] dark:text-[#B7A4FF]
            ">
              <BarChart2 size={18} /> Ranking de Categorias
            </h3>

            <div className="space-y-4">
              {Object.entries(catMap)
                .sort((a, b) => b[1] - a[1])
                .map(([name, value]) => (
                  <CategoryRank2026
                    key={name}
                    name={name}
                    value={value}
                    maxValue={maxCat}
                  />
                ))}
            </div>
          </PremiumGlassBox>

          <PremiumGlassBox>

            <h3 className="
              text-xl font-semibold mb-3 text-[#7B61FF] dark:text-[#B7A4FF]
            ">
              Resumo Final — O Que Este Período Revela?
            </h3>

            <p className="
              text-gray-700 dark:text-gray-300 text-sm leading-relaxed
            ">
              O comportamento financeiro de <strong>{bank.title}</strong> apresenta um
              perfil <strong>{saldo >= 0 ? "saudável e equilibrado" : "pressionado pelas saídas"}</strong>.
              A categoria <strong>{topCat?.[0]}</strong> dominou a movimentação,
              enquanto padrões semanais e horários revelam picos importantes.
              A projeção indica tendência <strong>{forecastPositive ? "positiva" : "negativa"}</strong>,
              sugerindo ajustes estratégicos inteligentes.
            </p>

          </PremiumGlassBox>

        </motion.div>
      </motion.div>
    </AnimatePresence>,
    modalRoot
  );
}


function PremiumGlassBox({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      {...cardMotion}
      className="
        p-7 rounded-2xl mb-12
        bg-white/60 dark:bg-white/[0.04]
        border border-white/50 dark:border-white/10
        shadow-lg dark:shadow-black/30
        backdrop-blur-xl
      "
    >
      {children}
    </motion.div>
  );
}

function MetricCard2026({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      transition={{ type: "spring", stiffness: 140 }}
      className="
        p-5 rounded-2xl
        bg-white/70 dark:bg-white/[0.05]
        border border-white/60 dark:border-white/10
        shadow-lg dark:shadow-black/30
        backdrop-blur-xl
        hover:shadow-2xl hover:border-white/80 dark:hover:border-white/20
        transition-all
        flex flex-col gap-1
      "
    >
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        {icon} {label}
      </div>
      <div className="font-bold text-xl text-[#2F2F36] dark:text-[#EDEBFF]">
        {value}
      </div>
    </motion.div>
  );
}

function InsightItem2026({
  text,
  strong,
  icon,
}: {
  text: string;
  strong?: string;
  icon: JSX.Element;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-2"
    >
      <div className="mt-0.5">{icon}</div>
      <p className="text-gray-700 dark:text-gray-200">
        {text} {strong && <strong>{strong}</strong>}
      </p>
    </motion.div>
  );
}

function MoMCard2026({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  const positive = value !== null && value >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="
        p-5 rounded-2xl
        bg-white/60 dark:bg-white/[0.04]
        border border-white/50 dark:border-white/10
        shadow-lg dark:shadow-black/30
        backdrop-blur-xl
        hover:border-white/80 dark:hover:border-white/20
      "
    >
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{label}</div>

      {value !== null ? (
        <div className="flex items-center gap-2">
          {positive ? (
            <TrendingUp size={20} className="text-green-500" />
          ) : (
            <TrendingDown size={20} className="text-red-500" />
          )}

          <span className={`
            font-bold text-lg
            ${positive ? "text-green-600" : "text-red-600"}
          `}>
            {positive ? "+" : ""}
            {value.toFixed(1)}%
          </span>
        </div>
      ) : (
        <span className="text-gray-400 dark:text-gray-500 text-sm">
          Sem dados suficientes
        </span>
      )}
    </motion.div>
  );
}

function ChartCard2026({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      className="
        p-7 rounded-2xl
        bg-white/60 dark:bg-white/[0.04]
        border border-white/50 dark:border-white/10
        shadow-xl dark:shadow-black/40
        backdrop-blur-xl
        hover:shadow-2xl hover:border-white/80 dark:hover:border-white/20
      "
    >
      <h3 className="text-lg font-semibold mb-4 text-[#7B61FF] dark:text-[#B7A4FF]">
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

function ForecastCard2026({
  forecast,
  positive,
}: {
  forecast: number | null;
  positive: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="
        p-7 rounded-2xl
        bg-white/60 dark:bg-white/[0.04]
        border border-white/50 dark:border-white/10
        shadow-xl dark:shadow-black/40
        backdrop-blur-xl
        hover:shadow-2xl hover:border-white/80 dark:hover:border-white/20
      "
    >
      <h3 className="
        text-lg font-semibold mb-4 flex items-center gap-2
        text-[#7B61FF] dark:text-[#B7A4FF]
      ">
        Previsão do Próximo Ciclo
        <LineChart size={18} />
      </h3>

      {forecast !== null ? (
        <div className="flex items-center gap-4">
          {positive ? (
            <TrendingUp size={40} className="text-green-500" />
          ) : (
            <TrendingDown size={40} className="text-red-500" />
          )}

          <div>
            <div className={`
              text-2xl font-extrabold
              ${positive ? "text-green-600" : "text-red-600"}
            `}>
              {positive ? "+" : ""}
              {formatMoney(forecast)}
            </div>

            <div className={`
              inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold
              ${positive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"}
            `}>
              {positive ? "Tendência de alta" : "Tendência de queda"}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          Não há dados suficientes para projetar.
        </p>
      )}
    </motion.div>
  );
}

function CategoryRank2026({
  name,
  value,
  maxValue,
}: {
  name: string;
  value: number;
  maxValue: number;
}) {
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700 dark:text-gray-200">{name}</span>
        <span className="font-semibold text-[#2F2F36] dark:text-[#EDEBFF]">
          {formatMoney(value)}
        </span>
      </div>

      <div className="
        w-full h-2 rounded-full
        bg-gray-200 dark:bg-white/[0.06]
        overflow-hidden
      ">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="
            h-full 
            bg-[#7B61FF] dark:bg-[#B7A4FF]
            shadow-[0_0_10px_2px_rgba(123,97,255,0.5)]
          "
        />
      </div>
    </motion.div>
  );
}

function ScatterPlot2026({ data }: { data: any }) {
  return (
    <ChartCard2026 title="Picos do Dia — Horário x Valor">
      <Scatter
        data={data}
        options={{
          scales: {
            x: {
              min: 0, max: 23,
              ticks: { color: "#888" },
              title: {
                display: true,
                text: "Hora do dia",
                color: "#888",
              },
            },
            y: {
              ticks: { color: "#888" },
              title: {
                display: true,
                text: "Valor (R$)",
                color: "#888",
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx: any) =>
                  `${ctx.raw.x}h — ${formatMoney(Number(ctx.raw.y) || 0)}`,
              },
            },
          },
        }}
      />
    </ChartCard2026>
  );
}

function Heatmap2026({
  data,
  weeks,
}: {
  data: Record<number, Record<number, number>>;
  weeks: number[];
}) {
  const max = Math.max(
    1,
    ...weeks.flatMap((w) => Object.values(data[w] || {}))
  );

  const daysLabel = ["D", "S", "T", "Q", "Q", "S", "S"];

  function color(value: number) {
    const pct = value / max;
    if (pct === 0) return "rgba(124,58,237,0.07)";
    if (pct < 0.25) return "rgba(124,58,237,0.18)";
    if (pct < 0.5) return "rgba(124,58,237,0.32)";
    if (pct < 0.75) return "rgba(124,58,237,0.46)";
    return "rgba(124,58,237,0.65)";
  }

  return (
    <ChartCard2026 title="Mapa de Calor — Atividade Semanal">
      <div className="flex gap-6 overflow-x-auto pb-4">

        <div className="flex flex-col justify-between py-1 text-xs text-gray-400 dark:text-gray-500">
          {daysLabel.map((d, i) => (
            <div key={i} className="h-5 flex items-center">{d}</div>
          ))}
        </div>

        {weeks.map((week) => (
          <div key={week} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dow) => {
              const value = data[week]?.[dow] ?? 0;

              return (
                <motion.div
                  whileHover={{ scale: 1.25 }}
                  key={dow}
                  className="
                    w-5 h-5 rounded-md cursor-pointer
                    border border-black/5 dark:border-white/10
                    shadow-sm hover:shadow-md dark:shadow-black/30
                  "
                  style={{ backgroundColor: color(value) }}
                  title={`Dia: ${daysLabel[dow]}\nValor: ${formatMoney(value)}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="
        flex justify-end mt-3 gap-1 items-center 
        text-xs text-gray-400 dark:text-gray-500
      ">
        <span>Baixo</span>
        <div className="w-5 h-4 rounded-md border dark:border-white/10" style={{ backgroundColor: color(0.1 * max) }} />
        <div className="w-5 h-4 rounded-md border dark:border-white/10" style={{ backgroundColor: color(0.35 * max) }} />
        <div className="w-5 h-4 rounded-md border dark:border-white/10" style={{ backgroundColor: color(0.6 * max) }} />
        <div className="w-5 h-4 rounded-md border dark:border-white/10" style={{ backgroundColor: color(0.9 * max) }} />
        <span>Alto</span>
      </div>

    </ChartCard2026>
  );
}

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
  Timer,
  Clock3,
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

import type { Bank } from "../types/Bank";
import type { JSX } from "react/jsx-runtime";


const pastel = {
  purple: "rgba(124, 58, 237, 0.55)",
  purpleSolid: "rgba(124, 58, 237, 1)",
  green: "rgba(16, 185, 129, 0.65)",
  red: "rgba(239, 68, 68, 0.65)",
  yellow: "rgba(245, 158, 11, 0.55)",
  blue: "rgba(59, 130, 246, 0.55)",
  indigo: "rgba(99, 102, 241, 0.55)",
};


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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-start justify-center pt-10 z-[9999]"
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
            w-[92%] max-w-6xl max-h-[92%] overflow-y-auto
            bg-white dark:bg-[#141418]
            rounded-3xl shadow-2xl dark:shadow-black/40
            p-8 border border-[#ECE9FF] dark:border-[#30303A]
          "
        >

      
          <div className="flex justify-between items-center mb-8">

       
            <div className="flex items-center gap-4">
              <div className="
                w-14 h-14 rounded-2xl
                bg-[#F5F2FF] dark:bg-[#222233]
                shadow-lg dark:shadow-black/40
                border border-[#E6E1F7] dark:border-[#30303A]
                flex items-center justify-center
                hover:scale-105 transition-all
              ">
                {typeof bank.icon === "string"
                  ? <img src={bank.icon} className="w-9 h-9" />
                  : bank.icon ?? <Info size={28} className="text-[#7B61FF]" />}
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2F2F36] dark:text-[#EDEBFF]">
                  Visão Geral do Período — {bank.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uma leitura moderna, interativa e profunda do comportamento financeiro.
                </p>
              </div>
            </div>

   
            <div className="flex items-center gap-3">

              <button
                onClick={handleExportPDF}
                className="
                  px-4 py-2 rounded-xl
                  bg-[#F5F2FF] dark:bg-[#222233]
                  border border-[#E6E1F7] dark:border-[#30303A]
                  text-[#7B61FF] dark:text-[#BBAAFF]
                  shadow-sm dark:shadow-black/30
                  flex items-center gap-2
                  hover:bg-[#EEE8FF] dark:hover:bg-[#2A2A38]
                  hover:shadow-md transition-all
                "
              >
                <FileDown size={18} />
                Exportar
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition"
              >
                <X size={24} className="text-[#2F2F36] dark:text-[#EDEBFF]" />
              </button>
            </div>
          </div>

         
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <MetricCard icon={<TrendingUp className="text-green-500" size={22} />} label="Entradas" value={formatMoney(totalIncome)} />
            <MetricCard icon={<TrendingDown className="text-red-500" size={22} />} label="Saídas" value={formatMoney(totalOutcome)} />
            <MetricCard icon={<Gauge className="text-[#7B61FF]" size={22} />} label="Saldo Atual" value={formatMoney(saldo)} />
            <MetricCard icon={<Activity className="text-indigo-500" size={22} />} label="Ticket Médio" value={formatMoney(avgValue)} />
          </div>

      
          <div className="mb-12 p-6 rounded-2xl border bg-[#F9F8FF] dark:bg-[#1A1A22] shadow-sm dark:shadow-black/40 dark:border-[#30303A]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#7B61FF]">
              <Sparkles size={18} /> O que este período está dizendo?
            </h3>

            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
              <InsightItem text="A categoria mais relevante no período foi " strong={topCat ? `${topCat[0]} (${formatMoney(topCat[1])})` : ""} icon={<BarChart2 size={16} className="text-[#7B61FF]" />} />
              <InsightItem text="O saldo geral fechou em " strong={formatMoney(saldo)} icon={saldo >= 0 ? <TrendingUp size={16} className="text-green-500" /> : <TrendingDown size={16} className="text-red-500" />} />
              {avgValue > 500 && <InsightItem text="O ticket médio está elevado — indicando momentos de alta intensidade." icon={<Flame size={16} className="text-red-500" />} />}
              {totalOutcome > totalIncome && <InsightItem text="As saídas superaram as entradas — atenção ao fluxo." icon={<AlertTriangle size={16} className="text-orange-500" />} />}
            </div>
          </div>

       
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#7B61FF]">
              <CalendarCheck size={18} /> Balanço Mensal Inteligente
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MoMCard label="Entradas MoM" value={momIncome} />
              <MoMCard label="Saídas MoM" value={momOutcome} />
              <MoMCard label="Saldo MoM" value={momSaldo} />
            </div>
          </div>

         
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

         
            <ChartCard title="Para Onde o Dinheiro Foi?">
              <Pie
                data={{
                  labels: Object.keys(catMap),
                  datasets: [
                    {
                      data: Object.values(catMap),
                      backgroundColor: [
                        pastel.purple,
                        pastel.blue,
                        pastel.green,
                        pastel.yellow,
                        pastel.red,
                        pastel.indigo,
                      ],
                      borderColor: "#fff",
                      borderWidth: 2,
                    },
                  ],
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
            </ChartCard>

            <ChartCard title="Movimentação Diária — Entradas x Saídas">
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
            </ChartCard>


            <ChartCard title="Onde os Gastos Mais Pesam? — Radar">
              <Radar
                data={{
                  labels: Object.keys(catMap),
                  datasets: [
                    {
                      label: "Gastos",
                      data: Object.values(catMap),
                      backgroundColor: "rgba(124,58,237,0.25)",
                      borderColor: pastel.purpleSolid,
                      borderWidth: 2,
                    },
                  ],
                }}
              />
            </ChartCard>

   
            <ForecastCard forecast={forecast} positive={forecastPositive} />

          </div>

     
          <ScatterPlot2026 data={scatterData} />

  
          <Heatmap2026 data={heatmap} weeks={heatmapWeeks} />

     
          <div className="p-6 rounded-2xl border bg-[#FAFAFF] dark:bg-[#191920] shadow-sm dark:shadow-black/40 mb-12 dark:border-[#30303A]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#7B61FF]">
              <BarChart2 size={18} /> Ranking de Categorias
            </h3>

            <div className="space-y-4">
              {Object.entries(catMap)
                .sort((a, b) => b[1] - a[1])
                .map(([name, value]) => (
                  <CategoryRank key={name} name={name} value={value} maxValue={maxCat} />
                ))}
            </div>
          </div>

          
          <div className="p-6 rounded-2xl border bg-[#F9F8FF] dark:bg-[#1A1A22] shadow-sm dark:shadow-black/40 mb-10 dark:border-[#30303A]">
            <h3 className="text-lg font-semibold mb-3 text-[#7B61FF]">
              Resumo Final — O Que Este Período Revela?
            </h3>

            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              O comportamento financeiro de <strong>{bank.title}</strong> apresenta um perfil{" "}
              <strong>{saldo >= 0 ? "saudável e equilibrado" : "pressionado pelas saídas"}</strong>.
              A categoria <strong>{topCat?.[0]}</strong> dominou a movimentação,
              enquanto os padrões semanais e horários revelam momentos de maior intensidade.
              A projeção indica uma tendência{" "}
              <strong>{forecastPositive ? "positiva" : "negativa"}</strong>, sugerindo
              oportunidades de ajustes finos e decisões estratégicas.
            </p>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


function MetricCard({
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
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 150 }}
      className="
        p-4 rounded-2xl
        bg-[#FAFAFF] dark:bg-[#1A1A22]
        border border-[#E6E1F7] dark:border-[#30303A]
        shadow-sm dark:shadow-black/30
        flex flex-col gap-1
        hover:shadow-lg hover:border-[#D8D2FF]
        dark:hover:border-[#5A4FCF]
      "
    >
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
        {icon} {label}
      </div>
      <div className="font-bold text-lg text-[#2F2F36] dark:text-[#EDEBFF]">{value}</div>
    </motion.div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="
        p-6 rounded-2xl
        border bg-[#FAFAFF] dark:bg-[#191920]
        shadow-md hover:shadow-xl
        dark:shadow-black/40
        hover:border-[#D8D2FF] dark:hover:border-[#5248C7]
      "
    >
      <h3 className="text-lg font-semibold mb-4 text-[#7B61FF]">{title}</h3>
      {children}
    </motion.div>
  );
}

function InsightItem({
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
      initial={{ opacity: 0, x: -6 }}
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

function MoMCard({
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
        p-4 rounded-2xl
        bg-[#F5F2FF] dark:bg-[#222233]
        border border-[#E6E1F7] dark:border-[#30303A]
        shadow-sm dark:shadow-black/30
        hover:shadow-lg hover:border-[#D8D2FF]
        dark:hover:border-[#5A4FCF]
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

          <span
            className={`
              font-bold text-lg
              ${positive ? "text-green-600" : "text-red-600"}
            `}
          >
            {positive ? "+" : ""}
            {value.toFixed(1)}%
          </span>
        </div>
      ) : (
        <span className="text-gray-400 dark:text-gray-500 text-sm">Sem dados suficientes</span>
      )}
    </motion.div>
  );
}

function ForecastCard({
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
        p-6 rounded-2xl
        border bg-[#FAFAFF] dark:bg-[#191920]
        shadow-md hover:shadow-xl
        dark:shadow-black/40
        hover:border-[#D8D2FF] dark:hover:border-[#5248C7]
      "
    >
      <h3 className="text-lg font-semibold mb-4 text-[#7B61FF] flex items-center gap-2">
        Previsão do Próximo Ciclo
        <LineChart size={18} />
      </h3>

      {forecast !== null ? (
        <div className="flex items-center gap-4">
          {positive ? (
            <TrendingUp size={36} className="text-green-500" />
          ) : (
            <TrendingDown size={36} className="text-red-500" />
          )}

          <div>
            <div
              className={`
                text-2xl font-extrabold
                ${positive ? "text-green-600" : "text-red-600"}
              `}
            >
              {positive ? "+" : ""}
              {formatMoney(forecast)}
            </div>

            <div
              className={`
                inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold
                ${positive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"}
              `}
            >
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

function CategoryRank({
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

      <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-[#2A2A30] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-full bg-[#7B61FF]"
        />
      </div>
    </motion.div>
  );
}

function ScatterPlot2026({ data }: { data: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="
        p-6 rounded-2xl border
        bg-[#FAFAFF] dark:bg-[#191920]
        shadow-md hover:shadow-xl
        dark:shadow-black/40
        hover:border-[#D8D2FF] dark:hover:border-[#5248C7]
        mb-12
      "
    >
      <h3 className="text-lg font-semibold mb-4 text-[#7B61FF] flex items-center gap-2">
        Picos do Dia — Horário x Valor
        <Clock3 size={18} />
      </h3>

      <Scatter
        data={data}
        options={{
          scales: {
            x: { 
              min: 0, max: 23,
              title: { display: true, text: "Hora do dia", color: "#888" }
            },
            y: { 
              title: { display: true, text: "Valor (R$)", color: "#888" }
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
    </motion.div>
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
    <motion.div
      {...cardMotion}
      className="
        p-6 rounded-2xl border
        bg-[#FAFAFF] dark:bg-[#191920]
        shadow-md hover:shadow-xl
        dark:shadow-black/40
        hover:border-[#D8D2FF] dark:hover:border-[#5248C7]
        mb-12
      "
    >
      <h3 className="text-lg font-semibold mb-4 text-[#7B61FF] flex items-center gap-2">
        Mapa de Calor — Atividade Semanal
        <Timer size={18} />
      </h3>

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


      <div className="flex justify-end mt-3 gap-1 items-center text-xs text-gray-400 dark:text-gray-500">
        <span>Baixo</span>
        <div className="w-5 h-4 rounded-md border dark:border-white/10" style={{ backgroundColor: color(0.1 * max) }} />
        <div className="w-5 h-4 rounded-md border dark:border-white/10" style={{ backgroundColor: color(0.35 * max) }} />
        <div className="w-5 h-4 rounded-md border dark:border-white/10" style={{ backgroundColor: color(0.6 * max) }} />
        <div className="w-5 h-4 rounded-md border dark:border-white/10" style={{ backgroundColor: color(0.9 * max) }} />
        <span>Alto</span>
      </div>
    </motion.div>
  );
}


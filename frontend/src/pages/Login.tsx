import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClearSheetLogo } from "../layouts/ClearSheetLogo";

import {
  Loader2,
  CreditCard,
  Landmark,
  DollarSign,
  PiggyBank,
  Wallet,
  Coins,
  Banknote,
  BarChart3,
  TrendingUp,
  Receipt,
} from "lucide-react";

import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================================
  // 🔒 BLOQUEIA O DARK MODE SOMENTE NO LOGIN
  // ============================================================
  useEffect(() => {
    const html = document.documentElement;

    // Remove tema dark ao entrar no login
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
    }

    // Impede que qualquer componente tente recolocar dark
    const observer = new MutationObserver(() => {
      if (html.classList.contains("dark")) {
        html.classList.remove("dark");
      }
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // ============================================================
  // ÍCONES FLUTUANTES
  // ============================================================
  const icons = [
    { icon: <CreditCard size={80} className="text-[#7B61FF]" />, delay: 0 },
    { icon: <Landmark size={95} className="text-[#7B61FF]" />, delay: 3 },
    { icon: <DollarSign size={75} className="text-[#00C184]" />, delay: 1 },
    { icon: <PiggyBank size={90} className="text-[#03B57F]" />, delay: 4 },
    { icon: <Wallet size={72} className="text-[#2A7FFF]" />, delay: 2 },
    { icon: <Banknote size={88} className="text-[#4B9CFF]" />, delay: 5 },
    { icon: <Coins size={78} className="text-[#FFA647]" />, delay: 1.5 },
    { icon: <Receipt size={72} className="text-[#FF874A]" />, delay: 3.5 },
    { icon: <TrendingUp size={85} className="text-[#FF4F7B]" />, delay: 2.75 },
    { icon: <BarChart3 size={96} className="text-[#FF6B9F]" />, delay: 6 },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Credenciais inválidas");
        return;
      }

      const rawToken =
        data?.data?.token ??
        data?.token ??
        "";

      const token = String(rawToken).replace(/^"|"$/g, "").trim();

      if (!token || token.length < 30) {
        setError("Token inválido recebido");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/app/dashboard", { replace: true });

    } catch {
      setError("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // LAYOUT DO LOGIN
  // ============================================================
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFAFF]">

      {/* ÍCONES ANIMADOS */}
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute opacity-[0.22] pointer-events-none"
          initial={{ y: 100, scale: 0.85, rotate: 0 }}
          animate={{
            y: [-90, 90, -90],
            opacity: [0.15, 0.4, 0.22],
            rotate: [0, 12, -12, 0],
            scale: [0.9, 1.1, 0.95],
          }}
          transition={{
            duration: 18 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
          style={{
            left: `${8 + (index * 9) % 84}%`,
            top: `${10 + (index * 13) % 76}%`,
          }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* CARD DO LOGIN */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            w-full max-w-md 
            bg-white 
            border border-[#E4E2F0]
            rounded-3xl 
            shadow-lg 
            p-10
            backdrop-blur-xl
          "
        >
          <div className="flex justify-center mb-8">
            {/* LOGO FORÇADA PARA CLARO */}
            <ClearSheetLogo size={120} forceLight />
          </div>

          <h1 className="text-2xl font-display text-[#2F2F36] font-semibold text-center mb-6 tracking-tight">
            Acesse sua conta
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-3 mb-5 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-[#3A3A45]">E-mail</label>
              <input
                type="email"
                className="
                  w-full px-4 py-3 rounded-xl 
                  bg-[#FBFAFF] 
                  border border-[#E0DEED] 
                  focus:ring-2 focus:ring-[#7B61FF] focus:border-[#7B61FF]
                  outline-none transition
                "
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-[#3A3A45]">Senha</label>
              <input
                type="password"
                className="
                  w-full px-4 py-3 rounded-xl 
                  bg-[#FBFAFF] 
                  border border-[#E0DEED] 
                  focus:ring-2 focus:ring-[#7B61FF] focus:border-[#7B61FF]
                  outline-none transition
                "
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-2
                bg-[#7B61FF] text-white 
                py-3 rounded-xl 
                text-base font-medium 
                shadow-sm hover:bg-[#6A54E6]
                transition disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Entrar
            </button>
          </form>

          <div className="text-center mt-10">
            <p className="text-xs text-gray-500 tracking-wide">
              <strong>ClearSheet 2.0</strong>
            </p>

            <p className="text-[11px] text-gray-400">
              Desenvolvido por <strong>Studio M&D</strong>
            </p>

            <p className="text-[10px] text-gray-400 mt-2">
              © {new Date().getFullYear()} ClearSheet • Todos os direitos reservados
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

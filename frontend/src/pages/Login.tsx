import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClearSheetLogo } from "../layouts/ClearSheetLogo";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Credenciais inválidas");
        setLoading(false);
        return;
      }

      const token = data?.data?.token;

      if (!token) {
        setError("Token não recebido");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch {
      setError("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFF] animate-fadeIn p-6">

      <div
        className="
          w-full max-w-md 
          bg-white 
          border border-[#E4E2F0]
          rounded-3xl 
          shadow-sm 
          p-10 
        "
      >
        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <ClearSheetLogo size={110} />
        </div>

        <h1 className="text-2xl font-display text-[#2F2F36] font-semibold text-center mb-6 tracking-tight">
          Acesse sua conta
        </h1>

        {/* ERRO */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 mb-5 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
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

          {/* SENHA */}
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

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full 
              flex items-center justify-center gap-2
              bg-[#7B61FF] 
              text-white 
              py-3 
              rounded-xl 
              text-base font-medium 
              shadow-sm 
              hover:bg-[#6A54E6] 
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Entrar
          </button>

        </form>
      </div>

    </div>
  );
}

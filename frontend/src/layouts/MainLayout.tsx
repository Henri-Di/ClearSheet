import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Sidebar } from "../components/navigation/Sidebar";
import { api } from "../services/api";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setLoadingLogout(true);

    Swal.fire({
      title: "Saindo...",
      text: "Aguarde enquanto finalizamos sua sessão.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await api.post("/logout");
      localStorage.removeItem("token");

      Swal.close();
      navigate("/login");
    } catch (err) {
      Swal.fire("Erro", "Não foi possível finalizar o logout.", "error");
    } finally {
      setLoadingLogout(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FBFAFF]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((previous) => !previous)}
        onLogout={handleLogout}
        loadingLogout={loadingLogout}
      />

      <main className="flex-1 p-10 bg-[#FBFAFF]">
        <div
          className="
            max-w-7xl mx-auto min-h-[85vh]
            bg-white rounded-3xl shadow-lg border border-[#ECEBF5]
            p-10 transition-all animate-fadeIn
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

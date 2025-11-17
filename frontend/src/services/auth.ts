import { api } from "./api";

export async function authLogout() {
  try {
    await api.post("/logout");
  } catch (e) {
    console.error("Erro ao fazer logout:", e);
  }
}

import axios from "axios";
import type { AuthRepository } from "@/domain/auth/ports";
import type { AuthSession } from "@/domain/auth/entities";

const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export const nextAuthRepository: AuthRepository = {
  async login(username, password): Promise<AuthSession> {
    await api.post("/auth/login", { username, password });
    return { accessToken: "httpOnly-cookie" }; 
  },
  async logout() {
    await api.post("/auth/logout");
  },
};

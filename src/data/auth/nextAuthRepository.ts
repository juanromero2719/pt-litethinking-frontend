import type { AuthRepository, RegisterData, RegisterResponse } from "@/domain/auth/ports";
import type { AuthSession } from "@/domain/auth/entities";
import { client } from "@/lib/axios/client";

export const nextAuthRepository: AuthRepository = {
  async login(username, password): Promise<AuthSession> {
    try {
      await client.post("/auth/login", { username, password });
      return { accessToken: "httpOnly-cookie" };
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error al iniciar sesión";
      throw new Error(message);
    }
  },
  async logout() {
    await client.post("/auth/logout");
  },
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await client.post("/auth/registro", data);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.response?.data?.error || "Error al registrar usuario";
      throw new Error(message);
    }
  },
};

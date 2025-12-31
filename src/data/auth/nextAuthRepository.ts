import type { AuthRepository } from "@/domain/auth/ports";
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
};

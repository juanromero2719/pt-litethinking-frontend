"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateCredentials } from "@/domain/auth/entities";
import { nextAuthRepository } from "@/data/auth/nextAuthRepository";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(username: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      validateCredentials(username, password); 

      await nextAuthRepository.login(username, password);

      router.replace("/dashboard");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);
    await nextAuthRepository.logout();
    setLoading(false);
    router.replace("/login");
    router.refresh();
  }

  return { loading, error, login, logout };
}

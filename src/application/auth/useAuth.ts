"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateCredentials } from "@/domain/auth/entities";
import { nextAuthRepository } from "@/data/auth/nextAuthRepository";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function login(username: string, password: string) {
    try {
      setLoading(true);

      validateCredentials(username, password); 

      await nextAuthRepository.login(username, password);

      router.replace("/dashboard");
      router.refresh();
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    await nextAuthRepository.logout();
    setLoading(false);
    router.replace("/login");
    router.refresh();
  }

  return { loading, login, logout };
}

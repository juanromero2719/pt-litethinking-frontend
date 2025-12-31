"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nextAuthRepository } from "@/data/auth/nextAuthRepository";
import type { RegisterData } from "@/domain/auth/ports";

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function register(data: RegisterData) {
    try {
      setLoading(true);
      await nextAuthRepository.register(data);
      router.push("/login");
      router.refresh();
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, register };
}

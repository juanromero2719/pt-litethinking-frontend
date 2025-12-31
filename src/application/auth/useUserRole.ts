"use client";

import { useState, useEffect } from "react";
import { getUserRoleClient } from "@/lib/auth/getUserRole.client";
import type { UserRole } from "@/domain/auth/entities";

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = getUserRoleClient();
    setRole(userRole);
    setLoading(false);
  }, []);

  return { role, loading, isAdmin: role === "Admin", isExterno: role === "Externo" };
}

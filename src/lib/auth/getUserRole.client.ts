"use client";

import type { UserRole } from "@/domain/auth/entities";

export function getUserRoleClient(): UserRole {
  if (typeof window === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");
  const roleCookie = cookies.find((cookie) => cookie.startsWith("user_role="));
  
  if (!roleCookie) {
    return null;
  }

  const role = roleCookie.split("=")[1];
  
  if (role === "Admin" || role === "Externo") {
    return role;
  }
  
  return null;
}

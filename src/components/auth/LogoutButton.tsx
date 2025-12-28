"use client";

import { useAuth } from "@/application/auth/useAuth";

type Props = {
  className?: string;
};

export default function LogoutButton({ className }: Props) {
  const { loading, logout } = useAuth();

  return (
    <button className={className} onClick={logout} disabled={loading}>
      {loading ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}

"use client";

import { useAuth } from "@/application/auth/useAuth";
import Button from "@/components/atoms/Button";

type LogoutButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
};

export default function LogoutButton({
  className = "",
  variant = "secondary",
  size = "medium",
}: LogoutButtonProps) {
  const { loading, logout } = useAuth();

  return (
    <Button
      onClick={logout}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? "Saliendo..." : "Cerrar sesión"}
    </Button>
  );
}

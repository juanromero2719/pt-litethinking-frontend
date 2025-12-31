"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/application/auth/useAuth";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

export default function LoginForm() {
  const { loading, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await login(username, password);
    } catch (error: any) {
      const errorMessage = error?.message || "Error al iniciar sesión";
      
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: errorMessage,
        confirmButtonColor: "#4A90E2",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-[#2C3E50]">Iniciar sesión</h1>
            <p className="text-sm text-[#6C757D]">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              label="Usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
              required
            />

            <FormField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              required
            />

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

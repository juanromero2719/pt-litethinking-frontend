"use client";

import { useState } from "react";
import { useAuth } from "@/application/auth/useAuth";

export default function LoginPage() {
  const { loading, error, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", display: "grid", gap: 12 }}>
      <h1>Iniciar sesión</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(username, password);
        }}
        style={{ display: "grid", gap: 12 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          Usuario
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="usuario"
            autoComplete="username"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Contraseña
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <p style={{ margin: 0 }}>{error}</p>}
      </form>
    </div>
  );
}

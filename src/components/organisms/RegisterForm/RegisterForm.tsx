"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRegister } from "@/application/auth/useRegister";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

export default function RegisterForm() {
  const { loading, register } = useRegister();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Por favor ingresa un correo electrónico válido";
      }
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!formData.password_confirm) {
      newErrors.password_confirm = "Por favor confirma tu contraseña";
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirm: formData.password_confirm,
      });

      await Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
        confirmButtonColor: "#4A90E2",
        confirmButtonText: "Ir a iniciar sesión",
      });
    } catch (error: any) {
      const errorMessage = error?.message || "Error al registrar usuario";

      // Si el error viene del backend con detalles específicos
      if (error?.response?.data) {
        const backendErrors = error.response.data;
        const newErrors: Record<string, string> = {};

        if (backendErrors.username) {
          newErrors.username = Array.isArray(backendErrors.username)
            ? backendErrors.username[0]
            : backendErrors.username;
        }
        if (backendErrors.email) {
          newErrors.email = Array.isArray(backendErrors.email)
            ? backendErrors.email[0]
            : backendErrors.email;
        }
        if (backendErrors.password) {
          newErrors.password = Array.isArray(backendErrors.password)
            ? backendErrors.password[0]
            : backendErrors.password;
        }
        if (backendErrors.password_confirm) {
          newErrors.password_confirm = Array.isArray(backendErrors.password_confirm)
            ? backendErrors.password_confirm[0]
            : backendErrors.password_confirm;
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error de registro",
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
            <h1 className="text-3xl font-semibold text-[#2C3E50]">Crear cuenta</h1>
            <p className="text-sm text-[#6C757D]">Completa el formulario para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              label="Nombre de usuario"
              type="text"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                if (errors.username) setErrors({ ...errors, username: "" });
              }}
              placeholder="Ingresa tu nombre de usuario"
              autoComplete="username"
              required
              error={errors.username}
            />

            <FormField
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              placeholder="Ingresa tu correo electrónico"
              autoComplete="email"
              required
              error={errors.email}
            />

            <FormField
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              required
              error={errors.password}
            />

            <FormField
              label="Confirmar contraseña"
              type="password"
              value={formData.password_confirm}
              onChange={(e) => {
                setFormData({ ...formData, password_confirm: e.target.value });
                if (errors.password_confirm) setErrors({ ...errors, password_confirm: "" });
              }}
              placeholder="Confirma tu contraseña"
              autoComplete="new-password"
              required
              error={errors.password_confirm}
            />

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </div>

            <div className="text-center text-sm text-[#6C757D]">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-[#4A90E2] hover:underline font-medium">
                Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { usePermissions } from "@/application/auth/usePermissions";
import ProtectedAction from "@/components/organisms/ProtectedAction";
import Button from "@/components/atoms/Button";
import { client } from "@/lib/axios/client";
import Swal from "sweetalert2";

type GenerarInventarioButtonProps = {
  empresaNit: string;
  empresaNombre?: string;
};

export default function GenerarInventarioButton({
  empresaNit,
  empresaNombre,
}: GenerarInventarioButtonProps) {
  const { can } = usePermissions();
  const [loading, setLoading] = useState(false);

  const handleDescargarPDF = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/inventario/empresa/${empresaNit}/pdf`, {
        responseType: "blob",
      });

      // Crear un blob del PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `inventario_${empresaNit}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      await Swal.fire({
        icon: "success",
        title: "PDF descargado",
        text: "El inventario se ha descargado correctamente",
        confirmButtonColor: "#4A90E2",
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Error al descargar el PDF",
        confirmButtonColor: "#4A90E2",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarPorCorreo = async () => {
    // Regex más robusta para validar correos electrónicos
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const { value: email } = await Swal.fire({
      title: "Enviar inventario por correo",
      html: `
        <input
          id="swal-email"
          type="email"
          class="swal2-input"
          placeholder="Correo electrónico"
          required
          autocomplete="email"
        />
        <div id="swal-email-error" class="swal2-validation-message" style="display: none; color: #f27474; font-size: 0.875rem; margin-top: 0.5rem;"></div>
      `,
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4A90E2",
      cancelButtonColor: "#6C757D",
      reverseButtons: true,
      didOpen: () => {
        const emailInput = document.getElementById("swal-email") as HTMLInputElement;
        const errorDiv = document.getElementById("swal-email-error");
        
        if (emailInput && errorDiv) {

          emailInput.addEventListener("input", () => {
            const value = emailInput.value.trim();
            
            if (value.length === 0) {
              errorDiv.style.display = "none";
              emailInput.classList.remove("swal2-inputerror");
              return;
            }
            
            if (!emailRegex.test(value)) {
              errorDiv.textContent = "Por favor ingresa un correo electrónico válido";
              errorDiv.style.display = "block";
              emailInput.classList.add("swal2-inputerror");
            } else {
              errorDiv.style.display = "none";
              emailInput.classList.remove("swal2-inputerror");
            }
          });
          
          emailInput.addEventListener("blur", () => {
            const value = emailInput.value.trim();
            if (value.length > 0 && !emailRegex.test(value)) {
              errorDiv.textContent = "Por favor ingresa un correo electrónico válido";
              errorDiv.style.display = "block";
              emailInput.classList.add("swal2-inputerror");
            }
          });
        }
      },
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Por favor ingresa un correo electrónico";
        }
        
        const trimmedValue = value.trim();
        if (!emailRegex.test(trimmedValue)) {
          return "Por favor ingresa un correo electrónico válido (ejemplo: usuario@dominio.com)";
        }
        
        return null;
      },
      preConfirm: () => {
        const emailInput = document.getElementById("swal-email") as HTMLInputElement;
        if (emailInput) {
          const value = emailInput.value.trim();
          if (!value) {
            Swal.showValidationMessage("Por favor ingresa un correo electrónico");
            return false;
          }
          if (!emailRegex.test(value)) {
            Swal.showValidationMessage("Por favor ingresa un correo electrónico válido (ejemplo: usuario@dominio.com)");
            return false;
          }
          return value;
        }
        return false;
      },
    });

    if (!email) return;

    try {
      setLoading(true);
      const response = await client.get(`/inventario/empresa/${empresaNit}/pdf`, {
        params: { email },
      });

      await Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: response.data.message || `El inventario se está enviando a ${email}`,
        confirmButtonColor: "#4A90E2",
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Error al enviar el correo",
        confirmButtonColor: "#4A90E2",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    Swal.fire({
      title: "Generar Reporte de Inventario",
      text: empresaNombre
        ? `¿Cómo deseas obtener el inventario de ${empresaNombre}?`
        : "¿Cómo deseas obtener el inventario?",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "📥 Descargar PDF",
      denyButtonText: "📧 Enviar por correo",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4A90E2",
      denyButtonColor: "#28a745",
      cancelButtonColor: "#6C757D",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDescargarPDF();
      } else if (result.isDenied) {
        handleEnviarPorCorreo();
      }
    });
  };

  return (
    <ProtectedAction permission={can.productos.listar}>
      <Button
        onClick={handleOpenModal}
        variant="primary"
        size="medium"
        disabled={loading}
        className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 border-0"
      >
        {loading ? "Generando..." : "📄 Generar Inventario PDF"}
      </Button>
    </ProtectedAction>
  );
}

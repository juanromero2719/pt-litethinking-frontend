"use client";

import { useState, useRef } from "react";
import { usePermissions } from "@/application/auth/usePermissions";
import ProtectedAction from "@/components/organisms/ProtectedAction";
import Button from "@/components/atoms/Button";
import { nextEmpresaRepository } from "@/data/empresa/nextEmpresaRepository";
import FormField from "@/components/molecules/FormField";
import Swal from "sweetalert2";

export default function CreateEmpresaButton() {
  const { can } = usePermissions();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleOpenModal = () => {
    Swal.fire({
      title: "Crear Nueva Empresa",
      html: `
        <form id="create-empresa-form" class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-[#2C3E50] mb-2">
              NIT <span class="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="text"
              id="swal-nit"
              class="w-full px-4 py-2 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              placeholder="Ingresa el NIT de la empresa"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2C3E50] mb-2">
              Nombre <span class="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="text"
              id="swal-nombre"
              class="w-full px-4 py-2 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              placeholder="Nombre de la empresa"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2C3E50] mb-2">
              Dirección <span class="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="text"
              id="swal-direccion"
              class="w-full px-4 py-2 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              placeholder="Dirección de la empresa"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2C3E50] mb-2">
              Teléfono <span class="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="text"
              id="swal-telefono"
              class="w-full px-4 py-2 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              placeholder="Teléfono de la empresa"
              required
            />
          </div>
        </form>
      `,
      width: "600px",
      showCancelButton: true,
      confirmButtonText: "Crear empresa",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4A90E2",
      cancelButtonColor: "#6C757D",
      reverseButtons: true,
      didOpen: () => {
        const form = document.getElementById("create-empresa-form");
        if (form) {
          formRef.current = form as HTMLFormElement;
        }
      },
      preConfirm: async () => {
        const nit = (document.getElementById("swal-nit") as HTMLInputElement)?.value;
        const nombre = (document.getElementById("swal-nombre") as HTMLInputElement)?.value;
        const direccion = (document.getElementById("swal-direccion") as HTMLInputElement)?.value;
        const telefono = (document.getElementById("swal-telefono") as HTMLInputElement)?.value;

        if (!nit || !nombre || !direccion || !telefono) {
          Swal.showValidationMessage("Por favor completa todos los campos");
          return false;
        }

        try {
          setLoading(true);
          const nuevaEmpresa = await nextEmpresaRepository.crear({
            nit,
            nombre,
            direccion,
            telefono,
          });

          window.dispatchEvent(new CustomEvent("empresas:reload"));

          return nuevaEmpresa;
        } catch (error: any) {
          Swal.showValidationMessage(error?.message || "Error al crear la empresa");
          setLoading(false);
          return false;
        } finally {
          setLoading(false);
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: "success",
          title: "Empresa creada",
          text: `La empresa "${result.value.nombre}" se ha creado correctamente`,
          confirmButtonColor: "#4A90E2",
        });
      }
    });
  };

  return (
    <ProtectedAction permission={can.empresas.crear}>
      <Button
        onClick={handleOpenModal}
        variant="primary"
        size="small"
        disabled={loading}
      >
        {loading ? "Creando..." : "+ Crear Empresa"}
      </Button>
    </ProtectedAction>
  );
}

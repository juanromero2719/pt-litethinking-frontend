"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEmpresa } from "@/application/empresa/useEmpresa";
import { usePermissions } from "@/application/auth/usePermissions";
import { nextEmpresaRepository } from "@/data/empresa/nextEmpresaRepository";
import Button from "@/components/atoms/Button";
import ProtectedAction from "@/components/organisms/ProtectedAction";
import EditEmpresaForm from "@/components/organisms/EditEmpresaForm";
import Swal from "sweetalert2";

type EmpresaDetailProps = {
  nit: string;
  onEmpresaChanged?: () => void;
};

export default function EmpresaDetail({ nit, onEmpresaChanged }: EmpresaDetailProps) {
  const router = useRouter();
  const { empresa, loading, error, recargar } = useEmpresa(nit);
  const { can } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleEmpresaChange = () => {
      recargar();
      onEmpresaChanged?.();
    };

    window.addEventListener("empresa:changed", handleEmpresaChange);
    window.addEventListener("empresa:deleted", handleEmpresaChange);

    return () => {
      window.removeEventListener("empresa:changed", handleEmpresaChange);
      window.removeEventListener("empresa:deleted", handleEmpresaChange);
    };
  }, [nit, recargar, onEmpresaChanged]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-[#6C757D]">Cargando empresa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FFE3E3] border border-[#FF6B6B] rounded-lg p-4">
        <p className="text-[#FF6B6B] mb-2">{error}</p>
        <Button onClick={recargar} variant="secondary" size="small">
          Reintentar
        </Button>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6C757D]">Empresa no encontrada</p>
      </div>
    );
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar la empresa "${empresa.nombre}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6B6B",
      cancelButtonColor: "#6C757D",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setIsDeleting(true);
      await nextEmpresaRepository.eliminar(nit);

      // Notificar que se eliminó una empresa
      window.dispatchEvent(new CustomEvent("empresa:deleted", { detail: { nit } }));
      window.dispatchEvent(new CustomEvent("empresas:reload"));

      await Swal.fire({
        icon: "success",
        title: "Empresa eliminada",
        text: "La empresa se ha eliminado correctamente",
        confirmButtonColor: "var(--primary-500)",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      const errorMessage = error?.message || "Error al eliminar la empresa";
      
      // Verificar si es el error de productos asociados
      if (errorMessage.includes("productos asociados") || errorMessage.includes("No es posible eliminar")) {
        await Swal.fire({
          icon: "error",
          title: "No se puede eliminar",
          text: "No es posible eliminar esta empresa mientras tenga productos asociados.",
          confirmButtonColor: "var(--primary-500)",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "var(--primary-500)",
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="border border-[#E1E8ED] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#2C3E50]">Editar Empresa</h3>
        </div>
        <EditEmpresaForm
          nit={nit}
          onSuccess={() => {
            setIsEditing(false);
            recargar();
            // Notificar que se editó una empresa
            window.dispatchEvent(new CustomEvent("empresa:changed", { detail: { nit } }));
            window.dispatchEvent(new CustomEvent("empresas:reload"));
            onEmpresaChanged?.();
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="border border-[#E1E8ED] rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#2C3E50] mb-2">
            {empresa.nombre}
          </h2>
          <span className="text-sm text-[#6C757D] bg-[#F8F9FA] px-3 py-1 rounded inline-block">
            NIT: {empresa.nit}
          </span>
        </div>
        <div className="flex gap-2">
          <ProtectedAction permission={can.empresas.editar}>
            <Button onClick={() => setIsEditing(true)} variant="secondary" size="small">
              Editar
            </Button>
          </ProtectedAction>
          <ProtectedAction permission={can.empresas.eliminar}>
            <Button
              onClick={handleDelete}
              variant="secondary"
              size="small"
              disabled={isDeleting}
              className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </ProtectedAction>
          <Button onClick={recargar} variant="ghost" size="small">
            Actualizar
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="border-t border-[#E1E8ED] pt-3">
          <p className="text-sm font-medium text-[#6C757D] mb-1">Dirección</p>
          <p className="text-[#2C3E50]">{empresa.direccion}</p>
        </div>

        <div className="border-t border-[#E1E8ED] pt-3">
          <p className="text-sm font-medium text-[#6C757D] mb-1">Teléfono</p>
          <p className="text-[#2C3E50]">{empresa.telefono}</p>
        </div>
      </div>
    </div>
  );
}

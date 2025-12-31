"use client";

import { useState, useEffect } from "react";
import { useEmpresa } from "@/application/empresa/useEmpresa";
import { nextEmpresaRepository } from "@/data/empresa/nextEmpresaRepository";
import type { Empresa } from "@/domain/empresa/entities";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Swal from "sweetalert2";

type EditEmpresaFormProps = {
  nit: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function EditEmpresaForm({ nit, onSuccess, onCancel }: EditEmpresaFormProps) {
  const { empresa, loading: loadingEmpresa, recargar } = useEmpresa(nit);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Empresa>>({
    nombre: "",
    direccion: "",
    telefono: "",
  });

  useEffect(() => {
    if (empresa) {
      setFormData({
        nombre: empresa.nombre,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
      });
    }
  }, [empresa]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!empresa) return;

    try {
      setLoading(true);
      await nextEmpresaRepository.actualizar(nit, {
        nit: nit,
        nombre: formData.nombre,
        direccion: formData.direccion,
        telefono: formData.telefono,
      });

      await Swal.fire({
        icon: "success",
        title: "Empresa actualizada",
        text: "La empresa se ha actualizado correctamente",
        confirmButtonColor: "var(--primary-500)",
      });

      recargar();
      onSuccess?.();
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Error al actualizar la empresa",
        confirmButtonColor: "var(--primary-500)",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingEmpresa) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-[#6C757D]">Cargando empresa...</p>
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="NIT"
        type="text"
        value={nit}
        disabled
        className="bg-[#F8F9FA]"
      />

      <FormField
        label="Nombre"
        type="text"
        value={formData.nombre || ""}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        required
      />

      <FormField
        label="Dirección"
        type="text"
        value={formData.direccion || ""}
        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
        required
      />

      <FormField
        label="Teléfono"
        type="text"
        value={formData.telefono || ""}
        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        required
      />

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            if (empresa) {
              setFormData({
                nombre: empresa.nombre,
                direccion: empresa.direccion,
                telefono: empresa.telefono,
              });
            }
            onCancel?.();
          }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

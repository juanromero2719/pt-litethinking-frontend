"use client";

import { useState } from "react";
import { nextEmpresaRepository } from "@/data/empresa/nextEmpresaRepository";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Swal from "sweetalert2";

type CreateEmpresaFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function CreateEmpresaForm({ onSuccess, onCancel }: CreateEmpresaFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nit: "",
    nombre: "",
    direccion: "",
    telefono: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const nuevaEmpresa = await nextEmpresaRepository.crear({
        nit: formData.nit,
        nombre: formData.nombre,
        direccion: formData.direccion,
        telefono: formData.telefono,
      });

      await Swal.fire({
        icon: "success",
        title: "Empresa creada",
        text: `La empresa "${nuevaEmpresa.nombre}" se ha creado correctamente`,
        confirmButtonColor: "var(--primary-500)",
      });

      window.dispatchEvent(new CustomEvent("empresas:reload"));

      setFormData({
        nit: "",
        nombre: "",
        direccion: "",
        telefono: "",
      });

      onSuccess?.();
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Error al crear la empresa",
        confirmButtonColor: "var(--primary-500)",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="NIT"
        type="text"
        value={formData.nit}
        onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
        required
        placeholder="Ingresa el NIT de la empresa"
      />

      <FormField
        label="Nombre"
        type="text"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        required
        placeholder="Nombre de la empresa"
      />

      <FormField
        label="Dirección"
        type="text"
        value={formData.direccion}
        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
        required
        placeholder="Dirección de la empresa"
      />

      <FormField
        label="Teléfono"
        type="text"
        value={formData.telefono}
        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        required
        placeholder="Teléfono de la empresa"
      />

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Creando..." : "Crear empresa"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEmpresas } from "@/application/empresa/useEmpresas";
import Button from "@/components/atoms/Button";

export default function EmpresasList() {
  const router = useRouter();
  const { empresas, loading, error, recargar } = useEmpresas();

  useEffect(() => {
    const handleReload = () => {
      recargar();
    };

    window.addEventListener("empresas:reload", handleReload);

    return () => {
      window.removeEventListener("empresas:reload", handleReload);
    };
  }, [recargar]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-[#6C757D]">Cargando empresas...</p>
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

  if (empresas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6C757D]">No hay empresas registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#6C757D]">
          Total: {empresas.length} {empresas.length === 1 ? "empresa" : "empresas"}
        </p>
        <Button onClick={recargar} variant="ghost" size="small">
          Actualizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {empresas.map((empresa) => (
          <div
            key={empresa.nit}
            onClick={() => router.push(`/dashboard/empresa/${empresa.nit}`)}
            className="border border-[#E1E8ED] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-[#4A90E2]"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-[#2C3E50]">{empresa.nombre}</h3>
              <span className="text-xs text-[#6C757D] bg-[#F8F9FA] px-2 py-1 rounded">
                NIT: {empresa.nit}
              </span>
            </div>
            <div className="space-y-1 text-sm text-[#6C757D]">
              <p>
                <span className="font-medium">Dirección:</span> {empresa.direccion}
              </p>
              <p>
                <span className="font-medium">Teléfono:</span> {empresa.telefono}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

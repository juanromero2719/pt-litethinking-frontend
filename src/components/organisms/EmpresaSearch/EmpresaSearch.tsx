"use client";

import { useState, useEffect, useRef } from "react";
import { useEmpresa } from "@/application/empresa/useEmpresa";
import { usePermissions } from "@/application/auth/usePermissions";
import Input from "@/components/atoms/Input";
import ProtectedAction from "@/components/organisms/ProtectedAction";
import Button from "@/components/atoms/Button";
import EmpresaDetail from "@/components/organisms/EmpresaDetail";

export default function EmpresaSearch() {
  const [nit, setNit] = useState("");
  const [nitToSearch, setNitToSearch] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { empresa, loading, error, recargar } = useEmpresa(nitToSearch);
  const { can } = usePermissions();

  useEffect(() => {
    const handleEmpresaChange = (event: any) => {
      const changedNit = event.detail?.nit;
      if (changedNit === nitToSearch) {
        recargar();
      }
    };

    const handleEmpresaDeleted = (event: any) => {
      const deletedNit = event.detail?.nit;
      if (deletedNit === nitToSearch) {
        setNit("");
        setNitToSearch(null);
      }
    };

    window.addEventListener("empresa:changed", handleEmpresaChange);
    window.addEventListener("empresa:deleted", handleEmpresaDeleted);

    return () => {
      window.removeEventListener("empresa:changed", handleEmpresaChange);
      window.removeEventListener("empresa:deleted", handleEmpresaDeleted);
    };
  }, [nitToSearch, recargar]);

  useEffect(() => {

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!nit.trim()) {
      setNitToSearch(null);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setNitToSearch(nit.trim());
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nit]);

  return (
    <div className="space-y-4">
      <div>
        <Input
          id="nit-search"
          type="text"
          placeholder="Ingresa el NIT de la empresa..."
          value={nit}
          onChange={(e) => setNit(e.target.value)}
          className="w-full"
        />
        {nit && !nitToSearch && (
          <p className="text-xs text-[#6C757D] mt-1">
            Buscando automáticamente en 2 segundos...
          </p>
        )}
      </div>

      {loading && nitToSearch && (
        <div className="border border-[#E1E8ED] rounded-lg p-4">
          <p className="text-[#6C757D]">Buscando empresa...</p>
        </div>
      )}

      {error && nitToSearch && (
        <div className="bg-[#FFE3E3] border border-[#FF6B6B] rounded-lg p-4">
          <p className="text-[#FF6B6B]">{error}</p>
        </div>
      )}

      {empresa && !loading && (
        <EmpresaDetail 
          nit={empresa.nit} 
          onEmpresaChanged={recargar}
        />
      )}

      {!empresa && !loading && !error && nitToSearch && (
        <div className="border border-[#E1E8ED] rounded-lg p-4">
          <p className="text-[#6C757D]">No se encontró ninguna empresa con ese NIT</p>
        </div>
      )}
    </div>
  );
}

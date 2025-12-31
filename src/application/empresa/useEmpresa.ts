"use client";

import { useState, useEffect } from "react";
import { nextEmpresaRepository } from "@/data/empresa/nextEmpresaRepository";
import type { Empresa } from "@/domain/empresa/entities";

export function useEmpresa(nit: string | null) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarEmpresa = async () => {
    if (!nit) {
      setEmpresa(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await nextEmpresaRepository.obtenerPorNit(nit);
      setEmpresa(data);
    } catch (err: any) {
      setError(err?.message || "Error al cargar empresa");
      setEmpresa(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpresa();
  }, [nit]);

  return {
    empresa,
    loading,
    error,
    recargar: cargarEmpresa,
  };
}

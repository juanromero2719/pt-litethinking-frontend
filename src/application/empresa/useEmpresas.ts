"use client";

import { useState, useEffect } from "react";
import { nextEmpresaRepository } from "@/data/empresa/nextEmpresaRepository";
import type { Empresa } from "@/domain/empresa/entities";

export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEmpresas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nextEmpresaRepository.listar();
      setEmpresas(data);
    } catch (err: any) {
      setError(err?.message || "Error al cargar empresas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  return {
    empresas,
    loading,
    error,
    recargar: cargarEmpresas,
  };
}

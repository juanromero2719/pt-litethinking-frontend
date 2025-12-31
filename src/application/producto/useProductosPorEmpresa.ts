"use client";

import { useState, useEffect } from "react";
import { nextProductoRepository } from "@/data/producto/nextProductoRepository";
import type { Producto } from "@/domain/producto/entities";

export function useProductosPorEmpresa(empresaNit: string | null) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarProductos = async () => {
    if (!empresaNit) {
      setProductos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await nextProductoRepository.listarPorEmpresa(empresaNit);
      setProductos(data);
    } catch (err: any) {
      const errorMessage = err?.message || "Error al cargar productos";
      setError(errorMessage);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresaNit]);

  return {
    productos,
    loading,
    error,
    recargar: cargarProductos,
  };
}

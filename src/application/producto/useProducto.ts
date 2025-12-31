"use client";

import { useState, useEffect } from "react";
import { nextProductoRepository } from "@/data/producto/nextProductoRepository";
import type { Producto } from "@/domain/producto/entities";

export function useProducto(codigo: string | null) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarProducto = async () => {
    if (!codigo) {
      setProducto(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await nextProductoRepository.obtenerPorCodigo(codigo);
      setProducto(data);
    } catch (err: any) {
      setError(err?.message || "Error al cargar producto");
      setProducto(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProducto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);

  return {
    producto,
    loading,
    error,
    recargar: cargarProducto,
  };
}

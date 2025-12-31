"use client";

import { useState, useEffect, useRef } from "react";
import { useProducto } from "@/application/producto/useProducto";
import Input from "@/components/atoms/Input";

export default function ProductoSearch() {
  const [codigo, setCodigo] = useState("");
  const [codigoToSearch, setCodigoToSearch] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { producto, loading, error } = useProducto(codigoToSearch);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!codigo.trim()) {
      setCodigoToSearch(null);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setCodigoToSearch(codigo.trim());
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [codigo]);

  return (
    <div className="space-y-4">
      <div>
        <Input
          id="producto-search"
          type="text"
          placeholder="Ingresa el código del producto..."
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full"
        />
        {codigo && !codigoToSearch && (
          <p className="text-xs text-[#6C757D] mt-1">
            Buscando automáticamente en 2 segundos...
          </p>
        )}
      </div>

      {loading && codigoToSearch && (
        <div className="border border-[#E1E8ED] rounded-lg p-4">
          <p className="text-[#6C757D]">Buscando producto...</p>
        </div>
      )}

      {error && codigoToSearch && (
        <div className="bg-[#FFE3E3] border border-[#FF6B6B] rounded-lg p-4">
          <p className="text-[#FF6B6B]">{error}</p>
        </div>
      )}

      {producto && !loading && (
        <div className="border border-[#E1E8ED] rounded-lg p-6 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-semibold text-[#2C3E50]">{producto.nombre}</h3>
                <span className="text-sm text-[#6C757D] bg-[#F8F9FA] px-3 py-1 rounded">
                  Código: {producto.codigo}
                </span>
              </div>
              
              {producto.caracteristicas && (
                <p className="text-sm text-[#6C757D] mb-2">
                  <span className="font-medium">Características:</span> {producto.caracteristicas}
                </p>
              )}
              
              {producto.descripcion && (
                <p className="text-sm text-[#2C3E50] mb-2">
                  {producto.descripcion}
                </p>
              )}
            </div>
          </div>

          {producto.precios && producto.precios.length > 0 ? (
            <div className="border-t border-[#E1E8ED] pt-4">
              <p className="text-sm font-medium text-[#6C757D] mb-2">Precios:</p>
              <div className="flex flex-wrap gap-2">
                {producto.precios.map((precio, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#E8F4FD] text-[#4A90E2]"
                  >
                    {precio.moneda}: {parseFloat(precio.valor).toLocaleString()}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-t border-[#E1E8ED] pt-4">
              <p className="text-sm text-[#6C757D]">Sin precios registrados</p>
            </div>
          )}
        </div>
      )}

      {!producto && !loading && !error && codigoToSearch && (
        <div className="border border-[#E1E8ED] rounded-lg p-4">
          <p className="text-[#6C757D]">No se encontró ningún producto con ese código</p>
        </div>
      )}
    </div>
  );
}

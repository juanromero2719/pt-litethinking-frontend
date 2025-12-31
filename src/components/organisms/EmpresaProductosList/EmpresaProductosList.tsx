"use client";

import { useEffect, useState } from "react";
import { useProductosPorEmpresa } from "@/application/producto/useProductosPorEmpresa";
import { useEmpresa } from "@/application/empresa/useEmpresa";
import { usePermissions } from "@/application/auth/usePermissions";
import { nextProductoRepository } from "@/data/producto/nextProductoRepository";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import ProductoSearch from "@/components/organisms/ProductoSearch";
import CreateProductoButton from "@/components/organisms/CreateProductoButton";
import AddPrecioButton from "@/components/organisms/AddPrecioButton";
import GenerarInventarioButton from "@/components/organisms/GenerarInventarioButton";
import ProtectedAction from "@/components/organisms/ProtectedAction";
import Swal from "sweetalert2";
import type { Producto } from "@/domain/producto/entities";

type EmpresaProductosListProps = {
  nit: string;
};

export default function EmpresaProductosList({ nit }: EmpresaProductosListProps) {
  const router = useRouter();
  const { empresa, loading: loadingEmpresa, recargar: recargarEmpresa } = useEmpresa(nit);
  const { productos, loading, error, recargar } = useProductosPorEmpresa(nit);
  const { can } = usePermissions();
  const [deletingCodigo, setDeletingCodigo] = useState<string | null>(null);

  const handleDelete = async (producto: Producto) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el producto "${producto.nombre}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6B6B",
      cancelButtonColor: "#6C757D",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingCodigo(producto.codigo);
      await nextProductoRepository.eliminar(producto.codigo);

      // Notificar que se eliminó un producto
      window.dispatchEvent(new CustomEvent("productos:reload", { detail: { empresaNit: nit } }));

      await Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        text: "El producto se ha eliminado correctamente",
        confirmButtonColor: "#4A90E2",
      });

      recargar();
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Error al eliminar el producto",
        confirmButtonColor: "#4A90E2",
      });
    } finally {
      setDeletingCodigo(null);
    }
  };

  useEffect(() => {
    const handleEmpresaChange = (event: any) => {
      const changedNit = event.detail?.nit;
      if (changedNit === nit) {
        recargarEmpresa();
        recargar();
      }
    };

    const handleEmpresaDeleted = (event: any) => {
      const deletedNit = event.detail?.nit;
      if (deletedNit === nit) {
        router.push("/dashboard");
        router.refresh();
      }
    };

    const handleProductosReload = (event: any) => {
      const changedNit = event.detail?.empresaNit;
      if (changedNit === nit) {
        recargar();
      }
    };

    window.addEventListener("empresa:changed", handleEmpresaChange);
    window.addEventListener("empresa:deleted", handleEmpresaDeleted);
    window.addEventListener("productos:reload", handleProductosReload);

    return () => {
      window.removeEventListener("empresa:changed", handleEmpresaChange);
      window.removeEventListener("empresa:deleted", handleEmpresaDeleted);
      window.removeEventListener("productos:reload", handleProductosReload);
    };
  }, [nit, recargarEmpresa, recargar, router]);

  if (loadingEmpresa || loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-[#6C757D]">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FFE3E3] border border-[#FF6B6B] rounded-lg p-4">
        <p className="text-[#FF6B6B] mb-2">{error}</p>
        <div className="flex gap-2">
          <Button onClick={recargar} variant="secondary" size="small">
            Reintentar
          </Button>
          <Button onClick={() => router.push("/dashboard")} variant="ghost" size="small">
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {empresa && (
        <div className="bg-[#F8F9FA] border border-[#E1E8ED] rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-[#2C3E50] mb-2">{empresa.nombre}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-[#6C757D]">
            <div>
              <span className="font-medium">Dirección:</span> {empresa.direccion}
            </div>
            <div>
              <span className="font-medium">Teléfono:</span> {empresa.telefono}
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">Buscar Producto</h2>
        <ProductoSearch />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#2C3E50]">
          Productos ({productos.length})
        </h2>
        <div className="flex gap-2">
          <GenerarInventarioButton empresaNit={nit} empresaNombre={empresa?.nombre} />
          <CreateProductoButton empresaNit={nit} onProductoCreated={recargar} />
          <Button onClick={recargar} variant="ghost" size="small">
            Actualizar
          </Button>
          <Button onClick={() => router.push("/dashboard")} variant="ghost" size="small">
            Volver
          </Button>
        </div>
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-8 border border-[#E1E8ED] rounded-lg">
          <p className="text-[#6C757D]">No hay productos registrados para esta empresa</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {productos.map((producto) => (
            <div
              key={producto.codigo}
              className="border border-[#E1E8ED] rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#2C3E50]">{producto.nombre}</h3>
                    <span className="text-xs text-[#6C757D] bg-[#F8F9FA] px-2 py-1 rounded">
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
                <ProtectedAction permission={can.productos.eliminar}>
                  <Button
                    onClick={() => handleDelete(producto)}
                    variant="secondary"
                    size="small"
                    disabled={deletingCodigo === producto.codigo}
                    className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white ml-2"
                  >
                    {deletingCodigo === producto.codigo ? "Eliminando..." : "Eliminar"}
                  </Button>
                </ProtectedAction>
              </div>

              <div className="border-t border-[#E1E8ED] pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-[#2C3E50]">
                    {producto.precios && producto.precios.length > 0 ? "Precios:" : "Sin precios registrados"}
                  </p>
                  <AddPrecioButton producto={producto} onPrecioAdded={recargar} />
                </div>
                {producto.precios && producto.precios.length > 0 && (
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
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

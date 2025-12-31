"use client";

import { useState } from "react";
import { usePermissions } from "@/application/auth/usePermissions";
import ProtectedAction from "@/components/organisms/ProtectedAction";
import Button from "@/components/atoms/Button";
import { nextProductoRepository } from "@/data/producto/nextProductoRepository";
import Swal from "sweetalert2";
import type { Producto } from "@/domain/producto/entities";

type AddPrecioButtonProps = {
  producto: Producto;
  onPrecioAdded?: () => void;
};

export default function AddPrecioButton({ producto, onPrecioAdded }: AddPrecioButtonProps) {
  const { can } = usePermissions();
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => {
    Swal.fire({
      title: `Agregar Precio - ${producto.nombre}`,
      html: `
        <form id="add-precio-form" class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-[#2C3E50] mb-2">
              Moneda <span class="text-[#FF6B6B]">*</span>
            </label>
            <select
              id="swal-moneda"
              class="w-full px-4 py-2 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              required
            >
              <option value="">Selecciona una moneda</option>
              <option value="COP">COP (Peso Colombiano)</option>
              <option value="USD">USD (Dólar Estadounidense)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="GBP">GBP (Libra Esterlina)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2C3E50] mb-2">
              Valor <span class="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="number"
              id="swal-valor"
              step="0.01"
              min="0"
              class="w-full px-4 py-2 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
        </form>
      `,
      width: "500px",
      showCancelButton: true,
      confirmButtonText: "Agregar precio",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4A90E2",
      cancelButtonColor: "#6C757D",
      reverseButtons: true,
      preConfirm: async () => {
        const moneda = (document.getElementById("swal-moneda") as HTMLSelectElement)?.value.trim();
        const valor = (document.getElementById("swal-valor") as HTMLInputElement)?.value.trim();

        if (!moneda || !valor) {
          Swal.showValidationMessage("Por favor completa todos los campos");
          return false;
        }

        const valorNum = parseFloat(valor);
        if (isNaN(valorNum) || valorNum < 0) {
          Swal.showValidationMessage("El valor debe ser un número válido mayor o igual a 0");
          return false;
        }

        try {
          setLoading(true);
          const productoActualizado = await nextProductoRepository.agregarPrecio(producto.codigo, {
            moneda,
            valor: valorNum.toFixed(2),
          });

          // Notificar que se agregó un precio
          window.dispatchEvent(new CustomEvent("productos:reload", { detail: { empresaNit: producto.empresa_nit } }));

          return productoActualizado;
        } catch (error: any) {
          Swal.showValidationMessage(error?.message || "Error al agregar el precio");
          setLoading(false);
          return false;
        } finally {
          setLoading(false);
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: "success",
          title: "Precio agregado",
          text: `El precio se ha agregado correctamente al producto "${producto.nombre}"`,
          confirmButtonColor: "#4A90E2",
        });
        onPrecioAdded?.();
      }
    });
  };

  return (
    <ProtectedAction permission={can.productos.editar}>
      <Button
        onClick={handleOpenModal}
        variant="primary"
        size="small"
        disabled={loading}
      >
        {loading ? "Agregando..." : "+ Agregar Precio"}
      </Button>
    </ProtectedAction>
  );
}

"use client";

import { useState } from "react";
import { usePermissions } from "@/application/auth/usePermissions";
import ProtectedAction from "@/components/organisms/ProtectedAction";
import Button from "@/components/atoms/Button";
import { nextProductoRepository } from "@/data/producto/nextProductoRepository";
import Swal from "sweetalert2";

type CreateProductoButtonProps = {
  empresaNit: string;
  onProductoCreated?: () => void;
};

export default function CreateProductoButton({ empresaNit, onProductoCreated }: CreateProductoButtonProps) {
  const { can } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const handleGenerarDescripcion = async (e?: Event) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const nombre = (document.getElementById("swal-nombre") as HTMLInputElement)?.value.trim();
    const caracteristicas = (document.getElementById("swal-caracteristicas") as HTMLTextAreaElement)?.value.trim() || "";

    if (!nombre || !caracteristicas) {
      // Mostrar mensaje de validación sin cerrar el modal
      Swal.showValidationMessage("Por favor completa los campos Nombre y Características para generar la descripción");
      setTimeout(() => {
        Swal.resetValidationMessage();
      }, 3000);
      return;
    }

    try {
      setGeneratingDesc(true);
      
      const btnGenerar = document.getElementById("btn-generar-descripcion");
      if (btnGenerar) {
        btnGenerar.textContent = "Generando...";
        (btnGenerar as HTMLButtonElement).disabled = true;
      }

      const resultado = await nextProductoRepository.generarDescripcion({
        nombre,
        caracteristicas_actuales: caracteristicas,
        categoria: "",
        precio: "",
        moneda: "COP",
      });

      const descripcionField = document.getElementById("swal-descripcion") as HTMLTextAreaElement;
      if (descripcionField) {
        descripcionField.value = resultado.descripcion;
      }

      if (btnGenerar) {
        btnGenerar.textContent = "✨ Generar con IA";
        (btnGenerar as HTMLButtonElement).disabled = false;
      }
    } catch (error: any) {
      const btnGenerar = document.getElementById("btn-generar-descripcion");
      if (btnGenerar) {
        btnGenerar.textContent = "✨ Generar con IA";
        (btnGenerar as HTMLButtonElement).disabled = false;
      }

      // Mostrar error sin cerrar el modal principal usando showValidationMessage
      const swalInstance = Swal.getContainer();
      if (swalInstance) {
        Swal.showValidationMessage(error?.message || "Error al generar la descripción");
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          Swal.resetValidationMessage();
        }, 3000);
      }
    } finally {
      setGeneratingDesc(false);
    }
  };

  const handleOpenModal = () => {
    Swal.fire({
      title: "Crear Nuevo Producto",
      html: `
        <form id="create-producto-form" class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-[#2C3E50] mb-2">
              Código <span class="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="text"
              id="swal-codigo"
              class="w-full px-4 py-2 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              placeholder="Ej: PROD-001"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2C3E50] mb-2">
              Nombre <span class="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="text"
              id="swal-nombre"
              class="w-full px-4 py-2 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              placeholder="Nombre del producto"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2C3E50] mb-2">
              Características
            </label>
            <textarea
              id="swal-caracteristicas"
              rows="3"
              class="w-full px-4 py-2 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent resize-none"
              placeholder="Características del producto (opcional)"
            ></textarea>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-[#2C3E50]">
                Descripción
              </label>
              <button
                type="button"
                id="btn-generar-descripcion"
                class="text-xs px-3 py-1 bg-[#4A90E2] text-white rounded-lg hover:bg-[#3B7BC8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✨ Generar con IA
              </button>
            </div>
            <textarea
              id="swal-descripcion"
              rows="4"
              class="w-full px-4 py-2 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent resize-none"
              placeholder="Descripción del producto (opcional)"
            ></textarea>
          </div>
        </form>
      `,
      width: "600px",
      showCancelButton: true,
      confirmButtonText: "Crear producto",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4A90E2",
      cancelButtonColor: "#6C757D",
      reverseButtons: true,
      didOpen: () => {
        const btnGenerar = document.getElementById("btn-generar-descripcion");
        if (btnGenerar) {
          btnGenerar.addEventListener("click", (e) => handleGenerarDescripcion(e));
        }
        
        const codigoInput = document.getElementById("swal-codigo") as HTMLInputElement;
        if (codigoInput) {
          codigoInput.addEventListener("input", () => {
            const value = codigoInput.value.trim();
            const codigoPattern = /^[A-Za-z]+-\d+$/;
            
            if (value && !codigoPattern.test(value)) {
              codigoInput.classList.add("border-red-500");
              codigoInput.classList.remove("border-[#E1E8ED]");
            } else {
              codigoInput.classList.remove("border-red-500");
              codigoInput.classList.add("border-[#E1E8ED]");
            }
          });
        }
      },
      preConfirm: async () => {
        const codigo = (document.getElementById("swal-codigo") as HTMLInputElement)?.value.trim();
        const nombre = (document.getElementById("swal-nombre") as HTMLInputElement)?.value.trim();
        const caracteristicas = (document.getElementById("swal-caracteristicas") as HTMLTextAreaElement)?.value.trim() || "";
        const descripcion = (document.getElementById("swal-descripcion") as HTMLTextAreaElement)?.value.trim() || "";

        if (!codigo || !nombre) {
          Swal.showValidationMessage("Por favor completa los campos requeridos (Código y Nombre)");
          return false;
        }

        const codigoPattern = /^[A-Za-z]+-\d+$/;
        if (!codigoPattern.test(codigo)) {
          Swal.showValidationMessage(
            "El código debe seguir el formato 'nombre-numero' (ej: PROD-001, LAPTOP-123). " +
            "Solo se permiten letras, un guion y números."
          );
          return false;
        }

        try {
          setLoading(true);
          const nuevoProducto = await nextProductoRepository.crear({
            codigo,
            nombre,
            empresa_nit: empresaNit,
            caracteristicas,
            descripcion,
          });

          // Notificar que se creó un producto
          window.dispatchEvent(new CustomEvent("productos:reload", { detail: { empresaNit } }));

          return nuevoProducto;
        } catch (error: any) {
          Swal.showValidationMessage(error?.message || "Error al crear el producto");
          setLoading(false);
          return false;
        } finally {
          setLoading(false);
        }
      },
      willClose: () => {
        const btnGenerar = document.getElementById("btn-generar-descripcion");
        if (btnGenerar) {
          btnGenerar.removeEventListener("click", handleGenerarDescripcion);
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: "success",
          title: "Producto creado",
          text: `El producto "${result.value.nombre}" se ha creado correctamente`,
          confirmButtonColor: "#4A90E2",
        });
        onProductoCreated?.();
      }
    });
  };

  return (
    <ProtectedAction permission={can.productos.crear}>
      <Button
        onClick={handleOpenModal}
        variant="primary"
        size="small"
        disabled={loading}
      >
        {loading ? "Creando..." : "+ Crear Producto"}
      </Button>
    </ProtectedAction>
  );
}

import type { ProductoRepository } from "@/domain/producto/ports";
import type { Producto, ProductoPrecio } from "@/domain/producto/entities";
import { client } from "@/lib/axios/client";

export const nextProductoRepository: ProductoRepository = {
  async listarPorEmpresa(empresaNit: string): Promise<Producto[]> {
    try {
      const response = await client.get(`/empresas/${empresaNit}/productos`);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error al listar productos";
      throw new Error(message);
    }
  },

  async obtenerPorCodigo(codigo: string): Promise<Producto | null> {
    try {
      const response = await client.get(`/productos/${codigo}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      const message = error?.response?.data?.message || "Error al obtener producto";
      throw new Error(message);
    }
  },

  async crear(producto: Omit<Producto, "precios"> & { precios?: Producto["precios"] }): Promise<Producto> {
    try {
      const response = await client.post("/productos", {
        codigo: producto.codigo,
        nombre: producto.nombre,
        empresa_nit: producto.empresa_nit,
        caracteristicas: producto.caracteristicas || "",
        descripcion: producto.descripcion || "",
      });
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error al crear producto";
      throw new Error(message);
    }
  },

  async eliminar(codigo: string): Promise<void> {
    try {
      const response = await client.delete(`/productos/${codigo}`);

      if (response.status >= 200 && response.status < 300) {
        return;
      }
    } catch (error: any) {

      if (error?.response?.data) {
        const message = error.response.data.message || error.response.data.error || "Error al eliminar producto";
        throw new Error(message);
      }

      const message = error?.message || "Error al eliminar producto";
      throw new Error(message);
    }
  },

  async agregarPrecio(codigo: string, precio: ProductoPrecio): Promise<Producto> {
    try {
      const response = await client.post(`/productos/${codigo}/precios`, {
        moneda: precio.moneda,
        valor: precio.valor,
      });
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error al agregar precio";
      throw new Error(message);
    }
  },

  async generarDescripcion(data: {
    nombre: string;
    caracteristicas_actuales: string;
    categoria?: string;
    precio?: string;
    moneda?: string;
  }): Promise<{ descripcion: string; nombre_producto: string; modelo_usado: string }> {
    try {
      const response = await client.post("/productos/generar-descripcion", {
        nombre: data.nombre,
        caracteristicas_actuales: data.caracteristicas_actuales,
        categoria: data.categoria || "",
        precio: data.precio || "",
        moneda: data.moneda || "COP",
      });
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error al generar descripción";
      throw new Error(message);
    }
  },
};

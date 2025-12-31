import type { Producto, ProductoPrecio } from "./entities";

export interface ProductoRepository {
  listarPorEmpresa(empresaNit: string): Promise<Producto[]>;
  obtenerPorCodigo(codigo: string): Promise<Producto | null>;
  crear(producto: Omit<Producto, "precios"> & { precios?: Producto["precios"] }): Promise<Producto>;
  eliminar(codigo: string): Promise<void>;
  agregarPrecio(codigo: string, precio: ProductoPrecio): Promise<Producto>;
  generarDescripcion(data: {
    nombre: string;
    caracteristicas_actuales: string;
    categoria?: string;
    precio?: string;
    moneda?: string;
  }): Promise<{ descripcion: string; nombre_producto: string; modelo_usado: string }>;
}

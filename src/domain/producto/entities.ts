export type ProductoCodigo = string;

export type ProductoPrecio = {
  moneda: string;
  valor: string;
};

export type Producto = {
  codigo: ProductoCodigo;
  nombre: string;
  empresa_nit: string;
  caracteristicas?: string;
  descripcion?: string;
  precios: ProductoPrecio[];
};

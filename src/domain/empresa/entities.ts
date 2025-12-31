export type EmpresaNit = string;

export type Empresa = {
  nit: EmpresaNit;
  nombre: string;
  direccion: string;
  telefono: string;
};

export function validateEmpresa(empresa: Partial<Empresa>): void {
  if (!empresa.nit?.trim()) {
    throw new Error("El NIT es requerido");
  }
  if (!empresa.nombre?.trim()) {
    throw new Error("El nombre es requerido");
  }
  if (!empresa.direccion?.trim()) {
    throw new Error("La dirección es requerida");
  }
  if (!empresa.telefono?.trim()) {
    throw new Error("El teléfono es requerido");
  }
}

import type { Empresa } from "./entities";

export interface EmpresaRepository {
  listar(): Promise<Empresa[]>;
  obtenerPorNit(nit: string): Promise<Empresa | null>;
  crear(empresa: Omit<Empresa, "nit"> & { nit: string }): Promise<Empresa>;
  actualizar(nit: string, empresa: Partial<Empresa>): Promise<Empresa>;
  eliminar(nit: string): Promise<void>;
}

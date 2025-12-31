import type { EmpresaRepository } from "@/domain/empresa/ports";
import type { Empresa } from "@/domain/empresa/entities";
import { client } from "@/lib/axios/client";

export const nextEmpresaRepository: EmpresaRepository = {
  async listar(): Promise<Empresa[]> {
    try {
      const response = await client.get("/empresas");
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error al listar empresas";
      throw new Error(message);
    }
  },

  async obtenerPorNit(nit: string): Promise<Empresa | null> {
    try {
      const response = await client.get(`/empresas/${nit}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      const message = error?.response?.data?.message || "Error al obtener empresa";
      throw new Error(message);
    }
  },

  async crear(empresa: Omit<Empresa, "nit"> & { nit: string }): Promise<Empresa> {
    try {
      const response = await client.post("/empresas", empresa);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error al crear empresa";
      throw new Error(message);
    }
  },

  async actualizar(nit: string, empresa: Partial<Omit<Empresa, "nit">>): Promise<Empresa> {
    try {
      const response = await client.put(`/empresas/${nit}`, empresa);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error al actualizar empresa";
      throw new Error(message);
    }
  },

  async eliminar(nit: string): Promise<void> {
    try {
      const response = await client.delete(`/empresas/${nit}`);

      if (response.status >= 200 && response.status < 300) {
        return;
      }
    } catch (error: any) {

      if (error?.response?.data) {
        const message = error.response.data.message || error.response.data.error || "Error al eliminar empresa";
        throw new Error(message);
      }

      const message = error?.message || "Error al eliminar empresa";
      throw new Error(message);
    }
  },
};

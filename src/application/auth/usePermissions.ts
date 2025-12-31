"use client";

import { useUserRole } from "./useUserRole";
import { Permissions } from "@/domain/auth/permissions";

export function usePermissions() {
  const { role, loading } = useUserRole();

  return {
    loading,
    can: {
      empresas: {
        listar: role ? Permissions.empresas.listar(role) : false,
        ver: role ? Permissions.empresas.ver(role) : false,
        crear: role ? Permissions.empresas.crear(role) : false,
        editar: role ? Permissions.empresas.editar(role) : false,
        eliminar: role ? Permissions.empresas.eliminar(role) : false,
      },
      productos: {
        listar: role ? Permissions.productos.listar(role) : false,
        ver: role ? Permissions.productos.ver(role) : false,
        crear: role ? Permissions.productos.crear(role) : false,
        editar: role ? Permissions.productos.editar(role) : false,
        eliminar: role ? Permissions.productos.eliminar(role) : false,
      },
    },
  };
}

import type { UserRole } from "./entities";


export const Permissions = {
  empresas: {
    listar: (role: UserRole): boolean => role === "Admin" || role === "Externo",
    ver: (role: UserRole): boolean => role === "Admin" || role === "Externo",
    crear: (role: UserRole): boolean => role === "Admin",
    editar: (role: UserRole): boolean => role === "Admin",
    eliminar: (role: UserRole): boolean => role === "Admin",
  },
  productos: {
    listar: (role: UserRole): boolean => role === "Admin" || role === "Externo",
    ver: (role: UserRole): boolean => role === "Admin" || role === "Externo",
    crear: (role: UserRole): boolean => role === "Admin",
    editar: (role: UserRole): boolean => role === "Admin",
    eliminar: (role: UserRole): boolean => role === "Admin",
  },
} as const;

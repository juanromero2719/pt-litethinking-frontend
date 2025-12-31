export type UserId = string;
export type UserRole = "Admin" | "Externo" | null;

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  userId?: UserId;
  role?: UserRole;
};

export function validateCredentials(username: string, password: string) {
  if (!username.trim()) throw new Error("El usuario es requerido");
  if (password.length < 2) throw new Error("Contraseña muy corta");
}

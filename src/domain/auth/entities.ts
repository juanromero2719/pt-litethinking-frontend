export type UserId = string;

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  userId?: UserId;
};

export function validateCredentials(username: string, password: string) {
  if (!username.trim()) throw new Error("El usuario es requerido");
  if (password.length < 2) throw new Error("Contraseña muy corta");
}

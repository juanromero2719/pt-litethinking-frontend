import type { AuthSession } from "./entities";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
  email: string;
  rol: string;
}

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthSession>;
  logout(): Promise<void>;
  register(data: RegisterData): Promise<RegisterResponse>;
}

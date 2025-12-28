import type { AuthSession } from "./entities";

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthSession>;
  logout(): Promise<void>;
}

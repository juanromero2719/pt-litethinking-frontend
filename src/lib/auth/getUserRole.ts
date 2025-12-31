import { cookies } from "next/headers";
import type { UserRole } from "@/domain/auth/entities";

export async function getUserRole(): Promise<UserRole> {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;
  
  if (role === "Admin" || role === "Externo") {
    return role;
  }
  
  return null;
}

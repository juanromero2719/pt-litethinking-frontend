import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Eliminar cookies
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  
  const res = NextResponse.json({ ok: true });

  // También usar headers como respaldo para asegurar eliminación
  res.headers.append(
    "Set-Cookie",
    "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  res.headers.append(
    "Set-Cookie",
    "refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  
  return res;
}
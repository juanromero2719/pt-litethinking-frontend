import { NextResponse } from "next/server";
import { djangoClient } from "@/lib/axios/django";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const r = await djangoClient.post("/api/auth/login/", { username, password });
    const { access, refresh } = r.data;

    const res = NextResponse.json({ ok: true });

    res.cookies.set("access_token", access, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // prod: true
      path: "/",
    });

    res.cookies.set("refresh_token", refresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
  }
}

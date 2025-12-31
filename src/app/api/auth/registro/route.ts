import { NextResponse } from "next/server";
import { djangoClient } from "@/lib/axios/django";

export async function POST(req: Request) {
  const { username, email, password, password_confirm } = await req.json();

  try {
    const r = await djangoClient.post("/api/auth/registro/", {
      username,
      email,
      password,
      password_confirm,
    });

    return NextResponse.json(r.data, { status: 201 });
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? { message: "Error al registrar usuario" };
    return NextResponse.json(data, { status });
  }
}

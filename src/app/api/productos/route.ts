import { NextResponse } from "next/server";
import { getDjangoAuthClient } from "@/lib/axios/django-auth";

export async function POST(req: Request) {
  const client = await getDjangoAuthClient();
  const body = await req.json();

  try {
    const r = await client.post("/api/productos/", body);
    return NextResponse.json(r.data, { status: 201 });
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const data = err?.response?.data ?? { message: "Error al crear producto" };
    return NextResponse.json(data, { status });
  }
}

import { NextResponse } from "next/server";
import { getDjangoAuthClient } from "@/lib/axios/django-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ nit: string }> }
) {
  const { nit } = await params;
  const client = await getDjangoAuthClient();

  try {
    const url = `/api/empresas/${nit}/productos/`;
    const r = await client.get(url);
    return NextResponse.json(r.data);
  } catch (err: any) {
    if (err?.response) {
      const status = err.response.status;
      const data = err.response.data;
      return NextResponse.json(data, { status });
    }
    return NextResponse.json(
      { 
        message: "Error al obtener productos de la empresa",
        error: err?.message || "Error desconocido"
      },
      { status: 500 }
    );
  }
}

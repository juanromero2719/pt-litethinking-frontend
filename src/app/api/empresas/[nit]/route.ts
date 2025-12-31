import { NextResponse } from "next/server";
import { getDjangoAuthClient } from "@/lib/axios/django-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ nit: string }> }
) {
  const { nit } = await params;
  const client = await getDjangoAuthClient();

  try {
    const url = `/api/empresas/${nit}/`;
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
        message: "Error al obtener empresa",
        error: err?.message || "Error desconocido"
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ nit: string }> }
) {
  const { nit } = await params;
  const client = await getDjangoAuthClient();
  const body = await req.json();

  try {
    const r = await client.put(`/api/empresas/${nit}/`, body);
    return NextResponse.json(r.data);
  } catch (err: any) {
    if (err?.response) {
      const status = err.response.status;
      const data = err.response.data;
      return NextResponse.json(data, { status });
    }
    return NextResponse.json(
      { message: "Error al actualizar empresa", error: err?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ nit: string }> }
) {
  const { nit } = await params;
  const client = await getDjangoAuthClient();

  try {
    const response = await client.delete(`/api/empresas/${nit}/`);
    if (response.status === 204 || !response.data) {
      return NextResponse.json({ message: "Empresa eliminada exitosamente" }, { status: 200 });
    }
    return NextResponse.json(response.data || { message: "Empresa eliminada exitosamente" }, { status: 200 });
  } catch (err: any) {
    if (err?.response) {
      const status = err.response.status;
      const data = err.response.data;
      return NextResponse.json(data, { status });
    }
    return NextResponse.json(
      { message: "Error al eliminar empresa", error: err?.message },
      { status: 500 }
    );
  }
}

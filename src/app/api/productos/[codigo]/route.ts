import { NextResponse } from "next/server";
import { getDjangoAuthClient } from "@/lib/axios/django-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;
  const client = await getDjangoAuthClient();

  try {
    const url = `/api/productos/${codigo}/`;
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
        message: "Error al obtener producto",
        error: err?.message || "Error desconocido"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;
  const client = await getDjangoAuthClient();

  try {
    const response = await client.delete(`/api/productos/${codigo}/`);
    if (response.status === 204 || !response.data) {
      return NextResponse.json({ message: "Producto eliminado exitosamente" }, { status: 200 });
    }
    return NextResponse.json(response.data || { message: "Producto eliminado exitosamente" }, { status: 200 });
  } catch (err: any) {
    if (err?.response) {
      const status = err.response.status;
      const data = err.response.data;
      return NextResponse.json(data, { status });
    }
    return NextResponse.json(
      { message: "Error al eliminar producto", error: err?.message },
      { status: 500 }
    );
  }
}

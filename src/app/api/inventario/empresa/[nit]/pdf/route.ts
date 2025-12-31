import { NextResponse } from "next/server";
import { getDjangoAuthClient } from "@/lib/axios/django-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ nit: string }> }
) {
  const { nit } = await params;
  const client = await getDjangoAuthClient();

  try {

    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    let response;
    if (email) {

      response = await client.get(`/api/inventario/empresa/${nit}/pdf/`, {
        params: { email },
        responseType: "json",
      });

      return NextResponse.json(response.data, { status: 200 });
    } else {

      response = await client.get(`/api/inventario/empresa/${nit}/pdf/`, {
        responseType: "arraybuffer", 
      });
      
      const pdfBuffer = Buffer.from(response.data);
      
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="inventario_${nit}.pdf"`,
        },
      });
    }
  } catch (err: any) {
    if (err?.response) {
      const status = err.response.status;
      const data = err.response.data;
      return NextResponse.json(data, { status });
    }
    return NextResponse.json(
      {
        message: "Error al generar el PDF de inventario",
        error: err?.message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}

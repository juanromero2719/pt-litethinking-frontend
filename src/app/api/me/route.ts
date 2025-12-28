import { NextResponse } from "next/server";
import { getDjangoAuthClient } from "@/lib/axios/django-auth";

export async function GET() {
  const client = await getDjangoAuthClient();

  try {
    const r = await client.get("/api/me/");
    return NextResponse.json(r.data);
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const data = err?.response?.data ?? { message: "Server error" };
    return NextResponse.json(data, { status });
  }
}

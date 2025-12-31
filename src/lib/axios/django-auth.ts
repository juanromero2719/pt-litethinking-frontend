import axios from "axios";
import { cookies } from "next/headers";

export async function getDjangoAuthClient() {
  const cookieStore = await cookies(); 
  const access = cookieStore.get("access_token")?.value;

  const baseURL = process.env.DJANGO_API_URL;
  
  if (!baseURL) {
    throw new Error("DJANGO_API_URL no está configurada en las variables de entorno");
  }

  return axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
  });
}

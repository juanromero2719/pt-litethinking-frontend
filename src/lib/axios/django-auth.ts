import axios from "axios";
import { cookies } from "next/headers";

export async function getDjangoAuthClient() {
  const cookieStore = await cookies(); 
  const access = cookieStore.get("access_token")?.value;

  return axios.create({
    baseURL: process.env.DJANGO_API_URL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
  });
}

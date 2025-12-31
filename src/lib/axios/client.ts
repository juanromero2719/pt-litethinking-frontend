"use client";

import axios from "axios";
import { setupAuthInterceptor } from "./interceptors";

const client = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

setupAuthInterceptor(client);

export { client };

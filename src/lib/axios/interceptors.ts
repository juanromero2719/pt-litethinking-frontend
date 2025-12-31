"use client";

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

let isRedirecting = false;

export function setupAuthInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const url = error.config?.url || "";
      
      if (url.includes("/auth/login")) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !isRedirecting) {
        isRedirecting = true;

        try {
          axios.post("/api/auth/logout").catch(() => {
          });
        } catch {
        }

        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

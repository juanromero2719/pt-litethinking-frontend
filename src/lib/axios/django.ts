import axios from "axios";

export const djangoClient = axios.create({
  baseURL: process.env.DJANGO_API_URL, 
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

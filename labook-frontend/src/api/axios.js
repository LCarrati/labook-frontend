import axios from "axios";

// const BASE_URL = "https://fojhrm.deta.dev";
// const BASE_URL = "https://beapiecommerce-1-z2862906.deta.app";
const BASE_URL = "http://localhost:3003";

// para requisições públicas
export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// para requisições que precisam ser enviadas com Authorization no header
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error?.message ||
      error.message ||
      "Unknown error";

    return Promise.reject(new Error(message));
  },
);

export const authenticatedApi = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    withCredentials: true,
  },
  timeout: 10000,
});

authenticatedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!globalThis.location.pathname.includes("/auth")) {
        globalThis.location.href = "/auth";
      }
    }

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error?.message ||
      error.message ||
      "Unknown error";

    return Promise.reject(new Error(message));
  },
);

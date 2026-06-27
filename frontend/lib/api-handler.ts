import { ApiError } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";
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
  },
  timeout: 10000,
});

authenticatedApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    const responseData = error?.response?.data;
    const message =
      responseData?.message || error?.message || "An error occurred";
    const status = error?.response?.status;
    return Promise.reject(new ApiError(message, responseData, status));
  },
);

authenticatedApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const responseData = error?.response?.data;
    const message =
      responseData?.message || error?.message || "An error occurred";
    const status = error?.response?.status;
    return Promise.reject(new ApiError(message, responseData, status));
  },
);

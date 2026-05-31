import axios from "axios";
import { cookies } from "next/headers";

export const getServerApiClient = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

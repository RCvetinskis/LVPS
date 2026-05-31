"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-handler";
import { useRouter } from "next/navigation";

type Props = {};

const SignOut = (props: Props) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete api.defaults.headers.common["Authorization"];

    router.push("/auth/signin");
  };
  return <Button onClick={handleLogout}>Sign Out</Button>;
};

export default SignOut;

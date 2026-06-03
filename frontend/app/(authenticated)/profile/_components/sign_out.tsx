"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-handler";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
type Props = {};

const SignOut = (props: Props) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove("token");
    delete api.defaults.headers.common["Authorization"];

    router.push("/auth/signin");
  };
  return <Button onClick={handleLogout}>Sign Out</Button>;
};

export default SignOut;

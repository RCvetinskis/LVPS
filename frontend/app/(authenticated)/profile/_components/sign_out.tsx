"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCurrentUserStore } from "@/stores/user-store";
import { useTranslations } from "next-intl";
type Props = {};

const SignOut = (props: Props) => {
  const router = useRouter();
  const { logout } = useCurrentUserStore();
  const t = useTranslations("UserActions");
  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
  };
  return (
    <Button
      className="w-full"
      variant={"ghost"}
      size={"sm"}
      onClick={handleLogout}
    >
      {t("signOut")}
    </Button>
  );
};

export default SignOut;

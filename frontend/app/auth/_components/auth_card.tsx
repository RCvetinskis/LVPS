"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type AuthType = "signup" | "signin";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  email?: string;
};
// TODO: move navbar to global layout, and render language select for not authorized users as well
const AuthCard = ({ children, title, description, email }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Auth");

  const afterAuth = (pathname.split("/auth/")[1] as AuthType) || "signup";
  const next = afterAuth === "signup" ? "signin" : "signup";

  const toggleAuthType = () => {
    router.push(`/auth/${next}`);
  };

  const cardTitle = title || t(`${afterAuth}.title`);
  const cardDescription = description || t(`${afterAuth}.description`);
  const toggleButtonText = t(`${next}.toggleButton`);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
        {!email && (
          <CardAction>
            <Button variant="link" onClick={toggleAuthType}>
              {toggleButtonText}
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AuthCard;

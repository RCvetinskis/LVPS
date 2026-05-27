"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";

type AuthType = "signup" | "signin";
const mappedType = {
  signup: "Sign Up",
  signin: "Sign in",
};

type Props = {
  children: React.ReactNode;
  title: string;
  description: string;
};

const AuthCard = ({ children, title, description }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const afterAuth = (pathname.split("/auth/")[1] as AuthType) || "signup";
  const next = afterAuth === "signup" ? "signin" : "signup";
  const toggleAuthType = () => {
    router.push(`/auth/${next}`);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button variant="link" onClick={toggleAuthType}>
            {mappedType[next]}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AuthCard;

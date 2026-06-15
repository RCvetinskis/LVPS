"use client";
import { TCompany } from "@/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type Props = {
  company: TCompany;
};

const CompanyCard = ({ company }: Props) => {
  const t = useTranslations("Company");
  const router = useRouter();

  const toggleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/company/${company.id}/edit`);
  };

  const navigateToCompany = () => {
    router.push(`/company/${company.id}`);
  };
  return (
    <Card onClick={navigateToCompany}>
      <CardHeader>
        <CardTitle>{company.name}</CardTitle>
        {company.description && (
          <CardDescription>{company.description}</CardDescription>
        )}

        <CardAction>
          <Button onClick={toggleEdit} size={"icon"} variant={"outline"}>
            <Edit />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-x-1">
          <span className="font-semibold">{t("location")}:</span>
          <span>{company.location}</span>
        </div>

        <div className="space-x-1">
          <span className="font-semibold">{t("managingSince")}:</span>
          <span>{company.created_at}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;

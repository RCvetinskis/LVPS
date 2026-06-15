"use client";
import { TUser } from "@/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { useCompanyStore } from "@/stores/company-store";
import { useTranslations } from "next-intl";

type Props = {
  employee: TUser;
};

const EmployeeCard = ({ employee }: Props) => {
  const { permissions } = useCompanyStore();
  const t = useTranslations("Employee");

  // Format date if needed
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {employee.name} {employee.surname}
        </CardTitle>
        <CardDescription>{employee.email || employee.surname}</CardDescription>
        {permissions?.manage_company_users && (
          <CardAction>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("editButton")}
              title={t("editButton")}
            >
              <EditIcon />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-x-1">
          <span className="font-semibold">{t("addedToSystemAt")}</span>
          <span>{formatDate(employee.created_at)}</span>
        </div>

        <div className="space-x-1">
          <span className="font-semibold">{t("role")}</span>
          <span className="capitalize">{employee.role}</span>
        </div>

        <div className="space-x-1">
          <span className="font-semibold">{t("status")}</span>
          <span className="capitalize">{employee.status}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;

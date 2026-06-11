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

type Props = {
  employee: TUser;
};

const EmployeeCard = ({ employee }: Props) => {
  const { permissions } = useCompanyStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {employee.name} {employee.surname}
        </CardTitle>
        <CardDescription>{employee.surname}</CardDescription>
        {permissions?.manage_company_users && (
          <CardAction>
            <Button variant="outline" size="icon">
              <EditIcon />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-x-1">
          <span className="font-semibold">Added to system at:</span>
          <span>{employee.created_at}</span>
        </div>

        <div className="space-x-1">
          <span className="font-semibold">Role:</span>
          <span>{employee.role}</span>
        </div>

        <div className="space-x-1">
          <span className="font-semibold">Status:</span>
          <span>{employee.status}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;

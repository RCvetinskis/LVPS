"use client";
import { TCompany } from "@/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  company: TCompany;
};

const CompanyCard = ({ company }: Props) => {
  const router = useRouter();

  const toggleEdit = () => {
    router.push(`/company/${company.id}/edit`);
  };

  return (
    <Card>
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
          <span className="font-semibold">Location:</span>
          <span>{company.location}</span>
        </div>

        <div className="space-x-1">
          <span className="font-semibold">Managing since:</span>
          <span>{company.created_at}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;

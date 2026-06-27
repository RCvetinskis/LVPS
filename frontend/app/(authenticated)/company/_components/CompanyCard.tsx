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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Edit,
  MapPin,
  Calendar,
  MessageSquareCode,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import DeleteCompany from "./DeleteCompany";

type Props = {
  company: TCompany;
  className?: string;
};

const CompanyCard = ({ company, className }: Props) => {
  const t = useTranslations("Company");
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/company/${company.id}/edit`);
  };

  const navigateToCompany = () => {
    router.push(`/company/${company.id}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50",
        className,
      )}
      onClick={navigateToCompany}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{company.name}</CardTitle>
              {company.description && (
                <CardDescription className="line-clamp-1">
                  {company.description}
                </CardDescription>
              )}
            </div>
          </div>

          <Badge variant="outline" className="hidden sm:flex">
            Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">{t("location")}:</span>
          <span className="font-medium">{company.location || "Not set"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">{t("managingSince")}:</span>
          <span className="font-medium">{formatDate(company.created_at)}</span>
        </div>
        {company.description && (
          <div className="flex items-center gap-2 text-sm">
            <MessageSquareCode className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{t("description")}:</span>
            <span className="font-medium">{company.description}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleEdit}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Edit className="h-3.5 w-3.5" />
          {t("edit")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyCard;

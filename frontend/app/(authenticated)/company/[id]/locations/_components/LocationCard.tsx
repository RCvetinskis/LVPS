"use client";

import { TLocation } from "@/types";
import {
  Card,
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
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  location: TLocation;
};

const LocationCard = ({ location }: Props) => {
  const t = useTranslations("Location");
  const router = useRouter();

  const getLocationIcon = () => {
    if (location.primary_location)
      return <Star className="h-5 w-5 text-yellow-500" />;
    return <Building2 className="h-5 w-5 text-muted-foreground" />;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const locationIdLink = `/company/${location.company_id}/locations/${location.id}`;

  const handleCardClick = () => {
    router.push(`${locationIdLink}/schedule`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`${locationIdLink}/edit`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="cursor-pointer relative overflow-hidden transition-all duration-200 hover:shadow-lg"
    >
      {location.primary_location && (
        <div className="absolute right-0 top-0">
          <Badge
            variant="default"
            className="rounded-br-none rounded-tl-none bg-yellow-500 hover:bg-yellow-600"
          >
            <Star className="mr-1 h-3 w-3" />
            {t("default")}
          </Badge>
        </div>
      )}

      <div className="absolute left-4 top-4">
        <Badge
          variant={location.active ? "default" : "secondary"}
          className="rounded-full"
        >
          {location.active ? (
            <>
              <CheckCircle className="mr-1 h-3 w-3" />
              {t("active")}
            </>
          ) : (
            <>
              <XCircle className="mr-1 h-3 w-3" />
              {t("inactive")}
            </>
          )}
        </Badge>
      </div>

      <CardHeader className="pt-12">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              {getLocationIcon()}
            </div>
            <div>
              <CardTitle className="text-xl">{location.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {t("locationId", { id: location.id })}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Address */}
        <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">{t("address")}</p>
            <p className="text-sm text-muted-foreground">
              {location.address}
              {location.city && `, ${location.city}`}
              {location.country && `, ${location.country}`}
              {location.postal_code && ` (${location.postal_code})`}
            </p>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {location.phone && (
            <div className="flex items-center gap-2 rounded-lg border p-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{location.phone}</span>
            </div>
          )}

          {location.email && (
            <div className="flex items-center gap-2 rounded-lg border p-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{location.email}</span>
            </div>
          )}

          {location.country && (
            <div className="flex items-center gap-2 rounded-lg border p-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{location.country}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {location.notes && (
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">{t("notes")}</p>
            <p className="text-sm">{location.notes}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-between">
        <div className="text-xs text-muted-foreground">
          <p>
            {t("createdAt")}: {formatDate(location.created_at)}
          </p>
          {location.updated_at && (
            <p>
              {t("updatedAt")}: {formatDate(location.updated_at)}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleEditClick}
          >
            <Edit className="h-3.5 w-3.5" />
            {t("edit")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LocationCard;

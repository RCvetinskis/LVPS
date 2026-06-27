"use client";
import { TLocation } from "@/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { authenticatedApi } from "@/lib/api-handler";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Save,
  Star,
  Home,
} from "lucide-react";
import { locationSchema } from "@/schemas/location-schema";

type Props = {
  companyId: number | string;
  location?: TLocation;
  className?: string;
  onSuccess?: () => void;
};

const LocationForm = ({ companyId, location, className, onSuccess }: Props) => {
  const t = useTranslations("Location");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name ?? "",
      address: location?.address ?? "",
      city: location?.city ?? "",
      country: location?.country ?? "",
      postal_code: location?.postal_code ?? "",
      phone: location?.phone ?? "",
      email: location?.email ?? "",
      notes: location?.notes ?? "",
      active: location?.active ?? true,
      primary_location: location?.primary_location ?? false,
    },
  });

  useEffect(() => {
    if (location) {
      form.reset({
        name: location.name ?? "",
        address: location.address ?? "",
        city: location.city ?? "",
        country: location.country ?? "",
        postal_code: location.postal_code ?? "",
        phone: location.phone ?? "",
        email: location.email ?? "",
        notes: location.notes ?? "",
        active: location.active ?? true,
        primary_location: location.primary_location ?? false,
      });
    }
  }, [location, form]);

  const isNewLocation = !location;

  const onSubmit = async (data: z.infer<typeof locationSchema>) => {
    try {
      setLoading(true);
      const body = {
        company_id: companyId,
        location: {
          company_id: companyId,
          name: data.name,
          address: data.address,
          city: data.city,
          country: data.country,
          postal_code: data.postal_code,
          phone: data.phone,
          email: data.email,
          notes: data.notes,
          active: data.active,
          primary_location: data.primary_location,
        },
      };

      const response = location
        ? await authenticatedApi.put(`/locations/${location.id}`, body)
        : await authenticatedApi.post("/locations", body);

      toast.success(response.data.message);
      onSuccess?.();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {isNewLocation ? t("createTitle") : location.name}
                </CardTitle>
                <CardDescription>
                  {isNewLocation
                    ? t("createDescription")
                    : t("editDescription")}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isNewLocation && (
                <Badge
                  variant={location.active ? "default" : "secondary"}
                  className="hidden sm:flex"
                >
                  {location.active ? t("activeBadge") : t("inactiveBadge")}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <FieldGroup>
              {/* Name */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="name"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {t("name")}
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="name"
                      type="text"
                      placeholder={t("namePlaceholder")}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Address */}
              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="address"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {t("address")}
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="address"
                      type="text"
                      placeholder={t("addressPlaceholder")}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* City and Country Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="city"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="city"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {t("city")}
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="city"
                        type="text"
                        placeholder={t("cityPlaceholder")}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="country"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="country"
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        {t("country")}
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="country"
                        type="text"
                        placeholder={t("countryPlaceholder")}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* Postal Code */}
              <Controller
                name="postal_code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="postal_code"
                      className="flex items-center gap-2"
                    >
                      <Home className="h-4 w-4 text-muted-foreground" />
                      {t("postalCode")}
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="postal_code"
                      type="text"
                      placeholder={t("postalCodePlaceholder")}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Phone and Email Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {t("phone")}
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="phone"
                        type="tel"
                        placeholder={t("phonePlaceholder")}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {t("email")}
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="email"
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* Notes */}
              <Controller
                name="notes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="notes"
                      className="flex items-center gap-2"
                    >
                      <Star className="h-4 w-4 text-muted-foreground" />
                      {t("notes")}
                    </FieldLabel>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="notes"
                      placeholder={t("notesPlaceholder")}
                      className="resize-none transition-all focus:ring-2 focus:ring-primary/20"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Checkboxes */}
              <div className="space-y-3">
                <Controller
                  name="active"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="active"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="active"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t("active")}
                      </label>
                    </div>
                  )}
                />

                <Controller
                  name="primary_location"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="primary_location"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="primary_location"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t("defaultLocation")}
                      </label>
                    </div>
                  )}
                />
              </div>
            </FieldGroup>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button disabled={loading} type="submit" className="gap-2">
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                {isNewLocation ? t("creating") : t("saving")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isNewLocation ? t("createButton") : t("saveButton")}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LocationForm;

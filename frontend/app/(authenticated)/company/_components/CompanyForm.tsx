"use client";
import { useCompanyStore } from "@/stores/company-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { authenticatedApi } from "@/lib/api-handler";
import { companySchema } from "@/schemas/company-schema";
import LoadingSpinner from "@/components/loading-spinner";

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
import { Building2, Edit, MapPin, FileText, Save, X } from "lucide-react";
import DeleteCompany from "./DeleteCompany";

type Props = {
  className?: string;
};

const CompanyForm = ({ className }: Props) => {
  const t = useTranslations("Company"); // todo add translations
  const router = useRouter();
  const { company, isLoading, permissions } = useCompanyStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name ?? "",
      location: company?.location ?? "",
      description: company?.description ?? undefined,
    },
  });

  useEffect(() => {
    if (company && !isLoading) {
      form.reset({
        name: company.name ?? "",
        location: company.location ?? "",
        description: company.description ?? undefined,
      });
    }
  }, [company, isLoading, form]);

  if (isLoading) return <LoadingSpinner />;

  const canEdit =
    permissions === undefined ? true : permissions.update === true;

  const onSubmit = async (data: z.infer<typeof companySchema>) => {
    try {
      setLoading(true);
      const body = {
        company: {
          name: data.name,
          location: data.location,
          description: data.description,
        },
      };
      const response = company
        ? await authenticatedApi.put(`/companies/${company.id}`, body)
        : await authenticatedApi.post("/companies", body);

      toast.success(response.data.message);
      router.push("/company/my");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isNewCompany = !company;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {isNewCompany ? "Create Company" : company.name}
              </CardTitle>
              {isNewCompany ? (
                <CardDescription>
                  Fill in the details to create a new company
                </CardDescription>
              ) : (
                company.description && (
                  <CardDescription className="line-clamp-1">
                    {company.description}
                  </CardDescription>
                )
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isNewCompany && (
              <Badge variant="outline" className="hidden sm:flex">
                Active
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <div className="">
            <FieldGroup>
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
                      Name
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="name"
                      type="text"
                      placeholder="UAB EXAMPLE"
                      required
                      disabled={!canEdit}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="location"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Location
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="location"
                      type="text"
                      placeholder="Vilnius, Kestucio 22"
                      required
                      disabled={!canEdit}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="description"
                      placeholder="Electronics company"
                      className="resize-none transition-all focus:ring-2 focus:ring-primary/20"
                      disabled={!canEdit}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-end gap-2 pt-2">
            {company && <DeleteCompany id={company?.id} />}

            <Button disabled={loading || !canEdit} type="submit">
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  {isNewCompany ? "Creating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isNewCompany ? "Create Company" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CompanyForm;

"use client";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authenticatedApi } from "@/lib/api-handler";
import { companySchema } from "@/schemas/company-schema";
import { useCompanyStore } from "@/stores/company-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const CompanyForm = () => {
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

  async function onSubmit(data: z.infer<typeof companySchema>) {
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
    } catch (error: any) {
      const errorMessage = error.message;

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const canEdit =
    permissions === undefined ? true : permissions.update === true;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-3">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="name"
                  type="text"
                  placeholder="UAB EXAMPLE"
                  required
                  disabled={!canEdit}
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
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="location"
                  type="text"
                  placeholder="Vilnius, kestucio 22"
                  required
                  disabled={!canEdit}
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
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="description"
                  placeholder="Electronics company"
                  className="resize-none"
                  disabled={!canEdit}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            disabled={loading || !canEdit}
            type="submit"
            className="w-full"
          >
            Create
          </Button>
        </FieldGroup>
      </div>
    </form>
  );
};

export default CompanyForm;

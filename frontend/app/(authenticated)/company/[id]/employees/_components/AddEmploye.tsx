"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { authenticatedApi } from "@/lib/api-handler";
import { toast } from "sonner";
import { userInvitationSchema } from "@/schemas/user-schema.ts";
import { useCompanyStore } from "@/stores/company-store";
import { useTranslations } from "next-intl";

const AddEmploye = () => {
  const { company } = useCompanyStore();
  const t = useTranslations("Employee");

  const form = useForm<z.infer<typeof userInvitationSchema>>({
    resolver: zodResolver(userInvitationSchema),
    defaultValues: {
      email: "",
      name: "",
      surname: "",
    },
  });

  async function onSubmit(data: z.infer<typeof userInvitationSchema>) {
    try {
      const response = await authenticatedApi.post("/users/invitations", {
        user: {
          email: data.email,
          name: data.name,
          surname: data.surname,
          company_id: company?.id,
          role_id: 5, // as employee TODO: later display role selection in the ui,
        },
      });
      console.log(response);
      toast.success(response.data.message || t("inviteSuccess"));
      form.reset();
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || error.message || t("inviteFailed");
      toast.error(errorMessage);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="name"
                      type="text"
                      placeholder={t("namePlaceholder")}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="surname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="surname">{t("surname")}</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="surname"
                      type="text"
                      placeholder={t("surnamePlaceholder")}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit" className="w-full">
                {t("inviteButton")}
              </Button>
            </FieldGroup>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEmploye;

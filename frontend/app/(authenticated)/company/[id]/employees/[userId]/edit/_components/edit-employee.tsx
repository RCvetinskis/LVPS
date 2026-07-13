"use client";
import { TUser } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userDataSchema } from "@/schemas/user-schema.ts";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateUserData } from "@/front-requests/user-requests";

type Props = {
  employee: TUser;
  companyId: string;
};

const EditEmployeeData = ({ employee, companyId }: Props) => {
  const t = useTranslations("Employee");
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    defaultValues: {
      name: employee?.name || "",
      surname: employee?.surname || "",
    },
  });

  async function onSubmit(data: z.infer<typeof userDataSchema>) {
    try {
      setLoading(true);
      await updateUserData(employee.id, companyId, data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t("editButton")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
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
                    placeholder={t("name")}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
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
                    placeholder={t("surname")}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-auto">
          <FieldGroup>
            <Button disabled={loading} type="submit">
              {t("saveButton")}
            </Button>
          </FieldGroup>
        </CardFooter>
      </Card>
    </form>
  );
};

export default EditEmployeeData;

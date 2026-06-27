"use client";
import { TUser, TUserWorkShiftPattern } from "@/types";
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
import { userShiftPatternShema } from "@/schemas/user-schema.ts";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertUserShiftPattern } from "@/front-requests/user-shift-pattern-request";
import { useState } from "react";

type Props = {
  employee: TUser;
  companyId: string;
  defaultPattern?: TUserWorkShiftPattern;
};
const hourOptions = Array.from({ length: 49 }, (_, i) => {
  const value = i * 0.5;
  const label = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
  return { value, label };
});
const EditEmployeeWorkShift = ({
  employee,
  companyId,
  defaultPattern,
}: Props) => {
  const t = useTranslations("EmployeeShiftPatterns");
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof userShiftPatternShema>>({
    resolver: zodResolver(userShiftPatternShema),
    defaultValues: {
      name: defaultPattern?.name || "",
      hours: defaultPattern?.hours ? Number(defaultPattern.hours) : 8.0,
      work_days: defaultPattern?.work_days || 5,
      off_days: defaultPattern?.off_days || 2,
    },
  });

  async function onSubmit(data: z.infer<typeof userShiftPatternShema>) {
    try {
      setLoading(true);
      const body = {
        ...data,
        user_id: employee.id,
        company_id: companyId,
      };
      await upsertUserShiftPattern(body);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{t("editShiftTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">{t("inputName")}</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="name"
                    type="text"
                    placeholder={t("inputNamePlaceHolder")}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldGroup>
              <Controller
                name="work_days"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="work_days">
                      {t("inputWorkDays")}
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                      value={field.value}
                      aria-invalid={fieldState.invalid}
                      id="work_days"
                      placeholder="3"
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
                name="off_days"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="off_days">
                      {t("inputOffDays")}
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                      value={field.value}
                      aria-invalid={fieldState.invalid}
                      id="off_days"
                      placeholder="3"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <FieldGroup>
            <Controller
              name="hours"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("inputHours")}</FieldLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => {
                      field.onChange(parseFloat(value));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hours" />
                    </SelectTrigger>
                    <SelectContent>
                      {hourOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
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

export default EditEmployeeWorkShift;

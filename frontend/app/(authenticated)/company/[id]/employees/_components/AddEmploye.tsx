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

type Props = {};

const AddEmploye = (props: Props) => {
  const { company } = useCompanyStore();

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
      toast.success(response.data.message);
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.message || "Invitation Failed";

      toast.error(errorMessage);
    }
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add new employee</CardTitle>
        <CardDescription>
          User will receive email and after confirmation he can access your
          company.
        </CardDescription>
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
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
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
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="name"
                      type="text"
                      placeholder="John"
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
                    <FieldLabel htmlFor="surname">Surname</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="surname"
                      type="text"
                      placeholder="Doe"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit" className="w-full">
                Invite
              </Button>
            </FieldGroup>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEmploye;

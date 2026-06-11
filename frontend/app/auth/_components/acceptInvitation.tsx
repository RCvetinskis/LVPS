"use client";
import { Input } from "@/components/ui/input";
import { acceptInvitationSchema, signInSchema } from "@/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-handler";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  email: string;
  invitationToken: string;
};
const AcceptInvitation = ({ email, invitationToken }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof acceptInvitationSchema>>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof acceptInvitationSchema>) {
    try {
      const response = await api.patch(
        `/users/invitations/${invitationToken}/set_password`,
        {
          user: {
            password: data.password,
          },
        },
      );

      if (!response.data.error) {
        toast.success("Confirmation Successfully");
        router.push("/auth/signin");
      } else {
        toast.error(response.data.message || "Confirmation Failed");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Confirmation Failed";

      toast.error(errorMessage);
    }
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-3">
        <FieldGroup>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            disabled
            defaultValue={email}
            value={email}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="password"
                  type="password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-full">
            Confirm
          </Button>
        </FieldGroup>
      </div>
    </form>
  );
};

export default AcceptInvitation;

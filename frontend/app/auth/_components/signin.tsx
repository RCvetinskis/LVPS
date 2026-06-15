"use client";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/auth-schema";
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
import { useState } from "react";
import { useCurrentUserStore } from "@/stores/user-store";

const SignIn = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { setToken, setCurrentUser, setLocale } = useCurrentUserStore();
  async function onSubmit(data: z.infer<typeof signInSchema>) {
    try {
      setLoading(true);
      const response = await api.post("/users/sign_in", {
        user: {
          email: data.email,
          password: data.password,
        },
      });

      if (!response.data.error) {
        const token = response.data.data.jwt;
        const user = response.data.data.user;

        setToken(token);
        setCurrentUser(user);
        setLocale(user.locale);

        toast.success("Login Successfully");
        router.push("/");
      } else {
        toast.error(response.data.message || "Login Failed");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login Failed";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-3">
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
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button disabled={loading} type="submit" className="w-full">
            Login
          </Button>
        </FieldGroup>
      </div>
    </form>
  );
};

export default SignIn;

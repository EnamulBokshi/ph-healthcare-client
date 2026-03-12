"use client";

import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.shcema";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { email } from "zod";

export default function LoginForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const { mutateAsync } = useMutation({
    mutationFn: async (payload: ILoginPayload) => loginAction(payload),
  });
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async (formState) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(formState.value)) as any;
        if (!result.success) {
          setServerError(result.message || "Log in failed");
          return;
        }
      } catch (error: any) {
        setServerError("An unexpected error occurred");
        console.error("Login error:", error);
      }
    },
  });
  return (
    <Card className="w-ful max-w-lg mx-auto shadow-md w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Welcome Back! 
        </CardTitle>
        <CardDescription>
          Please enter your credentials to access your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          method="POST"
          action={"#"}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
            children={(field) => {
              return (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
              );
            }}
          />
          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
            aria-label={showPassword ? "Hide password" : "Show password"}
            children={(field) => {
              return (
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  
                  append={
                    <Button
                      onClick={() => setShowPassword((value) => !value)}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-muted"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4 " aria-hidden />
                      ) : (
                        <Eye className="size-4" aria-hidden />
                      )}
                    </Button>
                  }
                />
              );
            }}
          />

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting}
                disabled={!canSubmit}
                pendingLabel="Logging in..."
                className="w-full"
              >
                Log In
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        <div className="text-right mt-2 ">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant={"outline"}
          className="w-full mb-2"
          onClick={() => {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            //TODO: redirect path after login
            window.location.href = `${baseUrl}/auth/login/google`;
          }}
        >
          <Image
            src="/assets/google-icon.svg"
            alt="Google icon"
            width={16}
            height={16}
            className="mr-2"
          />
          Continue with Google
        </Button>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4 ">
        <p className="text-sm text-muted-foreground ">
          Don&appos;t have an account?
          <Link
            href="/register"
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

"use client";

import { signUpSchema, verificationSchema } from "@/schema/signUpSchema";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded || !signUp) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        // Pass the user's name to be used by the webhook
        unsafeMetadata: {
          name: data.name,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(
        err.errors[0]?.longMessage || "An error occurred during sign up."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerify = async (data: z.infer<typeof verificationSchema>) => {
    if (!isLoaded || !signUp) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        setError("Verification failed. Please check the code and try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(
        err.errors[0]?.longMessage || "An error occurred during verification."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {!pendingVerification ? "Create your account" : "Verify your email"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!pendingVerification && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Creating..."
                    : "Create Account"}
                </Button>
              </form>
            </Form>
          )}

          {pendingVerification && (
            <Form {...verificationForm}>
              <p className="text-center text-sm text-gray-600 mb-4">
                A verification code was sent to your email.
              </p>
              <form
                onSubmit={verificationForm.handleSubmit(onVerify)}
                className="space-y-4"
              >
                <FormField
                  control={verificationForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={verificationForm.formState.isSubmitting}
                >
                  {verificationForm.formState.isSubmitting
                    ? "Verifying..."
                    : "Verify Email"}
                </Button>
              </form>
            </Form>
          )}

          {error && (
            <p className="mt-4 text-center text-sm text-red-600">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation"; // This is Next.js specific
import { useSignIn } from "@clerk/nextjs";
import { Toaster, toast } from "sonner";
import { LoginForm, LoginFormData } from "@/components/auth/LoginForm";


const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  // const router = useRouter(); // Router hook would be from 'react-router-dom' in a non-Next.js app

  // Handler for Email/Password submission
  const handleLogin = async (values: LoginFormData) => {
    if (!isLoaded) {
      toast.error("Authentication service is not ready, please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        toast.success("Login Successful!", {
          description: "Welcome back! Redirecting you to your dashboard.",
        });
        await setActive({ session: result.createdSessionId });
        // In a real app, you would redirect here, e.g., using react-router-dom
        // router.push("/"); 
        window.location.href = "/"; // Simple redirect for now
      } else {
        // This can handle other states like multi-factor authentication if needed
        console.log("Clerk sign-in status:", result.status);
      }
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.longMessage || "An unexpected error occurred. Please try again.";
      toast.error("Login Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Google OAuth
  const handleGoogleSignIn = async () => {
    if (!isLoaded) {
       toast.error("Authentication service is not ready, please try again.");
      return;
    }
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.longMessage || "Failed to authenticate with Google. Please try again.";
      toast.error("Authentication Failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <>

      <main>
        <LoginForm
          onSubmit={handleLogin}
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isLoading}
        />
      </main>
    </>
  );
};

export default LoginPage;


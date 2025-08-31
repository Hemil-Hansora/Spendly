"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import { RegisterForm, formSchema } from "@/components/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Mail } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {

    const { isLoaded, signUp } = useSignUp();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [pendingVerification, setPendingVerification] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    // Function to handle the form submission
    const handleRegister = async (data: z.infer<typeof formSchema>) => {
        if (!isLoaded) {
            // Clerk is not ready yet, do nothing.
            return;
        }

        setIsLoading(true);
        setError(null);
        setUserEmail(data.email);

        try {
            // Use the signUp object to create a new user
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
                // Split the full name into first and last names for Clerk
                firstName: data.fullName.split(' ')[0] || '',
                lastName: data.fullName.split(' ').slice(1).join(' ') || '',
                username: data.username,
            });

            // After creating the user, prepare the email verification
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // Switch the UI to the "pending verification" state
            setPendingVerification(true);

        } catch (err: any) {
            // Catch and display errors from Clerk
            const errorMessage = err.errors?.[0]?.longMessage || "An unexpected error occurred. Please try again.";
            setError(errorMessage);
            console.error("Clerk SignUp Error:", JSON.stringify(err, null, 2));
        } finally {
            setIsLoading(false);
        }
    };
    
    // If verification is pending, show a success message and instructions.
    if (pendingVerification) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
                <Card className="w-full max-w-md text-center shadow-2xl rounded-2xl">
                    <CardHeader className="space-y-4">
                        <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                            <Mail className="h-8 w-8 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                        <CardDescription>
                            We've sent a verification link to <span className="font-semibold text-primary">{userEmail}</span>. Please check your inbox to complete your registration.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Once verified, you can sign in to your new account.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Render the registration form
    return (
        <div>
            {/* Display any error messages above the form */}
            {error && (
                <div className="bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-md mb-6 max-w-md mx-auto flex items-center gap-3 text-sm">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}
            <RegisterForm onRegister={handleRegister} isLoading={isLoading} />
        </div>
    );
}
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  CheckCircle,
  UserPlus 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// --- Zod Schema Definition ---

// Schema for the first step
const step1Schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
});

// Schema for the second step, including a refinement for password matching
const step2Schema = z.object({
  username: z.string()
    .min(3, "Username must be 3-20 characters.")
    .max(20, "Username must be 3-20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Can only contain letters, numbers, or underscores."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Set the error on the confirmPassword field
});

// Combined schema for type inference
export const formSchema = step1Schema.and(step2Schema);

// --- Component ---

interface RegisterProps {
  onRegister?: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

export function RegisterForm({ onRegister, isLoading = false }: RegisterProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    }
  });

  const passwordValue = form.watch("password", "");

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(passwordValue));
  }, [passwordValue]);

  const handleNextStep = async () => {
    const isValid = await form.trigger(["fullName", "email"]);
    if (isValid) {
      // FIX: Clear errors from the next step before proceeding
      form.clearErrors(["username", "password", "confirmPassword"]);
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  
  const processRegistration = (data: z.infer<typeof formSchema>) => {
    onRegister?.(data);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-destructive";
    if (passwordStrength < 50) return "bg-orange-400";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto secondary-gradient p-3 rounded-xl w-16 h-16 flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Create account</CardTitle>
            <CardDescription>
              {currentStep === 1 ? "Let's get started with your details" : "Set up your login credentials"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
              <span>Step {currentStep} of 2</span>
              <span>{currentStep === 1 ? "Basic Info" : "Account Setup"}</span>
            </div>
            <Progress value={currentStep * 50} className="h-2" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(processRegistration)} className="space-y-4">
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter your full name" autoComplete="name" className="pl-10" {...field} />
                            </div>
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="email" placeholder="Enter your email" autoComplete="email" className="pl-10" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                             <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Choose a username" autoComplete="username" className="pl-10" {...field} />
                            </div>
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
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type={showPassword ? "text" : "password"} placeholder="Create a strong password" autoComplete="new-password" className="pl-10 pr-10" {...field} />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </FormControl>
                         {passwordValue && (
                            <div className="space-y-1 pt-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Strength: {getPasswordStrengthText()}</span>
                                    <span>{passwordStrength}%</span>
                                </div>
                                <Progress value={passwordStrength} className={`h-1.5 [&>*]:bg-transparent ${getPasswordStrengthColor()}`} />
                            </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                             <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" autoComplete="new-password" className="pl-10 pr-10" {...field} />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                         {!form.formState.errors.confirmPassword && form.getValues("confirmPassword") && form.getValues("password") === form.getValues("confirmPassword") && (
                            <p className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Passwords match
                            </p>
                        )}
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <div className="flex gap-3 pt-2">
                {currentStep === 2 && (
                  <Button type="button" variant="outline" size="lg" className="flex-1" onClick={handlePrevStep}>
                    Back
                  </Button>
                )}
                <Button 
                  type={currentStep === 1 ? "button" : "submit"}
                  onClick={currentStep === 1 ? handleNextStep : undefined}
                  size="lg" 
                  className="flex-1 primary-gradient"
                  disabled={isLoading && currentStep === 2}
                >
                  {isLoading && currentStep === 2 ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                  ) : currentStep === 1 ? "Continue" : "Create Account"}
                </Button>
              </div>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground pt-4">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


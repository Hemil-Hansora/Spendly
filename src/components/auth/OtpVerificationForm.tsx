
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, KeyRound } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


// --- Zod Schema for OTP Verification ---
export const otpFormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});


// --- OTP Verification Component ---
interface OtpVerificationFormProps {
    onSubmit: (data: z.infer<typeof otpFormSchema>) => void;
    isLoading: boolean;
    email: string;
}

export function OtpVerificationForm({ onSubmit, isLoading, email }: OtpVerificationFormProps) {
    const form = useForm<z.infer<typeof otpFormSchema>>({
        resolver: zodResolver(otpFormSchema),
        defaultValues: { code: "" },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto secondary-gradient p-3 rounded-xl w-16 h-16 flex items-center justify-center">
                        <KeyRound className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                        <CardDescription>
                            We've sent a 6-digit code to <span className="font-semibold text-primary">{email}</span>.
                            <br/> <span className="text-xs text-muted-foreground">(Hint: try 123456)</span>
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">One-Time Password</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field} containerClassName="justify-center">
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage className="text-center"/>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full primary-gradient" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                                    </>
                                ) : (
                                    "Verify Code"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

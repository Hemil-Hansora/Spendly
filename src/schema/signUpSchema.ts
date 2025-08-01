import * as z from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const verificationSchema = z.object({
    code: z.string().min(6, { message: "Verification code must be 6 characters."})
})
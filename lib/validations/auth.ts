import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

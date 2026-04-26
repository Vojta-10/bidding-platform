'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { H1, Muted, Subtitle } from '@/components/ui/typography';
import { signUp } from '@/lib/actions/auth';
import { signUpSchema, type SignUpValues } from '@/lib/validations/auth';

export function SignUpForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  function onSubmit(values: SignUpValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await signUp(values.email, values.password, values.username);
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <Card className='w-full max-w-md px-6 py-10'>
      <CardHeader className='mb-2 gap-1'>
        <H1 className='mb-1'>Create account</H1>
        <Subtitle>Fill in the details below to get started</Subtitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className='flex flex-col gap-4'>
            {serverError && (
              <p className='text-sm text-destructive'>{serverError}</p>
            )}

            <Field className='flex flex-col gap-2'>
              <FieldLabel htmlFor='username'>Username</FieldLabel>
              <Input
                id='username'
                type='text'
                placeholder='johndoe'
                {...register('username')}
              />
              {errors.username && (
                <FieldError>{errors.username.message}</FieldError>
              )}
            </Field>

            <Field className='flex flex-col gap-2'>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                {...register('email')}
              />
              {errors.email && (
                <FieldError>{errors.email.message}</FieldError>
              )}
            </Field>

            <Field className='flex flex-col gap-2'>
              <FieldLabel htmlFor='password'>Password</FieldLabel>
              <Input
                id='password'
                type='password'
                {...register('password')}
              />
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            <Field className='flex flex-col gap-2'>
              <FieldLabel htmlFor='confirmPassword'>
                Confirm password
              </FieldLabel>
              <Input
                id='confirmPassword'
                type='password'
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
              )}
            </Field>

            <Field>
              <Button
                type='submit'
                className='w-full mt-1'
                size='lg'
                disabled={isPending}
              >
                {isPending ? 'Creating account…' : 'Sign up'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className='justify-center p-6'>
        <Muted>
          Already have an account?{' '}
          <Link
            href='/sign-in'
            className='text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors ml-1'
          >
            Sign in
          </Link>
        </Muted>
      </CardFooter>
    </Card>
  );
}

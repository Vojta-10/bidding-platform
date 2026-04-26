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
import { signIn } from '@/lib/actions/auth';
import { signInSchema, type SignInValues } from '@/lib/validations/auth';

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  function onSubmit(values: SignInValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await signIn(values.email, values.password);
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <Card className='w-full max-w-md px-6 py-10'>
      <CardHeader className='mb-2 gap-1'>
        <H1 className='mb-1'>Sign in</H1>
        <Subtitle>Enter your email below to login to your account</Subtitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className='flex flex-col gap-4'>
            {serverError && (
              <p className='text-sm text-destructive'>{serverError}</p>
            )}

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

            <Field>
              <Button
                type='submit'
                className='w-full mt-1'
                size='lg'
                disabled={isPending}
              >
                {isPending ? 'Signing in…' : 'Login'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className='justify-center p-6'>
        <Muted>
          Don&apos;t have an account?{' '}
          <Link
            href='/sign-up'
            className='text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors ml-1'
          >
            Sign up
          </Link>
        </Muted>
      </CardFooter>
    </Card>
  );
}

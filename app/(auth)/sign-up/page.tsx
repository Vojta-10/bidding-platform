import { Suspense } from 'react';
import { SignUpForm } from '@/app/(auth)/_components/SignUpForm';

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}

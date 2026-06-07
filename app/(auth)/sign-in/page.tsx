import { Suspense } from 'react';
import { LoginForm } from '@/app/(auth)/_components/LoginForm';

export default function SignInPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

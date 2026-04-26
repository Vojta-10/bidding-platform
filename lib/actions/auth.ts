'use server';

import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email != 'string' || typeof password != 'string') return;

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error('Wrong credentials try again');

  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const username = formData.get('username');

  if (
    typeof email != 'string' ||
    typeof password != 'string' ||
    typeof username != 'string'
  ) {
    throw new Error('Invalid form data');
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) throw new Error(error.message);

  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error.message);
  }

  redirect('/');
}

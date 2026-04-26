'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signIn(
  email: string,
  password: string,
): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Wrong credentials, try again.' };

  redirect('/dashboard');
}

export async function signUp(
  email: string,
  password: string,
  username: string,
): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) return { error: error.message };

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

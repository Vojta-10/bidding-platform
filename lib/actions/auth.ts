'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { protectedPaths } from '../utils';

export async function signIn(
  email: string,
  password: string,
  redirectTo: string | null,
): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Wrong credentials, try again.' };

  if (redirectTo && redirectTo.startsWith('/')) redirect(redirectTo);
  redirect('/dashboard');
}

export async function signUp(
  email: string,
  password: string,
  username: string,
  redirectTo: string | null,
): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) return { error: error.message };

  if (redirectTo && redirectTo.startsWith('/')) redirect(redirectTo);
  redirect('/dashboard');
}

export async function signOut(path: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error.message);
  }
  if (path.startsWith('/') && protectedPaths.includes(path.split('/')[1]))
    redirect('/');
  redirect(path);
}

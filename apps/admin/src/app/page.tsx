import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/**
 * Root page – redirects based on auth state.
 */
export default async function RootPage() {
  const cookieStore = await cookies();
  const hasAuth = cookieStore.has('emunah_auth');

  if (hasAuth) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}

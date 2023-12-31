import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { routes } from 'src/pages';

interface AuthUtils {
  isAuthenticated: boolean;
  username: null | string;
  login(username: string): Promise<void>;
  logout(): Promise<void>;
}

/**
 * This represents some generic auth provider API, like Firebase.
 */
export const auth: AuthUtils = {
  isAuthenticated: false,
  username: null,
  async login(username: string) {
    await new Promise((r) => {
      setTimeout(r, 1000);
    }); // fake delay
    auth.isAuthenticated = true;
    auth.username = username;
  },
  async logout() {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    }); // fake delay
    auth.isAuthenticated = false;
    auth.username = '';
  },
};

export async function loginAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get('username') as string | null;

  // Validate our form inputs and return validation errors via useActionData()
  if (!username) {
    return {
      error: 'You must provide a username to log in',
    };
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    await auth.login(username);
  } catch (error) {
    // Unused as of now but this is how you would handle invalid
    // username/password combinations - just like validating the inputs
    // above
    return {
      error: 'Invalid login attempt',
    };
  }

  const redirectTo = formData.get('redirectTo') as string | null;
  return redirect(redirectTo ?? routes.home);
}

export async function loginLoader() {
  if (auth.isAuthenticated) {
    return redirect(routes.home);
  }
  return null;
}

export function protectedLoader({ request }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!auth.isAuthenticated) {
    const params = new URLSearchParams();
    params.set('from', new URL(request.url).pathname);
    return redirect(`${routes.login}?${params.toString()}`);
  }
  return null;
}

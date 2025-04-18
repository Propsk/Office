'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaGoogle } from 'react-icons/fa';
import Spinner from '@/components/Spinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (result?.error) {
        toast.error('Invalid admin credentials');
        setIsLoading(false);
      } else {
        toast.success('Logged in successfully');
        // Router will automatically redirect in the useEffect
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn('google', { callbackUrl: '/' })
      .catch(error => {
        console.error('Google sign-in error:', error);
        setIsLoading(false);
        toast.error('Google sign-in failed');
      });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner loading={true} />
      </div>
    );
  }

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto max-w-md py-20">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {isAdminView ? 'Admin Login' : 'User Login'}
          </h1>

          <div className="mb-6 text-center">
            <button 
              onClick={() => setIsAdminView(!isAdminView)}
              className="text-blue-600 underline"
            >
              {isAdminView ? 'Switch to User Login' : 'Switch to Admin Login'}
            </button>
          </div>

          {isAdminView ? (
            // Admin login form
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Login as Admin
              </button>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                Default admin: admin@example.com / admin123
              </div>
            </form>
          ) : (
            // Google login option for regular users
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Sign in with your Google account to access the workspace rental system.
              </p>
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-800 py-3 rounded hover:bg-gray-50"
              >
                <FaGoogle className="mr-2 text-red-500" />
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
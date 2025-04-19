'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaGoogle, FaUser, FaUserShield } from 'react-icons/fa';
import Spinner from '@/components/Spinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (result?.error) {
        toast.error(isAdminView ? 'Invalid admin credentials' : 'Invalid email or password');
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

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Input validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register new user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          username
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Account created successfully');
        
        // Auto login after registration
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password
        });
        
        if (result?.error) {
          toast.error('Registration successful, but login failed');
          setIsLoading(false);
        }
      } else {
        toast.error(data.message || 'Registration failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Something went wrong during registration');
      setIsLoading(false);
    }
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
            {isAdminView ? 'Admin Login' : (isRegistering ? 'Create Account' : 'User Login')}
          </h1>

          {/* View toggle buttons */}
          <div className="mb-6 flex justify-center gap-4">
            <button 
              onClick={() => {
                setIsAdminView(false);
                setIsRegistering(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${!isAdminView && !isRegistering ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <FaUser /> User Login
            </button>
            
            <button 
              onClick={() => {
                setIsAdminView(true);
                setIsRegistering(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isAdminView ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <FaUserShield /> Admin Login
            </button>
          </div>

          {isAdminView ? (
            // Admin login form
            <form onSubmit={handleCredentialsLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="admin-email">Email:</label>
                <input
                  type="email"
                  id="admin-email"
                  className="w-full px-3 py-2 border rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="admin-password">Password:</label>
                <input
                  type="password"
                  id="admin-password"
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
                Use your admin credentials to login
              </div>
            </form>
          ) : (
            // User login/register
            !isRegistering ? (
              // User login form
              <div>
                <form onSubmit={handleCredentialsLogin} className="mb-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="user-email">Email:</label>
                    <input
                      type="email"
                      id="user-email"
                      className="w-full px-3 py-2 border rounded"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="user-password">Password:</label>
                    <input
                      type="password"
                      id="user-password"
                      className="w-full px-3 py-2 border rounded"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
                  >
                    Login
                  </button>
                </form>
                
                <div className="flex items-center justify-between mb-6">
                  <hr className="w-full" />
                  <p className="mx-4 text-gray-500">OR</p>
                  <hr className="w-full" />
                </div>
                
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-800 py-3 rounded hover:bg-gray-50 mb-6"
                >
                  <FaGoogle className="mr-2 text-red-500" />
                  Sign in with Google
                </button>
                
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Don't have an account?</p>
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Create an account
                  </button>
                </div>
              </div>
            ) : (
              // Registration form
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="register-username">Username:</label>
                  <input
                    type="text"
                    id="register-username"
                    className="w-full px-3 py-2 border rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="register-email">Email:</label>
                  <input
                    type="email"
                    id="register-email"
                    className="w-full px-3 py-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="register-password">Password:</label>
                  <input
                    type="password"
                    id="register-password"
                    className="w-full px-3 py-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength="6"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="register-confirm-password">Confirm Password:</label>
                  <input
                    type="password"
                    id="register-confirm-password"
                    className="w-full px-3 py-2 border rounded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
                >
                  Register
                </button>
                
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Already have an account?</p>
                  <button
                    onClick={() => setIsRegistering(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Login instead
                  </button>
                </div>
              </form>
            )
          )}
        </div>
      </div>
    </section>
  );
}
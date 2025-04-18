'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Spinner from '@/components/Spinner';

export default function DebugSession() {
  const { data: session, status } = useSession();
  const [checkResponse, setCheckResponse] = useState(null);

  useEffect(() => {
    // Check session API endpoint
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        setCheckResponse(data);
      } catch (error) {
        setCheckResponse({ error: error.message });
      }
    };

    checkSession();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner loading={true} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Session Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <p className="mb-2">
            <span className="font-bold">Status:</span>{' '}
            <span className={`px-2 py-1 rounded ${
              status === 'authenticated' ? 'bg-green-100 text-green-800' : 
              status === 'loading' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {status}
            </span>
          </p>
          
          {session && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Session Data</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-6 flex space-x-4">
            {!session ? (
              <button
                onClick={() => signIn()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2">
            <p><strong>NextAuth URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL}</p>
            <p><strong>Current Path:</strong> {window.location.pathname}</p>
            <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">API Session Check</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {checkResponse ? JSON.stringify(checkResponse, null, 2) : 'Loading...'}
        </pre>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/login" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login Page
          </Link>
          <Link 
            href="/properties/add" 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Property
          </Link>
          <Link 
            href="/admin" 
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Admin Dashboard
          </Link>
          <Link 
            href="/" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
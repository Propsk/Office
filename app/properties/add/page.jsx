"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import SimplePropertyForm from "./form";

export default function AddPropertyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

  if (loading || status === 'loading') {
    return (
      <div className="container mx-auto py-20 text-center">
        <Spinner loading={true} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-6">You need to be logged in to add a property.</p>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <SimplePropertyForm />
    </div>
  );
}
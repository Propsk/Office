"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PropertiesList from "../components/PropertiesList";
import Spinner from "../components/Spinner";
import Hero from "../components/Hero";
import InfoBoxes from "../components/InfoBoxes";

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/properties");
        if (res.ok) {
          const data = await res.json();
          setProperties(data.properties || []);
        } else {
          console.error("Failed to load properties");
        }
      } catch (err) {
        console.error(err);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, []);

  return (
    <>
      <Hero />
      <InfoBoxes />
      
      <main className="container m-auto px-6 py-10">
        {/* Login box at the top */}
        {!session && !isLoading && (
          <div className="max-w-lg mx-auto mb-10 p-6 bg-white rounded-lg shadow-md border border-blue-100">
            <h2 className="text-2xl font-bold text-center mb-4">Account Login</h2>
            <p className="text-gray-600 mb-6 text-center">
              Log in to add properties or manage your account
            </p>
            <div className="flex justify-center">
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6">Latest Workspaces</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner loading={true} />
          </div>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-600">No properties found. Check back later!</p>
        ) : (
          <PropertiesList items={properties} />
        )}
      </main>
    </>
  );
}
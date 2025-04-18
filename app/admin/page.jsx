'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (status === 'authenticated') {
      if (!session?.user?.isAdmin) {
        toast.error('Not authorized to view admin area');
        router.push('/');
      } else {
        fetchPendingProperties();
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const fetchPendingProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/properties/pending');
      
      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Unauthorized - Please login as admin');
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch pending properties');
      }
      
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch pending properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, status, notes = '') => {
    try {
      const res = await fetch(`/api/properties/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes })
      });

      if (res.ok) {
        toast.success(`Property ${status}`);
        // Remove from list
        setProperties(properties.filter(p => p._id !== id));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      toast.error('Something went wrong');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner loading={true} />
      </div>
    );
  }

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link 
            href="/properties/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Property
          </Link>
        </div>
        
        <h2 className="text-xl font-bold mb-4">Pending Properties</h2>
        
        {properties.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <p>No pending properties</p>
            <p className="text-gray-500 mt-2">All properties have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Name</th>
                  <th className="border p-3 text-left">Type</th>
                  <th className="border p-3 text-left">Location</th>
                  <th className="border p-3 text-left">User</th>
                  <th className="border p-3 text-left">Date</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property._id} className="hover:bg-gray-50">
                    <td className="border p-3">{property.name}</td>
                    <td className="border p-3">{property.type}</td>
                    <td className="border p-3">
                      {property.location?.city || 'N/A'}, 
                      {property.location?.state || ''}
                    </td>
                    <td className="border p-3">
                      {property.owner?.username || 'Unknown'}
                    </td>
                    <td className="border p-3">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border p-3 flex space-x-2">
                      <button 
                        onClick={() => handleApproval(property._id, 'approved')} 
                        className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleApproval(property._id, 'rejected')} 
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <Link
                        href={`/properties/${property._id}`} 
                        target="_blank" 
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
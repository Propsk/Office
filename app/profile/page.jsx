"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { deleteProperty } from "@/utils/propertyActions";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProperties = async (userId) => {
      if (!userId) {
        return;
      }
      try {
        // If user is admin, fetch all properties
        const endpoint = session?.user?.isAdmin 
          ? '/api/properties?admin=true'  // Use admin parameter
          : `/api/properties/user/${userId}`;
        
        const res = await fetch(endpoint);

        if (res.status === 200) {
          const data = await res.json();
          // For admin endpoint, we get { properties }
          const propertiesData = session?.user?.isAdmin ? data.properties : data;
          setProperties(propertiesData);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user properties when session is available
    if (session?.user?.id) {
      fetchUserProperties(session.user.id);
    }
  }, [session]);

  const handleDeleteProperty = async (propertyId) => {
    const property = properties.find(p => p._id === propertyId);
    const propertyName = property ? property.name : 'this property';
    
    // Use the utility function for deletion
    const success = await deleteProperty(
      propertyId, 
      propertyName,
      // On success callback - remove property from list
      () => {
        const updatedProperties = properties.filter(property => property._id !== propertyId);
        setProperties(updatedProperties);
      }
    );
  }

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 mx-20 mt-10">
              <div className="mb-4">
                <Image
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
                  src={profileImage || profileDefault}
                  width={100}
                  height={100}
                  alt="User"
                />
              </div>

              <h2 className="text-xl mb-4">
                <span className="font-bold block">Name: </span> {profileName}
              </h2>
              <h2 className="text-xl">
                <span className="font-bold block">Email: </span> {profileEmail}
              </h2>
            </div>

            <div className="md:w-3/4 md:pl-4">
              <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
              {!loading && properties.length === 0 && (
                <p>You have no Property Listing</p>
              )}

              {loading ? (
                <Spinner loading={loading} />
              ) : (
                properties.map((property) => (
                  <div key= {property._id} className="mb-10">
                    <Link href={`/properties/${property._id}`}>
                      <Image
                        className="h-32 w-full rounded-md object-cover"
                        src={property.images[0]}
                        alt=""
                        width={500}
                        height={100}
                        priority= {true}
                      />
                    </Link>
                    <div className="mt-2">
                      <p className="text-lg font-semibold">{property.name}</p>
                      <p className="text-gray-600">Address: {property.location.street} { property.location.city} {property.location.state} </p>
                      
                      {/* Show owner info if admin */}
                      {session?.user?.isAdmin && property.owner && (
                        <p className="text-sm text-gray-600 mt-1">
                          Owner: {typeof property.owner === 'object' 
                            ? property.owner.username || property.owner.email 
                            : 'Unknown user'}
                        </p>
                      )}
                    </div>
                    <div className="mt-2">
                      <Link
                        href={`/properties/${property._id}/edit`}
                        className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                      onClick={() => handleDeleteProperty(property._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;

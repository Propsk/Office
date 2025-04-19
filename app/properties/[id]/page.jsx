"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProperty } from "@/utils/requests";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import PropertyDetails from "@/components/PropertyDetails";
import { FaArrowLeft} from 'react-icons/fa';
import Spinner from "@/components/Spinner";
import PropertyImages from "@/components/PropertyImages";
import BookmarkButton from "@/components/BookmarkButton";
import PropertyContactForm from "@/components/PropertyContactForm";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { deleteProperty } from '@/utils/propertyActions';

// Create AdminControls component
const AdminControls = ({ property }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Use the utility function for deletion
    await deleteProperty(
      property._id,
      property.name,
      // On success callback
      () => router.push('/properties'),
      setIsDeleting
    );
  };

  return (
    <div className="bg-red-50 p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-bold text-red-700 mb-2">Admin Controls</h3>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span>ID: {property._id}</span>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm">
            Status: {property.status || 'approved'}
          </span>
        </div>
        
        <div className="flex space-x-2 mt-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Property'}
          </button>
          
          <Link
            href={`/admin`}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;
      try {
        const property = await fetchProperty(id);
        setProperty(property);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (property === null) {
      fetchPropertyData();
    }
  }, [id, property]);

  if (!property && !loading ) {
    return (
      <h1 className = 'text-center text-2xl font-bold mt-10'>Property Not Found</h1> 
    )
  }


  return <>
  {loading && <Spinner loading={loading}/>}
    { !loading && property && (<>
      <PropertyHeaderImage image = {property.images[0]} ></PropertyHeaderImage>
      <section>
      <div className="container m-auto py-6 px-6">
        <a
          href="/properties"
          className="text-blue-500 hover:text-blue-600 flex items-center"
        >
          <FaArrowLeft className="mr-2"/> Back to Properties
        </a>
      </div>
    </section>

    <section className="bg-blue-50">
      <div className="container m-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
          
        <PropertyDetails property = {property} />

          {/* <!-- Sidebar --> */}
          <aside className="space-y-4">
            {/* Show admin controls if user is admin */}
            {session?.user?.isAdmin && property && (
              <AdminControls property={property} />
            )}
            <BookmarkButton property = {property}/>
            {/* <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
            >
              <i className="fas fa-share mr-2"></i> Share Property
            </button> */}
            <PropertyContactForm property = {property}/>
          </aside>
        </div>
      </div>
    </section>
    <PropertyImages images = {property.images}/>
    </>)} 
  </>
};

export default PropertyPage;

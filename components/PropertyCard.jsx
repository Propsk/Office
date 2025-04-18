import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaChair,
  FaDoorOpen,
  FaRulerCombined,
  FaMapMarker,
  FaWifi,
  FaPrint,
  FaUtensils,
  FaUsers
} from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  const getRateDisplay = () => {
    const { rates } = property;
    if (rates.monthly) return `£${rates.monthly.toLocaleString()}/mo`;
    if (rates.weekly) return `£${rates.weekly.toLocaleString()}/wk`;
    if (rates.daily) return `£${rates.daily.toLocaleString()}/day`;
    return 'Contact for pricing';
  };

  return (
    <div className="rounded-xl shadow-md relative overflow-hidden">
      <Image
        src={property.images?.[0] || '/default-office.jpg'}
        alt={property.name || 'Workspace Image'}
        width={500}
        height={350}
        priority={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="w-full h-48 object-cover rounded-t-xl"
      />

      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-4">
          <div className="text-sm text-gray-500">{property.type}</div>
          <h3 className="text-xl font-bold text-gray-800">{property.name}</h3>
        </div>

        <h3 className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-blue-600 font-bold shadow">
          {getRateDisplay()}
        </h3>

        <div className="flex justify-center gap-4 text-gray-600 text-sm mb-3">
          <p><FaChair className="inline mr-1" /> {property.desk_capacity || 0} Desks</p>
          <p><FaDoorOpen className="inline mr-1" /> {property.rooms || 0} Rooms</p>
          <p><FaRulerCombined className="inline mr-1" /> {property.square_feet || 0} sqft</p>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-500 mb-4">
            {property.amenities.includes('Wi-Fi') && <span><FaWifi className="inline mr-1" />Wi-Fi</span>}
            {property.amenities.includes('Printing') && <span><FaPrint className="inline mr-1" />Printing</span>}
            {property.amenities.includes('Kitchen') && <span><FaUtensils className="inline mr-1" />Kitchen</span>}
            {property.amenities.includes('Meeting Room') && <span><FaUsers className="inline mr-1" />Meeting Room</span>}
          </div>
        )}

        <div className="border-t border-gray-200 my-4"></div>

        <div className="flex flex-col lg:flex-row justify-between items-center text-sm">
          <div className="flex items-center text-orange-700 gap-2">
            <FaMapMarker />
            <span>{property.location?.city}, {property.location?.state}</span>
          </div>
          <Link
            href={`/properties/${property._id}`}
            className="mt-2 lg:mt-0 h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            View Workspace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

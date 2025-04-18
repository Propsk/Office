'use client';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';

const LocationsDropdown = () => {
  return (
    <div className="relative group">
      <Link 
        href="/locations" 
        className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 flex items-center"
      >
        Locations <FaChevronDown className="ml-1" />
      </Link>
      
      <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 z-10 transform translate-y-2 group-hover:translate-y-0">
        <div className="py-1 rounded-md bg-white shadow-xs">
          <Link 
            href="/locations/nottingham" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Nottingham
          </Link>
          <Link 
            href="/locations/derby" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Derby
          </Link>
          <Link 
            href="/locations/beeston" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Beeston
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationsDropdown;
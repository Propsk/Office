'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import LocationLanding from '@/components/LocationLanding';

// Valid locations list
const validLocations = [
  'long-eaton',
  'nottingham',
  'derby',
  'beeston',
  'stapleford',
  'west-bridgford',
  'wilford',
  'clifton',
  'ruddington'
];

// Function to format location name for display
function formatLocationName(location) {
  return location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function LocationPage({ params }) {
  const [locationName, setLocationName] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get the location from params
    const locationParam = params.location;
    
    // Check if location is valid
    if (!validLocations.includes(locationParam.toLowerCase())) {
      return notFound();
    }
    
    // Format the location name
    const formattedName = formatLocationName(locationParam);
    setLocationName(formattedName);
    setLoading(false);
    
    // Update document title
    document.title = `Office Space & Coworking in ${formattedName} | RentOfficeSpace.co.uk`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `Find affordable hot desks, private offices and coworking space in ${formattedName}. Daily, weekly and monthly rates available.`);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = `Find affordable hot desks, private offices and coworking space in ${formattedName}. Daily, weekly and monthly rates available.`;
      document.head.appendChild(meta);
    }
  }, [params]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  if (!locationName) {
    return notFound();
  }
  
  return (
    <div>
      <LocationLanding location={locationName} />
    </div>
  );
}
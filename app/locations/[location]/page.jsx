import { notFound } from 'next/navigation';
import LocationLanding from '@/components/LocationLanding';
import { generateMetadata as generateSEOMetadata } from '@/components/SEOConfig';

// Valid locations list
const validLocations = [
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

// Generate metadata for each location page
export async function generateMetadata({ params }) {
  // In Next.js App Router, params is a promise in server components
  // We need to await it properly
  const locationParam = params.location;

  if (!validLocations.includes(locationParam.toLowerCase())) {
    return {};
  }
  
  const locationName = formatLocationName(locationParam);
  
  return generateSEOMetadata({
    title: `Office Space & Coworking in ${locationName}`,
    description: `Find affordable hot desks, private offices and coworking space in ${locationName}. Daily, weekly and monthly rates available.`,
    location: locationName,
  });
}

// Generate static params for all locations
export async function generateStaticParams() {
  return validLocations.map(location => ({
    location,
  }));
}

export default async function LocationPage({ params }) {
  // In Next.js App Router, params is a promise in server components
  // We need to await it properly
  const locationParam = params.location;
  
  // Check if location is valid
  if (!validLocations.includes(locationParam.toLowerCase())) {
    return notFound();
  }
  
  const locationName = formatLocationName(locationParam);
  
  return (
    <div>
      <LocationLanding location={locationName} />
    </div>
  );
}
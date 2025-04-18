import { notFound } from 'next/navigation';
import LocationLanding from '@/components/LocationLanding';
import { generateMetadata } from '@/components/SEOConfig';

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
const formatLocationName = (location) => {
  return location
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Generate metadata for each location page
export async function generateMetadata({ params }) {
  const { location } = params;
  
  if (!validLocations.includes(location.toLowerCase())) {
    return {};
  }
  
  const locationName = formatLocationName(location);
  
  return generateMetadata({
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

export default function LocationPage({ params }) {
  const { location } = params;
  
  // Check if location is valid
  if (!validLocations.includes(location.toLowerCase())) {
    return notFound();
  }
  
  const locationName = formatLocationName(location);
  
  return (
    <div>
      <LocationLanding location={locationName} />
    </div>
  );
}
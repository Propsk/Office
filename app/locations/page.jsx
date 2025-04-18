import Link from 'next/link';
import Image from 'next/image';
import { generateMetadata } from '@/components/SEOconfig';

// Locations data
const locations = [
  {
    name: 'Nottingham',
    description: 'Coworking and office space in the heart of Nottingham city center.',
    image: '/location-nottingham.jpg',
    slug: 'nottingham'
  },
  {
    name: 'Derby',
    description: 'Flexible workspace solutions in Derby with great transport links.',
    image: '/location-derby.jpg',
    slug: 'derby'
  },
  {
    name: 'Beeston',
    description: 'Modern coworking space near the University of Nottingham.',
    image: '/location-beeston.jpg',
    slug: 'beeston'
  },
  {
    name: 'West Bridgford',
    description: 'Premium office space in the popular West Bridgford area.',
    image: '/location-west-bridgford.jpg',
    slug: 'west-bridgford'
  },
  {
    name: 'Stapleford',
    description: 'Convenient workspace options in Stapleford.',
    image: '/location-stapleford.jpg',
    slug: 'stapleford'
  },
  {
    name: 'Wilford',
    description: 'Quiet and productive office space in Wilford.',
    image: '/location-wilford.jpg',
    slug: 'wilford'
  },
  {
    name: 'Clifton',
    description: 'Affordable hot desking and private offices in Clifton.',
    image: '/location-clifton.jpg',
    slug: 'clifton'
  },
  {
    name: 'Ruddington',
    description: 'Professional workspace in the village of Ruddington.',
    image: '/location-ruddington.jpg',
    slug: 'ruddington'
  }
];

export const metadata = generateMetadata({
  title: "Office Space Locations | RentOfficeSpace.co.uk",
  description: "Find coworking space, hot desks and private offices across Nottingham, Derby and surrounding areas in the East Midlands.",
});

export default function LocationsPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">
          Our Office Space Locations
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover flexible workspace solutions across Nottingham, Derby and the East Midlands.
          From hot desks to private offices, we have the perfect space for you.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {locations.map((location) => (
            <Link 
              href={`/locations/${location.slug}`} 
              key={location.slug}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={location.image || '/default-office.jpg'}
                  alt={`Office space in ${location.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{location.name}</h2>
                <p className="text-gray-600">{location.description}</p>
                <span className="inline-block mt-4 text-blue-600 font-medium">
                  View spaces in {location.name} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import Image from 'next/image';
import PropertySearchForm from '@/components/PropertySearchForm';
import { FaMapMarkerAlt, FaWifi, FaMugHot, FaUsers } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const LocationLanding = ({ location }) => {
  const [imagePaths, setImagePaths] = useState({});
  
  // Function to check if an image exists
  const checkImageExists = async (path) => {
    try {
      const res = await fetch(path, { method: 'HEAD' });
      return res.ok;
    } catch (error) {
      return false;
    }
  };
  
  // Using .jpg consistently for all images
  useEffect(() => {
    const locations = ['nottingham', 'derby', 'beeston', 'stapleford', 'west-bridgford', 'wilford', 'clifton', 'ruddington'];
    
    // Create a map of location to image path
    const paths = {};
    
    // Set all images to use .jpg extension
    for (const loc of locations) {
      paths[loc.toLowerCase()] = `/location-${loc.toLowerCase()}.jpg`;
    }
    
    // Set default image path
    paths['default'] = '/default-office.jpg';
    
    setImagePaths(paths);
  }, []);
  
  // Location data mapping
  const locationData = {
    'nottingham': {
      title: 'Coworking & Hot Desks in Nottingham',
      description: 'Flexible workspace solutions in the heart of Nottingham. Daily, weekly, and monthly rates available.',
      amenities: ['High-speed Wi-Fi', 'Free tea & coffee', 'Meeting rooms', 'Reception services'],
      nearbyPlaces: ['Nottingham Train Station', 'Old Market Square', 'Victoria Centre'],
    },
    'derby': {
      title: 'Office Space & Coworking in Derby',
      description: 'Modern office spaces and hot desks in Derby city centre. Perfect for freelancers and businesses of all sizes.',
      amenities: ['24/7 access', 'Meeting rooms', 'Kitchen facilities', 'Business address'],
      nearbyPlaces: ['Derby Cathedral', 'Intu Derby', 'Derby Train Station'],
    },
    'beeston': {
      title: 'Hot Desking & Office Space in Beeston',
      description: 'Contemporary workspace in Beeston with excellent transport links. Daily and monthly rates for professionals and students.',
      amenities: ['High-speed Wi-Fi', 'Kitchen access', 'Meeting rooms', 'Printing facilities'],
      nearbyPlaces: ['University of Nottingham', 'Beeston Train Station', 'Beeston Square'],
    },
    'stapleford': {
      title: 'Affordable Office Space in Stapleford',
      description: 'Budget-friendly workspace solutions in Stapleford. Perfect for startups and small businesses looking for value.',
      amenities: ['High-speed internet', 'Meeting pods', 'Kitchen facilities', 'Secure 24/7 access'],
      nearbyPlaces: ['Stapleford Library', 'Walter Parker VC Square', 'Local shopping district'],
    },
    'west-bridgford': {
      title: 'Premium Coworking Space in West Bridgford',
      description: 'Upscale office and coworking facilities in the prime location of West Bridgford. Professional environment for growing businesses.',
      amenities: ['Premium furniture', 'Conference rooms', 'Barista-quality coffee', 'Networking events'],
      nearbyPlaces: ['Trent Bridge Cricket Ground', 'Bridgford Park', 'Central Avenue shops'],
    },
    'wilford': {
      title: 'Quiet Office Space in Wilford',
      description: 'Peaceful and productive workspace away from city noise. Ideal for focused work and creative thinking.',
      amenities: ['Quiet zones', 'Garden area', 'Free parking', 'High-speed broadband'],
      nearbyPlaces: ['Wilford Village', 'Victoria Embankment', 'Gresham Sports Park'],
    },
    'clifton': {
      title: 'Convenient Workspace in Clifton',
      description: 'Well-connected office and hot desk facilities in Clifton. Affordable options with flexible rental terms.',
      amenities: ['Transport links', 'Breakout spaces', 'Printing services', 'Meeting facilities'],
      nearbyPlaces: ['Clifton Campus', 'Clifton Centre', 'Clifton Playing Fields'],
    },
    'ruddington': {
      title: 'Charming Office Space in Ruddington Village',
      description: 'Character workspaces in the picturesque village of Ruddington. Beautiful surroundings with all modern amenities.',
      amenities: ['Rural setting', 'High-speed connectivity', 'Local cafes nearby', 'Free parking'],
      nearbyPlaces: ['Ruddington Village Centre', 'Ruddington Country Park', 'The Framework Knitters Museum'],
    }
  };

  const data = locationData[location.toLowerCase()] || {
    title: `Office Space in ${location}`,
    description: `Flexible workspace solutions in ${location}. Find your perfect office space, coworking desk, or meeting room.`,
    amenities: ['High-speed Wi-Fi', 'Kitchen facilities', 'Meeting rooms'],
    nearbyPlaces: ['Local amenities', 'Transport links'],
  };
  
  const imagePath = imagePaths[location.toLowerCase()] || imagePaths['default'] || 'https://placehold.co/600x400?text=Office+Space';

  return (
    <>
      {/* Hero section */}
      <section className="bg-blue-700 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              {data.title}
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              {data.description}
            </p>
            <PropertySearchForm />
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Workspace Solutions in {location}</h2>
              <p className="text-gray-600 mb-6">
                Whether you need a hot desk for the day, a dedicated desk for the week, or a private office for your team,
                we have flexible solutions to suit your needs in {location}.
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Popular Options in {location}</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                      <FaWifi />
                    </span>
                    <span>Hot Desking - from £15/day</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                      <FaUsers />
                    </span>
                    <span>Private Offices - from £350/month</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                      <FaMugHot />
                    </span>
                    <span>Coworking Membership - from £99/month</span>
                  </li>
                </ul>
              </div>
              
              <Link 
                href="/properties" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700 transition"
              >
                View Available Spaces
              </Link>
            </div>
            
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              {Object.keys(imagePaths).length > 0 && (
                <Image
                  src={imagePath}
                  alt={`Office space in ${location}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Amenities section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Workspace Amenities in {location}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.amenities.map((amenity, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-3">{amenity}</h3>
                <p className="text-gray-600">
                  Enjoy our premium {amenity.toLowerCase()} in our {location} workspace.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Prime Location in {location}
          </h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-start mb-4">
              <FaMapMarkerAlt className="text-red-500 text-2xl mr-3 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Conveniently Located</h3>
                <p className="text-gray-600">
                  Our {location} workspace is perfectly situated with easy access to transport links and local amenities.
                </p>
              </div>
            </div>
            
            <h4 className="font-semibold mb-2">Nearby:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.nearbyPlaces.map((place, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  <span>{place}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-center">
            <Link 
              href="/contact" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700 transition"
            >
              Book a Tour in {location}
            </Link>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-12 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to work from {location}?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of professionals and find your perfect workspace solution today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/properties" 
              className="bg-white text-blue-700 px-6 py-3 rounded-lg inline-block hover:bg-gray-100 transition"
            >
              Browse Spaces
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg inline-block hover:bg-white hover:text-blue-700 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default LocationLanding;
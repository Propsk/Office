export const generateMetadata = ({ 
  title = "RentOfficeSpace.co.uk | Find Coworking Space & Offices to Rent",
  description = "Affordable hot desks, coworking spaces and private offices to rent in the East Midlands. Daily, weekly and monthly options available.",
  keywords = "office space, coworking, hot desk, hot desking, office rental, workspace, Nottingham, Derby, Beeston",
  location = "",
  type = ""
}) => {
  // Create a more specific title if location or type is provided
  let metaTitle = title;
  if (location && type) {
    metaTitle = `${type} in ${location} | RentOfficeSpace.co.uk`;
  } else if (location) {
    metaTitle = `Office Space & Coworking in ${location} | RentOfficeSpace.co.uk`;
  } else if (type) {
    metaTitle = `${type} Office Space for Rent | RentOfficeSpace.co.uk`;
  }

  // Create a more specific description if location or type is provided
  let metaDescription = description;
  if (location && type) {
    metaDescription = `Rent ${type.toLowerCase()} workspace in ${location}. Flexible rates, modern amenities, and prime locations. Book daily, weekly, or monthly.`;
  } else if (location) {
    metaDescription = `Find affordable office space and coworking desks in ${location}. Flexible workspace solutions for freelancers, startups, and businesses.`;
  }

  // Build keyword list with location-specific terms if available
  let keywordList = keywords;
  if (location) {
    keywordList += `, office space ${location}, hot desk ${location}, coworking ${location}, office rental ${location}`;
  }

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywordList,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'website',
      locale: 'en_GB',
      url: 'https://rentOfficespace.co.uk/',
      siteName: 'RentOfficeSpace',
      images: [
        {
          url: 'https://rentOfficespace.co.uk/og-image.jpg', // Create this image
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ['https://rentOfficespace.co.uk/twitter-image.jpg'], // Create this image
    },
    alternates: {
      canonical: 'https://rentOfficespace.co.uk',
    },
  };
};
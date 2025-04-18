'use client';

import Script from 'next/script';

export function LocalBusinessSchema({ 
  businessName = "RentOfficeSpace.co.uk",
  address = {
    streetAddress: "123 Office Street",
    addressLocality: "Long Eaton",
    addressRegion: "Derbyshire",
    postalCode: "NG10 1AA",
    addressCountry: "GB"
  },
  geo = {
    latitude: "52.897",  // Replace with actual coordinates
    longitude: "-1.275"  // Replace with actual coordinates
  },
  telephone = "+441234567890", // Replace with actual phone
  email = "info@rentOfficespace.co.uk", // Replace with actual email
  url = "https://rentOfficespace.co.uk/",
  image = "https://rentOfficespace.co.uk/logo.png",
  priceRange = "£15-£500",
  openingHours = [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00"
    }
  ],
  location
}) {
  const locationSpecificName = location 
    ? `${businessName} - ${location}` 
    : businessName;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CoworkingSpace",
    "name": locationSpecificName,
    "address": {
      "@type": "PostalAddress",
      ...address
    },
    "geo": {
      "@type": "GeoCoordinates",
      ...geo
    },
    "telephone": telephone,
    "email": email,
    "url": url,
    "image": image,
    "priceRange": priceRange,
    "openingHoursSpecification": openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.dayOfWeek,
      "opens": hours.opens,
      "closes": hours.closes
    })),
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "WiFi",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Air conditioning",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Meeting rooms",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Kitchen",
        "value": true
      }
    ]
  };

  return (
    <Script id="schema-markup" type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
  );
}

export function PropertyListingSchema({ properties = [] }) {
  if (!properties.length) return null;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": properties.map((property, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "RealEstateListing",
        "name": property.name,
        "description": property.description,
        "url": `https://rentOfficespace.co.uk/properties/${property._id}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": property.location?.city || "",
          "addressRegion": property.location?.state || "",
          "postalCode": property.location?.zipcode || ""
        },
        "offers": {
          "@type": "Offer",
          "price": property.rates?.monthly || property.rates?.weekly || property.rates?.daily || "",
          "priceCurrency": "GBP",
          "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          "businessFunction": "LeaseOut"
        }
      }
    }))
  };

  return (
    <Script id="property-listing-schema" type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
  );
}

export function FaqSchema({ faqs = [] }) {
  if (!faqs.length) return null;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Script id="faq-schema" type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
  );
}
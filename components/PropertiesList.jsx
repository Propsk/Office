'use client';

import PropertyCard from "./PropertyCard";

export default function PropertiesList({ items = [] }) {
  // Make sure items is always an array
  const properties = Array.isArray(items) ? items : [];
  
  if (properties.length === 0) {
    return <p>No properties available.</p>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard key={p._id} property={p} />
      ))}
    </div>
  );
}
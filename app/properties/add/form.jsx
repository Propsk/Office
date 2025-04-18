'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { WORKSPACE_TYPES } from '@/constants/workspaceTypes';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';

const AMENITIES = [
  'Wi‑Fi',
  'Kitchen',
  'Meeting Room',
  'Parking',
  'Air Conditioning',
  'Printing',
];

export default function SimplePropertyForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Simple form state to avoid nested object issues
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  
  const [squareFeet, setSquareFeet] = useState('');
  const [deskCapacity, setDeskCapacity] = useState('');
  const [rooms, setRooms] = useState('');
  
  const [amenities, setAmenities] = useState([]);
  
  const [rateDaily, setRateDaily] = useState('');
  const [rateWeekly, setRateWeekly] = useState('');
  const [rateMonthly, setRateMonthly] = useState('');
  
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAmenities(prev => [...prev, value]);
    } else {
      setAmenities(prev => prev.filter(item => item !== value));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast.error('You must be logged in to add a property');
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Upload images first
      const uploaded = [];
      for (const file of images) {
        const fd = new FormData();
        fd.append('file', file);
        
        const res = await fetch('/api/upload', { 
          method: 'POST', 
          body: fd,
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          toast.error(`Image upload failed: ${errorData.error || 'Unknown error'}`);
          setIsSubmitting(false);
          return;
        }
        
        const { url } = await res.json();
        uploaded.push(url);
      }

      // Create the property with individual fields
      const property = {
        name,
        type,
        description,
        location: {
          street,
          city,
          state,
          zipcode
        },
        square_feet: squareFeet ? Number(squareFeet) : 0,
        desk_capacity: deskCapacity ? Number(deskCapacity) : 0,
        rooms: rooms ? Number(rooms) : 0,
        amenities,
        rates: {
          daily: rateDaily ? Number(rateDaily) : 0,
          weekly: rateWeekly ? Number(rateWeekly) : 0,
          monthly: rateMonthly ? Number(rateMonthly) : 0
        },
        contact: {
          name: contactName,
          email: contactEmail,
          phone: contactPhone
        },
        images: uploaded,
        status: 'pending'
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });

      if (res.ok) {
        toast.success('Workspace added successfully and pending approval');
        router.push('/properties');
      } else {
        const { message = 'Something went wrong' } = await res.json();
        toast.error(message);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-10">
        <Spinner loading={true} />
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded"
    >
      <h1 className="text-3xl font-semibold text-center mb-6">
        Add Workspace
      </h1>

      {/* images */}
      <div className="mb-6">
        <label className="block font-bold mb-1">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border px-3 py-2 rounded"
        />
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="preview"
                className="h-32 w-full object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      {/* type & name */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Workspace Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select --</option>
          {WORKSPACE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-1">Workspace Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-1">Description</label>
        <textarea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* location */}
      <div className="mb-6 bg-blue-50 p-4 rounded">
        <label className="block font-bold mb-2">Location</label>
        <input
          type="text"
          placeholder="Street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full border px-3 py-2 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full border px-3 py-2 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="County or Region"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full border px-3 py-2 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Postcode"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* size & capacity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-bold mb-1">Square Feet</label>
          <input
            type="number"
            value={squareFeet}
            onChange={(e) => setSquareFeet(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Desk Capacity</label>
          <input
            type="number"
            value={deskCapacity}
            onChange={(e) => setDeskCapacity(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Private Rooms</label>
          <input
            type="number"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* amenities */}
      <div className="mb-6">
        <label className="block font-bold mb-2">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map((a) => (
            <label key={a} className="flex items-center">
              <input
                type="checkbox"
                value={a}
                checked={amenities.includes(a)}
                onChange={handleAmenityChange}
                className="mr-2"
              />
              {a}
            </label>
          ))}
        </div>
      </div>

      {/* rates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-bold mb-1">Daily Rate (£)</label>
          <input
            type="number"
            value={rateDaily}
            onChange={(e) => setRateDaily(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Weekly Rate (£)</label>
          <input
            type="number"
            value={rateWeekly}
            onChange={(e) => setRateWeekly(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Monthly Rate (£)</label>
          <input
            type="number"
            value={rateMonthly}
            onChange={(e) => setRateMonthly(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block font-bold mb-1">Contact Name</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Contact Email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Phone</label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Add Workspace'}
        </button>
      </div>
    </form>
  );
}
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

const num = (v) => (v === '' ? 0 : Number(v));

export default function PropertyAddForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState({
    type: '',
    name: '',
    description: '',
    location: { street: '', city: '', state: '', zipcode: '' },
    square_feet: '',
    desk_capacity: '',
    rooms: '',
    amenities: [],
    rates: { daily: '', weekly: '', monthly: '' },
    contact: { name: '', email: '', phone: '' },
  });

  // Safe access to nested fields
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((prev, curr) => {
      return prev && typeof prev === 'object' ? prev[curr] : '';
    }, obj);
  };

  // ---------- handlers ----------
  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name.startsWith('location.')) {
      const k = name.split('.')[1];
      return setFields((p) => ({ ...p, location: { ...p.location, [k]: value } }));
    }
    if (name.startsWith('rates.')) {
      const k = name.split('.')[1];
      return setFields((p) => ({ ...p, rates: { ...p.rates, [k]: value } }));
    }
    if (name.startsWith('contact.')) {
      const k = name.split('.')[1];
      return setFields((p) => ({ ...p, contact: { ...p.contact, [k]: value } }));
    }
    if (name === 'amenities') {
      return setFields((p) => ({
        ...p,
        amenities: checked
          ? [...p.amenities, value]
          : p.amenities.filter((a) => a !== value),
      }));
    }
    setFields((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
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

      // Then create the property
      const body = {
        ...fields,
        square_feet: num(fields.square_feet),
        desk_capacity: num(fields.desk_capacity),
        rooms: num(fields.rooms),
        rates: {
          daily: num(fields.rates.daily),
          weekly: num(fields.rates.weekly),
          monthly: num(fields.rates.monthly),
        },
        images: uploaded,
        status: 'pending', // Set initial status to pending
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
          name="type"
          value={fields.type}
          onChange={handleChange}
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
          name="name"
          value={fields.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-1">Description</label>
        <textarea
          name="description"
          rows="4"
          value={fields.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* location */}
      <div className="mb-6 bg-blue-50 p-4 rounded">
        <label className="block font-bold mb-2">Location</label>
        <input
          type="text"
          name="location.street"
          placeholder="Street"
          value={getNestedValue(fields, 'location.street')}
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-2 rounded"
        />
        <input
          type="text"
          name="location.city"
          placeholder="City"
          value={getNestedValue(fields, 'location.city')}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 mb-2 rounded"
        />
        <input
          type="text"
          name="location.state"
          placeholder="County or Region"
          value={getNestedValue(fields, 'location.state')}
          onChange={handleChange}
          className="w-full border px-3 py-2 mb-2 rounded"
        />
        <input
          type="text"
          name="location.zipcode"
          placeholder="Postcode"
          value={getNestedValue(fields, 'location.zipcode')}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* size & capacity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Square Feet', name: 'square_feet' },
          { label: 'Desk Capacity', name: 'desk_capacity' },
          { label: 'Private Rooms', name: 'rooms' },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block font-bold mb-1">{label}</label>
            <input
              type="number"
              name={name}
              value={fields[name]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
      </div>

      {/* amenities */}
      <div className="mb-6">
        <label className="block font-bold mb-2">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map((a) => (
            <label key={a} className="flex items-center">
              <input
                type="checkbox"
                name="amenities"
                value={a}
                checked={fields.amenities.includes(a)}
                onChange={handleChange}
                className="mr-2"
              />
              {a}
            </label>
          ))}
        </div>
      </div>

      {/* rates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {['daily', 'weekly', 'monthly'].map((p) => (
          <div key={p}>
            <label className="block font-bold mb-1 capitalize">
              {p} Rate (£)
            </label>
            <input
              type="number"
              name={`rates.${p}`}
              value={getNestedValue(fields, `rates.${p}`)}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
      </div>

      {/* contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Contact Name', field: 'contact.name' },
          { label: 'Contact Email', field: 'contact.email' },
          { label: 'Phone', field: 'contact.phone' },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="block font-bold mb-1">{label}</label>
            <input
              type={field.includes('email') ? 'email' : 'text'}
              name={field}
              value={getNestedValue(fields, field)}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
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
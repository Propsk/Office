'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { WORKSPACE_TYPES } from '@/models/Property'; // adjust if path differs

const AMENITIES = ['Wi-Fi', 'Kitchen', 'Meeting Room', 'Parking', 'Air Conditioning', 'Printing'];

const num = (v) => (v === '' ? 0 : Number(v));

export default function PropertyAddForm() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
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

  // ----------------------- handlers -----------------------
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
        amenities: checked ? [...p.amenities, value] : p.amenities.filter((a) => a !== value),
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

    // upload images
    const uploaded = [];
    for (const file of images) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        toast.error('Image upload failed');
        return;
      }
      const { url } = await res.json();
      uploaded.push(url);
    }

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
    };

    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success('Workspace added successfully');
      router.push('/properties');
    } else {
      const { message = 'Something went wrong' } = await res.json();
      toast.error(message);
    }
  };

  // ----------------------------- UI -----------------------------
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-semibold text-center mb-6">Add Workspace</h1>

      {/* images */}
      <div className="mb-6">
        <label className="block font-bold mb-1">Upload Images</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border px-3 py-2 rounded" />
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="preview" className="h-32 w-full object-cover rounded" />
            ))}
          </div>
        )}
      </div>

      {/* type & name */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Workspace Type</label>
        <select name="type" value={fields.type} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
          <option value="">-- Select --</option>
          {WORKSPACE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-1">Workspace Name</label>
        <input type="text" name="name" value={fields.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-1">Description</label>
        <textarea name="description" rows="4" value={fields.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* location */}
      <div className="mb-6 bg-blue-50 p-4 rounded">
        <label className="block font-bold mb-2">Location</label>
        <input type="text" name="location.street" placeholder="Street" value={fields.location.street} onChange={handleChange} className="w-full border px-3 py-2 mb-2 rounded" />
        <input type="text" name="location.city" placeholder="City" value={fields.location.city} onChange={handleChange} required className="w-full border px-3 py-2 mb-2 rounded" />
        <input type="text" name="location.state" placeholder="County or Region" value={fields.location.state} onChange={handleChange} className="w-full border px-3 py-2 mb-2 rounded" />
        <input type="text" name="location.zipcode" placeholder="Postcode" value={fields.location.zipcode} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* size & capacity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-bold mb-1">Square Feet</label>
          <input type="number" name="square_feet" value={fields.square_feet} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-bold mb-1">Desk Capacity</label>
          <input type="number" name="desk_capacity" value={fields.desk_capacity} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-bold mb-1">Private Rooms</label>
          <input type="number" name="rooms" value={fields.rooms} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      {/* amenities */}
      <div className="mb-6">
        <label className="block font-bold mb-2">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map((a) => (
            <label key={a} className="flex items-center">
              <input type="checkbox" name="amenities" value={a} checked={fields.amenities.includes(a)} onChange={handleChange} className="mr-2" />
              {a}
            </label>
          ))}
        </div>
      </div>

      {/* rates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {['daily', 'weekly', 'monthly'].map((p) => (
          <div key={p}>
            <label className="block font-bold mb-1 capitalize">{p} Rate (£)</label>
            <input type="number" name={`rates.${p}`} value={fields.rates[p]} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
        ))}
      </div>

      {/* contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block font-bold mb-1">Contact Name</label>
          <input type="text" name="contact.name" value={fields.contact.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-bold mb-1">Contact Email</label>
          <input type="email" name="contact.email" value={fields.contact.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-bold mb-1">Phone</label>
          <input type="tel" name="contact.phone" value={fields.contact.phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700">
          Add Workspace
        </button>
      </div>
    </form>
  );
}


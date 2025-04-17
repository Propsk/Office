"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchProperty } from '@/utils/requests';
import { WORKSPACE_TYPES } from '@/models/Property';

const AMENITIES = ['Wi-Fi', 'Kitchen', 'Meeting Room', 'Parking', 'Air Conditioning', 'Printing'];
const num = (v) => (v === '' ? 0 : Number(v));

const PropertyEditForm = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    location: { street: '', city: '', state: '', zipcode: '' },
    square_feet: '',
    desk_capacity: '',
    rooms: '',
    amenities: [],
    images: [],
    rates: { daily: '', weekly: '', monthly: '' },
    contact: { name: '', email: '', phone: '' },
  });

  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const getProperty = async () => {
      const property = await fetchProperty(id);
      setFormData({
        ...property,
        rates: {
          daily: property.rates?.daily || '',
          weekly: property.rates?.weekly || '',
          monthly: property.rates?.monthly || '',
        },
        location: property.location || { street: '', city: '', state: '', zipcode: '' },
        contact: property.contact || { name: '', email: '', phone: '' },
        desk_capacity: property.desk_capacity || '',
        rooms: property.rooms || '',
        images: property.images || [],
      });
    };
    getProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name.startsWith('rates.')) {
      const rateField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        rates: { ...prev.rates, [rateField]: value },
      }));
    } else if (name.startsWith('location.')) {
      const locField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [locField]: value },
      }));
    } else if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [contactField]: value },
      }));
    } else if (name === 'amenities') {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((a) => a !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedUrls = [...formData.images];

    if (newImages.length) {
      for (const img of newImages) {
        const fileData = new FormData();
        fileData.append('file', img);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: fileData,
        });

        if (res.ok) {
          const { url } = await res.json();
          uploadedUrls.push(url);
        }
      }
    }

    const updatedData = {
      ...formData,
      square_feet: num(formData.square_feet),
      desk_capacity: num(formData.desk_capacity),
      rooms: num(formData.rooms),
      rates: {
        daily: num(formData.rates.daily),
        weekly: num(formData.rates.weekly),
        monthly: num(formData.rates.monthly),
      },
      images: uploadedUrls,
    };

    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      router.push('/properties');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-3xl font-semibold mb-6 text-center">Edit Workspace</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Upload Additional Images</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border px-3 py-2 rounded" />
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {previews.map((src, idx) => (
              <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded" />
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Workspace Type</label>
        <select name="type" value={formData.type} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value="">-- Select --</option>
          {WORKSPACE_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Workspace Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows="4" />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Location</label>
        <input type="text" name="location.street" placeholder="Street" value={formData.location.street} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2" />
        <input type="text" name="location.city" placeholder="City" value={formData.location.city} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2" />
        <input type="text" name="location.state" placeholder="County or Region" value={formData.location.state} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2" />
        <input type="text" name="location.zipcode" placeholder="Postcode" value={formData.location.zipcode} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Desk Capacity</label>
          <input type="number" name="desk_capacity" value={formData.desk_capacity} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Private Rooms</label>
          <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map((a) => (
            <label key={a} className="flex items-center">
              <input type="checkbox" name="amenities" value={a} checked={formData.amenities.includes(a)} onChange={handleChange} className="mr-2" />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {['daily', 'weekly', 'monthly'].map((rate) => (
          <div key={rate}>
            <label className="block font-semibold mb-1 capitalize">{rate} Rate (£)</label>
            <input type="number" name={`rates.${rate}`} value={formData.rates[rate]} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Contact Name</label>
          <input type="text" name="contact.name" value={formData.contact.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Contact Email</label>
          <input type="email" name="contact.email" value={formData.contact.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input type="tel" name="contact.phone" value={formData.contact.phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
          Update Workspace
        </button>
      </div>
    </form>
  );
};

export default PropertyEditForm;

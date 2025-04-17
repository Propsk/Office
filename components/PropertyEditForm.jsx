import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchProperty } from '@/utils/requests';

const PropertyEditForm = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    location: '',
    square_feet: '',
    beds: '',
    baths: '',
    amenities: [],
    rates: {
      daily: '',
      weekly: '',
      monthly: '',
    },
    seller_name: '',
    seller_email: '',
    seller_phone: '',
  });

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
      });
    };
    getProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('rates.')) {
      const rateField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        rates: {
          ...prev.rates,
          [rateField]: value,
        },
      }));
    } else if (name === 'amenities') {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          amenities: [...prev.amenities, value],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          amenities: prev.amenities.filter((a) => a !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push('/properties');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-3xl font-semibold mb-6 text-center">Edit Workspace</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Workspace Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select --</option>
          <option value="Hot Desk">Hot Desk</option>
          <option value="Dedicated Desk">Dedicated Desk</option>
          <option value="Private Office">Private Office</option>
          <option value="Meeting Room">Meeting Room</option>
          <option value="Whole Office">Entire Office</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Workspace Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows="4"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Square Feet</label>
        <input
          type="number"
          name="square_feet"
          value={formData.square_feet}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Desk Capacity</label>
          <input
            type="number"
            name="beds"
            value={formData.beds}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Private Rooms</label>
          <input
            type="number"
            name="baths"
            value={formData.baths}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {['Wi-Fi', 'Kitchen', 'Meeting Room', 'Parking', 'Air Conditioning', 'Printing'].map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                name="amenities"
                value={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={handleChange}
                className="mr-2"
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-1">Daily Rate (£)</label>
          <input
            type="number"
            name="rates.daily"
            value={formData.rates.daily}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Weekly Rate (£)</label>
          <input
            type="number"
            name="rates.weekly"
            value={formData.rates.weekly}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Monthly Rate (£)</label>
          <input
            type="number"
            name="rates.monthly"
            value={formData.rates.monthly}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Contact Name</label>
          <input
            type="text"
            name="seller_name"
            value={formData.seller_name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Contact Email</label>
          <input
            type="email"
            name="seller_email"
            value={formData.seller_email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input
            type="tel"
            name="seller_phone"
            value={formData.seller_phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Update Workspace
        </button>
      </div>
    </form>
  );
};

export default PropertyEditForm;

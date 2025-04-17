import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const PropertyAddForm = () => {
  const router = useRouter()
  const [fields, setFields] = useState({
    type: '',
    name: '',
    description: '',
    location: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
    },
    square_feet: '',
    beds: '',
    amenities: [],
    rates: {
      daily: '',
      weekly: '',
      monthly: '',
    },
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('location.')) {
      const locField = name.split('.')[1]
      setFields((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locField]: value,
        },
      }))
    } else if (name.startsWith('rates.')) {
      const rateField = name.split('.')[1]
      setFields((prev) => ({
        ...prev,
        rates: {
          ...prev.rates,
          [rateField]: value,
        },
      }))
    } else if (name === 'amenities') {
      if (checked) {
        setFields((prev) => ({
          ...prev,
          amenities: [...prev.amenities, value],
        }))
      } else {
        setFields((prev) => ({
          ...prev,
          amenities: prev.amenities.filter((a) => a !== value),
        }))
      }
    } else {
      setFields((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })

    if (res.ok) {
      toast.success('Workspace added successfully!')
      router.push('/properties')
    } else {
      toast.error('Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-3xl text-center font-semibold mb-6">Add Workspace</h2>

      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
          Workspace Type
        </label>
        <select
          id="type"
          name="type"
          className="border rounded w-full py-2 px-3"
          required
          value={fields.type}
          onChange={handleChange}
        >
          <option value="">-- Select Type --</option>
          <option value="Hot Desk">Hot Desk</option>
          <option value="Dedicated Desk">Dedicated Desk</option>
          <option value="Private Office">Private Office</option>
          <option value="Meeting Room">Meeting Room</option>
          <option value="Whole Office">Entire Office</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Workspace Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="e.g. Private Office - Tamworth Road"
          required
          value={fields.name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="border rounded w-full py-2 px-3"
          rows="4"
          placeholder="Describe the space, access, usage policy, included services..."
          value={fields.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="mb-4 bg-blue-50 p-4">
        <label className="block text-gray-700 font-bold mb-2">Location</label>
        <input
          type="text"
          id="street"
          name="location.street"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="Street"
          value={fields.location.street}
          onChange={handleChange}
        />
        <input
          type="text"
          id="city"
          name="location.city"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="City"
          required
          value={fields.location.city}
          onChange={handleChange}
        />
        <input
          type="text"
          id="state"
          name="location.state"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="County or Region"
          required
          value={fields.location.state}
          onChange={handleChange}
        />
        <input
          type="text"
          id="zipcode"
          name="location.zipcode"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="Postcode"
          value={fields.location.zipcode}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="square_feet" className="block text-gray-700 font-bold mb-2">
          Approximate Square Feet
        </label>
        <input
          type="number"
          id="square_feet"
          name="square_feet"
          className="border rounded w-full py-2 px-3"
          value={fields.square_feet}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Desk Capacity</label>
        <input
          type="number"
          id="beds"
          name="beds"
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. 6"
          value={fields.beds}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {['Wi-Fi', 'Kitchen', 'Meeting Room', 'Parking', 'Air Conditioning', 'Printing'].map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                name="amenities"
                value={amenity}
                checked={fields.amenities.includes(amenity)}
                onChange={handleChange}
                className="mr-2"
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Daily Price (£)</label>
        <input
          type="number"
          id="daily_rate"
          name="rates.daily"
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. 20"
          value={fields.rates.daily}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Weekly Price (£)</label>
        <input
          type="number"
          id="weekly_rate"
          name="rates.weekly"
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. 100"
          value={fields.rates.weekly}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Monthly Price (£)</label>
        <input
          type="number"
          id="monthly_rate"
          name="rates.monthly"
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. 350"
          value={fields.rates.monthly}
          onChange={handleChange}
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Workspace
        </button>
      </div>
    </form>
  )
}

export default PropertyAddForm

// app/page.jsx

import HomePageProperties from '@/components/HomePageProperties'
import Hero from '@/components/Hero'
import InfoBoxes from '@/components/InfoBoxes'

import connectDB from '@/config/database'
import Property from '@/models/Property'   // adjust path if needed

/**
 * Directly query the database in a Server Component.
 */
export default async function Page() {
  // Connect (or skip if already connected)
  await connectDB()

  // Fetch the first page of properties (6 items)
  const pageSize = 6
  const page     = 1
  const skip     = (page - 1) * pageSize

  const [properties, total] = await Promise.all([
    Property.find({})
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Property.countDocuments(),
  ])

  return (
    <div>
      <Hero />
      <InfoBoxes />
      <HomePageProperties
        properties={properties}
        totalItems={total}
        currentPage={page}
        pageSize={pageSize}
      />
    </div>
  )
}
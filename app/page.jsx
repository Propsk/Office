// app/page.jsx

import Hero from '@/components/Hero'
import InfoBoxes from '@/components/InfoBoxes'
import HomePageProperties from '@/components/HomePageProperties'

/**
 * Server‑side fetch with ISR.
 * Uses an absolute URL so Node can parse it.
 */
async function getProperties({ page = 1, pageSize = 6 } = {}) {
  // Build an absolute URL from our env‑var
  const base = process.env.NEXT_PUBLIC_BASE_URL
  const url = new URL('/api/properties', base)
  url.searchParams.set('page', page)
  url.searchParams.set('pageSize', pageSize)

  const res = await fetch(url.toString(), {
    // Re‑generate this page on Vercel at most once every 60 seconds
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch properties (${res.status})`)
  }

  return res.json() // { properties: [...], total: 42 }
}

export default async function Page() {
  // Fetch server‑side (for SEO) with caching
  const { properties, total } = await getProperties()

  return (
    <div>
      <Hero />
      <InfoBoxes />
      {/* This is the same component you already have –
          it now receives pre‑fetched data for immediate render */}
      <HomePageProperties
        properties={properties}
        totalItems={total}
        // you can still pass page/pageSize handlers if you wire them up
      />
    </div>
  )
}

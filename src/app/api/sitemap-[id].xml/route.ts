import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

const BASE_URL = 'https://cuet.sayed.page'
const LINKS_PER_SITEMAP = 200

export async function GET(request: Request, { params }: { params: { id?: string } }) {
  try {
    // Fetch all student IDs from Supabase
    const { data, error } = await supabaseServer
      .from('apidata')
      .select('studentid')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.error()
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 })
    }

    // Calculate the total number of sitemaps required
    const totalSitemaps = Math.ceil(data.length / LINKS_PER_SITEMAP)

    // If no specific sitemap is requested (i.e., the index is requested)
    if (!params.id) {
      // Create a sitemap index
      const sitemapIndex = `
        <?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${Array.from({ length: totalSitemaps }, (_, i) => `
            <sitemap>
              <loc>${BASE_URL}/sitemap-${i + 1}.xml</loc>
            </sitemap>
          `).join('')}
        </sitemapindex>`

      return new NextResponse(sitemapIndex, {
        headers: {
          'Content-Type': 'application/xml',
        },
      })
    }

    // If a specific sitemap is requested (e.g., /sitemap-1.xml)
    const sitemapId = parseInt(params.id, 10)
    
    // Check if sitemapId is valid
    if (isNaN(sitemapId) || sitemapId < 1 || sitemapId > totalSitemaps) {
      return NextResponse.json({ error: 'Invalid sitemap ID' }, { status: 404 })
    }

    // Get the specific chunk of student IDs for the requested sitemap
    const chunk = data.slice((sitemapId - 1) * LINKS_PER_SITEMAP, sitemapId * LINKS_PER_SITEMAP)

    const urls = chunk.map((student) => `
      <url>
        <loc>${BASE_URL}/${student.studentid}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>`).join('')

    const sitemap = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    return NextResponse.error()
  }
}

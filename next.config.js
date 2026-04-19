/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoicG9zaXRpdmVwcGwiLCJhIjoiY21tbXdocTBxMmQ0czJwb2Y3ejBmYmp2MiJ9.3HS4ay8Kq6OIJlv06lZr3Q',
  },
}

module.exports = nextConfig
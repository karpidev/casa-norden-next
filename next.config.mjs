/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Imágenes desde Cloudflare R2 (producción)
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      // Dominio personalizado del CDN de Casa Norden
      { protocol: 'https', hostname: 'cdn.casanorden.com.ar' },
      // Fallback para desarrollo local contra Payload
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'admin.casanorden.com.ar' },
    ],
  },
};

export default nextConfig;

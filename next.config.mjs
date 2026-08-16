/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exportación estática para Cloudflare Pages (sin servidor Node.js)
  output: 'export',
  images: {
    // Requerido para output: 'export' — las imágenes se sirven optimizadas desde el CDN
    unoptimized: true,
    remotePatterns: [
      // Imágenes desde Cloudflare R2 (producción)
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      // Dominio personalizado del CDN de Casa Norden
      { protocol: 'https', hostname: 'cdn.casanorden.com.ar' },
      // Fallback para desarrollo local contra Payload
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;

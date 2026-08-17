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
  async headers() {
    return [
      {
        // Aplicar a todas las rutas de páginas HTML (excluyendo estáticos cacheados por hash y APIs)
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita React Strict Mode para detectar problemas
  reactStrictMode: true,

  // 🔥 DESABILITA ESLINT NO BUILD (NOVO)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Otimizações de imagem
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Headers de segurança e cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // Experimental: otimizações do App Router
  experimental: {
    // Otimiza pacotes importados
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vídeos de depoimento em public/videos/: cache longo no navegador/CDN.
  // Se trocar um vídeo, troque também o nome do arquivo (o cache é immutable).
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;

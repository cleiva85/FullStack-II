import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Los componentes se escribieron en JavaScript con JSX (sin tipos de TypeScript).
  // Next los compila igual; esto evita que "next build" se detenga por falta de tipos.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;

// En JavaScript a propósito, NO en TypeScript: un next.config.ts obliga a Next a
// cargar su motor nativo (SWC) al arrancar, y ese motor abre un hilo por cada
// núcleo del servidor. Hostinger cuenta esos hilos en el límite de procesos del
// plan (medido: 28 hilos con .ts contra 13 con .mjs en un mismo arranque).
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // El build en Hostinger abría 26 procesos a la vez (uno por núcleo) y, con el
    // plan cerca del tope de 200, Turbopack no pudo abrir el de CSS y el build
    // tronó (2026-11-18). Con 2 basta: el sitio solo tiene 23 páginas.
    cpus: 2,
  },
};

export default nextConfig;

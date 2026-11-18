// En JavaScript a propósito, NO en TypeScript: un next.config.ts obliga a Next a
// cargar su motor nativo (SWC) al arrancar, y ese motor abre un hilo por cada
// núcleo del servidor. Hostinger cuenta esos hilos en el límite de procesos del
// plan (medido: 28 hilos con .ts contra 13 con .mjs en un mismo arranque).
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

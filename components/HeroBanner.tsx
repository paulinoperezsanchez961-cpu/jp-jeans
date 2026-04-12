'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const BASE_URL = 'https://api.jpjeansvip.com/api';
// 🚨 Dominio puro para las imágenes estáticas de la carpeta public
const API_DOMAIN = 'https://api.jpjeansvip.com'; 

// ==============================================================================
// 🧠 RED DE SEGURIDAD (Fallbacks)
// Garantiza que la web NUNCA se vea vacía o negra mientras el servidor responde
// o si el administrador olvidó subir alguna de las 3 diapositivas.
// ==============================================================================
const defaultSlides = [
  { 
    id: 1, 
    imgDesktop: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=2500&auto=format&fit=crop',
    imgMobile: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=1000&h=1400&auto=format&fit=crop'
  },
  { 
    id: 2, 
    imgDesktop: 'https://images.unsplash.com/photo-1511130558090-00af810c2111?q=80&w=2500&auto=format&fit=crop',
    imgMobile: 'https://images.unsplash.com/photo-1511130558090-00af810c2111?q=80&w=1000&h=1400&auto=format&fit=crop'
  },
  { 
    id: 3, 
    imgDesktop: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2500&auto=format&fit=crop',
    imgMobile: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&h=1400&auto=format&fit=crop'
  }
];

export default function HeroBanner() {
  const [slides, setSlides] = useState<any[]>(defaultSlides);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // 🧠 DETECTOR MÁGICO: ¿Estamos en el simulador del Admin o en la web real?
    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
    
    fetch(`${BASE_URL}/web/storefront${isPreview ? '?preview=true' : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.exito && data.banners) {
          const b = data.banners;
          
          // 🚨 LÓGICA AUTO-SANADORA DE URLS (Tu Solución Nativa)
          const getImg = (path: string | undefined, fallback: string) => {
            if (!path || path.trim() === '') return fallback;
            if (path.startsWith('http')) return path;
            
            // Limpiamos cualquier rastro de código sucio de intentos anteriores
            let cleanPath = path.replace('/api/uploads/', '/uploads/').replace('/api/media/', '/uploads/');
            
            // Si tiene el ?f= de Nginx, lo cortamos para que quede solo /uploads/nombre.jpg
            if (cleanPath.includes('?f=')) {
                cleanPath = `/uploads/${cleanPath.split('?f=')[1]}`;
            }
            
            cleanPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
            return `${API_DOMAIN}${cleanPath}`;
          };
          
          setSlides([
            { 
              id: 1, 
              imgDesktop: getImg(b.hero_1?.d, defaultSlides[0].imgDesktop), 
              imgMobile: getImg(b.hero_1?.m, defaultSlides[0].imgMobile) 
            },
            { 
              id: 2, 
              imgDesktop: getImg(b.hero_2?.d, defaultSlides[1].imgDesktop), 
              imgMobile: getImg(b.hero_2?.m, defaultSlides[1].imgMobile) 
            },
            { 
              id: 3, 
              imgDesktop: getImg(b.hero_3?.d, defaultSlides[2].imgDesktop), 
              imgMobile: getImg(b.hero_3?.m, defaultSlides[2].imgMobile) 
            }
          ]);
        }
      })
      .catch(console.error);
  }, []);

  // Rota cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    // En celular ocupará el 85% de la pantalla (h-[85vh]) para dar un formato retrato imponente
    <div className="w-full relative h-[85vh] md:h-screen bg-black overflow-hidden">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* IMAGEN MÓVIL (Se oculta en PC) */}
          <div 
            className="md:hidden absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${slides[current].imgMobile})` }} 
          />
          {/* IMAGEN PC (Se oculta en Móvil) */}
          <div 
            className="hidden md:block absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${slides[current].imgDesktop})` }} 
          />
          
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* TEXTOS (Unificados para Móvil y PC en la esquina inferior izquierda) */}
      <div className="absolute bottom-8 left-6 md:bottom-16 md:left-12 flex flex-col items-start z-10">
        <p className="font-sans font-light text-[10px] md:text-base tracking-[0.15em] text-white uppercase mb-3 md:mb-4 drop-shadow-md">
          Descubre nuestras colecciones
        </p>
        {/* En móvil los ponemos apilados, en PC uno al lado del otro */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <Link 
            href="/mujer" 
            className="font-sans font-thin text-[11px] md:text-sm tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5 w-fit"
          >
            Colección Mujer
          </Link>
          <Link 
            href="/hombre" 
            className="font-sans font-thin text-[11px] md:text-sm tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5 w-fit"
          >
            Colección Hombre
          </Link>
        </div>
      </div>

    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const BASE_URL = 'https://api.jpjeansvip.com/api';
// 🚨 Dominio puro para las imágenes estáticas de la carpeta public
const API_DOMAIN = 'https://api.jpjeansvip.com'; 

// ==============================================================================
// 🧠 RED DE SEGURIDAD (Fallbacks)
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 🧠 DETECTOR MÁGICO
    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
    
    fetch(`${BASE_URL}/web/storefront${isPreview ? '?preview=true' : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.exito && data.banners) {
          const b = data.banners;
          
          // 🚨 LÓGICA AUTO-SANADORA DE URLS
          const getImg = (path: string | undefined, fallback: string) => {
            if (!path || path.trim() === '') return fallback;
            if (path.startsWith('http')) return path;
            
            let cleanPath = path.replace('/api/uploads/', '/uploads/').replace('/api/media/', '/uploads/');
            if (cleanPath.includes('?f=')) { cleanPath = `/uploads/${cleanPath.split('?f=')[1]}`; }
            cleanPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
            return `${API_DOMAIN}${cleanPath}`;
          };
          
          setSlides([
            { id: 1, imgDesktop: getImg(b.hero_1?.d, defaultSlides[0].imgDesktop), imgMobile: getImg(b.hero_1?.m, defaultSlides[0].imgMobile) },
            { id: 2, imgDesktop: getImg(b.hero_2?.d, defaultSlides[1].imgDesktop), imgMobile: getImg(b.hero_2?.m, defaultSlides[1].imgMobile) },
            { id: 3, imgDesktop: getImg(b.hero_3?.d, defaultSlides[2].imgDesktop), imgMobile: getImg(b.hero_3?.m, defaultSlides[2].imgMobile) }
          ]);
        }
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        setIsLoaded(true);
      });
  }, []);

  // ⏱️ Rota exactamente cada 3 segundos de manera automática
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    // 📐 PROPORCIÓN MATEMÁTICA PERFECTA (Zero-Crop): aspect-[9/16] en móvil, aspect-[16/9] en PC
    <div className="w-full relative aspect-[9/16] md:aspect-[16/9] bg-black overflow-hidden">
      
      {/* 🎞️ SIN MODE="WAIT": Permite que las imágenes se fundan suavemente entre sí (Crossfade) */}
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
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
          
          {/* GRADIENTE DE LEGIBILIDAD: Solo oscurece la parte de abajo para que el texto resalte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* TEXTOS Y BOTONES (Animados al cargar la página) */}
      {isLoaded && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="absolute bottom-8 left-6 md:bottom-16 md:left-12 flex flex-col items-start z-10"
        >
          <p className="font-sans font-light text-[10px] md:text-base tracking-[0.15em] text-white uppercase mb-4 drop-shadow-md">
            Descubre nuestras colecciones
          </p>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-8">
            <Link 
              href="/mujer" 
              className="font-sans font-thin text-[11px] md:text-sm tracking-[0.1em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 hover:border-white pb-1 w-fit"
            >
              Colección Mujer
            </Link>
            <Link 
              href="/hombre" 
              className="font-sans font-thin text-[11px] md:text-sm tracking-[0.1em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 hover:border-white pb-1 w-fit"
            >
              Colección Hombre
            </Link>
          </div>
        </motion.div>
      )}

    </div>
  );
}
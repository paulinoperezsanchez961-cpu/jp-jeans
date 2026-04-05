'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Usamos dos encuadres de la misma foto: Panorámica para PC, Retrato para Móvil
const slides = [
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
    imgDesktop: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=2500&auto=format&fit=crop',
    imgMobile: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=1000&h=1400&auto=format&fit=crop'
  }
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1)), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // En celular ocupará el 85% de la pantalla (h-[85vh]) para dar formato retrato imponente
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
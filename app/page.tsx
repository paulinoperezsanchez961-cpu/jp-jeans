'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import HeroBanner from "@/components/HeroBanner";
import Footer from "@/components/Footer";
import { SignUpButton } from "@clerk/nextjs";

const BASE_URL = 'https://api.jpjeansvip.com/api';

// ==============================================================================
// 🧠 IMÁGENES DE RESPALDO (Fallbacks por si apenas está cargando el servidor)
// ==============================================================================
const defaultImgs = {
  hombre: {
    d: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1600&auto=format&fit=crop',
    m: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&h=1400&auto=format&fit=crop'
  },
  mujer: {
    d: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
    m: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&h=1400&auto=format&fit=crop'
  },
  nina: {
    d: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1200&auto=format&fit=crop',
    m: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&h=1200&auto=format&fit=crop'
  },
  nino: {
    d: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&auto=format&fit=crop',
    m: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&h=1200&auto=format&fit=crop'
  },
  rebajas: {
    d: 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=2000&auto=format&fit=crop',
    m: 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=1000&h=1400&auto=format&fit=crop'
  }
};

const defaultCarrusel = [
  'https://images.unsplash.com/photo-1550614000-4b95dd2475ec?q=80&w=1200', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200', 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=1200',
  'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=1200', 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200'
];

export default function Home() {
  // ==============================================================================
  // ⚡ ESTADOS DINÁMICOS CONECTADOS AL CEREBRO
  // ==============================================================================
  const [imgs, setImgs] = useState(defaultImgs);
  const [images, setImages] = useState(defaultCarrusel);
  const [showPromo, setShowPromo] = useState(false);

  // ==============================================================================
  // 🧠 CONEXIÓN A HOSTINGER (Se ejecuta al entrar a la página)
  // ==============================================================================
  useEffect(() => {
    // Detectamos si el Jefe está viendo la página desde el Admin
    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
    
    fetch(`${BASE_URL}/web/storefront${isPreview ? '?preview=true' : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.exito && data.banners) {
          const b = data.banners;
          // Función para convertir la ruta de tu servidor en URL completa
          const getImg = (path: string, fallback: string) => path ? (path.startsWith('http') ? path : BASE_URL.replace('/api', '') + path) : fallback;
          
          setImgs(prev => ({
            hombre: { d: getImg(b.home_hombre?.d, prev.hombre.d), m: getImg(b.home_hombre?.m, prev.hombre.m) },
            mujer: { d: getImg(b.home_mujer?.d, prev.mujer.d), m: getImg(b.home_mujer?.m, prev.mujer.m) },
            nina: { d: getImg(b.home_nina?.d, prev.nina.d), m: getImg(b.home_nina?.m, prev.nina.m) },
            nino: { d: getImg(b.home_nino?.d, prev.nino.d), m: getImg(b.home_nino?.m, prev.nino.m) },
            rebajas: { d: getImg(b.home_rebajas?.d, prev.rebajas.d), m: getImg(b.home_rebajas?.m, prev.rebajas.m) }
          }));

          // Verificamos si en el Admin configuraste imágenes para el carrusel vertical
          const arrDinamico = [
            getImg(b.c_vert_1?.d, ''), getImg(b.c_vert_2?.d, ''), getImg(b.c_vert_3?.d, ''),
            getImg(b.c_vert_4?.d, ''), getImg(b.c_vert_5?.d, ''), getImg(b.c_vert_6?.d, '')
          ].filter(Boolean);

          if (arrDinamico.length > 0) {
            setImages(arrDinamico);
          }
        }
      })
      .catch(console.error);
  }, []);

  // Parallax Configurado: De arriba hacia abajo hasta descansar en la esquina
  const refNovedades = useRef(null);
  const { scrollYProgress: scrollNovedades } = useScroll({ target: refNovedades, offset: ["start center", "end end"] });
  const yNovedades = useTransform(scrollNovedades, [0, 1], ["-50vh", "0vh"]); 

  const refKids = useRef(null);
  const { scrollYProgress: scrollKids } = useScroll({ target: refKids, offset: ["start center", "end end"] });
  const yKids = useTransform(scrollKids, [0, 1], ["-50vh", "0vh"]);

  useEffect(() => {
    // Temporizador del carrusel (Intacto)
    const timer = setInterval(() => {
      setImages((prev) => [...prev.slice(1), prev[0]]);
    }, 3000);
    
    // LÓGICA DEL POPUP: Mostrar después de 3 segundos si no lo ha cerrado antes (Intacto)
    const hasSeenPromo = localStorage.getItem('jpjeans_promo_cerrada');
    if (!hasSeenPromo) {
      const promoTimer = setTimeout(() => setShowPromo(true), 3000);
      return () => {
        clearInterval(timer);
        clearTimeout(promoTimer);
      };
    }
    
    return () => clearInterval(timer);
  }, []);

  // Función para cerrar el popup y no molestar más (Intacto)
  const cerrarPromo = () => {
    setShowPromo(false);
    localStorage.setItem('jpjeans_promo_cerrada', 'true');
  };

  return (
    <main className="bg-black min-h-screen w-full overflow-hidden text-white relative">
      
      {/* ============================================================================== */}
      {/* POPUP DE 30% DE DESCUENTO (Elegante y no estorboso) */}
      {/* ============================================================================== */}
      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[120] w-[calc(100%-3rem)] md:w-[340px] bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl"
          >
            {/* Botón Cerrar */}
            <button onClick={cerrarPromo} className="absolute top-3 right-4 text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h3 className="font-serif text-lg tracking-[0.15em] uppercase text-white mb-2">JP Jeans Club</h3>
            <p className="text-gray-400 text-[11px] tracking-widest uppercase leading-relaxed mb-6">
              Regístrate ahora y obtén un <span className="text-white font-bold">30% de descuento</span> en tu primera compra.
            </p>
            
            <SignUpButton mode="modal">
              <button onClick={cerrarPromo} className="w-full bg-white text-black py-3 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-200 transition-colors">
                Obtener 30% OFF
              </button>
            </SignUpButton>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ============================================================================== */}

      {/* 1. HERO PRINCIPAL */}
      <div className="w-full relative mt-16 md:mt-0 border-b border-white/10">
        <HeroBanner />
      </div>

      {/* 2. NOVEDADES HOMBRE Y MUJER */}
      <section ref={refNovedades} className="w-full flex flex-col md:flex-row h-auto md:h-[140vh] border-b border-white/10 relative">
        
        {/* HOMBRE */}
        <div className="w-full h-[75vh] md:h-full md:w-1/2 relative overflow-hidden group border-b md:border-b-0 md:border-r border-white/10 bg-black">
          <div className="hidden md:block absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${imgs.hombre.d})` }} />
          <div className="md:hidden absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${imgs.hombre.m})` }} />
          <div className="absolute inset-0 bg-black/20 md:bg-gradient-to-t md:from-black/80 md:via-black/20 md:to-black/40" />
          
          <div className="absolute bottom-6 left-6 z-10 md:hidden flex flex-col items-start">
            <p className="font-sans font-light text-[11px] tracking-[0.15em] text-white uppercase mb-2 drop-shadow-md">Novedades</p>
            <Link href="/novedades?genero=hombre" className="font-sans font-thin text-[11px] tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5">Novedades Hombre</Link>
          </div>

          <motion.div style={{ y: yNovedades }} className="hidden md:flex absolute bottom-12 left-8 lg:bottom-16 lg:left-12 flex-col items-start z-10">
             <p className="font-sans font-light text-sm lg:text-base tracking-[0.15em] text-white uppercase mb-4 drop-shadow-md">Novedades</p>
             <Link href="/novedades?genero=hombre" className="font-sans font-thin text-xs lg:text-sm tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5">Novedades Hombre</Link>
          </motion.div>
        </div>

        {/* MUJER */}
        <div className="w-full h-[75vh] md:h-full md:w-1/2 relative overflow-hidden group bg-black">
          <div className="hidden md:block absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${imgs.mujer.d})` }} />
          <div className="md:hidden absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${imgs.mujer.m})` }} />
          <div className="absolute inset-0 bg-black/20 md:bg-gradient-to-t md:from-black/80 md:via-black/20 md:to-black/40" />
          
          <div className="absolute bottom-6 left-6 z-10 md:hidden flex flex-col items-start">
            <p className="font-sans font-light text-[11px] tracking-[0.15em] text-white uppercase mb-2 drop-shadow-md">Novedades</p>
            <Link href="/novedades?genero=mujer" className="font-sans font-thin text-[11px] tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5">Novedades Mujer</Link>
          </div>

          <motion.div style={{ y: yNovedades }} className="hidden md:flex absolute bottom-12 left-8 lg:bottom-16 lg:left-12 flex-col items-start z-10">
             <p className="font-sans font-light text-sm lg:text-base tracking-[0.15em] text-white uppercase mb-4 drop-shadow-md">Novedades</p>
             <Link href="/novedades?genero=mujer" className="font-sans font-thin text-xs lg:text-sm tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5">Novedades Mujer</Link>
          </motion.div>
        </div>
      </section>

      {/* 3. CARRUSEL */}
      <section className="w-full h-[70vh] md:h-screen bg-black flex flex-col justify-center border-b border-white/10 relative overflow-hidden">
        <div className="w-full h-full relative flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {images.slice(0, 3).map((img, i) => {
              let positionClass = i === 0 ? "left-0 -translate-x-1/2 md:-translate-x-1/3" : i === 1 ? "left-1/2 -translate-x-1/2 shadow-[0_0_50px_rgba(255,255,255,0.1)]" : "right-0 translate-x-1/2 md:translate-x-1/3";
              return (
                <motion.div
                  key={img}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === 1 ? 1 : 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`absolute w-[75vw] md:w-[40vw] aspect-[2/3] md:aspect-[3/4] ${positionClass}`}
                  style={{ zIndex: i === 1 ? 20 : 10 }}
                >
                  <div className="w-full h-full bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${img})` }} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. SPLIT SCREEN: NIÑA Y NIÑO */}
      <section ref={refKids} className="w-full flex flex-col md:flex-row h-auto md:h-[140vh] border-b border-white/10 relative">
        
        {/* NIÑA */}
        <div className="w-full h-[75vh] md:h-full md:w-1/2 relative overflow-hidden group border-b md:border-b-0 md:border-r border-white/10 bg-black">
          <div className="hidden md:block absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${imgs.nina.d})` }} />
          <div className="md:hidden absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${imgs.nina.m})` }} />
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="absolute bottom-6 left-6 z-10 md:hidden flex flex-col items-start">
            <p className="font-sans font-light text-[11px] tracking-[0.15em] text-white uppercase mb-2 drop-shadow-md">Para Ella</p>
            <Link href="/nina" className="font-sans font-thin text-[11px] tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5">Colección Niña</Link>
          </div>

          <motion.div style={{ y: yKids }} className="hidden md:flex absolute bottom-12 left-8 lg:bottom-16 lg:left-12 flex-col items-start z-10">
             <p className="font-sans font-light text-sm lg:text-base tracking-[0.15em] text-white uppercase mb-4 drop-shadow-md">Para Ella</p>
             <Link href="/nina" className="font-sans font-thin text-xs lg:text-sm tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5">Colección Niña</Link>
          </motion.div>
        </div>

        {/* NIÑO */}
        <div className="w-full h-[75vh] md:h-full md:w-1/2 relative overflow-hidden group bg-black">
          <div className="hidden md:block absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${imgs.nino.d})` }} />
          <div className="md:hidden absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${imgs.nino.m})` }} />
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="absolute bottom-6 left-6 z-10 md:hidden flex flex-col items-start">
            <p className="font-sans font-light text-[11px] tracking-[0.15em] text-white uppercase mb-2 drop-shadow-md">Para Él</p>
            <Link href="/nino" className="font-sans font-thin text-[11px] tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5">Colección Niño</Link>
          </div>

          <motion.div style={{ y: yKids }} className="hidden md:flex absolute bottom-12 left-8 lg:bottom-16 lg:left-12 flex-col items-start z-10">
             <p className="font-sans font-light text-sm lg:text-base tracking-[0.15em] text-white uppercase mb-4 drop-shadow-md">Para Él</p>
             <Link href="/nino" className="font-sans font-thin text-xs lg:text-sm tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5">Colección Niño</Link>
          </motion.div>
        </div>
      </section>

      {/* 5. REBAJAS COMPLETO */}
      <section className="w-full relative h-[85vh] md:h-screen bg-black overflow-hidden border-b border-white/10">
        
        <div className="hidden md:block absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: `url(${imgs.rebajas.d})` }} />
        <div className="md:hidden absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imgs.rebajas.m})` }} />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute bottom-6 left-6 z-10 md:hidden flex flex-col items-start">
          <p className="font-sans font-light text-[11px] tracking-[0.15em] text-white uppercase mb-2 drop-shadow-md">La Colección Zero</p>
          <Link href="/rebajas" className="font-sans font-thin text-[11px] tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5">Descubrir Rebajas</Link>
        </div>

        <div className="hidden md:flex absolute bottom-12 left-8 lg:bottom-16 lg:left-12 flex-col items-start z-10">
          <p className="font-sans font-light text-sm lg:text-base tracking-[0.15em] text-white uppercase mb-4 drop-shadow-md">La Colección Zero</p>
          <Link href="/rebajas" className="font-sans font-thin text-xs lg:text-sm tracking-[0.05em] text-white uppercase hover:text-white/70 transition-colors border-b border-white/50 pb-0.5">Descubrir Rebajas</Link>
        </div>

      </section>

      <Footer />
    </main>
  );
}
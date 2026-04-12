'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';

const BASE_URL = 'https://api.jpjeansvip.com/api';
const API_DOMAIN = 'https://api.jpjeansvip.com'; 

const defaultImgs = {
  hero: { d: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=2000', m: 'https://images.unsplash.com/photo-1516826957135-73318231cb6c?q=80&w=800' },
  jeans: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
  chamarras: 'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
  playeras: 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
  accesorios: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800&q=80'
};

const defaultTextos = {
  titulo: "La Colección Hombre",
  descripcion: "Redefiniendo el streetwear de lujo a través de siluetas estructuradas y materiales de primer nivel. Cada pieza ha sido diseñada meticulosamente para mantener la esencia pura de JP Jeans."
};

export default function HombreLandingPage() {
  const [imgs, setImgs] = useState(defaultImgs);
  const [textos, setTextos] = useState(defaultTextos);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
    fetch(`${BASE_URL}/web/storefront${isPreview ? '?preview=true' : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.exito) {
          // 1. CARGA DE IMÁGENES RESPETANDO RATIOS DE LA OFICINA
          if (data.banners) {
            const b = data.banners;
            const getImg = (p: any, f: string) => p?.d ? `${API_DOMAIN}${p.d.includes('?f=') ? `/uploads/${p.d.split('?f=')[1]}` : p.d}` : f;
            const getImgM = (p: any, f: string) => p?.m ? `${API_DOMAIN}${p.m.includes('?f=') ? `/uploads/${p.m.split('?f=')[1]}` : p.m}` : f;
            
            setImgs({
              hero: { d: getImg(b.hombre, defaultImgs.hero.d), m: getImgM(b.hombre, defaultImgs.hero.m) },
              jeans: getImg(b.h_cat_jeans, defaultImgs.jeans),
              chamarras: getImg(b.h_cat_chamarras, defaultImgs.chamarras),
              playeras: getImg(b.h_cat_playeras, defaultImgs.playeras),
              accesorios: getImg(b.h_cat_accesorios, defaultImgs.accesorios)
            });
          }
          
          // 2. CARGA DE TEXTOS DINÁMICOS DESDE EL ADMIN
          if (data.banners?.textos_hombre) {
             setTextos({
                titulo: data.banners.textos_hombre.titulo || defaultTextos.titulo,
                descripcion: data.banners.textos_hombre.descripcion || defaultTextos.descripcion
             });
          }
        }
        setIsLoaded(true);
      }).catch(() => setIsLoaded(true));
  }, []);

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">

      {/* 📐 HERO PRINCIPAL HOMBRE: 9:16 Móvil / 16:9 PC - CERO RECORTES */}
      <section className="w-full relative aspect-[9/16] md:aspect-[16/9] bg-black overflow-hidden">
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0">
            {/* Imagen Móvil */}
            <img 
              src={imgs.hero.m} 
              alt="Colección Hombre" 
              className="md:hidden w-full h-full object-cover" 
            />
            {/* Imagen PC */}
            <img 
              src={imgs.hero.d} 
              alt="Colección Hombre" 
              className="hidden md:block w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-12 left-6 md:bottom-16 md:left-12 text-white z-10">
          <h1 className="text-2xl md:text-4xl tracking-[0.3em] uppercase font-light drop-shadow-lg">Hombre</h1>
        </div>
      </section>

      {/* 📐 CATEGORÍAS: 2:3 - SIMETRÍA TOTAL */}
      <section className="w-full px-4 md:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/hombre/jeans', label: 'Jeans', img: imgs.jeans },
            { href: '/hombre/chamarras', label: 'Chamarras', img: imgs.chamarras },
            { href: '/hombre/playeras', label: 'Playeras', img: imgs.playeras },
            { href: '/hombre/accesorios', label: 'Accesorios', img: imgs.accesorios }
          ].map((item, i) => (
            <Link key={i} href={item.href} className="group block">
              <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100">
                <motion.img 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.5 }} 
                  src={item.img} 
                  alt={item.label} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-6 left-4 md:bottom-8 md:left-6 z-20">
                  <h3 className="text-white text-xs md:text-sm tracking-[0.25em] uppercase font-bold drop-shadow-lg">{item.label}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TEXTOS DINÁMICOS */}
      <section className="w-full py-20 px-6 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-black text-xl md:text-2xl tracking-[0.3em] uppercase font-light mb-6">
            {textos.titulo}
          </h2>
          <p className="text-black text-xs md:text-sm tracking-[0.2em] leading-loose uppercase">
            {textos.descripcion}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
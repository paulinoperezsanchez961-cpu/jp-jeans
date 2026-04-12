'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';

const BASE_URL = 'https://api.jpjeansvip.com/api';
const API_DOMAIN = 'https://api.jpjeansvip.com'; 

// Imágenes por defecto mientras responde el servidor
const defaultImgs = {
  hero: { d: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000', m: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800' },
  jeans: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800',
  vestidos: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
  chamarras: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800',
  accesorios: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800'
};

// Textos por defecto por si el servidor tarda o no hay nada guardado
const defaultTextos = {
  titulo: "La Colección Mujer",
  descripcion: "Redefiniendo el streetwear de lujo a través de siluetas estructuradas y materiales de primer nivel. Cada pieza ha sido diseñada meticulosamente para mantener la esencia pura de JP Jeans. Exclusividad y corte perfecto en cada detalle."
};

export default function MujerLandingPage() {
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
              hero: { d: getImg(b.mujer, defaultImgs.hero.d), m: getImgM(b.mujer, defaultImgs.hero.m) },
              jeans: getImg(b.m_cat_jeans, defaultImgs.jeans),
              vestidos: getImg(b.m_cat_vestidos, defaultImgs.vestidos),
              chamarras: getImg(b.m_cat_chamarras, defaultImgs.chamarras),
              accesorios: getImg(b.m_cat_accesorios, defaultImgs.accesorios)
            });
          }
          
          // 2. CARGA DE TEXTOS DINÁMICOS DESDE EL ADMIN
          if (data.banners?.textos_mujer) {
             setTextos({
                titulo: data.banners.textos_mujer.titulo || defaultTextos.titulo,
                descripcion: data.banners.textos_mujer.descripcion || defaultTextos.descripcion
             });
          }
        }
        setIsLoaded(true);
      }).catch(() => setIsLoaded(true));
  }, []);

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">

      {/* 📐 HERO PRINCIPAL MUJER: 9:16 Móvil / 16:9 PC - CERO RECORTES */}
      <section className="w-full relative aspect-[9/16] md:aspect-[16/9] bg-black overflow-hidden">
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0">
            {/* Imagen Móvil */}
            <img 
              src={imgs.hero.m} 
              alt="Colección Mujer" 
              className="md:hidden w-full h-full object-cover" 
            />
            {/* Imagen PC */}
            <img 
              src={imgs.hero.d} 
              alt="Colección Mujer" 
              className="hidden md:block w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-12 left-6 md:bottom-16 md:left-12 text-white z-10">
          <h1 className="text-2xl md:text-4xl tracking-[0.3em] uppercase font-light drop-shadow-lg">
            Mujer
          </h1>
        </div>
      </section>

      {/* 📐 CATEGORÍAS: 2:3 - SIMETRÍA TOTAL */}
      <section className="w-full px-4 md:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/mujer/jeans', label: 'Jeans', img: imgs.jeans },
            { href: '/mujer/vestidos', label: 'Vestidos y Faldas', img: imgs.vestidos },
            { href: '/mujer/chamarras', label: 'Chamarras', img: imgs.chamarras },
            { href: '/mujer/accesorios', label: 'Accesorios', img: imgs.accesorios }
          ].map((item, i) => (
            <Link key={i} href={item.href} className="group block">
              <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100">
                
                {/* 🚨 IMAGEN ANIMADA SIN RECORTES INESPERADOS */}
                <motion.img 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.5 }} 
                  src={item.img} 
                  alt={item.label} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                {/* SOMBRAS Y DEGRADADOS PARA LEGIBILIDAD */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
                
                <div className="absolute bottom-6 left-4 md:bottom-8 md:left-6 z-20">
                  <h3 className="text-white text-xs md:text-sm tracking-[0.25em] uppercase font-bold drop-shadow-lg">
                    {item.label}
                  </h3>
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
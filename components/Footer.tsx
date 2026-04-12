'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const BASE_URL = 'https://api.jpjeansvip.com/api';

const defaultFooterImages = [
  'https://images.unsplash.com/photo-1618886487325-f82764b6ba37?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550614000-4b95dd2475ec?q=80&w=1600&auto=format&fit=crop'
];

export default function Footer() {
  const [images, setImages] = useState(defaultFooterImages);

  useEffect(() => {
    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
    
    fetch(`${BASE_URL}/web/storefront${isPreview ? '?preview=true' : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.exito && data.banners) {
          const b = data.banners;
          
          // 🚨 EL AUTO-SANADOR PARA EL FOOTER
          const getImg = (path: string | undefined) => {
            if (!path || path.trim() === '') return null;
            if (path.startsWith('http')) return path;
            const filename = path.includes('?f=') ? path.split('?f=')[1] : path.split('/').pop();
            return `${BASE_URL.replace('/api', '')}/api/imagen?f=${filename}`;
          };
          
          const dynamicImages = Array.isArray(b.footer_list) 
            ? b.footer_list.map((img: any) => getImg(img.d)).filter(Boolean) as string[]
            : [];

          if (dynamicImages.length > 0) {
            let finalFooter = [...dynamicImages];
            while (finalFooter.length < 4) { finalFooter = [...finalFooter, ...dynamicImages]; }
            setImages(finalFooter);
          }
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setImages((prev) => [...prev.slice(1), prev[0]]), 3000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-black text-white pt-16 pb-12 border-t border-white/10 w-full overflow-hidden">
      <div className="w-full h-[30vh] md:h-[60vh] relative flex items-center justify-center overflow-hidden mb-16 md:mb-24">
        <AnimatePresence mode="popLayout">
          {images.slice(0, 3).map((img, i) => {
            let positionClass = i === 0 ? "left-0 -translate-x-1/2 md:-translate-x-1/3" : i === 1 ? "left-1/2 -translate-x-1/2 shadow-[0_0_50px_rgba(255,255,255,0.1)]" : "right-0 translate-x-1/2 md:translate-x-1/3";
            return (
              <motion.div key={`${img}-${i}`} layout initial={{ opacity: 0 }} animate={{ opacity: i === 1 ? 1 : 0.4 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} className={`absolute w-[80vw] md:w-[45vw] aspect-video ${positionClass}`} style={{ zIndex: i === 1 ? 20 : 10 }}>
                <div className="w-full h-full bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${img})` }} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-10 mb-12">
          <div className="flex space-x-8 w-full md:w-1/3 justify-center md:justify-start mb-8 md:mb-0">
            <a href="#" className="opacity-70 hover:opacity-100 transition-opacity"><svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg></a>
            <a href="#" className="opacity-70 hover:opacity-100 transition-opacity"><svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a href="#" className="opacity-70 hover:opacity-100 transition-opacity"><svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg></a>
          </div>
          <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0"><Link href="/" className="transition-opacity hover:opacity-70"><img src="/JpJeans%20Blanco.png" alt="JP Jeans Logo" className="h-10 md:h-14 object-contain" /></Link></div>
          <div className="hidden md:block md:w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center md:text-left mb-16">
          <div className="space-y-6"><h4 className="font-sans font-medium text-xs tracking-[0.2em] uppercase opacity-90">Atención al Cliente</h4><ul className="space-y-3"><li><Link href="/informacion/contacto" className="font-sans font-light text-[11px] md:text-xs tracking-widest text-white/60 hover:text-white transition-colors">Contacto</Link></li><li><Link href="/informacion/envios" className="font-sans font-light text-[11px] md:text-xs tracking-widest text-white/60 hover:text-white transition-colors">Envíos y Entregas</Link></li><li><Link href="/informacion/devoluciones" className="font-sans font-light text-[11px] md:text-xs tracking-widest text-white/60 hover:text-white transition-colors">Devoluciones</Link></li><li><Link href="/informacion/faq" className="font-sans font-light text-[11px] md:text-xs tracking-widest text-white/60 hover:text-white transition-colors">Preguntas Frecuentes</Link></li></ul></div>
          <div className="space-y-6"><h4 className="font-sans font-medium text-xs tracking-[0.2em] uppercase opacity-90">La Empresa</h4><ul className="space-y-3"><li><Link href="/informacion/nosotros" className="font-sans font-light text-[11px] md:text-xs tracking-widest text-white/60 hover:text-white transition-colors">Sobre JP Jeans</Link></li><li><Link href="/informacion/tiendas" className="font-sans font-light text-[11px] md:text-xs tracking-widest text-white/60 hover:text-white transition-colors">Nuestras Tiendas</Link></li><li><Link href="/informacion/sustentabilidad" className="font-sans font-light text-[11px] md:text-xs tracking-widest text-white/60 hover:text-white transition-colors">Sustentabilidad</Link></li></ul></div>
          <div className="space-y-6"><h4 className="font-sans font-medium text-xs tracking-[0.2em] uppercase opacity-90">Legal</h4><ul className="space-y-3"><li><Link href="/informacion/privacidad" className="font-sans font-light text-[11px] md:text-xs tracking-widest text-white/60 hover:text-white transition-colors">Política de Privacidad</Link></li><li><Link href="/informacion/terminos" className="font-sans font-light text-[11px] md:text-xs tracking-widest text-white/60 hover:text-white transition-colors">Términos y Condiciones</Link></li><li><Link href="/informacion/cookies" className="font-sans font-light text-[11px] md:text-xs tracking-widest text-white/60 hover:text-white transition-colors">Política de Cookies</Link></li></ul></div>
        </div>
        <div className="w-full pt-8 text-center flex flex-col md:flex-row justify-between items-center opacity-40 gap-4 border-t border-white/10">
          <p className="font-sans font-light text-[9px] md:text-[10px] tracking-widest uppercase">© {new Date().getFullYear()} JP JEANS. TODOS LOS DERECHOS RESERVADOS.</p>
          <p className="font-sans font-light text-[9px] md:text-[10px] tracking-widest uppercase">DISEÑADO EN TLAXCALA, MÉXICO</p>
        </div>
      </div>
    </footer>
  );
}
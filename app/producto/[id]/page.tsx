'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

// Importaciones de Swiper para el carrusel táctil en celular
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';

const productoSimulado = {
  id: "JD-001",
  nombre: "Jeans Dark Premium",
  precioTexto: "$2,499.00 MXN",
  precioNumerico: 2499.00,
  descripcion: "Denim premium negro absoluto. Corte recto clásico con detalles de desgaste manual. Herrajes oscurecidos y costuras de alta tensión para una durabilidad absoluta. Diseñado en Tlaxcala.",
  imagenes: [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200", 
    "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=1200", 
    "https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=1200", 
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200", 
    "https://images.unsplash.com/photo-1516826957135-73318231cb6c?q=80&w=1600"  
  ],
  tallas: ["28x30", "30x30", "32x32", "34x32", "36x34"]
};

// Array simulado para la sección "También te puede interesar"
const productosRelacionados = [
  { id: 'J-02', nombre: 'Cargo Parachute Black', precio: 2799, img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800' },
  { id: 'J-03', nombre: 'Slim Fit Essential Ice', precio: 2199, img: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800' },
  { id: 'J-04', nombre: 'Recto Classic Raw', precio: 2299, img: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800' },
  { id: 'J-05', nombre: 'Baggy Washed Grey', precio: 2599, img: 'https://images.unsplash.com/photo-1516826957135-73318231cb6c?q=80&w=800' }
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
  const [errorTalla, setErrorTalla] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const nextLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % productoSimulado.imagenes.length);
    }
  };

  const prevLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + productoSimulado.imagenes.length) % productoSimulado.imagenes.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % productoSimulado.imagenes.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + productoSimulado.imagenes.length) % productoSimulado.imagenes.length);
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const handleAddToCart = () => {
    if (!tallaSeleccionada) {
      setErrorTalla(true);
      return;
    }
    setErrorTalla(false);
    
    addToCart({
      id: productoSimulado.id,
      nombre: productoSimulado.nombre,
      precio: productoSimulado.precioNumerico,
      talla: tallaSeleccionada,
      img: productoSimulado.imagenes[0],
      cantidad: 1
    });
  };

  return (
    <main className="bg-black min-h-screen w-full text-white pt-16 md:pt-24 pb-20">
      <div className="w-full max-w-[1450px] mx-auto px-0 md:px-8 flex flex-col md:flex-row gap-6 md:gap-12">
        
        {/* COLUMNA IZQUIERDA: IMÁGENES */}
        <div className="w-full md:w-[65%]">

          {/* VISTA MÓVIL: Swiper (Deslizable y más largo) */}
          <div className="md:hidden w-full relative">
            <Swiper
              pagination={{ clickable: true, dynamicBullets: true }}
              modules={[Pagination]}
              className="w-full aspect-[2/3] bg-[#111]" // aspect-[2/3] hace la imagen más alta
            >
              {productoSimulado.imagenes.map((img, index) => (
                <SwiperSlide key={index} onClick={() => setLightboxIndex(index)}>
                  <img 
                    src={img} 
                    alt={`${productoSimulado.nombre} ${index + 1}`} 
                    className="w-full h-full object-cover object-top cursor-zoom-in"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* VISTA PC: Cuadrícula original (TODAS verticales aspect-[2/3]) */}
          <div className="hidden md:grid md:grid-cols-2 gap-2 md:gap-4">
            {productoSimulado.imagenes.map((img, index) => (
              <div 
                key={index} 
                onClick={() => setLightboxIndex(index)}
                // Eliminamos col-span-2. Ahora todas son siempre col-span-1 y aspect-[2/3]
                className="relative overflow-hidden group bg-white/5 cursor-zoom-in col-span-1 aspect-[2/3]"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-top transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${img})` }}
                />
              </div>
            ))}
          </div>

        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN ANCLADA */}
        <div className="w-full md:w-[35%] relative mt-2 md:mt-0 px-4 md:px-0">
          <div className="md:sticky md:top-32 space-y-8">
            
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-4 hidden md:block">Nuevas Llegadas / Hombre</p>
              
              <div className="flex justify-between items-start gap-4 mb-4">
                <h1 className="font-serif text-3xl md:text-5xl uppercase tracking-widest leading-tight">
                  {productoSimulado.nombre}
                </h1>
                
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="shrink-0 mt-2 text-white hover:opacity-70 transition-opacity"
                >
                  <svg className={`w-7 h-7 md:w-8 md:h-8 transition-colors ${isFavorite ? 'fill-white' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <p className="font-sans text-xl opacity-90">{productoSimulado.precioTexto}</p>
            </div>

            <div className="h-px w-full bg-white/20" />

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase">Talla</span>
                <button className="text-[10px] tracking-widest uppercase opacity-50 hover:opacity-100 border-b border-white/50 pb-0.5 transition-opacity">
                  Guía de tallas
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {productoSimulado.tallas.map((talla) => (
                  <button 
                    key={talla}
                    onClick={() => {
                      setTallaSeleccionada(talla);
                      setErrorTalla(false);
                    }}
                    className={`py-3 font-sans text-xs tracking-widest uppercase transition-all border ${
                      tallaSeleccionada === talla 
                        ? 'bg-white text-black border-white' 
                        : 'bg-transparent text-white border-white/20 hover:border-white'
                    }`}
                  >
                    {talla}
                  </button>
                ))}
              </div>

              {errorTalla && (
                <p className="text-red-500 font-sans font-light text-[10px] tracking-widest uppercase mt-3">
                  * Por favor selecciona una talla antes de continuar.
                </p>
              )}
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full py-5 bg-white text-black font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/80 transition-colors"
            >
              Añadir a la bolsa
            </button>

            <div className="pt-8">
              <h3 className="font-sans text-[10px] tracking-[0.2em] uppercase mb-4 opacity-70">Detalles</h3>
              <p className="font-sans text-sm leading-relaxed opacity-70">
                {productoSimulado.descripcion}
              </p>
            </div>

            <div className="border-t border-b border-white/20 divide-y divide-white/20 mt-8">
              <button className="w-full py-5 flex justify-between items-center text-[10px] tracking-widest uppercase hover:opacity-70 transition-opacity">
                <span>Composición y Cuidados</span>
                <span className="text-lg font-light">+</span>
              </button>
              <button className="w-full py-5 flex justify-between items-center text-[10px] tracking-widest uppercase hover:opacity-70 transition-opacity">
                <span>Envíos y Devoluciones</span>
                <span className="text-lg font-light">+</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* SECCIÓN INTACTA: COMPLETAR EL LOOK (PRODUCTOS RELACIONADOS) */}
      <section className="w-full max-w-[1450px] mx-auto px-4 md:px-8 mt-24 pt-16 border-t border-white/10">
        <h3 className="font-serif text-2xl md:text-3xl tracking-[0.2em] uppercase mb-10 text-center md:text-left">
          También te puede interesar
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/20 p-px">
          {productosRelacionados.map((prod) => (
            <div key={prod.id} className="group bg-black flex flex-col relative">
              <div className="relative w-full aspect-[2/3] bg-[#111] overflow-hidden">
                <Link href={`/producto/${prod.id}`} className="absolute inset-0 z-10">
                  <img 
                    src={prod.img} 
                    alt={prod.nombre}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <button className="absolute top-3 right-3 z-20 text-white hover:text-gray-400 transition bg-black/30 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <Link href={`/producto/${prod.id}`} className="w-full text-left px-3 py-4 flex flex-col">
                <p className="text-white/60 text-[10px] tracking-widest mb-1">
                  ${prod.precio.toLocaleString('es-MX')} MXN
                </p>
                <h3 className="text-white font-medium text-[11px] md:text-xs tracking-wide uppercase">
                  {prod.nombre}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* GALERÍA EXPANDIDA A PANTALLA COMPLETA (LIGHTBOX) */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightboxIndex(null)} 
          >
            <button 
              className="absolute top-6 right-6 z-[110] p-4 text-white hover:text-white/50 transition-colors"
              onClick={() => setLightboxIndex(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <button 
              className="absolute left-4 md:left-12 z-[110] p-4 text-white hover:text-white/50 transition-colors"
              onClick={prevLightboxImage}
            >
              <svg className="w-10 h-10 md:w-14 md:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button 
              className="absolute right-4 md:right-12 z-[110] p-4 text-white hover:text-white/50 transition-colors"
              onClick={nextLightboxImage}
            >
              <svg className="w-10 h-10 md:w-14 md:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5l7 7-7 7" /></svg>
            </button>

            <div className="w-full h-full flex items-center justify-center p-4 md:p-12">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  src={productoSimulado.imagenes[lightboxIndex]}
                  alt={`Imagen expandida ${lightboxIndex + 1}`}
                  className="max-h-full max-w-full object-contain cursor-default"
                  onClick={(e) => e.stopPropagation()} 
                />
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
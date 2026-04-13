'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useParams } from 'next/navigation'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';

const BASE_URL = 'https://api.jpjeansvip.com/api';
const API_DOMAIN = 'https://api.jpjeansvip.com'; 

export default function ProductPage() {
  const { addToCart } = useCart();
  
  const params = useParams();
  const idParam = params?.id as string;
  
  const [producto, setProducto] = useState<any>(null);
  const [relacionados, setRelacionados] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
  const [errorTalla, setErrorTalla] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const getImg = (path: string | undefined, fallback: string = 'https://via.placeholder.com/400x600?text=JP+Jeans') => {
    if (!path || typeof path !== 'string' || path.trim() === '') return fallback;
    const cleanInput = path.trim();
    if (cleanInput.includes('http')) return cleanInput; 
    
    let cleanPath = cleanInput.replace('/api/uploads/', '/uploads/').replace('/api/media/', '/uploads/');
    if (cleanPath.includes('?f=')) cleanPath = '/uploads/' + cleanPath.split('?f=')[1];
    return `${API_DOMAIN}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
  };

  useEffect(() => {
    if (!idParam) return;

    fetch(`${BASE_URL}/web/catalogo`)
      .then(res => res.json())
      .then(data => {
        if (data.exito) {
          const p = data.productos.find((prod: any) => prod.id.toString() === idParam);
          
          if (p) {
            let fotosExtra = [];
            try { if (p.urls_fotos_extra) fotosExtra = JSON.parse(p.urls_fotos_extra); } catch(e){}
            const allImgs = [p.url_foto_principal, ...fotosExtra].filter(Boolean).map((img: string) => getImg(img));
            if(allImgs.length === 0) allImgs.push(getImg(''));

            const precioFinal = parseFloat(p.en_rebaja ? p.precio_rebaja : p.precio_venta);

            // 🚨 SISTEMA DE INVENTARIO INTELIGENTE (Nivel Master)
            // Extraemos el nombre para mostrarlo y la cantidad oculta para saber si está agotado
            let tallasList: any[] = [{ nombre: 'ÚNICA', stock: 1 }];
            try {
              let tallasGuardadas = p.tallas;
              if (typeof tallasGuardadas === 'string') {
                tallasGuardadas = JSON.parse(tallasGuardadas);
              }
              if (Array.isArray(tallasGuardadas) && tallasGuardadas.length > 0) {
                tallasList = tallasGuardadas.map((t: any) => {
                  if (typeof t === 'object' && t !== null) {
                    return { 
                      nombre: t.talla || t.nombre, 
                      stock: t.cantidad !== undefined ? Number(t.cantidad) : 1 
                    };
                  }
                  return { nombre: t, stock: 1 }; // Si solo viene el texto
                });
              }
            } catch (e) {
              if (typeof p.tallas === 'string' && p.tallas.trim() !== '') {
                tallasList = [{ nombre: p.tallas, stock: 1 }];
              }
            }

            setProducto({
              id: p.id,
              sku: p.sku || `JP-${p.id}`,
              nombre: p.nombre,
              precioNumerico: precioFinal,
              precioOriginal: parseFloat(p.precio_venta),
              enRebaja: p.en_rebaja,
              precioTexto: `$${precioFinal.toLocaleString('es-MX')} MXN`,
              descripcion: p.descripcion || "Prenda exclusiva JP Jeans. Corte perfecto y materiales de primera calidad.",
              imagenes: allImgs,
              tallas: tallasList, // Guardamos el objeto inteligente {nombre, stock}
              categoria: p.categoria || 'Colección'
            });

            const otros = data.productos.filter((prod: any) => prod.id.toString() !== idParam);
            const shuffled = otros.sort(() => 0.5 - Math.random()).slice(0, 4);
            const relMapeados = shuffled.map((rp: any) => ({
              id: rp.id,
              nombre: rp.nombre,
              precio: parseFloat(rp.en_rebaja ? rp.precio_rebaja : rp.precio_venta),
              img: getImg(rp.url_foto_principal)
            }));
            setRelacionados(relMapeados);
          }
        }
        setIsLoaded(true);
      }).catch(() => setIsLoaded(true));
  }, [idParam]);

  const nextLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (lightboxIndex !== null && producto) {
      setLightboxIndex((lightboxIndex + 1) % producto.imagenes.length);
    }
  };

  const prevLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (lightboxIndex !== null && producto) {
      setLightboxIndex((lightboxIndex - 1 + producto.imagenes.length) % producto.imagenes.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null || !producto) return;
      if (e.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % producto.imagenes.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + producto.imagenes.length) % producto.imagenes.length);
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, producto]);

  const handleAddToCart = () => {
    if (!producto) return;
    if (!tallaSeleccionada) {
      setErrorTalla(true);
      return;
    }
    setErrorTalla(false);
    
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precioNumerico,
      talla: tallaSeleccionada,
      img: producto.imagenes[0],
      cantidad: 1
    });
  };

  if (!isLoaded) {
    return (
      <div className="bg-black min-h-screen w-full flex items-center justify-center text-white pt-24">
        <p className="text-xs tracking-widest uppercase animate-pulse">Cargando detalles de la prenda...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center text-white pt-24 text-center px-4">
        <h1 className="text-2xl md:text-4xl tracking-widest uppercase mb-4 text-red-600">Prenda no encontrada</h1>
        <p className="text-xs tracking-widest uppercase mb-8 opacity-70">El artículo que buscas ya no está disponible o el enlace es incorrecto.</p>
        <Link href="/" className="border-b border-white pb-1 text-xs uppercase tracking-widest hover:text-gray-400 transition">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen w-full text-white pt-16 md:pt-24 pb-20">
      <div className="w-full max-w-[1450px] mx-auto px-0 md:px-8 flex flex-col md:flex-row gap-6 md:gap-12">
        
        <div className="w-full md:w-[65%]">
          <div className="md:hidden w-full relative">
            <Swiper
              pagination={{ clickable: true, dynamicBullets: true }}
              modules={[Pagination]}
              className="w-full aspect-[2/3] bg-[#111]" 
            >
              {producto.imagenes.map((img: string, index: number) => (
                <SwiperSlide key={index} onClick={() => setLightboxIndex(index)}>
                  <img 
                    src={img} 
                    alt={`${producto.nombre} ${index + 1}`} 
                    className="w-full h-full object-cover object-top cursor-zoom-in"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="hidden md:grid md:grid-cols-2 gap-2 md:gap-4">
            {producto.imagenes.map((img: string, index: number) => (
              <div 
                key={index} 
                onClick={() => setLightboxIndex(index)}
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

        <div className="w-full md:w-[35%] relative mt-2 md:mt-0 px-4 md:px-0">
          <div className="md:sticky md:top-32 space-y-8">
            
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-4 hidden md:block">
                Tienda / {producto.categoria}
              </p>
              
              <div className="flex justify-between items-start gap-4 mb-4">
                <h1 className="font-serif text-3xl md:text-5xl uppercase tracking-widest leading-tight">
                  {producto.nombre}
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

              <div className="flex items-center gap-4">
                {producto.enRebaja && (
                  <span className="font-sans text-lg opacity-50 line-through">
                    ${producto.precioOriginal.toLocaleString('es-MX')}
                  </span>
                )}
                <span className={`font-sans text-xl ${producto.enRebaja ? 'text-red-500 font-bold' : 'opacity-90'}`}>
                  {producto.precioTexto}
                </span>
              </div>
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
                {/* 🚨 AQUÍ SE DIBUJA LA TALLA Y SE BLOQUEA SI ESTÁ AGOTADA */}
                {producto.tallas.map((t: any, i: number) => {
                  const isAgotado = t.stock < 1;
                  const isSelected = tallaSeleccionada === t.nombre;
                  
                  return (
                    <button 
                      key={i}
                      disabled={isAgotado}
                      onClick={() => {
                        setTallaSeleccionada(t.nombre);
                        setErrorTalla(false);
                      }}
                      className={`py-3 font-sans text-xs tracking-widest uppercase transition-all border ${
                        isAgotado 
                          ? 'bg-transparent text-white/20 border-white/10 cursor-not-allowed line-through' // Botón tachado y bloqueado
                          : isSelected 
                          ? 'bg-white text-black border-white' 
                          : 'bg-transparent text-white border-white/20 hover:border-white'
                      }`}
                    >
                      {t.nombre}
                    </button>
                  );
                })}
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
              
              <p className="font-sans text-sm leading-relaxed opacity-70 whitespace-pre-line">
                {producto.descripcion}
              </p>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="font-mono text-[11px] tracking-[0.15em] text-white/50 uppercase">
                  IDENTIFICADOR: {producto.sku}
                </p>
              </div>
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

      {relacionados.length > 0 && (
        <section className="w-full max-w-[1450px] mx-auto px-4 md:px-8 mt-24 pt-16 border-t border-white/10">
          <h3 className="font-serif text-2xl md:text-3xl tracking-[0.2em] uppercase mb-10 text-center md:text-left">
            También te puede interesar
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/20 p-px">
            {relacionados.map((prod) => (
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
                  <h3 className="text-white font-medium text-[11px] md:text-xs tracking-wide uppercase truncate">
                    {prod.nombre}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && producto && (
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
                  src={producto.imagenes[lightboxIndex]}
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
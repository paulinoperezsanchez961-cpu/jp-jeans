'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// Importaciones de Swiper para el catálogo móvil
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';

const BASE_URL = 'https://api.jpjeansvip.com/api';
const API_DOMAIN = 'https://api.jpjeansvip.com'; 

// 🚨 BANNERS POR DEFECTO (En caso de que no haya nada en el Cerebro)
const defaultHero = {
  d: 'https://images.unsplash.com/photo-1520023814866-ab7284b23821?q=80&w=2000',
  m: 'https://images.unsplash.com/photo-1516826957135-73318231cb6c?q=80&w=800'
};

export default function NovedadesPage() {
  const [productosDb, setProductosDb] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filtroGenero, setFiltroGenero] = useState<string | null>(null);

  // 🚨 ESTADOS NUEVOS PARA SINCRONIZACIÓN
  const [heroImg, setHeroImg] = useState(defaultHero);
  const [mostrarExito, setMostrarExito] = useState(false);

  // 🧠 SANADOR DE IMÁGENES UNIVERSAL (A prueba de balas)
  const getImg = (path: string | undefined, fallback: string = 'https://via.placeholder.com/400x600?text=JP+Jeans') => {
    if (!path || typeof path !== 'string' || path.trim() === '') return fallback;
    const cleanInput = path.trim();
    if (cleanInput.includes('http')) return cleanInput; 
    let cleanPath = cleanInput.replace('/api/uploads/', '/uploads/').replace('/api/media/', '/uploads/');
    if (cleanPath.includes('?f=')) cleanPath = '/uploads/' + cleanPath.split('?f=')[1];
    return `${API_DOMAIN}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
  };

  useEffect(() => {
    // 1. LEEMOS LA URL POR SI VIENE DEL CHECKOUT EXITOSO O CON FILTRO
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('exito') === 'true') {
      setMostrarExito(true);
      // Limpiamos la URL para que no vuelva a salir si el usuario recarga la página
      window.history.replaceState({}, '', '/novedades');
      // Ocultamos el mensaje de gracias a los 8 segundos
      setTimeout(() => setMostrarExito(false), 8000);
    } else {
      const generoURL = params.get('genero');
      if (generoURL) {
        setFiltroGenero(generoURL.charAt(0).toUpperCase() + generoURL.slice(1).toLowerCase());
      }
    }

    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');

    // 2. CARGAMOS EL BANNER DE NOVEDADES DESDE LA OFICINA
    fetch(`${BASE_URL}/web/storefront${isPreview ? '?preview=true' : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.exito && data.banners && data.banners.novedades) {
          setHeroImg({
            d: getImg(data.banners.novedades.d, defaultHero.d),
            m: getImg(data.banners.novedades.m, defaultHero.m)
          });
        }
      }).catch(console.error);

    // 3. CONECTAMOS AL CEREBRO PIDIENDO SÓLO LO MÁS NUEVO (?novedades=true)
    fetch(`${BASE_URL}/web/catalogo?novedades=true`)
      .then(res => res.json())
      .then(data => {
        if (data.exito) {
          const mapeados = data.productos.map((p: any) => {
            let fotosExtra = [];
            try { if (p.urls_fotos_extra) fotosExtra = JSON.parse(p.urls_fotos_extra); } catch(e){}
            const allImgs = [p.url_foto_principal, ...fotosExtra].filter(Boolean).map((img: string) => getImg(img));
            if(allImgs.length === 0) allImgs.push(getImg(''));

            return {
              id: p.id,
              nombre: p.nombre,
              precio: parseFloat(p.en_rebaja ? p.precio_rebaja : p.precio_venta),
              precioOriginal: parseFloat(p.precio_venta),
              enRebaja: p.en_rebaja,
              imagenes: allImgs,
              genero: p.categoria || 'Unisex', // La categoría (Hombre/Mujer) funciona como género
            };
          });
          setProductosDb(mapeados);
        }
        setIsLoaded(true);
      }).catch(() => setIsLoaded(true));
  }, []);

  // APLICAR EL FILTRO DE GÉNERO
  let productosMostrar = [...productosDb];
  if (filtroGenero) {
    productosMostrar = productosMostrar.filter(p => p.genero === filtroGenero);
  }

  const limpiarFiltros = () => {
    setFiltroGenero(null);
    window.history.replaceState({}, '', '/novedades');
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col font-sans relative">
      
      {/* ========================================================= */}
      {/* 🚨 MODAL FLOTANTE DE PAGO EXITOSO */}
      {/* ========================================================= */}
      <AnimatePresence>
        {mostrarExito && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md bg-white text-black p-6 md:p-8 border border-gray-200 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif font-bold uppercase tracking-widest text-lg md:text-xl">¡PEDIDO RECIBIDO!</h3>
              <p className="text-[10px] md:text-xs text-gray-600 uppercase tracking-widest leading-relaxed mt-2">
                Muchas gracias por tu compra. Tu pedido ya está en manos de nuestro equipo en bodega. Te notificaremos los detalles de tu envío en breve.
              </p>
              <button 
                onClick={() => setMostrarExito(false)} 
                className="mt-6 bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors w-full"
              >
                Continuar Viendo Novedades
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. ESPACIO PARA NAVBAR */}
      <div className="w-full h-16 md:h-20 bg-black shrink-0" />

      {/* 2. BANNER PRINCIPAL (HERO) - Sincronizado con la BD */}
      <section className="w-full relative aspect-[9/16] md:aspect-[16/9] overflow-hidden bg-black">
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0">
            {/* Imagen Móvil */}
            <img 
              src={heroImg.m} 
              alt="Novedades Móvil" 
              className="md:hidden w-full h-full object-cover object-top" 
            />
            {/* Imagen PC */}
            <img 
              src={heroImg.d} 
              alt="Novedades PC" 
              className="hidden md:block w-full h-full object-cover object-top" 
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 left-6 md:bottom-16 md:left-12 text-white z-10">
          <h1 className="text-4xl md:text-6xl tracking-[0.3em] uppercase font-light drop-shadow-xl">
            Novedades
          </h1>
          <h2 className="mt-4 text-xs md:text-sm tracking-[0.4em] uppercase font-bold drop-shadow-md">
            Hombre & Mujer
          </h2>
        </div>
      </section>

      {/* 3. BARRA DE FILTROS STICKY */}
      <div className="w-full z-40 sticky top-16 md:top-20 shadow-sm bg-black border-y border-white/20 relative">
        <div className="w-full text-white px-4 md:px-8 py-5 md:py-6 flex flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase relative z-20">
          
          <div className="flex items-center space-x-6">
            <span className="text-gray-400">{productosMostrar.length} NUEVOS INGRESOS</span>
            {filtroGenero && (
              <button onClick={limpiarFiltros} className="text-gray-400 hover:text-white transition-colors border-b border-gray-400 hover:border-white">
                VER TODOS
              </button>
            )}
          </div>

          <div className="flex items-center justify-end space-x-8">
            <button 
              onClick={() => {
                setFiltroGenero(filtroGenero === 'Mujer' ? null : 'Mujer');
                window.history.replaceState({}, '', '/novedades' + (filtroGenero === 'Mujer' ? '' : '?genero=mujer'));
              }}
              className={`transition-opacity ${filtroGenero === 'Mujer' ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              Mujer
            </button>

            <button 
              onClick={() => {
                setFiltroGenero(filtroGenero === 'Hombre' ? null : 'Hombre');
                window.history.replaceState({}, '', '/novedades' + (filtroGenero === 'Hombre' ? '' : '?genero=hombre'));
              }}
              className={`transition-opacity ${filtroGenero === 'Hombre' ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              Hombre
            </button>
          </div>
        </div>
      </div>

      {/* 4. CUADRÍCULA DE PRODUCTOS (Conectada al Cerebro) */}
      <section className="w-full grow bg-white pb-12">
        <div className="w-full bg-black border-y border-black">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black">
            
            {!isLoaded ? (
               <div className="col-span-2 md:col-span-4 bg-white py-24 text-center">
                 <p className="text-black text-[10px] md:text-xs tracking-widest uppercase animate-pulse">Sincronizando Últimos Modelos...</p>
               </div>
            ) : productosMostrar.length > 0 ? (
              productosMostrar.map((prod) => (
                <div key={prod.id} className="group bg-white flex flex-col relative">

                  {/* IMAGEN (Aspecto 2/3 Exacto) */}
                  <div className="relative w-full aspect-[2/3] bg-[#f6f6f6] overflow-hidden">
                    
                    {/* VISTA MÓVIL: Swiper táctil */}
                    <div className="md:hidden w-full h-full">
                      <Swiper
                        pagination={{ dynamicBullets: true }}
                        modules={[Pagination]}
                        className="w-full h-full"
                        style={{
                          "--swiper-pagination-color": "#000",
                          "--swiper-pagination-bullet-inactive-color": "#000",
                          "--swiper-pagination-bullet-inactive-opacity": "0.2",
                          "--swiper-pagination-bullet-size": "5px"
                        } as React.CSSProperties}
                      >
                        {prod.imagenes.map((img: string, index: number) => (
                          <SwiperSlide key={index}>
                            <Link href={`/producto/${prod.id}`}>
                              <img src={img} alt={`${prod.nombre} vista ${index + 1}`} className="w-full h-full object-cover" />
                            </Link>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>

                    {/* VISTA PC: Animación Hover */}
                    <Link href={`/producto/${prod.id}`} className="hidden md:block absolute inset-0 z-10">
                      <img 
                        src={prod.imagenes[0]} 
                        alt={prod.nombre}
                        className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      {prod.imagenes[1] && (
                        <img 
                          src={prod.imagenes[1]} 
                          alt={`${prod.nombre} hover`}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        />
                      )}
                    </Link>
                    
                    {/* ETIQUETA DE "NUEVO" AUTOMÁTICA */}
                    <div className="absolute top-4 left-4 z-20 bg-white/90 text-black px-2 py-1 text-[8px] tracking-[0.2em] font-bold uppercase shadow-sm">
                      NEW
                    </div>

                    {/* FAVORITO */}
                    <button className="absolute top-3 right-3 z-20 text-black hover:text-gray-400 transition bg-white/50 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* INFORMACIÓN */}
                  <Link href={`/producto/${prod.id}`} className="w-full text-left px-3 py-4 flex flex-col">
                    <span className="text-gray-400 text-[8px] tracking-[0.2em] uppercase mb-1">{prod.genero}</span>
                    <h3 className="text-black font-medium text-[11px] md:text-xs tracking-wide uppercase mb-1 truncate">
                      {prod.nombre}
                    </h3>
                    <div className="flex gap-2 items-center">
                      {prod.enRebaja && (
                        <p className="text-gray-400 text-[9px] line-through">
                          ${prod.precioOriginal.toLocaleString('es-MX')}
                        </p>
                      )}
                      <p className={`text-[10px] md:text-xs tracking-widest ${prod.enRebaja ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        ${prod.precio.toLocaleString('es-MX')} MXN
                      </p>
                    </div>
                  </Link>

                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 bg-white py-24 text-center flex flex-col items-center">
                <p className="text-black text-[10px] md:text-xs tracking-widest uppercase mb-4">No hay novedades por el momento.</p>
                <button onClick={limpiarFiltros} className="border-b border-black text-black text-[10px] md:text-xs font-bold uppercase tracking-widest pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Ver todas las prendas
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
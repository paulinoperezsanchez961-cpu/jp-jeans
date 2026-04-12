'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';

const BASE_URL = 'https://api.jpjeansvip.com/api';
const API_DOMAIN = 'https://api.jpjeansvip.com'; 

export default function AccesoriosHombrePage() {
  const [productosDb, setProductosDb] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [filtroColor, setFiltroColor] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<'tipo' | 'color' | null>(null);

  // 🧠 SANADOR DE IMÁGENES UNIVERSAL
  const getImg = (path: string | undefined, fallback: string = 'https://via.placeholder.com/400x600?text=JP+Jeans') => {
    if (!path) return fallback;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace('/api/uploads/', '/uploads/').replace('/api/media/', '/uploads/');
    if (cleanPath.includes('?f=')) cleanPath = `/uploads/${cleanPath.split('?f=')[1]}`;
    return `${API_DOMAIN}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
  };

  useEffect(() => {
    // CARGAMOS LOS PRODUCTOS REALES (Hombre + Accesorio)
    fetch(`${BASE_URL}/web/catalogo?genero=Hombre&tipo=Accesorio`)
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
              // Usamos el corte como subtipo (ej: Gorra, Cinturón, etc) o fallback
              tipo: p.nombre_corte ? p.nombre_corte : 'Accesorio',
              color: 'Negro' // Mock hasta agregar columna de color en BD
            };
          });
          setProductosDb(mapeados);
        }
        setIsLoaded(true);
      }).catch(() => setIsLoaded(true));
  }, []);

  // LÓGICA DE FILTRADO
  let productosMostrar = [...productosDb];
  if (filtroTipo) productosMostrar = productosMostrar.filter(p => p.tipo === filtroTipo);
  if (filtroColor) productosMostrar = productosMostrar.filter(p => p.color === filtroColor);

  const limpiarFiltros = () => {
    setFiltroTipo(null);
    setFiltroColor(null);
    setMenuAbierto(null);
  };

  // EXTRACCIÓN DINÁMICA DE FILTROS
  const tiposDisponibles = Array.from(new Set(productosDb.map(p => p.tipo))).sort();
  const coloresDisponibles = Array.from(new Set(productosDb.map(p => p.color))).sort();

  return (
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* 1. ESPACIO PARA NAVBAR */}
      <div className="w-full h-16 md:h-20 bg-black shrink-0" />

      {/* TÍTULO ACCESORIOS */}
      <div className="w-full pt-8 pb-10 md:pt-12 md:pb-16 text-center bg-white relative z-10">
        <h1 className="text-black text-3xl md:text-5xl font-light tracking-[0.3em] uppercase">
          Accesorios
        </h1>
        <p className="text-gray-400 text-[10px] md:text-xs tracking-[0.2em] mt-4 uppercase">
          Colección Hombre JP Jeans
        </p>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="w-full z-40 sticky top-16 md:top-20 shadow-sm border-y border-black bg-black text-white relative">
        <div className="w-full px-4 md:px-8 py-5 md:py-6 flex flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase relative z-20">
          
          <div className="flex items-center space-x-6">
            <span className="text-gray-400">{productosMostrar.length} ARTÍCULOS</span>
            {(filtroTipo || filtroColor) && (
              <button 
                onClick={limpiarFiltros} 
                className="text-white hover:text-gray-300 transition-colors border-b border-transparent hover:border-white"
              >
                LIMPIAR TODO
              </button>
            )}
          </div>

          <div className="flex items-center justify-end space-x-8">
            <button 
              onClick={() => setMenuAbierto(menuAbierto === 'tipo' ? null : 'tipo')}
              className={`transition-opacity ${filtroTipo ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              {filtroTipo ? `TIPO: ${filtroTipo}` : 'TIPO'}
            </button>

            <button 
              onClick={() => setMenuAbierto(menuAbierto === 'color' ? null : 'color')}
              className={`transition-opacity ${filtroColor ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              {filtroColor ? `COLOR: ${filtroColor}` : 'COLOR'}
            </button>
          </div>
        </div>

        {/* PANELES DESPLEGABLES CON ANIMACIÓN */}
        <AnimatePresence>
          {menuAbierto && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-white text-black border-b border-black shadow-xl z-10 px-8 py-8 text-[10px] md:text-xs tracking-widest uppercase"
            >
              {menuAbierto === 'tipo' && (
                <div className="flex flex-wrap gap-6">
                  {tiposDisponibles.length > 0 ? tiposDisponibles.map((t) => (
                    <button 
                      key={t as string} 
                      onClick={() => { setFiltroTipo(filtroTipo === t ? null : t as string); setMenuAbierto(null); }}
                      className={`${filtroTipo === t ? 'font-bold border-b border-black' : 'text-gray-500 hover:text-black transition-colors'}`}
                    >
                      {t as string}
                    </button>
                  )) : (
                    <span className="text-gray-400">Cargando tipos...</span>
                  )}
                </div>
              )}

              {menuAbierto === 'color' && (
                <div className="flex flex-wrap gap-6">
                  {coloresDisponibles.length > 0 ? coloresDisponibles.map((c) => (
                    <button 
                      key={c as string} 
                      onClick={() => { setFiltroColor(filtroColor === c ? null : c as string); setMenuAbierto(null); }} 
                      className={`${filtroColor === c ? 'font-bold border-b border-black' : 'text-gray-500 hover:text-black transition-colors'}`}
                    >
                      {c as string}
                    </button>
                  )) : (
                    <span className="text-gray-400">Cargando colores...</span>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CUADRÍCULA DE PRODUCTOS (Conexión Real con Bodega) */}
      <section className="w-full flex-grow bg-white pb-12">
        <div className="w-full bg-black border-y border-black">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black">
            
            {!isLoaded ? (
               <div className="col-span-2 md:col-span-4 bg-white py-24 text-center">
                 <p className="text-black text-[10px] md:text-xs tracking-widest uppercase animate-pulse">Sincronizando Colección...</p>
               </div>
            ) : productosMostrar.length > 0 ? (
              productosMostrar.map((prod) => (
                <div key={prod.id} className="group bg-white flex flex-col relative">

                  {/* 📐 IMAGEN (Aspecto 2/3 Exacto) */}
                  <div className="relative w-full aspect-[2/3] bg-[#f6f6f6] overflow-hidden">
                    
                    {/* VISTA MÓVIL: Swiper táctil */}
                    <div className="md:hidden w-full h-full">
                      <Swiper
                        pagination={{ dynamicBullets: true }}
                        modules={[Pagination]}
                        className="w-full h-full"
                        style={{
                          "--swiper-pagination-color": "#000000",
                          "--swiper-pagination-bullet-inactive-color": "#000000",
                          "--swiper-pagination-bullet-inactive-opacity": "0.3",
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

                    {/* VISTA PC: Animación Hover Clásica */}
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

                    {/* ETIQUETA DE OFERTA */}
                    {prod.enRebaja && (
                       <div className="absolute top-4 left-4 z-20 bg-red-600 text-white px-2 py-1 text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
                         OFERTA
                       </div>
                    )}

                    {/* FAVORITO */}
                    <button className="absolute top-3 right-3 z-20 text-black hover:text-gray-400 transition bg-white/50 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* INFORMACIÓN */}
                  <Link href={`/producto/${prod.id}`} className="w-full text-left px-3 py-4 flex flex-col">
                    <div className="flex gap-2 items-center mb-1">
                      {prod.enRebaja && (
                        <p className="text-gray-400 text-[9px] line-through">
                          ${prod.precioOriginal.toLocaleString('es-MX')}
                        </p>
                      )}
                      <p className={`text-[10px] md:text-xs tracking-widest ${prod.enRebaja ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        ${prod.precio.toLocaleString('es-MX')} MXN
                      </p>
                    </div>
                    <h3 className="text-black font-medium text-[11px] md:text-xs tracking-wide uppercase truncate">
                      {prod.nombre}
                    </h3>
                  </Link>

                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 bg-white py-24 text-center flex flex-col items-center">
                <p className="text-black text-[10px] md:text-xs tracking-widest uppercase mb-4">No hay accesorios disponibles bajo este filtro.</p>
                <button onClick={limpiarFiltros} className="border-b border-black text-black text-[10px] md:text-xs font-bold uppercase tracking-widest pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Limpiar Filtros
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
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// Importaciones de Swiper para el catálogo móvil
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';

const BASE_URL = 'https://api.jpjeansvip.com/api';
const API_DOMAIN = 'https://api.jpjeansvip.com'; 

// Los 4 Círculos (Mantienen fotos de ambiente)
const categorias = [
  { id: 'Hombre', label: 'Hombre', img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=400' },
  { id: 'Mujer', label: 'Mujer', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400' },
  { id: 'Niña', label: 'Niña', img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=400' },
  { id: 'Niño', label: 'Niño', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400' }
];

export default function RebajasPage() {
  const [productosDb, setProductosDb] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [filtroGenero, setFiltroGenero] = useState<string | null>(null);

  // 🧠 SANADOR DE IMÁGENES UNIVERSAL
  const getImg = (path: string | undefined, fallback: string = 'https://via.placeholder.com/400x600?text=JP+Jeans') => {
    if (!path) return fallback;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace('/api/uploads/', '/uploads/').replace('/api/media/', '/uploads/');
    if (cleanPath.includes('?f=')) cleanPath = '/uploads/' + cleanPath.split('?f=')[1];
    return `${API_DOMAIN}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
  };

  useEffect(() => {
    // 1. LEEMOS LA URL POR SI ALGUIEN ENTRA CON ?genero=mujer
    const params = new URLSearchParams(window.location.search);
    const generoURL = params.get('genero');
    if (generoURL) {
      setFiltroGenero(generoURL.charAt(0).toUpperCase() + generoURL.slice(1).toLowerCase());
    }

    // 2. CONECTAMOS AL CEREBRO PIDIENDO SÓLO OFERTAS (?rebajas=true)
    fetch(`${BASE_URL}/web/catalogo?rebajas=true`)
      .then(res => res.json())
      .then(data => {
        if (data.exito) {
          const mapeados = data.productos.map((p: any) => {
            let fotosExtra = [];
            try { if (p.urls_fotos_extra) fotosExtra = JSON.parse(p.urls_fotos_extra); } catch(e){}
            const allImgs = [p.url_foto_principal, ...fotosExtra].filter(Boolean).map((img: string) => getImg(img));
            if(allImgs.length === 0) allImgs.push(getImg(''));

            // Cálculo matemático del porcentaje de descuento
            const pOrig = parseFloat(p.precio_venta);
            const pRebaja = parseFloat(p.precio_rebaja);
            let porcentajeDescuento = 0;
            if (pOrig > 0 && pRebaja > 0 && pOrig > pRebaja) {
                porcentajeDescuento = Math.round(((pOrig - pRebaja) / pOrig) * 100);
            }

            return {
              id: p.id,
              nombre: p.nombre,
              precioOriginal: pOrig,
              precioOferta: pRebaja,
              descuentoReal: porcentajeDescuento,
              imagenes: allImgs,
              genero: p.categoria || 'Unisex', 
            };
          });
          setProductosDb(mapeados);
        }
        setIsLoaded(true);
      }).catch(() => setIsLoaded(true));
  }, []);

  // FILTRADO DINÁMICO
  let productosMostrar = [...productosDb];
  if (filtroGenero) {
    productosMostrar = productosMostrar.filter(p => p.genero === filtroGenero);
  }

  const limpiarFiltros = () => {
    setFiltroGenero(null);
    window.history.replaceState({}, '', '/rebajas');
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* ESPACIO PARA NAVBAR */}
      <div className="w-full h-16 md:h-20 bg-black shrink-0" />

      {/* TÍTULO */}
      <div className="w-full pt-10 pb-6 text-center bg-white relative z-10">
        <h1 className="text-black text-4xl md:text-6xl font-thin tracking-[0.4em] uppercase text-red-600">REBAJAS</h1>
        <p className="text-gray-400 text-[10px] md:text-xs tracking-[0.3em] mt-4 uppercase">Últimas Tallas JP Jeans</p>
      </div>

      {/* 1. CÍRCULOS DE CATEGORÍAS */}
      <section className="w-full py-10 flex justify-center items-center gap-6 md:gap-16 px-4 overflow-x-auto no-scrollbar relative z-10">
        {categorias.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => {
              setFiltroGenero(filtroGenero === cat.id ? null : cat.id);
              window.history.replaceState({}, '', '/rebajas' + (filtroGenero === cat.id ? '' : `?genero=${cat.id.toLowerCase()}`));
            }}
            className="flex flex-col items-center group shrink-0"
          >
            <div className={`w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-2 transition-all duration-300 ${filtroGenero === cat.id ? 'border-red-600 scale-110' : 'border-transparent opacity-70 group-hover:opacity-100'}`}>
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
            </div>
            <span className={`mt-4 text-[11px] md:text-sm tracking-widest uppercase font-medium ${filtroGenero === cat.id ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
              {cat.label}
            </span>
          </button>
        ))}
      </section>

      {/* BARRA DE ESTADO / LIMPIAR */}
      {filtroGenero && (
        <div className="w-full bg-black text-white py-3 flex justify-center items-center gap-4 relative z-10">
          <span className="text-[9px] md:text-[10px] tracking-widest uppercase">
            Mostrando Rebajas de: {filtroGenero}
          </span>
          <button onClick={limpiarFiltros} className="text-white border-b border-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
            Quitar Filtro
          </button>
        </div>
      )}

      {/* 3. CUADRÍCULA DE PRODUCTOS (Fondo blanco con CUADRÍCULA NEGRA de 1px) */}
      <section className="w-full grow bg-white pb-12">
        <div className="w-full bg-black border-y border-black">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black">
            
            {!isLoaded ? (
               <div className="col-span-2 md:col-span-4 bg-white py-24 text-center">
                 <p className="text-black text-[10px] md:text-xs tracking-widest uppercase animate-pulse">Buscando Ofertas...</p>
               </div>
            ) : productosMostrar.length > 0 ? (
              productosMostrar.map((prod) => (
                <div key={prod.id} className="group bg-white flex flex-col relative">
                  
                  {/* IMAGEN (Aspecto 2/3) */}
                  <div className="relative w-full aspect-[2/3] bg-[#f9f9f9] overflow-hidden">
                    
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
                    
                    {/* BADGE DESCUENTO (Automático) */}
                    {prod.descuentoReal > 0 && (
                        <div className="absolute top-4 left-4 z-20 bg-red-600 text-white px-2 py-1 text-[8px] font-bold uppercase tracking-widest">
                        -{prod.descuentoReal}%
                        </div>
                    )}
                  </div>

                  {/* INFO CENTRALIZADA TIPO REBAJAS */}
                  <div className="w-full text-center px-4 py-5 flex flex-col items-center">
                    <span className="text-gray-400 text-[8px] tracking-[0.2em] uppercase mb-1">{prod.genero}</span>
                    <Link href={`/producto/${prod.id}`}>
                      <h3 className="text-black font-medium text-[10px] md:text-xs tracking-[0.15em] uppercase mb-2 hover:text-gray-600 transition-colors">
                        {prod.nombre}
                      </h3>
                    </Link>
                    <div className="flex space-x-3 items-center">
                      <p className="text-gray-400 text-[9px] md:text-[10px] line-through font-light">
                        ${prod.precioOriginal.toLocaleString('es-MX')}
                      </p>
                      <p className="text-red-600 text-[10px] md:text-xs font-bold tracking-widest">
                        ${prod.precioOferta.toLocaleString('es-MX')} MXN
                      </p>
                    </div>
                  </div>
                  
                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 bg-white py-24 text-center flex flex-col items-center">
                <p className="text-black text-[10px] md:text-xs tracking-widest uppercase mb-4">No hay prendas en rebaja en esta categoría por el momento.</p>
                <button onClick={limpiarFiltros} className="border-b border-black text-black text-[10px] font-bold uppercase tracking-widest pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Ver todas las ofertas
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
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

// Banners por defecto
const defaultCategorias = [
  { id: 'Vestido', label: 'Vestidos', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800' },
  { id: 'Falda', label: 'Faldas', img: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=800' }
];

export default function VestidosMujerPage() {
  const [categorias, setCategorias] = useState(defaultCategorias);
  const [productosDb, setProductosDb] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [filtroActivo, setFiltroActivo] = useState<string | null>(null);
  const [filtroTalla, setFiltroTalla] = useState<string | null>(null);
  const [filtroColor, setFiltroColor] = useState<string | null>(null);
  const [orden, setOrden] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<'talla' | 'color' | 'orden' | null>(null);

  // 🧠 SANADOR DE IMÁGENES UNIVERSAL
  const getImg = (path: string | undefined, fallback: string = 'https://via.placeholder.com/400x600?text=JP+Jeans') => {
    if (!path) return fallback;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace('/api/uploads/', '/uploads/').replace('/api/media/', '/uploads/');
    if (cleanPath.includes('?f=')) cleanPath = `/uploads/${cleanPath.split('?f=')[1]}`;
    return `${API_DOMAIN}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
  };

  useEffect(() => {
    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');

    // 1. CARGAMOS LOS BANNERS DOBLES DE LA OFICINA
    fetch(`${BASE_URL}/web/storefront${isPreview ? '?preview=true' : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.exito && data.banners) {
          const b = data.banners;
          setCategorias([
            { id: 'Vestido', label: 'Vestidos', img: getImg(b.m_sub_vestidos?.d, defaultCategorias[0].img) },
            { id: 'Falda', label: 'Faldas', img: getImg(b.m_sub_faldas?.d, defaultCategorias[1].img) }
          ]);
        }
      }).catch(console.error);

    // 2. CARGAMOS VESTIDOS Y FALDAS AL MISMO TIEMPO
    Promise.all([
      fetch(`${BASE_URL}/web/catalogo?genero=Mujer&tipo=Vestido`).then(res => res.json()),
      fetch(`${BASE_URL}/web/catalogo?genero=Mujer&tipo=Falda`).then(res => res.json())
    ])
    .then(([dataVestidos, dataFaldas]) => {
      
      // 🚨 AQUÍ ESTÁ LA CORRECCIÓN DE TYPESCRIPT (any[])
      let todos: any[] = []; 
      
      if (dataVestidos.exito) todos = [...todos, ...dataVestidos.productos.map((p: any) => ({ ...p, tipo_prenda: 'Vestido' }))];
      if (dataFaldas.exito) todos = [...todos, ...dataFaldas.productos.map((p: any) => ({ ...p, tipo_prenda: 'Falda' }))];

      const mapeados = todos.map((p: any) => {
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
          categoria: p.tipo_prenda, // Vestido o Falda
          imagenes: allImgs,
          tallas: p.tallas_array && p.tallas_array.length > 0 ? p.tallas_array : ['CH', 'M', 'G'],
          color: 'Negro' // Mock hasta que haya columna color
        };
      });
      setProductosDb(mapeados);
      setIsLoaded(true);
    }).catch(() => setIsLoaded(true));
  }, []);

  // LÓGICA DE FILTRADO
  let productosMostrar = [...productosDb];

  if (filtroActivo) productosMostrar = productosMostrar.filter(p => p.categoria === filtroActivo);
  if (filtroTalla) productosMostrar = productosMostrar.filter(p => p.tallas.includes(filtroTalla));
  if (filtroColor) productosMostrar = productosMostrar.filter(p => p.color === filtroColor);

  if (orden === 'asc') productosMostrar.sort((a, b) => a.precio - b.precio);
  if (orden === 'desc') productosMostrar.sort((a, b) => b.precio - a.precio);

  const limpiarFiltros = () => {
    setFiltroActivo(null);
    setFiltroTalla(null);
    setFiltroColor(null);
    setOrden(null);
    setMenuAbierto(null);
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* 1. ESPACIO DEL ENCABEZADO Y SEPARADOR */}
      <div className="w-full h-16 md:h-20 bg-black shrink-0" />
      <div className="w-full h-0.5 bg-white shrink-0" />

      {/* 2. LOS 2 BANNERS DOBLES (Vestidos y Faldas) */}
      <section className="w-full grid grid-cols-2 bg-white">
        {categorias.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => {
              setFiltroActivo(cat.id === filtroActivo ? null : cat.id);
              setMenuAbierto(null);
            }}
            className="group relative w-full aspect-[9/16] md:aspect-[3/4] overflow-hidden cursor-pointer bg-gray-100"
          >
            {/* 🚨 ETIQUETA IMG PARA EVITAR RECORTES */}
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              src={cat.img} 
              alt={cat.label}
              className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                filtroActivo === cat.id ? 'scale-105' : 'group-hover:scale-105'
              }`}
            />
            
            <div className={`absolute inset-0 bg-white/50 transition-opacity duration-500 ${
              filtroActivo && filtroActivo !== cat.id ? 'opacity-100' : 'opacity-0'
            }`} />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-30">
              <h3 className="text-white text-sm md:text-xl font-bold tracking-[0.2em] uppercase drop-shadow-md">
                {cat.label}
              </h3>
            </div>
          </div>
        ))}
      </section>

      {/* 3. BARRA DE FILTROS */}
      <div className="w-full z-40 sticky top-16 md:top-20 bg-black border-y border-white/20 text-white relative">
        <div className="w-full px-4 md:px-8 py-5 md:py-6 flex flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase relative z-20">
          
          <div className="flex items-center space-x-6">
            <span className="text-gray-400">{productosMostrar.length} ARTÍCULOS</span>
            {(filtroActivo || filtroTalla || filtroColor || orden) && (
              <button 
                onClick={limpiarFiltros}
                className="text-white hover:text-gray-300 transition-colors border-b border-transparent hover:border-white"
              >
                LIMPIAR TODO
              </button>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <button 
                onClick={() => setMenuAbierto(menuAbierto === 'talla' ? null : 'talla')}
                className={`transition-opacity ${filtroTalla ? 'text-white font-bold border-b border-white' : 'hover:opacity-70'}`}
              >
                {filtroTalla ? `TALLA: ${filtroTalla}` : 'TALLA'}
              </button>
            </div>

            <div className="relative hidden md:block">
              <button 
                onClick={() => setMenuAbierto(menuAbierto === 'color' ? null : 'color')}
                className={`transition-opacity ${filtroColor ? 'text-white font-bold border-b border-white' : 'hover:opacity-70'}`}
              >
                {filtroColor ? `COLOR: ${filtroColor}` : 'COLOR'}
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setMenuAbierto(menuAbierto === 'orden' ? null : 'orden')}
                className="flex items-center space-x-2 hover:opacity-70 transition-opacity"
              >
                <span className="hidden md:inline">{orden ? 'ORDENADO' : 'FILTRAR'}</span>
                <span className="md:hidden">FILTRAR</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* PANELES DESPLEGABLES */}
        <AnimatePresence>
          {menuAbierto && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-white text-black border-b border-black shadow-xl z-10 px-8 py-8 text-[10px] md:text-xs tracking-widest uppercase"
            >
              {menuAbierto === 'talla' && (
                <div className="flex flex-wrap gap-6">
                  {Array.from(new Set(productosDb.flatMap(p => p.tallas))).sort().map(t => (
                    <button 
                      key={t as string} 
                      onClick={() => { setFiltroTalla(filtroTalla === t ? null : t as string); setMenuAbierto(null); }}
                      className={`${filtroTalla === t ? 'font-bold border-b border-black' : 'text-gray-500 hover:text-black transition-colors'}`}
                    >
                      Talla {t as string}
                    </button>
                  ))}
                </div>
              )}

              {menuAbierto === 'color' && (
                <div className="flex flex-wrap gap-6">
                  {Array.from(new Set(productosDb.map(p => p.color))).sort().map(c => (
                    <button 
                      key={c as string} 
                      onClick={() => { setFiltroColor(filtroColor === c ? null : c as string); setMenuAbierto(null); }}
                      className={`${filtroColor === c ? 'font-bold border-b border-black' : 'text-gray-500 hover:text-black transition-colors'}`}
                    >
                      {c as string}
                    </button>
                  ))}
                </div>
              )}

              {menuAbierto === 'orden' && (
                <div className="flex flex-col space-y-4 items-start">
                  <button 
                    onClick={() => { setOrden(orden === 'asc' ? null : 'asc'); setMenuAbierto(null); }}
                    className={`${orden === 'asc' ? 'font-bold border-b border-black' : 'text-gray-500 hover:text-black transition-colors'}`}
                  >
                    PRECIO: MENOR A MAYOR
                  </button>
                  <button 
                    onClick={() => { setOrden(orden === 'desc' ? null : 'desc'); setMenuAbierto(null); }}
                    className={`${orden === 'desc' ? 'font-bold border-b border-black' : 'text-gray-500 hover:text-black transition-colors'}`}
                  >
                    PRECIO: MAYOR A MENOR
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. CATÁLOGO DE PRODUCTOS REAELS */}
      <section className="w-full grow bg-white pb-12">
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

                    {/* ETIQUETA DE OFERTA */}
                    {prod.enRebaja && (
                       <div className="absolute top-4 left-4 z-20 bg-red-600 text-white px-2 py-1 text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
                         OFERTA
                       </div>
                    )}

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
                <p className="text-black text-[10px] md:text-xs tracking-widest uppercase mb-4">No hay productos que coincidan con tu búsqueda.</p>
                <button onClick={limpiarFiltros} className="border-b border-black text-black text-[10px] md:text-xs font-bold uppercase tracking-widest pb-1 hover:text-gray-500 transition-colors">
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
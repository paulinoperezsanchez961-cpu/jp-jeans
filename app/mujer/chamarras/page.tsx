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

// 1. BANNERS DOBLES POR DEFECTO
const defaultCategorias = [
  { id: 'chamarra', label: 'Chamarras', img: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?q=80&w=800' },
  { id: 'top', label: 'Tops', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800' }
];

export default function ChamarrasMujerPage() {
  const [categorias, setCategorias] = useState(defaultCategorias);
  const [productosDb, setProductosDb] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [filtroActivo, setFiltroActivo] = useState<string | null>(null); // Chamarra o Top
  const [filtroTalla, setFiltroTalla] = useState<string | null>(null);
  const [filtroTono, setFiltroTono] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<'talla' | 'tono' | null>(null);

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
            { id: 'chamarra', label: 'Chamarras', img: getImg(b.m_sub_chamarras?.d, defaultCategorias[0].img) },
            { id: 'top', label: 'Tops', img: getImg(b.m_sub_tops?.d, defaultCategorias[1].img) }
          ]);
        }
      }).catch(console.error);

    // 2. CARGAMOS CHAMARRAS Y TOPS AL MISMO TIEMPO
    Promise.all([
      fetch(`${BASE_URL}/web/catalogo?genero=Mujer&tipo=Chamarra`).then(res => res.json()),
      fetch(`${BASE_URL}/web/catalogo?genero=Mujer&tipo=Top`).then(res => res.json())
    ])
    .then(([dataChamarras, dataTops]) => {
      
      let todos: any[] = []; 
      
      if (dataChamarras.exito) todos = [...todos, ...dataChamarras.productos.map((p: any) => ({ ...p, tipo_prenda: 'chamarra' }))];
      if (dataTops.exito) todos = [...todos, ...dataTops.productos.map((p: any) => ({ ...p, tipo_prenda: 'top' }))];

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
          categoria: p.tipo_prenda, // chamarra o top
          imagenes: allImgs,
          tallas: p.tallas_array && p.tallas_array.length > 0 ? p.tallas_array : ['CH', 'M', 'G'],
          tono: 'Oscuro' // Mock hasta que agregues columna tono
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
  if (filtroTono) productosMostrar = productosMostrar.filter(p => p.tono === filtroTono);

  const limpiarFiltros = () => {
    setFiltroActivo(null);
    setFiltroTalla(null);
    setFiltroTono(null);
    setMenuAbierto(null);
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* 1. ESPACIO DEL ENCABEZADO Y SEPARADOR */}
      <div className="w-full h-16 md:h-20 bg-black shrink-0" />
      <div className="w-full h-0.5 bg-white shrink-0" />

      {/* 2. LOS 2 BANNERS DOBLES (Chamarras y Tops) - PROPORCIÓN ESTRICTA */}
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
            {/* 🚨 CERO RECORTES */}
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
              <h3 className="text-white text-sm md:text-xl font-bold tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
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
            {(filtroActivo || filtroTalla || filtroTono) && (
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
              onClick={() => setMenuAbierto(menuAbierto === 'talla' ? null : 'talla')}
              className={`transition-opacity ${filtroTalla ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              {filtroTalla ? `TALLA: ${filtroTalla}` : 'TALLA'}
            </button>

            <button 
              onClick={() => setMenuAbierto(menuAbierto === 'tono' ? null : 'tono')}
              className={`transition-opacity ${filtroTono ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              {filtroTono ? `TONO: ${filtroTono}` : 'TONO'}
            </button>
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

              {menuAbierto === 'tono' && (
                <div className="flex flex-wrap gap-6">
                  {['Claro', 'Oscuro'].map(tono => (
                    <button 
                      key={tono} 
                      onClick={() => { setFiltroTono(filtroTono === tono ? null : tono); setMenuAbierto(null); }}
                      className={`${filtroTono === tono ? 'font-bold border-b border-black' : 'text-gray-500 hover:text-black transition-colors'}`}
                    >
                      {tono}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. CATÁLOGO DE PRODUCTOS (Conexión Real con Bodega) */}
      <section className="w-full flex-grow bg-white pb-12">
        <div className="w-full bg-black border-y border-black">
          {/* 📱 2 COLUMNAS PERFECTAS EN MÓVIL */}
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
                <p className="text-black text-[10px] md:text-xs tracking-widest uppercase mb-4">No hay productos disponibles bajo este filtro.</p>
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
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// Importaciones de Swiper para el catálogo móvil y Banners
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';
// @ts-ignore
import 'swiper/css/free-mode';

// 1. BANNERS DE CORTES HOMBRE (Ajustado a los 4 cortes solicitados)
const cortes = [
  { id: 'baggy', label: 'Baggy', img: 'https://images.unsplash.com/photo-1516826957135-73318231cb6c?q=80&w=800' },
  { id: 'cargo', label: 'Cargo', img: 'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg?auto=compress&cs=tinysrgb&w=800&q=80' },
  { id: 'recto', label: 'Recto', img: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800' },
  { id: 'slim', label: 'Slim', img: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=800' }
];

// 2. PRODUCTOS (Actualizados con arreglo de "imagenes" para el Swiper)
const productosDb = [
  { id: 'J-01', nombre: 'Jeans Baggy 90s Vintage', precio: 2499, corte: 'baggy', color: 'Azul', tallas: ['28', '30', '32'],
    imagenes: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800',
      'https://images.unsplash.com/photo-1516826957135-73318231cb6c?q=80&w=800',
      'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800'
    ]
  },
  { id: 'J-02', nombre: 'Cargo Parachute Black', precio: 2799, corte: 'cargo', color: 'Negro', tallas: ['30', '32', '34'],
    imagenes: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800',
      'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800'
    ]
  },
  { id: 'J-03', nombre: 'Slim Fit Essential Ice', precio: 2199, corte: 'slim', color: 'Azul', tallas: ['28', '30'],
    imagenes: [
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800',
      'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=800',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800'
    ]
  },
  { id: 'J-04', nombre: 'Recto Classic Raw', precio: 2299, corte: 'recto', color: 'Azul Oscuro', tallas: ['30', '32', '34'],
    imagenes: [
      'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800',
      'https://images.unsplash.com/photo-1511130558090-00af810c2111?q=80&w=800',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800'
    ]
  },
  { id: 'J-05', nombre: 'Baggy Washed Grey', precio: 2599, corte: 'baggy', color: 'Gris', tallas: ['32', '34'],
    imagenes: [
      'https://images.unsplash.com/photo-1516826957135-73318231cb6c?q=80&w=800',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800'
    ]
  },
  { id: 'J-06', nombre: 'Cargo Utility Sand', precio: 2899, corte: 'cargo', color: 'Arena', tallas: ['28', '30', '32'],
    imagenes: [
      'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800',
      'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800'
    ]
  },
  { id: 'J-07', nombre: 'Slim Dark Night', precio: 2199, corte: 'slim', color: 'Negro', tallas: ['28', '30', '32', '34'],
    imagenes: [
      'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=800',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800',
      'https://images.unsplash.com/photo-1511130558090-00af810c2111?q=80&w=800'
    ]
  },
  { id: 'J-08', nombre: 'Recto Selvedge 14oz', precio: 3199, corte: 'recto', color: 'Azul Oscuro', tallas: ['30', '32'],
    imagenes: [
      'https://images.unsplash.com/photo-1511130558090-00af810c2111?q=80&w=800',
      'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800',
      'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=800'
    ]
  }
];

export default function JeansHombrePage() {
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null);
  const [filtroTalla, setFiltroTalla] = useState<string | null>(null);
  const [filtroColor, setFiltroColor] = useState<string | null>(null);
  const [orden, setOrden] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<'talla' | 'color' | 'orden' | null>(null);

  let productosMostrar = [...productosDb];

  if (filtroActivo) productosMostrar = productosMostrar.filter(p => p.corte === filtroActivo);
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
    <div className="bg-white min-h-screen w-full flex flex-col font-sans text-black">
      
      {/* 1. ESPACIO DEL ENCABEZADO Y SEPARADOR */}
      <div className="w-full h-16 md:h-20 bg-black shrink-0" />
      <div className="w-full h-0.5 bg-white shrink-0" />

      {/* 2. LOS BANNERS (AHORA EN CARRUSEL DESLIZABLE - Proporción alta aspect-[9/16]) */}
      <section className="w-full bg-white relative">
        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          spaceBetween={2}
          slidesPerView={2.2} // En móvil muestra 2.2 para invitar a deslizar
          breakpoints={{
            768: {
              slidesPerView: 4, // En PC muestra los 4 exactos
            },
          }}
          className="w-full h-full"
        >
          {cortes.map((corte) => (
            <SwiperSlide key={corte.id}>
              <div 
                onClick={() => {
                  setFiltroActivo(corte.id === filtroActivo ? null : corte.id);
                  setMenuAbierto(null);
                }}
                className="group relative w-full aspect-[9/16] overflow-hidden cursor-pointer bg-gray-100"
              >
                <img 
                  src={corte.img} 
                  alt={`Corte ${corte.label}`}
                  className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                    filtroActivo === corte.id ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                />
                
                {/* Overlay blanco sutil para destacar la selección */}
                <div className={`absolute inset-0 bg-white/50 transition-opacity duration-500 ${
                  filtroActivo && filtroActivo !== corte.id ? 'opacity-100' : 'opacity-0'
                }`} />
                
                {/* Texto en negro, estilo Calvin Klein */}
                <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-30">
                  <h3 className="text-black text-[10px] md:text-sm font-medium tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
                    {corte.label}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 3. BARRA DE FILTROS (z-40 para evitar cruces con el menú) */}
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
        {menuAbierto && (
          <div className="absolute top-full left-0 w-full bg-white text-black border-b border-black shadow-xl z-10 px-8 py-8 text-[10px] md:text-xs tracking-widest uppercase animate-in slide-in-from-top-2 duration-300">
            {menuAbierto === 'talla' && (
              <div className="flex space-x-8">
                {['28', '30', '32', '34'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => { setFiltroTalla(filtroTalla === t ? null : t); setMenuAbierto(null); }}
                    className={`${filtroTalla === t ? 'font-bold border-b border-black' : 'text-gray-500 hover:text-black transition-colors'}`}
                  >
                    Talla {t}
                  </button>
                ))}
              </div>
            )}
            {menuAbierto === 'color' && (
              <div className="flex space-x-8">
                {['Azul', 'Azul Oscuro', 'Negro', 'Gris', 'Arena'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => { setFiltroColor(filtroColor === c ? null : c); setMenuAbierto(null); }}
                    className={`${filtroColor === c ? 'font-bold border-b border-black' : 'text-gray-500 hover:text-black transition-colors'}`}
                  >
                    {c}
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
          </div>
        )}
      </div>

      {/* 4. CATÁLOGO DE PRODUCTOS (Fondo blanco con CUADRÍCULA NEGRA) */}
      <section className="w-full grow bg-white pb-12">
        <div className="w-full bg-black border-y border-black">
          {/* gap-px genera la cuadrícula negra de 1px */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black">
            {productosMostrar.length > 0 ? (
              productosMostrar.map((prod) => (
                <div key={prod.id} className="group bg-white flex flex-col relative">
                  
                  {/* CONTENEDOR DE IMAGEN */}
                  <div className="relative w-full aspect-[2/3] bg-[#f6f6f6] overflow-hidden">
                    
                    {/* VISTA MÓVIL: Swiper táctil con bolitas NEGRAS Y SUTILES */}
                    <div className="md:hidden w-full h-full">
                      <Swiper
                        pagination={{ dynamicBullets: true }}
                        modules={[Pagination]}
                        className="w-full h-full"
                        // Inyección de estilos para bolitas negras
                        style={{
                          "--swiper-pagination-color": "#000",
                          "--swiper-pagination-bullet-inactive-color": "#000",
                          "--swiper-pagination-bullet-inactive-opacity": "0.2",
                          "--swiper-pagination-bullet-size": "5px"
                        } as React.CSSProperties}
                      >
                        {prod.imagenes.map((img, index) => (
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
                      <img 
                        src={prod.imagenes[1]} 
                        alt={`${prod.nombre} hover`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </Link>

                    <button className="absolute top-3 right-3 z-20 text-black hover:text-gray-400 transition bg-white/50 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <Link href={`/producto/${prod.id}`} className="w-full text-left px-3 py-4 flex flex-col">
                    <p className="text-gray-500 text-[10px] md:text-xs tracking-widest mb-1">
                      ${prod.precio.toLocaleString('es-MX')} MXN
                    </p>
                    <h3 className="text-black font-medium text-[11px] md:text-xs tracking-wide uppercase">
                      {prod.nombre}
                    </h3>
                  </Link>

                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 bg-white py-20 text-center flex flex-col items-center">
                <p className="text-black text-xs md:text-sm tracking-widest uppercase mb-4">No hay productos que coincidan con tu búsqueda.</p>
                <button onClick={limpiarFiltros} className="border-b border-black text-black text-xs font-bold uppercase tracking-widest pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Ver todos los productos
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
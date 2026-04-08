'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// Importaciones de Swiper para el catálogo móvil
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';

// 1. BASE DE DATOS DE ACCESORIOS HOMBRE (Actualizada con arreglo de imágenes)
const productosDb = [
  { id: 'AH-01', nombre: 'Gorra Signature Logo', precio: 599, tipo: 'Gorras', color: 'Negro',
    imagenes: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800', 
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800' // Repetida para demo
    ] 
  },
  { id: 'AH-02', nombre: 'Cinturón Cuero Raw', precio: 1199, tipo: 'Cinturones', color: 'Cuero',
    imagenes: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800', 
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800',
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800'
    ]
  },
  { id: 'AH-03', nombre: 'Cadena Plata 925', precio: 1899, tipo: 'Joyería', color: 'Plata',
    imagenes: [
      'https://images.unsplash.com/photo-1599643478514-4a48489c1653?q=80&w=800', 
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800',
      'https://images.unsplash.com/photo-1599643478514-4a48489c1653?q=80&w=800'
    ]
  },
  { id: 'AH-04', nombre: 'Gafas de Sol Aviador', precio: 1499, tipo: 'Lentes', color: 'Negro',
    imagenes: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800', 
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800'
    ]
  },
  { id: 'AH-05', nombre: 'Anillo Sello Acero', precio: 899, tipo: 'Joyería', color: 'Plata',
    imagenes: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800', 
      'https://images.unsplash.com/photo-1599643478514-4a48489c1653?q=80&w=800', 
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800'
    ] 
  },
  { id: 'AH-06', nombre: 'Crossbody Bag Black', precio: 1599, tipo: 'Bolsos', color: 'Negro',
    imagenes: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800', 
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800'
    ]
  }
];

export default function AccesoriosHombrePage() {
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [filtroColor, setFiltroColor] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<'tipo' | 'color' | null>(null);

  // LÓGICA DE FILTRADO
  let productosMostrar = [...productosDb];
  if (filtroTipo) productosMostrar = productosMostrar.filter(p => p.tipo === filtroTipo);
  if (filtroColor) productosMostrar = productosMostrar.filter(p => p.color === filtroColor);

  const limpiarFiltros = () => {
    setFiltroTipo(null);
    setFiltroColor(null);
    setMenuAbierto(null);
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* ESPACIO PARA NAVBAR */}
      {/* Bloque estático que sirve de fondo para tu menú transparente sin arruinar el diseño */}
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

      {/* BARRA DE FILTROS (z-40 para no chocar con el Navbar principal) */}
      <div className="w-full z-40 sticky top-16 md:top-20 shadow-sm border-y border-black relative">
        <div className="w-full bg-black text-white px-4 md:px-8 py-5 md:py-6 flex flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase relative z-20">
          
          <div className="flex items-center space-x-6">
            <span>{productosMostrar.length} ARTÍCULOS</span>
            {(filtroTipo || filtroColor) && (
              <button onClick={limpiarFiltros} className="text-gray-400 hover:text-white transition-colors border-b border-gray-400 hover:border-white">
                LIMPIAR
              </button>
            )}
          </div>

          <div className="flex items-center justify-end space-x-8">
            <button 
              onClick={() => setMenuAbierto(menuAbierto === 'tipo' ? null : 'tipo')}
              className={`transition-opacity ${filtroTipo ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              {filtroTipo ? `Tipo: ${filtroTipo}` : 'Tipo'}
            </button>

            <button 
              onClick={() => setMenuAbierto(menuAbierto === 'color' ? null : 'color')}
              className={`transition-opacity ${filtroColor ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              {filtroColor ? `Color: ${filtroColor}` : 'Color'}
            </button>
          </div>
        </div>

        {/* PANELES DESPLEGABLES */}
        {menuAbierto && (
          <div className="absolute top-full left-0 w-full bg-white text-black border-b border-black shadow-xl z-10 px-8 py-8 text-[10px] md:text-xs tracking-widest uppercase animate-in slide-in-from-top-2 duration-300">
            
            {menuAbierto === 'tipo' && (
              <div className="flex space-x-12">
                {['Gorras', 'Bolsos', 'Cinturones', 'Joyería', 'Lentes'].map(t => (
                  <button key={t} onClick={() => { setFiltroTipo(t); setMenuAbierto(null); }} className={`${filtroTipo === t ? 'font-bold underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>
                    {t}
                  </button>
                ))}
              </div>
            )}

            {menuAbierto === 'color' && (
              <div className="flex space-x-12">
                {['Negro', 'Plata', 'Oro', 'Cuero'].map(c => (
                  <button key={c} onClick={() => { setFiltroColor(c); setMenuAbierto(null); }} className={`${filtroColor === c ? 'font-bold underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
            
          </div>
        )}
      </div>

      {/* CUADRÍCULA DE PRODUCTOS (Fondo blanco y cuadrícula negra) */}
      <section className="w-full flex-grow bg-white pb-12">
        <div className="w-full bg-black border-y border-black">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black">
            
            {productosMostrar.length > 0 ? (
              productosMostrar.map((prod) => (
                <div key={prod.id} className="group bg-white flex flex-col relative">

                  {/* IMAGEN (Aspecto 2/3) */}
                  <div className="relative w-full aspect-[2/3] bg-[#f6f6f6] overflow-hidden">
                    
                    {/* VISTA MÓVIL: Swiper táctil con bolitas negras */}
                    <div className="md:hidden w-full h-full">
                      <Swiper
                        pagination={{ dynamicBullets: true }}
                        modules={[Pagination]}
                        className="w-full h-full"
                        style={{
                          "--swiper-pagination-color": "#000000",
                          "--swiper-pagination-bullet-inactive-color": "#000000",
                          "--swiper-pagination-bullet-inactive-opacity": "0.3",
                          "--swiper-pagination-bullet-size": "6px"
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

                    {/* VISTA PC: Animación Hover Clásica */}
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

                    {/* FAVORITO */}
                    <button className="absolute top-3 right-3 z-20 text-black hover:text-gray-400 transition bg-white/50 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* INFORMACIÓN */}
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
                <p className="text-black text-xs md:text-sm tracking-widest uppercase mb-4">No hay accesorios que coincidan con tu búsqueda.</p>
                <button onClick={limpiarFiltros} className="border-b border-black text-black text-xs font-bold uppercase tracking-widest pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Ver todos los accesorios
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
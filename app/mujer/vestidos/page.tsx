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

// 1. BANNERS DOBLES (Vestidos y Faldas)
const categorias = [
  { id: 'vestido', label: 'Vestidos', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800' },
  { id: 'falda', label: 'Faldas', img: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=800' }
];

// 2. PRODUCTOS SIMULADOS (Vestidos y Faldas con arreglo de imágenes)
const productosDb = [
  { id: 'VM-01', nombre: 'Vestido Denim Midi', precio: 1899, categoria: 'vestido', color: 'Azul', tallas: ['XS', 'S', 'M'],
    imagenes: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800', 
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800' // Repetida para demo
    ] 
  },
  { id: 'VM-02', nombre: 'Falda Denim Maxi', precio: 1499, categoria: 'falda', color: 'Negro', tallas: ['S', 'M', 'L'],
    imagenes: [
      'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=800', 
      'https://images.unsplash.com/photo-1583391733958-d25e07fac04f?q=80&w=800',
      'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=800'
    ]
  },
  { id: 'VM-03', nombre: 'Vestido Skater Negro', precio: 1599, categoria: 'vestido', color: 'Negro', tallas: ['XS', 'S'],
    imagenes: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800', 
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800'
    ]
  },
  { id: 'VM-04', nombre: 'Falda Mini Cargo', precio: 1299, categoria: 'falda', color: 'Verde', tallas: ['XS', 'S', 'M'],
    imagenes: [
      'https://images.unsplash.com/photo-1583391733958-d25e07fac04f?q=80&w=800', 
      'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=800',
      'https://images.unsplash.com/photo-1583391733958-d25e07fac04f?q=80&w=800'
    ]
  }
];

export default function VestidosMujerPage() {
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null);
  const [filtroTalla, setFiltroTalla] = useState<string | null>(null);
  const [filtroColor, setFiltroColor] = useState<string | null>(null);
  const [orden, setOrden] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<'talla' | 'color' | 'orden' | null>(null);

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
      
      {/* 1. ESPACIO DEL ENCABEZADO Y SEPARADOR EN NEGRO */}
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
            <img 
              src={cat.img} 
              alt={cat.label}
              className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                filtroActivo === cat.id ? 'scale-105' : 'group-hover:scale-105'
              }`}
            />
            
            <div className={`absolute inset-0 bg-white/50 transition-opacity duration-500 ${
              filtroActivo && filtroActivo !== cat.id ? 'opacity-100' : 'opacity-0'
            }`} />
            
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-30">
              <h3 className="text-black text-sm md:text-xl font-bold tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                {cat.label}
              </h3>
            </div>
          </div>
        ))}
      </section>

      {/* 3. BARRA NEGRA DE HERRAMIENTAS FUNCIONAL (z-40) */}
      <div className="w-full z-40 sticky top-16 md:top-20 shadow-lg relative">
        <div className="w-full bg-black text-white px-4 md:px-8 py-5 md:py-6 flex flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase relative z-20">
          
          <div className="flex items-center space-x-6">
            <span>{productosMostrar.length} ARTÍCULOS</span>
            {(filtroActivo || filtroTalla || filtroColor || orden) && (
              <button 
                onClick={limpiarFiltros}
                className="text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white"
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
                <span className="hidden md:inline">{orden ? 'ORDENADO' : 'ORDENAR'}</span>
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
          <div className="absolute top-full left-0 w-full bg-white text-black border-b border-black shadow-xl z-10 px-8 py-6 text-xs tracking-widest uppercase">
            
            {menuAbierto === 'talla' && (
              <div className="flex space-x-8">
                {['XS', 'S', 'M', 'L'].map(t => (
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
                {['Azul', 'Negro', 'Verde'].map(c => (
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

      {/* 4. CATÁLOGO DE PRODUCTOS (Fondo blanco y cuadrícula negra) */}
      <section className="w-full grow bg-white pb-12">
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

                  {/* INFO */}
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
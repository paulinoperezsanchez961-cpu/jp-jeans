'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// 1. BASE DE DATOS DE PLAYERAS
const productosDb = [
  { id: 'PL-01', nombre: 'Playera Oversize Black', precio: 799, tono: 'Oscuro', tallas: ['CH', 'M', 'G'],
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?q=80&w=800' 
  },
  { id: 'PL-02', nombre: 'T-Shirt Classic White', precio: 599, tono: 'Claro', tallas: ['M', 'G'],
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800'
  },
  { id: 'PL-03', nombre: 'Heavyweight Grey', precio: 899, tono: 'Claro', tallas: ['CH', 'M'],
    img: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800'
  },
  { id: 'PL-04', nombre: 'Polo Essential Navy', precio: 999, tono: 'Oscuro', tallas: ['CH', 'M', 'G'],
    img: 'https://images.unsplash.com/photo-1569089247385-d861d85fb6b4?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1586363104862-3a5e222ee483?q=80&w=800'
  },
  { id: 'PL-05', nombre: 'Graphic Tee Vintage', precio: 699, tono: 'Oscuro', tallas: ['G'],
    img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800' 
  },
  { id: 'PL-06', nombre: 'Playera Básica Sand', precio: 599, tono: 'Claro', tallas: ['CH', 'M', 'G'],
    img: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800'
  }
];

export default function PlayerasPage() {
  const [filtroTalla, setFiltroTalla] = useState<string | null>(null);
  const [filtroTono, setFiltroTono] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<'talla' | 'tono' | null>(null);

  // LÓGICA DE FILTRADO
  let productosMostrar = [...productosDb];
  if (filtroTalla) productosMostrar = productosMostrar.filter(p => p.tallas.includes(filtroTalla));
  if (filtroTono) productosMostrar = productosMostrar.filter(p => p.tono === filtroTono);

  const limpiarFiltros = () => {
    setFiltroTalla(null);
    setFiltroTono(null);
    setMenuAbierto(null);
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* ESPACIO PARA NAVBAR */}
      <div className="w-full h-16 md:h-20 bg-black shrink-0" />

      {/* LEYENDA PLAYERAS */}
      <div className="w-full pt-8 pb-10 md:pt-12 md:pb-16 text-center bg-white relative z-10">
        <h1 className="text-black text-3xl md:text-5xl font-light tracking-[0.3em] uppercase">
          Playeras
        </h1>
        <p className="text-gray-400 text-[10px] md:text-xs tracking-[0.2em] mt-4 uppercase">
          Colección Superior JP Jeans
        </p>
      </div>

      {/* BARRA DE FILTROS (STICKY SIN LOGO) */}
      <div className="w-full z-[90] sticky top-16 md:top-20 shadow-sm relative">
        <div className="w-full bg-black text-white px-4 md:px-8 py-5 md:py-6 flex flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase relative z-20">
          
          <div className="flex items-center space-x-6">
            <span>{productosMostrar.length} ARTÍCULOS</span>
            {(filtroTalla || filtroTono) && (
              <button onClick={limpiarFiltros} className="text-gray-400 hover:text-white transition-colors border-b border-gray-400">
                LIMPIAR
              </button>
            )}
          </div>

          <div className="flex items-center justify-end space-x-8">
            <button 
              onClick={() => setMenuAbierto(menuAbierto === 'talla' ? null : 'talla')}
              className={`transition-opacity ${filtroTalla ? 'border-b border-white' : 'hover:opacity-70'}`}
            >
              {filtroTalla ? `Talla: ${filtroTalla}` : 'Talla'}
            </button>

            <button 
              onClick={() => setMenuAbierto(menuAbierto === 'tono' ? null : 'tono')}
              className={`transition-opacity ${filtroTono ? 'border-b border-white' : 'hover:opacity-70'}`}
            >
              {filtroTono ? `Tono: ${filtroTono}` : 'Tono'}
            </button>
          </div>
        </div>

        {/* PANELES DESPLEGABLES */}
        {menuAbierto && (
          <div className="absolute top-full left-0 w-full bg-white text-black border-b border-black shadow-xl z-10 px-8 py-8 text-[10px] md:text-xs tracking-widest uppercase animate-in slide-in-from-top-2 duration-300">
            
            {menuAbierto === 'talla' && (
              <div className="flex space-x-12">
                {['CH', 'M', 'G'].map(t => (
                  <button key={t} onClick={() => { setFiltroTalla(t); setMenuAbierto(null); }} className={`${filtroTalla === t ? 'font-bold underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>
                    {t === 'CH' ? 'Chica' : t === 'M' ? 'Mediana' : 'Grande'}
                  </button>
                ))}
              </div>
            )}

            {menuAbierto === 'tono' && (
              <div className="flex space-x-12">
                {['Claro', 'Oscuro'].map(tono => (
                  <button key={tono} onClick={() => { setFiltroTono(tono); setMenuAbierto(null); }} className={`${filtroTono === tono ? 'font-bold underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>
                    Tono {tono}
                  </button>
                ))}
              </div>
            )}
            
          </div>
        )}
      </div>

      {/* CUADRÍCULA DE PRODUCTOS (GRID PRO CON LÍNEAS FINAS DE 1PX) */}
      <section className="w-full flex-grow bg-white">
        <div className="w-full bg-black p-[1px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-black">
            
            {productosMostrar.length > 0 ? (
              productosMostrar.map((prod) => (
                <div key={prod.id} className="group bg-white flex flex-col">
                  {/* IMAGEN CON HOVER */}
                  <div className="relative w-full aspect-[2/3] bg-[#f9f9f9] overflow-hidden">
                    <Link href={`/producto/${prod.id}`} className="absolute inset-0 z-10">
                      <img src={prod.img} alt={prod.nombre} className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                      <img src={prod.imgHover} alt={prod.nombre} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </Link>
                    <button className="absolute top-4 right-4 z-20 text-black hover:text-gray-400 transition">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* INFORMACIÓN */}
                  <Link href={`/producto/${prod.id}`} className="w-full text-center px-4 py-5 flex flex-col items-center">
                    <h3 className="text-black font-medium text-[10px] md:text-xs tracking-[0.15em] uppercase mb-2">
                      {prod.nombre}
                    </h3>
                    <p className="text-gray-500 text-[10px] md:text-xs tracking-widest">
                      ${prod.precio.toLocaleString('es-MX')} MXN
                    </p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 bg-white py-20 text-center flex flex-col items-center">
                <p className="text-black text-xs md:text-sm tracking-widest uppercase mb-4">No hay playeras que coincidan con tu búsqueda.</p>
                <button onClick={limpiarFiltros} className="border-b border-black text-black text-xs font-bold uppercase tracking-widest pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Ver todas las playeras
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
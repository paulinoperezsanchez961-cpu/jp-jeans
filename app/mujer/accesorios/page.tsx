'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// 1. BASE DE DATOS DE ACCESORIOS MUJER
const productosDb = [
  { id: 'AM-01', nombre: 'Bolso de Hombro Mini', precio: 1899, tipo: 'Bolsos', color: 'Negro',
    img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800' 
  },
  { id: 'AM-02', nombre: 'Gafas Cat Eye Retro', precio: 1299, tipo: 'Lentes', color: 'Negro',
    img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800'
  },
  { id: 'AM-03', nombre: 'Collar Eslabones Chunky', precio: 999, tipo: 'Joyería', color: 'Oro',
    img: 'https://images.unsplash.com/photo-1599643478514-4a48489c1653?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800'
  },
  { id: 'AM-04', nombre: 'Cinturón Hebilla Dorada', precio: 1199, tipo: 'Cinturones', color: 'Cuero',
    img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800'
  },
  { id: 'AM-05', nombre: 'Aretes Aro Essential', precio: 699, tipo: 'Joyería', color: 'Oro',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800' 
  },
  { id: 'AM-06', nombre: 'Tote Bag Canvas', precio: 1599, tipo: 'Bolsos', color: 'Arena',
    img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=800'
  }
];

export default function AccesoriosMujerPage() {
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
      <div className="w-full h-16 md:h-20 bg-black shrink-0" />

      {/* TÍTULO ACCESORIOS (Sin clases relative/z-index problemáticas) */}
      <div className="w-full pt-8 pb-10 md:pt-12 md:pb-16 text-center bg-white">
        <h1 className="text-black text-3xl md:text-5xl font-light tracking-[0.3em] uppercase">
          Accesorios
        </h1>
        <p className="text-gray-400 text-[10px] md:text-xs tracking-[0.2em] mt-4 uppercase">
          Colección Mujer JP Jeans
        </p>
      </div>

      {/* BARRA DE FILTROS (z-[90] para fuerza máxima y sticky para que baje) */}
      <div className="w-full z-[90] sticky top-16 md:top-20 shadow-sm">
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
                {['Bolsos', 'Joyería', 'Lentes', 'Cinturones'].map(t => (
                  <button key={t} onClick={() => { setFiltroTipo(t); setMenuAbierto(null); }} className={`${filtroTipo === t ? 'font-bold underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>
                    {t}
                  </button>
                ))}
              </div>
            )}

            {menuAbierto === 'color' && (
              <div className="flex space-x-12">
                {['Negro', 'Oro', 'Plata', 'Cuero', 'Arena'].map(c => (
                  <button key={c} onClick={() => { setFiltroColor(c); setMenuAbierto(null); }} className={`${filtroColor === c ? 'font-bold underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
            
          </div>
        )}
      </div>

      {/* CUADRÍCULA DE PRODUCTOS (Grid PRO de 1px) */}
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
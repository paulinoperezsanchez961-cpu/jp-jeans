'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// 1. BASE DE DATOS DE CHAMARRAS MUJER
const productosDb = [
  { id: 'CHM-01', nombre: 'Biker Leather Suede', precio: 3299, tono: 'Oscuro', tallas: ['CH', 'M'],
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=800' 
  },
  { id: 'CHM-02', nombre: 'Denim Jacket Oversize', precio: 2199, tono: 'Claro', tallas: ['CH', 'M', 'G'],
    img: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?q=80&w=800'
  },
  { id: 'CHM-03', nombre: 'Trench Coat Essential', precio: 4599, tono: 'Claro', tallas: ['M', 'G'],
    img: 'https://images.unsplash.com/photo-1545431780-e7fa69911e2f?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800'
  },
  { id: 'CHM-04', nombre: 'Bomber Satin Black', precio: 2899, tono: 'Oscuro', tallas: ['CH', 'M', 'G'],
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=800'
  },
  { id: 'CHM-05', nombre: 'Puffer Cropped Nocturna', precio: 3499, tono: 'Oscuro', tallas: ['CH', 'M'],
    img: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=800' 
  },
  { id: 'CHM-06', nombre: 'Chaqueta Lino Arena', precio: 1999, tono: 'Claro', tallas: ['M', 'G'],
    img: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?q=80&w=800'
  }
];

export default function ChamarrasMujerPage() {
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

      {/* TÍTULO CHAMARRAS (Sin clases relative o z-index que choquen con el Navbar) */}
      <div className="w-full pt-8 pb-10 md:pt-12 md:pb-16 text-center bg-white">
        <h1 className="text-black text-3xl md:text-5xl font-light tracking-[0.3em] uppercase">
          Chamarras
        </h1>
        <p className="text-gray-400 text-[10px] md:text-xs tracking-[0.2em] mt-4 uppercase">
          Colección Mujer JP Jeans
        </p>
      </div>

      {/* BARRA DE FILTROS (z-[90] restaurado para fuerza máxima y sticky para que baje) */}
      <div className="w-full z-[90] sticky top-16 md:top-20 shadow-sm">
        <div className="w-full bg-black text-white px-4 md:px-8 py-5 md:py-6 flex flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase relative z-20">
          
          <div className="flex items-center space-x-6">
            <span>{productosMostrar.length} ARTÍCULOS</span>
            {(filtroTalla || filtroTono) && (
              <button onClick={limpiarFiltros} className="text-gray-400 hover:text-white transition-colors border-b border-gray-400 hover:border-white">
                LIMPIAR
              </button>
            )}
          </div>

          <div className="flex items-center justify-end space-x-8">
            <button 
              onClick={() => setMenuAbierto(menuAbierto === 'talla' ? null : 'talla')}
              className={`transition-opacity ${filtroTalla ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              {filtroTalla ? `Talla: ${filtroTalla}` : 'Talla'}
            </button>

            <button 
              onClick={() => setMenuAbierto(menuAbierto === 'tono' ? null : 'tono')}
              className={`transition-opacity ${filtroTono ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
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

      {/* CUADRÍCULA DE PRODUCTOS (Restauramos a flex-grow para mayor compatibilidad) */}
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
                <p className="text-black text-xs md:text-sm tracking-widest uppercase mb-4">No hay chamarras que coincidan con tu búsqueda.</p>
                <button onClick={limpiarFiltros} className="border-b border-black text-black text-xs font-bold uppercase tracking-widest pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Ver todas las chamarras
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
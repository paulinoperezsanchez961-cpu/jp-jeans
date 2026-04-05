'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// 1. BASE DE DATOS DE NIÑA
const productosDb = [
  { id: 'NN-01', nombre: 'Jeans Wide Leg Kids', precio: 899, tipo: 'Jeans', tallas: ['6', '8', '10'],
    img: 'https://images.unsplash.com/photo-1519238381255-6b728068ff61?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?q=80&w=800' 
  },
  { id: 'NN-02', nombre: 'Vestido Floral Primavera', precio: 1199, tipo: 'Vestidos', tallas: ['4', '6', '8'],
    img: 'https://images.unsplash.com/photo-1600085108871-337ee913b860?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800'
  },
  { id: 'NN-03', nombre: 'Playera Básica Logo', precio: 499, tipo: 'Playeras', tallas: ['8', '10', '12'],
    img: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1519238381255-6b728068ff61?q=80&w=800'
  },
  { id: 'NN-04', nombre: 'Chamarra Denim Classic', precio: 1499, tipo: 'Chamarras', tallas: ['6', '8', '10', '12'],
    img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1503945438517-f65904a52ce6?q=80&w=800'
  },
  { id: 'NN-05', nombre: 'Falda Denim Raw', precio: 799, tipo: 'Jeans', tallas: ['4', '6'],
    img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800' 
  },
  { id: 'NN-06', nombre: 'Sudadera Oversize Soft', precio: 999, tipo: 'Chamarras', tallas: ['10', '12'],
    img: 'https://images.unsplash.com/photo-1503945438517-f65904a52ce6?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800'
  }
];

export default function NinaPage() {
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [filtroTalla, setFiltroTalla] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<'tipo' | 'talla' | null>(null);

  // LÓGICA DE FILTRADO
  let productosMostrar = [...productosDb];
  if (filtroTipo) productosMostrar = productosMostrar.filter(p => p.tipo === filtroTipo);
  if (filtroTalla) productosMostrar = productosMostrar.filter(p => p.tallas.includes(filtroTalla));

  const limpiarFiltros = () => {
    setFiltroTipo(null);
    setFiltroTalla(null);
    setMenuAbierto(null);
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* 2. BANNER PRINCIPAL (HERO) - AHORA PANTALLA COMPLETA */}
      {/* Usamos h-screen para que ocupe todo el alto, sin el div separador para que el navbar flote encima */}
      <section className="w-full h-[85vh] md:h-screen relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=2000"
          alt="Colección Niña"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute bottom-10 left-6 md:bottom-16 md:left-12 text-white z-10">
          <h1 className="text-3xl md:text-5xl tracking-[0.3em] uppercase font-light drop-shadow-lg">
            Niña
          </h1>
          <p className="mt-4 text-xs md:text-sm tracking-[0.2em] uppercase drop-shadow-md">
            Colección Kids JP Jeans
          </p>
        </div>
      </section>

      {/* 3. BARRA DE FILTROS (z-[90] y sticky) */}
      <div className="w-full z-[90] sticky top-16 md:top-20 shadow-sm bg-black">
        <div className="w-full text-white px-4 md:px-8 py-5 md:py-6 flex flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase relative z-20">
          
          <div className="flex items-center space-x-6">
            <span>{productosMostrar.length} ARTÍCULOS</span>
            {(filtroTipo || filtroTalla) && (
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
              onClick={() => setMenuAbierto(menuAbierto === 'talla' ? null : 'talla')}
              className={`transition-opacity ${filtroTalla ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              {filtroTalla ? `Talla: ${filtroTalla}` : 'Talla'}
            </button>
          </div>
        </div>

        {/* PANELES DESPLEGABLES */}
        {menuAbierto && (
          <div className="absolute top-full left-0 w-full bg-white text-black border-b border-black shadow-xl z-10 px-8 py-8 text-[10px] md:text-xs tracking-widest uppercase animate-in slide-in-from-top-2 duration-300">
            
            {menuAbierto === 'tipo' && (
              <div className="flex space-x-12">
                {['Jeans', 'Vestidos', 'Playeras', 'Chamarras'].map(t => (
                  <button key={t} onClick={() => { setFiltroTipo(t); setMenuAbierto(null); }} className={`${filtroTipo === t ? 'font-bold underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>
                    {t}
                  </button>
                ))}
              </div>
            )}

            {menuAbierto === 'talla' && (
              <div className="flex space-x-12">
                {['4', '6', '8', '10', '12'].map(t => (
                  <button key={t} onClick={() => { setFiltroTalla(t); setMenuAbierto(null); }} className={`${filtroTalla === t ? 'font-bold underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>
                    Talla {t}
                  </button>
                ))}
              </div>
            )}
            
          </div>
        )}
      </div>

      {/* 4. CUADRÍCULA DE PRODUCTOS (Grid PRO) */}
      <section className="w-full grow bg-white">
        <div className="w-full bg-black p-px">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black">
            
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
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// 1. BASE DE DATOS DE OFERTAS COMPLETA
const productosDb = [
  { id: 'O-01', nombre: 'Jeans Cargo Shadow', precioOriginal: 2400, precioOferta: 1200, genero: 'Hombre', descuento: 50,
    img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800' 
  },
  { id: 'O-02', nombre: 'Vestido Satin Rose', precioOriginal: 1800, precioOferta: 900, genero: 'Mujer', descuento: 50,
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800' 
  },
  { id: 'O-03', nombre: 'Chamarra Denim Niña', precioOriginal: 1500, precioOferta: 1050, genero: 'Niña', descuento: 30,
    img: 'https://images.unsplash.com/photo-1519238381255-6b728068ff61?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800'
  },
  { id: 'O-04', nombre: 'Sudadera Basic Niño', precioOriginal: 900, precioOferta: 810, genero: 'Niño', descuento: 10,
    img: 'https://images.unsplash.com/photo-1503945438517-f65904a52ce6?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1471286174890-9c112cbcd5b8?q=80&w=800'
  },
  { id: 'O-05', nombre: 'Playera Heavy Hombre', precioOriginal: 800, precioOferta: 560, genero: 'Hombre', descuento: 30,
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?q=80&w=800'
  }
];

const categorias = [
  { id: 'Hombre', label: 'Hombre', img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=400' },
  { id: 'Mujer', label: 'Mujer', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400' },
  { id: 'Niña', label: 'Niña', img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=400' },
  { id: 'Niño', label: 'Niño', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400' }
];

const descuentos = [50, 30, 10];

export default function RebajasPage() {
  const [filtroGenero, setFiltroGenero] = useState<string | null>(null);
  const [filtroDescuento, setFiltroDescuento] = useState<number | null>(null);

  // LÓGICA DE FILTRADO DOBLE
  let productosMostrar = productosDb.filter(p => {
    const matchGenero = filtroGenero ? p.genero === filtroGenero : true;
    const matchDescuento = filtroDescuento ? p.descuento === filtroDescuento : true;
    return matchGenero && matchDescuento;
  });

  const limpiarFiltros = () => {
    setFiltroGenero(null);
    setFiltroDescuento(null);
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* ESPACIO PARA NAVBAR */}
      <div className="w-full h-16 md:h-20 bg-black shrink-0" />

      {/* TÍTULO */}
      <div className="w-full pt-10 pb-6 text-center bg-white">
        <h1 className="text-black text-4xl md:text-6xl font-thin tracking-[0.4em] uppercase">REBAJAS</h1>
        <p className="text-gray-400 text-[10px] md:text-xs tracking-[0.3em] mt-4 uppercase">Exclusivo JP Jeans</p>
      </div>

      {/* 1. CÍRCULOS DE CATEGORÍAS */}
      <section className="w-full py-10 flex justify-center items-center gap-6 md:gap-16 px-4 overflow-x-auto no-scrollbar">
        {categorias.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => setFiltroGenero(filtroGenero === cat.id ? null : cat.id)}
            className="flex flex-col items-center group shrink-0"
          >
            <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 transition-all duration-300 ${filtroGenero === cat.id ? 'border-black scale-110' : 'border-transparent opacity-70 group-hover:opacity-100'}`}>
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
            </div>
            <span className={`mt-3 text-[10px] md:text-xs tracking-widest uppercase font-medium ${filtroGenero === cat.id ? 'text-black' : 'text-gray-400'}`}>
              {cat.label}
            </span>
          </button>
        ))}
      </section>

      {/* 2. BOTONES DE DESCUENTO (%) */}
      <section className="w-full py-6 flex justify-center gap-4 md:gap-10 border-t border-gray-100 bg-gray-50/50">
        {descuentos.map((desc) => (
          <button 
            key={desc}
            onClick={() => setFiltroDescuento(filtroDescuento === desc ? null : desc)}
            className={`px-6 py-2 md:px-10 md:py-3 text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all border ${
              filtroDescuento === desc ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
            }`}
          >
            -{desc}% OFF
          </button>
        ))}
      </section>

      {/* BARRA DE ESTADO / LIMPIAR */}
      {(filtroGenero || filtroDescuento) && (
        <div className="w-full bg-black text-white py-3 flex justify-center items-center gap-4">
          <span className="text-[9px] md:text-[10px] tracking-widest uppercase">
            Filtrando por: {filtroGenero || 'Todo'} {filtroDescuento ? `(-${filtroDescuento}%)` : ''}
          </span>
          <button onClick={limpiarFiltros} className="text-white border-b border-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
            Limpiar filtros
          </button>
        </div>
      )}

      {/* 3. CUADRÍCULA DE PRODUCTOS (GRID PRO) */}
      <section className="w-full grow bg-white">
        <div className="w-full bg-black p-px">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black">
            
            {productosMostrar.length > 0 ? (
              productosMostrar.map((prod) => (
                <div key={prod.id} className="group bg-white flex flex-col">
                  {/* IMAGEN */}
                  <div className="relative w-full aspect-2/3 bg-[#f9f9f9] overflow-hidden">
                    <Link href={`/producto/${prod.id}`} className="absolute inset-0 z-10">
                      <img src={prod.img} alt={prod.nombre} className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                      <img src={prod.imgHover} alt={prod.nombre} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </Link>
                    
                    {/* BADGE DESCUENTO */}
                    <div className="absolute top-4 left-4 z-20 bg-red-600 text-white px-2 py-1 text-[8px] font-bold uppercase tracking-widest">
                      -{prod.descuento}%
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="w-full text-center px-4 py-5 flex flex-col items-center">
                    <span className="text-gray-400 text-[8px] tracking-[0.2em] uppercase mb-1">{prod.genero}</span>
                    <h3 className="text-black font-medium text-[10px] md:text-xs tracking-[0.15em] uppercase mb-2">
                      {prod.nombre}
                    </h3>
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
                <p className="text-black text-[10px] md:text-xs tracking-widest uppercase mb-4">No hay ofertas disponibles bajo este filtro.</p>
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
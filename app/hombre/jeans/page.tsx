'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// 1. BANNERS DE CORTES (INTACTOS)
const cortes = [
  { id: 'baggy', label: 'Baggy', img: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800&q=80' },
  { id: 'cargo', label: 'Cargo', img: 'https://images.pexels.com/photos/2881023/pexels-photo-2881023.jpeg?auto=compress&cs=tinysrgb&w=800&q=80' },
  { id: 'slim', label: 'Slim', img: 'https://images.pexels.com/photos/1040893/pexels-photo-1040893.jpeg?auto=compress&cs=tinysrgb&w=800&q=80' },
  { id: 'recto', label: 'Recto', img: 'https://images.pexels.com/photos/3775249/pexels-photo-3775249.jpeg?auto=compress&cs=tinysrgb&w=800&q=80' }
];

// 2. PRODUCTOS
const productosDb = [
  { id: 'J-01', nombre: 'Jeans Baggy 90s Vintage', precio: 2499, corte: 'baggy', color: 'Azul', tallas: ['28', '30', '32'],
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1516826957135-73318231cb6c?q=80&w=800' 
  },
  { id: 'J-02', nombre: 'Cargo Parachute Black', precio: 2799, corte: 'cargo', color: 'Negro', tallas: ['30', '32', '34'],
    img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800', 
    imgHover: 'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg?auto=compress&cs=tinysrgb&w=800&q=80'
  },
  { id: 'J-03', nombre: 'Slim Fit Essential Ice', precio: 2199, corte: 'slim', color: 'Azul', tallas: ['28', '30'],
    img: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=800'
  },
  { id: 'J-04', nombre: 'Recto Classic Raw', precio: 2299, corte: 'recto', color: 'Azul Oscuro', tallas: ['30', '32', '34'],
    img: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1511130558090-00af810c2111?q=80&w=800'
  },
  { id: 'J-05', nombre: 'Baggy Washed Grey', precio: 2599, corte: 'baggy', color: 'Gris', tallas: ['32', '34'],
    img: 'https://images.unsplash.com/photo-1516826957135-73318231cb6c?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800' 
  },
  { id: 'J-06', nombre: 'Cargo Utility Sand', precio: 2899, corte: 'cargo', color: 'Arena', tallas: ['28', '30', '32'],
    img: 'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', 
    imgHover: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800'
  },
  { id: 'J-07', nombre: 'Slim Dark Night', precio: 2199, corte: 'slim', color: 'Negro', tallas: ['28', '30', '32', '34'],
    img: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800'
  },
  { id: 'J-08', nombre: 'Recto Selvedge 14oz', precio: 3199, corte: 'recto', color: 'Azul Oscuro', tallas: ['30', '32'],
    img: 'https://images.unsplash.com/photo-1511130558090-00af810c2111?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800'
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
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* 1. ESPACIO DEL ENCABEZADO */}
      <div className="w-full h-16 md:h-20 bg-white shrink-0" />

      {/* 2. LOS 4 BANNERS (MODIFICADOS AL ESTILO CALVIN KLEIN) */}
      {/* Se eliminó el "gap-1 px-1" para que las imágenes estén pegadas */}
      <section className="w-full grid grid-cols-4 h-[40vh] md:h-[65vh] bg-white">
        {cortes.map((corte) => (
          <div 
            key={corte.id} 
            onClick={() => {
              setFiltroActivo(corte.id === filtroActivo ? null : corte.id);
              setMenuAbierto(null);
            }}
            className="group relative w-full h-full overflow-hidden cursor-pointer bg-[#f2f2f2]"
          >
            <img 
              src={corte.img} 
              alt={`Corte ${corte.label}`}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                filtroActivo === corte.id ? 'scale-105' : 'group-hover:scale-105'
              }`}
            />
            
            {/* Overlay sutil blanco cuando otro banner está seleccionado (sin degradados oscuros) */}
            <div className={`absolute inset-0 bg-white/60 transition-opacity duration-500 ${
              filtroActivo && filtroActivo !== corte.id ? 'opacity-100' : 'opacity-0'
            }`} />
            
            {/* Texto en negro puro, alineado abajo a la izquierda, sin upperCase forzado */}
            <div className="absolute bottom-2 left-2 md:bottom-6 md:left-6 z-30">
              <h3 className="text-black text-[11px] md:text-base font-semibold tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                {corte.label}
              </h3>
            </div>
          </div>
        ))}
      </section>

      {/* 3. BARRA DE HERRAMIENTAS (Filtros en color claro para combinar) */}
      <div className="w-full z-[90] sticky top-16 md:top-20 shadow-sm border-y border-gray-200">
        <div className="w-full bg-white text-black px-4 md:px-8 py-4 flex flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase relative z-20">
          
          <div className="flex items-center space-x-6">
            <span className="font-medium text-gray-500">{productosMostrar.length} ARTÍCULOS</span>
            {(filtroActivo || filtroTalla || filtroColor || orden) && (
              <button 
                onClick={limpiarFiltros}
                className="text-black hover:text-gray-500 transition-colors border-b border-transparent hover:border-black"
              >
                LIMPIAR TODO
              </button>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <button 
                onClick={() => setMenuAbierto(menuAbierto === 'talla' ? null : 'talla')}
                className={`transition-opacity ${filtroTalla ? 'text-black font-bold border-b border-black' : 'hover:opacity-70'}`}
              >
                {filtroTalla ? `TALLA: ${filtroTalla}` : 'TALLAR'}
              </button>
            </div>

            <div className="relative hidden md:block">
              <button 
                onClick={() => setMenuAbierto(menuAbierto === 'color' ? null : 'color')}
                className={`transition-opacity ${filtroColor ? 'text-black font-bold border-b border-black' : 'hover:opacity-70'}`}
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

        {menuAbierto && (
          <div className="absolute top-full left-0 w-full bg-white text-black border-b border-gray-200 shadow-md z-10 px-8 py-6 text-xs tracking-widest uppercase">
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

      {/* 4. CATÁLOGO DE PRODUCTOS */}
      <section className="w-full grow bg-white pb-12">
        <div className="w-full bg-white p-px">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
            {productosMostrar.length > 0 ? (
              productosMostrar.map((prod) => (
                <div key={prod.id} className="group bg-white flex flex-col relative">
                  <div className="relative w-full aspect-[3/4] md:aspect-[2/3] bg-[#f6f6f6] overflow-hidden">
                    <Link href={`/producto/${prod.id}`} className="absolute inset-0 z-10">
                      <img 
                        src={prod.img} 
                        alt={prod.nombre}
                        className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <img 
                        src={prod.imgHover} 
                        alt={`${prod.nombre} hover`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </Link>
                    <button className="absolute top-4 right-4 z-20 text-black hover:text-gray-400 transition bg-white/50 p-2 rounded-full backdrop-blur-sm">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <Link href={`/producto/${prod.id}`} className="w-full text-left px-4 py-5 flex flex-col">
                    <p className="text-gray-500 text-[10px] md:text-xs tracking-widest mb-1">
                      ${prod.precio.toLocaleString('es-MX')} MXN
                    </p>
                    <h3 className="text-black font-medium text-[11px] md:text-sm tracking-wide capitalize">
                      {prod.nombre.toLowerCase()}
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
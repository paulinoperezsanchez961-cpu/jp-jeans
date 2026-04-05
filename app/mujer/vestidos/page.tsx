'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// 1. BASE DE DATOS DE VESTIDOS
const productosDb = [
  { id: 'VM-01', nombre: 'Vestido Midi Seda', precio: 1899, tono: 'Claro', tallas: ['CH', 'M'],
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800' 
  },
  { id: 'VM-02', nombre: 'Mini Vestido Denim', precio: 1499, tono: 'Oscuro', tallas: ['CH', 'M', 'G'],
    img: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=800'
  },
  { id: 'VM-03', nombre: 'Vestido Ajustado Black', precio: 1699, tono: 'Oscuro', tallas: ['M', 'G'],
    img: 'https://images.unsplash.com/photo-1539109136881-3be0616bc469?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800'
  },
  { id: 'VM-04', nombre: 'Vestido Lino White', precio: 2199, tono: 'Claro', tallas: ['CH', 'M', 'G'],
    img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800'
  },
  { id: 'VM-05', nombre: 'Vestido Noche Satin', precio: 2899, tono: 'Oscuro', tallas: ['G'],
    img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1539109136881-3be0616bc469?q=80&w=800' 
  },
  { id: 'VM-06', nombre: 'Vestido Flores Soft', precio: 1299, tono: 'Claro', tallas: ['CH', 'M', 'G'],
    img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800'
  }
];

export default function VestidosPage() {
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
    // CORRECCIÓN: Le quité el "pt-16 md:pt-20" a este div principal para que el fondo empiece pegado al techo.
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* ESPACIO PARA NAVBAR */}
      {/* Este bloque negro ahora sí queda pegado hasta arriba y sirve de fondo para tu menú transparente */}
      <div className="w-full h-16 md:h-20 bg-black shrink-0" />

      {/* TÍTULO VESTIDOS */}
      <div className="w-full pt-8 pb-10 md:pt-12 md:pb-16 text-center bg-white relative z-10">
        <h1 className="text-black text-3xl md:text-5xl font-light tracking-[0.3em] uppercase">
          Vestidos
        </h1>
        <p className="text-gray-400 text-[10px] md:text-xs tracking-[0.2em] mt-4 uppercase">
          Colección Mujer JP Jeans
        </p>
      </div>

      {/* BARRA DE FILTROS (STICKY SIN LOGO) */}
      <div className="w-full z-90 sticky top-16 md:top-20 shadow-sm relative">
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

      {/* CUADRÍCULA DE PRODUCTOS (GRID PRO CON LÍNEA FINA DE 1PX) */}
      <section className="w-full grow bg-white">
        <div className="w-full bg-black p-px">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black">
            
            {productosMostrar.length > 0 ? (
              productosMostrar.map((prod) => (
                <div key={prod.id} className="group bg-white flex flex-col">
                  {/* IMAGEN CON HOVER */}
                  <div className="relative w-full aspect-2/3 bg-[#f9f9f9] overflow-hidden">
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
                <p className="text-black text-xs md:text-sm tracking-widest uppercase mb-4">No hay vestidos que coincidan con tu búsqueda.</p>
                <button onClick={limpiarFiltros} className="border-b border-black text-black text-xs font-bold uppercase tracking-widest pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Ver todos los vestidos
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
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// 1. BASE DE DATOS MAESTRA DE NOVEDADES
// Mezclamos productos de Hombre y Mujer y les asignamos una "fecha" de lanzamiento.
const productosDb = [
  { id: 'J-01', nombre: 'Jeans Baggy 90s Vintage', precio: 2499, genero: 'Hombre', fecha: '2026-04-02',
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1516826957135-73318231cb6c?q=80&w=800' 
  },
  { id: 'VM-01', nombre: 'Vestido Midi Seda', precio: 1899, genero: 'Mujer', fecha: '2026-04-01',
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800' 
  },
  { id: 'CH-02', nombre: 'Chaqueta Aviador Black', precio: 4599, genero: 'Hombre', fecha: '2026-03-30',
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=800'
  },
  { id: 'AM-01', nombre: 'Bolso de Hombro Mini', precio: 1899, genero: 'Mujer', fecha: '2026-04-03',
    img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800' 
  },
  { id: 'PL-01', nombre: 'Playera Oversize Black', precio: 799, genero: 'Hombre', fecha: '2026-03-28',
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?q=80&w=800' 
  },
  { id: 'CHM-05', nombre: 'Puffer Cropped Nocturna', precio: 3499, genero: 'Mujer', fecha: '2026-04-04', // <-- El más nuevo
    img: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=800' 
  },
  { id: 'AH-03', nombre: 'Cadena Plata 925', precio: 1899, genero: 'Hombre', fecha: '2026-03-25',
    img: 'https://images.unsplash.com/photo-1599643478514-4a48489c1653?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800'
  },
  { id: 'JM-03', nombre: 'Wide Leg Essential', precio: 2199, genero: 'Mujer', fecha: '2026-03-29',
    img: 'https://images.unsplash.com/photo-1604135307399-86c6ce0aba8e?q=80&w=800', 
    imgHover: 'https://images.unsplash.com/photo-1528650774618-80f4f910609f?q=80&w=800'
  }
];

export default function NovedadesPage() {
  const [filtroGenero, setFiltroGenero] = useState<string | null>(null);

  // EFECTO PARA LEER LA URL (Ej. si vienen de /novedades?genero=hombre)
  useEffect(() => {
    // Leemos la URL actual sin romper el servidor de Next.js
    const params = new URLSearchParams(window.location.search);
    const generoURL = params.get('genero');
    if (generoURL) {
      // Capitalizamos la primera letra (hombre -> Hombre)
      setFiltroGenero(generoURL.charAt(0).toUpperCase() + generoURL.slice(1).toLowerCase());
    }
  }, []);

  // 2. EL ALGORITMO DE ORDENAMIENTO (De más nuevo a más viejo)
  const productosOrdenados = [...productosDb].sort((a, b) => {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  // APLICAR EL FILTRO DE GÉNERO
  let productosMostrar = productosOrdenados;
  if (filtroGenero) {
    productosMostrar = productosMostrar.filter(p => p.genero === filtroGenero);
  }

  const limpiarFiltros = () => {
    setFiltroGenero(null);
    // Limpiamos la URL visualmente
    window.history.replaceState({}, '', '/novedades');
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col font-sans">
      
      {/* BANNER PRINCIPAL (HERO) - Pantalla completa con pareja (Hombre y Mujer) */}
      <section className="w-full h-[85vh] md:h-screen relative overflow-hidden">
        {/* Imagen de una pareja/estilo mixto streetwear */}
        <img
          src="https://images.unsplash.com/photo-1520023814866-ab7284b23821?q=80&w=2000"
          alt="Novedades JP Jeans"
          className="w-full h-full object-cover object-top"
        />
        {/* Overlay oscuro para que las letras resalten perfectamente */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-10 left-6 md:bottom-16 md:left-12 text-white z-10">
          <h1 className="text-4xl md:text-6xl tracking-[0.3em] uppercase font-light drop-shadow-xl">
            Novedades
          </h1>
          <h2 className="mt-4 text-xs md:text-sm tracking-[0.4em] uppercase font-bold drop-shadow-md">
            Hombre & Mujer
          </h2>
        </div>
      </section>

      {/* BARRA DE FILTROS STICKY */}
      <div className="w-full z-50 sticky top-16 md:top-20 shadow-sm bg-black">
        <div className="w-full text-white px-4 md:px-8 py-5 md:py-6 flex flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase relative z-20">
          
          <div className="flex items-center space-x-6">
            <span>{productosMostrar.length} NUEVOS INGRESOS</span>
            {filtroGenero && (
              <button onClick={limpiarFiltros} className="text-gray-400 hover:text-white transition-colors border-b border-gray-400 hover:border-white">
                VER TODOS
              </button>
            )}
          </div>

          <div className="flex items-center justify-end space-x-8">
            <button 
              onClick={() => {
                setFiltroGenero(filtroGenero === 'Mujer' ? null : 'Mujer');
                window.history.replaceState({}, '', '/novedades' + (filtroGenero === 'Mujer' ? '' : '?genero=mujer'));
              }}
              className={`transition-opacity ${filtroGenero === 'Mujer' ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              Mujer
            </button>

            <button 
              onClick={() => {
                setFiltroGenero(filtroGenero === 'Hombre' ? null : 'Hombre');
                window.history.replaceState({}, '', '/novedades' + (filtroGenero === 'Hombre' ? '' : '?genero=hombre'));
              }}
              className={`transition-opacity ${filtroGenero === 'Hombre' ? 'border-b border-white font-bold' : 'hover:opacity-70'}`}
            >
              Hombre
            </button>
          </div>
        </div>
      </div>

      {/* CUADRÍCULA DE PRODUCTOS (Revuelta por defecto, filtrada por botones) */}
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
                    
                    {/* ETIQUETA DE "NUEVO" (Exclusiva de esta página) */}
                    <div className="absolute top-4 left-4 z-20 bg-white/90 text-black px-2 py-1 text-[8px] tracking-[0.2em] font-bold uppercase">
                      New
                    </div>

                    <button className="absolute top-4 right-4 z-20 text-black hover:text-gray-400 transition">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* INFORMACIÓN */}
                  <Link href={`/producto/${prod.id}`} className="w-full text-center px-4 py-5 flex flex-col items-center">
                    {/* Agregué el género para que se distinga en la vista general */}
                    <span className="text-gray-400 text-[8px] tracking-[0.2em] uppercase mb-1">{prod.genero}</span>
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
                <p className="text-black text-xs md:text-sm tracking-widest uppercase mb-4">No hay novedades por el momento.</p>
                <button onClick={limpiarFiltros} className="border-b border-black text-black text-xs font-bold uppercase tracking-widest pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Ver todas las novedades
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
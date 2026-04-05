'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';

const imagenes = {
  // IMÁGENES SEPARADAS PARA EL HERO SEGÚN EL DISPOSITIVO
  heroDesktop: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000', // Foto horizontal para PC
  heroMobile: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',  // Foto vertical para Celular
  
  // IMÁGENES DE CATEGORÍAS
  jeans: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800',
  vestidos: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
  chamarras: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800',
  accesorios: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800'
};

export default function MujerLandingPage() {
  return (
    <div className="bg-white min-h-screen w-full flex flex-col">

      {/* HERO (MÁS GRANDE: 85vh en celular, pantalla completa en PC) */}
      <section className="w-full h-[85vh] md:h-screen relative overflow-hidden">
        
        {/* Imagen Celular (Se oculta en pantallas medianas y grandes) */}
        <img
          src={imagenes.heroMobile}
          alt="Colección Mujer Celular"
          className="w-full h-full object-cover block md:hidden"
        />
        
        {/* Imagen PC (Se oculta en celulares) */}
        <img
          src={imagenes.heroDesktop}
          alt="Colección Mujer PC"
          className="w-full h-full object-cover hidden md:block"
        />
        
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute bottom-12 left-6 md:bottom-16 md:left-12 text-white z-10">
          <h1 className="text-2xl md:text-4xl tracking-[0.3em] uppercase font-light drop-shadow-lg">
            Mujer
          </h1>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="w-full px-4 md:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[
            { href: '/mujer/jeans', label: 'Jeans', img: imagenes.jeans },
            { href: '/mujer/vestidos', label: 'Vestidos', img: imagenes.vestidos },
            { href: '/mujer/chamarras', label: 'Chamarras', img: imagenes.chamarras },
            { href: '/mujer/accesorios', label: 'Accesorios', img: imagenes.accesorios }
          ].map((item, i) => (
            <Link key={i} href={item.href} className="group block">

              <div className="relative w-full aspect-2/3 overflow-hidden bg-gray-100">
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* SOMBRA SÚPER OSCURA PARA QUE RESALTEN LAS LETRAS */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />

                {/* AQUÍ ESTÁN LAS LETRAS */}
                <div className="absolute bottom-6 left-4 md:bottom-8 md:left-6 z-20">
                  <h3 className="text-white text-xs md:text-sm tracking-[0.25em] uppercase font-bold drop-shadow-lg">
                    {item.label}
                  </h3>
                </div>

              </div>

            </Link>
          ))}

        </div>
      </section>

      {/* DESCRIPCIÓN */}
      <section className="w-full py-20 px-6 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-black text-xl md:text-2xl tracking-[0.3em] uppercase font-light mb-6">
            La Colección Mujer
          </h2>
          <p className="text-black text-xs md:text-sm tracking-[0.2em] leading-loose uppercase">
            Redefiniendo el streetwear de lujo a través de siluetas estructuradas y materiales de primer nivel.
            Cada pieza ha sido diseñada meticulosamente para mantener la esencia pura de JP Jeans.
            Exclusividad y corte perfecto en cada detalle.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
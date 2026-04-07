'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext'; 
// 1. IMPORTACIONES DE CLERK (Actualizado a la versión Core 3)
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { setIsCartOpen, cartCount } = useCart(); 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Novedades', href: '/novedades' },
    { name: 'Mujer', href: '/mujer' },
    { name: 'Hombre', href: '/hombre' },
    { name: 'Niña', href: '/nina' },
    { name: 'Niño', href: '/nino' },
    { name: 'Rebajas', href: '/rebajas' },
  ];

  return (
    <>
      <header className={`fixed w-full top-0 z-[100] transition-colors duration-300 h-16 md:h-20 ${isScrolled || mobileMenuOpen ? 'bg-black border-b border-white/10' : 'bg-transparent'}`}>
        <div className="w-full max-w-[1450px] mx-auto px-4 md:px-6 h-full flex justify-between items-center">
          
          <div className="flex-1 flex items-center">
            <nav className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-[13px] font-sans tracking-widest uppercase transition-colors duration-200 text-white hover:text-white/70 drop-shadow-md">
                  {link.name}
                </Link>
              ))}
            </nav>
            <button className="md:hidden text-white p-2 -ml-2 hover:opacity-70 transition-opacity" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <Link href="/" className="transition-opacity hover:opacity-70 flex items-center justify-center">
              <img src="/JpJeans%20Blanco.png" alt="JP Jeans Logo" className="h-8 md:h-12 w-auto object-contain drop-shadow-lg" />
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-end space-x-3 md:space-x-6">
            <button className="text-white drop-shadow-md transition-colors hover:text-white/70 hidden sm:block">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
            
            {/* ================= BOTÓN DE CUENTA (CLERK CORE 3) ================= */}
            <div className="flex items-center justify-center">
              
              {/* Cuando no ha iniciado sesión */}
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-white drop-shadow-md transition-colors hover:text-white/70 flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </button>
                </SignInButton>
              </Show>

              {/* Cuando ya inició sesión */}
              <Show when="signed-in">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-5 h-5 md:w-6 md:h-6 rounded-full border border-white/20 hover:border-white transition-colors"
                    }
                  }}
                />
              </Show>
              
            </div>
            {/* ========================================================== */}

            {/* BOTÓN DEL CARRITO */}
            <button onClick={() => setIsCartOpen(true)} className="text-white drop-shadow-md transition-colors relative hover:text-white/70 flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full bg-white text-black font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[80] bg-black pt-24 px-6 md:hidden">
            <nav className="flex flex-col space-y-8 mt-10">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif tracking-[0.2em] uppercase text-white border-b border-white/10 pb-4">{link.name}</Link>
              ))}
              
              {/* Botón de cuenta extra para el menú móvil */}
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif tracking-[0.2em] uppercase text-white/50 text-left hover:text-white transition-colors">
                    Iniciar Sesión
                  </button>
                </SignInButton>
              </Show>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
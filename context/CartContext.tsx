'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

// Estructura de cómo se guardará una prenda en la bolsa
export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Función para añadir ropa
  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      // Si la prenda y talla ya están, solo sumamos la cantidad
      const existing = prev.find(i => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map(i => i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    openCart(); // Despliega la bolsa automáticamente para mostrar que se añadió
  };

  // Función para eliminar ropa
  const removeFromCart = (id: string, size: string) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && i.size === size)));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, openCart, closeCart, addToCart, removeFromCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};
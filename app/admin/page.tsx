'use client';

import { useState, useRef, useEffect } from 'react';
import ImageCropper from '../../components/ImageCropper'; 

// 🚨 AQUÍ VA LA URL DE TU SERVIDOR NODE.JS EN HOSTINGER (Igual que en el POS)
const BASE_URL = 'http://jpjeansvip.com/api'; // Cambia esto por tu URL real (ej. https://tudominio.com/api)

export default function AdminDashboard() {
  const [menuActivo, setMenuActivo] = useState<'hero' | 'cortes' | 'textos' | 'productos'>('productos');
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState('');

  // Estados del Cropper
  const [fotoEnProceso, setFotoEnProceso] = useState<string | null>(null);
  const [aspectRatioActual, setAspectRatioActual] = useState<number>(1);
  const [campoDestino, setCampoDestino] = useState<string>('');
  const archivoInputRef = useRef<HTMLInputElement>(null);

  // =========================================================
  // 🧠 ESTADOS DE DATOS REALES (CONEXIÓN BD)
  // =========================================================
  const [inventarioCrudo, setInventarioCrudo] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  
  // Formulario del Producto
  const [prodSeleccionadoId, setProdSeleccionadoId] = useState('');
  const [nombreWeb, setNombreWeb] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [corte, setCorte] = useState('');
  const [fotosProducto, setFotosProducto] = useState<string[]>(['', '', '', '', '']);

  // Cargar el inventario al entrar
  useEffect(() => {
    if (autenticado) {
      fetch(`${BASE_URL}/bodega/inventario`)
        .then(res => res.json())
        .then(data => {
          if (data.exito) setInventarioCrudo(data.productos);
        })
        .catch(err => console.error("Error al cargar inventario:", err));
    }
  }, [autenticado]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'jpjeans2026') setAutenticado(true);
    else alert('Contraseña incorrecta');
  };

  // --- Lógica del Cropper ---
  const onArchivoSeleccionado = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setFotoEnProceso(reader.result?.toString() || null));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const iniciarCargaFoto = (campo: string, proporcion: number) => {
    setCampoDestino(campo);
    setAspectRatioActual(proporcion);
    if (archivoInputRef.current) archivoInputRef.current.click();
  };

  const aplicarRecorte = (imagenRecortadaBase64: string) => {
    if (campoDestino.startsWith('prod_')) {
      const index = parseInt(campoDestino.split('_')[1]);
      const nuevasFotos = [...fotosProducto];
      nuevasFotos[index] = imagenRecortadaBase64;
      setFotosProducto(nuevasFotos);
    }
    setFotoEnProceso(null);
    if (archivoInputRef.current) archivoInputRef.current.value = '';
  };

  // =========================================================
  // 🚀 MOTOR DE SUBIDA: EMPAQUETA Y ENVÍA AL CEREBRO
  // =========================================================
  const base64ToFile = async (base64: string, filename: string) => {
    const res = await fetch(base64);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/jpeg' });
  };

  const publicarProductoWeb = async () => {
    if (!prodSeleccionadoId || !nombreWeb) {
      alert("Selecciona un producto y ponle nombre comercial."); return;
    }
    setCargando(true);

    try {
      const formData = new FormData();
      formData.append('nombre_web', nombreWeb);
      formData.append('descripcion', descripcion);
      formData.append('categoria', categoria);
      formData.append('tipo', tipo);
      formData.append('corte', corte);

      // Convertimos los Base64 a archivos reales JPG
      for (let i = 0; i < fotosProducto.length; i++) {
        if (fotosProducto[i]) {
          const file = await base64ToFile(fotosProducto[i], `lujo_${prodSeleccionadoId}_foto${i}.jpg`);
          formData.append('fotos', file);
        }
      }

      const res = await fetch(`${BASE_URL}/oficina/publicar-web/${prodSeleccionadoId}`, {
        method: 'PUT',
        body: formData
      });

      const data = await res.json();
      if (data.exito) {
        alert("✅ Producto publicado con éxito en la Web");
        // Limpiamos formulario
        setProdSeleccionadoId(''); setNombreWeb(''); setDescripcion(''); setFotosProducto(['', '', '', '', '']);
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  // --- Render del Login ---
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center flex-col px-4 text-white">
        <h1 className="text-3xl font-light tracking-[0.3em] uppercase mb-8">Bóveda JP Jeans</h1>
        <form onSubmit={login} className="flex flex-col gap-4 w-full max-w-sm">
          <input type="password" placeholder="CONTRASEÑA DE DIRECCIÓN" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-white/20 p-4 text-center tracking-[0.2em] focus:border-white outline-none" />
          <button type="submit" className="bg-white text-black font-bold tracking-[0.2em] uppercase py-4 mt-4 hover:bg-gray-200">Ingresar al Sistema</button>
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden font-sans text-black relative">
      <input type="file" accept="image/*" ref={archivoInputRef} onChange={onArchivoSeleccionado} className="hidden" />
      {fotoEnProceso && (
        <ImageCropper imageSrc={fotoEnProceso} aspectRatio={aspectRatioActual} onCropComplete={aplicarRecorte} onCancel={() => { setFotoEnProceso(null); if (archivoInputRef.current) archivoInputRef.current.value = ''; }} />
      )}

      {/* PANEL IZQUIERDO */}
      <div className="w-[45%] h-full flex flex-col border-r border-gray-300 bg-[#f9f9f9]">
        <div className="h-20 bg-black text-white flex items-center justify-between px-6 shrink-0">
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase">E-Commerce Manager</h2>
        </div>

        <div className="flex border-b border-gray-300 bg-white shrink-0 overflow-x-auto hide-scrollbar">
          {[
            { id: 'productos', label: 'Catálogo y Fotos' },
            { id: 'hero', label: 'Banners Principales' },
            { id: 'textos', label: 'Textos Web' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setMenuActivo(tab.id as any)} className={`px-6 py-4 text-[10px] tracking-widest uppercase whitespace-nowrap transition-colors ${menuActivo === tab.id ? 'border-b-2 border-black font-bold' : 'text-gray-500 hover:text-black'}`}>{tab.label}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          
          {menuActivo === 'productos' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="font-bold tracking-widest uppercase border-b border-gray-200 pb-2">Enriquecimiento de Catálogo</h3>
              
              {/* 1. SELECCIÓN DINÁMICA */}
              <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Paso 1: Seleccionar Mercancía (De Bodega)</span>
                  <select 
                    value={prodSeleccionadoId} 
                    onChange={(e) => setProdSeleccionadoId(e.target.value)}
                    className="border p-3 text-xs w-full bg-gray-50 outline-none"
                  >
                      <option value="">Selecciona un artículo crudo de bodega...</option>
                      {inventarioCrudo.map((prod: any) => (
                        <option key={prod.id} value={prod.id}>
                          SKU: {prod.sku} - {prod.nombre} (Bodega: {prod.stock_bodega} pzs) {prod.estado_web === 1 ? '🌐 (Ya en Web)' : ''}
                        </option>
                      ))}
                  </select>
              </div>

              {/* 2. DATOS DE LUJO */}
              <div className="bg-white p-6 border border-gray-200 shadow-sm space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Paso 2: Textos y Algoritmo</span>
                  
                  <input type="text" value={nombreWeb} onChange={e => setNombreWeb(e.target.value)} placeholder="Nombre Comercial (Ej. Baggy Jean Structured Wash)" className="w-full border p-3 text-xs uppercase outline-none focus:border-black" />
                  <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Redactar descripción de lujo para la venta en línea..." className="w-full border p-3 text-xs h-24 outline-none focus:border-black"></textarea>
                  
                  <div className="flex gap-4">
                      <select value={categoria} onChange={e => setCategoria(e.target.value)} className="border p-3 text-xs w-full outline-none">
                        <option value="">Categoría</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Kids">Kids</option>
                      </select>
                      <select value={corte} onChange={e => setCorte(e.target.value)} className="border p-3 text-xs w-full outline-none">
                        <option value="">Corte / Ajuste</option>
                        <option value="Baggy">Baggy</option>
                        <option value="Skinny">Skinny</option>
                        <option value="Recto">Recto</option>
                        <option value="Wide Leg">Wide Leg</option>
                      </select>
                  </div>
              </div>

              {/* 3. LAS 5 FOTOS */}
              <div className="bg-white p-6 border border-gray-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-4 block">Paso 3: Las 5 Fotos de Estudio (Recorte 2:3)</span>
                  <div className="grid grid-cols-5 gap-2 mt-4">
                      {fotosProducto.map((foto, index) => (
                          <div key={index} onClick={() => iniciarCargaFoto(`prod_${index}`, 2/3)} className="aspect-[2/3] bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden relative group">
                              {foto ? (
                                <><img src={foto} alt={`Foto ${index}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center"><span className="text-[8px] text-white font-bold uppercase">Cambiar</span></div></>
                              ) : (
                                <span className="text-[8px] text-gray-400 font-bold uppercase text-center px-1">{index === 0 ? 'Principal' : `Extra ${index}`}</span>
                              )}
                          </div>
                      ))}
                  </div>
              </div>

              {/* BOTÓN MAESTRO */}
              <button 
                onClick={publicarProductoWeb}
                disabled={cargando}
                className="w-full bg-green-600 text-white font-bold tracking-widest uppercase py-4 shadow-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {cargando ? 'ENVIANDO A HOSTINGER...' : '🚀 PUBLICAR PRODUCTO EN LA WEB'}
              </button>

            </div>
          )}
        </div>
      </div>

      {/* PANEL DERECHO: EL SIMULADOR */}
      <div className="w-[55%] h-full bg-gray-200 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Vista Previa en Vivo</span>
        </div>
        <div className="flex-1 w-full bg-white rounded-xl shadow-xl overflow-hidden border-4 border-black">
          <iframe src="http://localhost:3000/?preview=true" className="w-full h-full" title="Simulador JP Jeans" />
        </div>
      </div>
    </div>
  );
}
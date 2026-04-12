'use client';

import { useState, useRef, useEffect } from 'react';
import ImageCropper from '../../components/ImageCropper'; 

const BASE_URL = 'https://api.jpjeansvip.com/api'; 
const API_DOMAIN = 'https://api.jpjeansvip.com'; 

// =========================================================
// 🧠 DICCIONARIO MAESTRO DE ESCAPARATE WEB
// =========================================================
type BannerConfig = { id: string; titulo: string; tipo: 'hero' | 'tarjeta' | 'lista'; aspect?: number; aspectDesktop?: number; aspectMobile?: number; };
const SECCIONES_BANNERS: Record<string, BannerConfig[]> = {
  inicio: [
    { id: 'hero_1', titulo: 'Hero Principal - Slide 1', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 },
    { id: 'hero_2', titulo: 'Hero Principal - Slide 2', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 },
    { id: 'hero_3', titulo: 'Hero Principal - Slide 3', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 },
    { id: 'c_vert_list', titulo: 'Carrusel Central Vertical', tipo: 'lista', aspect: 2/3 },
    { id: 'home_mujer', titulo: 'Sección Portada: MUJER', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 },
    { id: 'home_hombre', titulo: 'Sección Portada: HOMBRE', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 },
    { id: 'home_nina', titulo: 'Sección Portada: NIÑA', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 },
    { id: 'home_nino', titulo: 'Sección Portada: NIÑO', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 },
    { id: 'home_rebajas', titulo: 'Sección Portada: REBAJAS', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 },
  ],
  hombre: [
    { id: 'hombre', titulo: 'Hero Hombre', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 },
    { id: 'h_cat_jeans', titulo: 'Categoría: Jeans', tipo: 'tarjeta', aspect: 2/3 },
    { id: 'h_cat_chamarras', titulo: 'Categoría: Chamarras', tipo: 'tarjeta', aspect: 2/3 },
    { id: 'h_cat_playeras', titulo: 'Categoría: Playeras', tipo: 'tarjeta', aspect: 2/3 },
    { id: 'h_cat_accesorios', titulo: 'Categoría: Accesorios', tipo: 'tarjeta', aspect: 2/3 },
    { id: 'h_corte_baggy', titulo: 'Corte Jeans: Baggy', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'h_corte_cargo', titulo: 'Corte Jeans: Cargo', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'h_corte_recto', titulo: 'Corte Jeans: Recto', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'h_corte_slim', titulo: 'Corte Jeans: Slim', tipo: 'tarjeta', aspect: 9/16 },
  ],
  mujer: [
    { id: 'mujer', titulo: 'Hero Mujer', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 },
    { id: 'm_cat_jeans', titulo: 'Categoría: Jeans', tipo: 'tarjeta', aspect: 2/3 },
    { id: 'm_cat_vestidos', titulo: 'Categoría: Vestidos y Faldas', tipo: 'tarjeta', aspect: 2/3 },
    { id: 'm_cat_chamarras', titulo: 'Categoría: Chamarras', tipo: 'tarjeta', aspect: 2/3 },
    { id: 'm_cat_accesorios', titulo: 'Categoría: Accesorios', tipo: 'tarjeta', aspect: 2/3 },
    { id: 'm_corte_holgado', titulo: 'Jeans: Holgado', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_corte_wideleg', titulo: 'Jeans: Wide Leg', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_corte_recto', titulo: 'Jeans: Recto', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_corte_acampanado', titulo: 'Jeans: Acampanado', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_corte_cargo', titulo: 'Jeans: Cargo', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_corte_skinny', titulo: 'Jeans: Skinny', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_corte_colombiano', titulo: 'Jeans: Colombiano', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_corte_barrel', titulo: 'Jeans: Barrel', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_sub_vestidos', titulo: 'Sub: Vestidos', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_sub_faldas', titulo: 'Sub: Faldas', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_sub_chamarras', titulo: 'Sub: Chamarras', tipo: 'tarjeta', aspect: 9/16 },
    { id: 'm_sub_tops', titulo: 'Sub: Tops', tipo: 'tarjeta', aspect: 9/16 },
  ],
  nina: [ { id: 'nina', titulo: 'Hero Niña', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 } ],
  nino: [ { id: 'nino', titulo: 'Hero Niño', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 } ],
  rebajas: [ { id: 'rebajas', titulo: 'Hero Rebajas', tipo: 'hero', aspectDesktop: 16/9, aspectMobile: 9/16 } ],
  complementos: [
    { id: 'footer_list', titulo: 'Carrusel Horizontal (Footer)', tipo: 'lista', aspect: 16/9 },
  ]
};

export default function AdminDashboard() {
  const [menuActivo, setMenuActivo] = useState<'banners' | 'productos' | 'gestion' | 'textos'>('banners');
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState('');
  const [simuladorModo, setSimuladorModo] = useState<'mobile' | 'desktop'>('mobile');

  const [fotoEnProceso, setFotoEnProceso] = useState<string | null>(null);
  const [aspectRatioActual, setAspectRatioActual] = useState<number>(1);
  const [campoDestino, setCampoDestino] = useState<string>('');
  const archivoInputRef = useRef<HTMLInputElement>(null);

  const [inventarioCrudo, setInventarioCrudo] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [prodSeleccionadoId, setProdSeleccionadoId] = useState('');
  const [nombreWeb, setNombreWeb] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [corte, setCorte] = useState('');
  const [fotosProducto, setFotosProducto] = useState<string[]>(['', '', '', '', '']);

  const [seccionBannerActiva, setSeccionBannerActiva] = useState<string>('inicio');
  const [bannersData, setBannersData] = useState<any>({});

  useEffect(() => {
    if (autenticado) {
      cargarInventario();
      cargarBanners();
    }
  }, [autenticado]);

  const cargarInventario = () => {
    fetch(`${BASE_URL}/bodega/inventario`)
      .then(res => res.json())
      .then(data => { if (data.exito) setInventarioCrudo(data.productos); })
      .catch(console.error);
  };

  const cargarBanners = () => {
    fetch(`${BASE_URL}/web/storefront?preview=true`)
      .then(res => res.json())
      .then(data => { if (data.exito) setBannersData(data.banners); })
      .catch(console.error);
  };

  // 🚨 EL AUTO-SANADOR NATIVO (Basado en la investigación de carpeta Public)
  const getImgUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // Limpiamos rastros de URLs viejas y sucias si el servidor tenía caché
    let cleanPath = path.replace('/api/uploads/', '/uploads/').replace('/api/media/', '/uploads/');
    
    // Si la ruta trae el truco sucio de ?f=, lo eliminamos y usamos el nombre del archivo limpio
    if (cleanPath.includes('?f=')) {
        cleanPath = `/uploads/${cleanPath.split('?f=')[1]}`;
    }
    
    cleanPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    return `${API_DOMAIN}${cleanPath}`;
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'jpjeans2026') setAutenticado(true);
    else alert('Contraseña incorrecta');
  };

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

  const base64ToFile = async (base64: string, filename: string) => {
    const res = await fetch(base64);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/jpeg' });
  };

  const aplicarRecorte = async (imagenRecortadaBase64: string) => {
    if (campoDestino.startsWith('prod_')) {
      const index = parseInt(campoDestino.split('_')[1]);
      const nuevasFotos = [...fotosProducto];
      nuevasFotos[index] = imagenRecortadaBase64;
      setFotosProducto(nuevasFotos);
    } 
    else if (campoDestino.startsWith('banner|')) {
      const [, seccionId, dispositivo] = campoDestino.split('|');
      await guardarBannerEnCerebro(seccionId, dispositivo, imagenRecortadaBase64);
    }
    else if (campoDestino.startsWith('banner_lista|')) {
      const [, seccionId, indexStr] = campoDestino.split('|');
      const index = parseInt(indexStr);
      setCargando(true);
      try {
        const file = await base64ToFile(imagenRecortadaBase64, `lista_${seccionId}_${index}.jpg`);
        const fd = new FormData();
        fd.append('imagen', file);
        const resUpload = await fetch(`${BASE_URL}/oficina/upload-directo`, { method: 'POST', body: fd });
        const dataUpload = await resUpload.json();

        if (dataUpload.exito) {
          let listaActual = Array.isArray(bannersData[seccionId]) ? [...bannersData[seccionId]] : [];
          listaActual[index] = { d: dataUpload.url };

          await fetch(`${BASE_URL}/oficina/storefront/guardar-seccion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seccion: seccionId, datos: listaActual })
          });
          cargarBanners();
          if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
        } else {
          alert("Error subiendo foto a la lista");
        }
      } catch (e) { alert("Error de conexión"); }
      finally { setCargando(false); }
    }
    
    setFotoEnProceso(null);
    if (archivoInputRef.current) archivoInputRef.current.value = '';
  };

  const guardarBannerEnCerebro = async (seccion: string, dispositivo: string, base64: string) => {
    setCargando(true);
    try {
      const file = await base64ToFile(base64, `banner_${seccion}_${dispositivo}.jpg`);
      const fd = new FormData();
      fd.append('imagen', file);
      fd.append('seccion', seccion);
      fd.append('dispositivo', dispositivo);

      const response = await fetch(`${BASE_URL}/oficina/storefront/draft`, { method: 'POST', body: fd });
      const data = await response.json();
      
      if (!data.exito) {
        alert("❌ Error en el Servidor: " + (data.error || "Fallo desconocido."));
      }

      cargarBanners(); 
      if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
    } catch (e) { alert("Error de red conectando con Hostinger."); } 
    finally { setCargando(false); }
  };

  const manejarLista = async (idSeccion: string, accion: 'add' | 'remove', index?: number) => {
    let listaActual = Array.isArray(bannersData[idSeccion]) ? [...bannersData[idSeccion]] : [];
    
    if (accion === 'add') {
      listaActual.push({ d: '' });
    } else if (accion === 'remove' && index !== undefined) {
      listaActual.splice(index, 1);
    }

    setCargando(true);
    try {
      await fetch(`${BASE_URL}/oficina/storefront/guardar-seccion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seccion: idSeccion, datos: listaActual })
      });
      cargarBanners();
      if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
    } catch (e) { alert("Error al modificar la lista"); }
    finally { setCargando(false); }
  };

  const publicarProductoWeb = async () => {
    if (!prodSeleccionadoId || !nombreWeb) { alert("Selecciona un producto y ponle nombre comercial."); return; }
    setCargando(true);
    try {
      const formData = new FormData();
      formData.append('nombre_web', nombreWeb);
      formData.append('descripcion', descripcion);
      formData.append('categoria', categoria);
      formData.append('tipo', tipo);
      formData.append('corte', corte);

      for (let i = 0; i < fotosProducto.length; i++) {
        if (fotosProducto[i]) {
          const file = await base64ToFile(fotosProducto[i], `lujo_${prodSeleccionadoId}_foto${i}.jpg`);
          formData.append('fotos', file);
        }
      }

      const res = await fetch(`${BASE_URL}/oficina/publicar-web/${prodSeleccionadoId}`, { method: 'PUT', body: formData });
      const data = await res.json();
      if (data.exito) {
        alert("✅ Producto publicado con éxito en la Web");
        setProdSeleccionadoId(''); setNombreWeb(''); setDescripcion(''); setFotosProducto(['', '', '', '', '']);
        cargarInventario(); 
        if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
      } else { alert("❌ Error: " + data.error); }
    } catch (e) { alert("Error de conexión con el servidor"); } 
    finally { setCargando(false); }
  };

  const removerDeLaWeb = async (id: string, nombre: string) => {
    if(!confirm(`¿Ocultar "${nombre}" de la tienda en línea?`)) return;
    setCargando(true);
    try {
      const formData = new FormData();
      formData.append('estado_web', '0'); 
      
      const res = await fetch(`${BASE_URL}/oficina/publicar-web/${id}`, { method: 'PUT', body: formData });
      const data = await res.json();
      
      if(data.exito) {
        alert("✅ Producto ocultado de la web exitosamente.");
        cargarInventario();
        if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (e) {
      alert("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const publicarBannersEnVivo = async () => {
    if(!confirm("Esto impactará la página web en vivo mundialmente. ¿Continuar?")) return;
    try {
      await fetch(`${BASE_URL}/oficina/storefront/publicar`, { method: 'POST' });
      alert("🚀 Banners publicados mundialmente.");
    } catch (e) { alert("Error al publicar"); }
  };

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

  const productosEnWeb = inventarioCrudo.filter(p => p.estado_web === 1);

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden font-sans text-black relative pt-16 md:pt-20">
      
      <input type="file" accept="image/*" ref={archivoInputRef} onChange={onArchivoSeleccionado} className="hidden" />
      {fotoEnProceso && (
        <ImageCropper imageSrc={fotoEnProceso} aspectRatio={aspectRatioActual} onCropComplete={aplicarRecorte} onCancel={() => { setFotoEnProceso(null); if (archivoInputRef.current) archivoInputRef.current.value = ''; }} />
      )}

      <div className="w-full md:w-[45%] h-full flex flex-col border-r border-gray-300 bg-[#f9f9f9]">
        
        <div className="h-16 bg-black text-white flex items-center justify-between px-4 md:px-6 shrink-0 gap-2">
          <div className="flex items-center gap-3 md:gap-6">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase hidden xl:block">E-Commerce</h2>
            <div className="flex gap-1 bg-white/10 p-1 rounded">
              <button onClick={() => setSimuladorModo('mobile')} className={`p-1.5 rounded transition-all text-xs md:text-sm flex items-center justify-center ${simuladorModo === 'mobile' ? 'bg-white shadow text-black' : 'text-gray-400 hover:text-white'}`} title="Vista Celular">📱</button>
              <button onClick={() => setSimuladorModo('desktop')} className={`p-1.5 rounded transition-all text-xs md:text-sm flex items-center justify-center ${simuladorModo === 'desktop' ? 'bg-white shadow text-black' : 'text-gray-400 hover:text-white'}`} title="Vista Computadora">💻</button>
            </div>
          </div>
          <button onClick={publicarBannersEnVivo} className="bg-white text-black px-3 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-gray-200 shrink-0">
            Publicar Live
          </button>
        </div>

        <div className="flex border-b border-gray-300 bg-white shrink-0 overflow-x-auto hide-scrollbar">
          {[
            { id: 'banners', label: 'Escaparate Múltiple' },
            { id: 'productos', label: 'Catálogo' },
            { id: 'gestion', label: 'Control Web' },
            { id: 'textos', label: 'Textos' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setMenuActivo(tab.id as any)} className={`px-6 py-4 text-[10px] tracking-widest uppercase whitespace-nowrap transition-colors ${menuActivo === tab.id ? 'border-b-2 border-black font-bold' : 'text-gray-500 hover:text-black'}`}>{tab.label}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {menuActivo === 'banners' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-6">
                {Object.keys(SECCIONES_BANNERS).map((sec) => (
                  <button 
                    key={sec}
                    onClick={() => setSeccionBannerActiva(sec)}
                    className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold border transition-colors ${seccionBannerActiva === sec ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black'}`}
                  >
                    Sección {sec}
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                {SECCIONES_BANNERS[seccionBannerActiva].map((item) => (
                  <div key={item.id} className="bg-white p-5 border border-gray-200 shadow-sm relative overflow-hidden">
                    
                    {item.tipo === 'hero' ? (
                      <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">{item.titulo}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest">PC (Horizontal)</span>
                            <div style={{ aspectRatio: item.aspectDesktop || 16/9 }} className="w-full max-w-[200px] bg-gray-50 border border-dashed border-gray-300 relative overflow-hidden group">
                               {bannersData[item.id]?.d ? <img src={getImgUrl(bannersData[item.id].d)} className="w-full h-full object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-400">Vacío</span>}
                               <button disabled={cargando} onClick={() => iniciarCargaFoto(`banner|${item.id}|d`, item.aspectDesktop || 16/9)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[8px] uppercase font-bold transition-all">Cambiar</button>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest">Móvil (Vertical)</span>
                            <div style={{ aspectRatio: item.aspectMobile || 9/16 }} className="w-full max-w-[100px] bg-gray-50 border border-dashed border-gray-300 relative overflow-hidden group">
                               {bannersData[item.id]?.m ? <img src={getImgUrl(bannersData[item.id].m)} className="w-full h-full object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-400">Vacío</span>}
                               <button disabled={cargando} onClick={() => iniciarCargaFoto(`banner|${item.id}|m`, item.aspectMobile || 9/16)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[8px] uppercase font-bold transition-all">Cambiar</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : item.tipo === 'lista' ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <h4 className="font-bold text-[11px] uppercase tracking-widest">{item.titulo}</h4>
                          <button disabled={cargando} onClick={() => manejarLista(item.id, 'add')} className="bg-black text-white px-3 py-1.5 text-[9px] uppercase font-bold hover:bg-gray-800 transition-colors">
                            + Añadir Espacio
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(Array.isArray(bannersData[item.id]) ? bannersData[item.id] : []).map((img: any, idx: number) => (
                            <div key={idx} className="relative group mt-3">
                              <span className="absolute -top-3 left-0 text-[8px] font-bold text-gray-400 uppercase">Espacio {idx + 1}</span>
                              <div style={{ aspectRatio: item.aspect }} className="bg-gray-100 border border-dashed border-gray-300 overflow-hidden relative">
                                 {img.d ? <img src={getImgUrl(img.d)} className="w-full h-full object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-400">Vacío</span>}
                                 <button disabled={cargando} onClick={() => iniciarCargaFoto(`banner_lista|${item.id}|${idx}`, item.aspect || 1)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[8px] font-bold uppercase transition-all">Cambiar</button>
                              </div>
                              <button disabled={cargando} onClick={() => manejarLista(item.id, 'remove', idx)} className="absolute top-0 right-0 translate-x-2 -translate-y-2 bg-red-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center hover:bg-red-700 shadow-md">✕</button>
                            </div>
                          ))}
                          {(Array.isArray(bannersData[item.id]) ? bannersData[item.id] : []).length === 0 && (
                             <div className="col-span-2 md:col-span-4 p-8 text-center border border-dashed border-gray-300 bg-gray-50 mt-2">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">No hay imágenes. Añade un espacio.</p>
                             </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-[11px] uppercase tracking-widest">{item.titulo}</h4>
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest">Forzado {item.aspect === 16/9 ? 'Horizontal (16:9)' : item.aspect === 9/16 ? 'Vertical (9:16)' : 'Vertical (2:3)'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div style={{ aspectRatio: item.aspect || 1 }} className="w-[60px] bg-gray-100 border border-dashed border-gray-300 relative overflow-hidden">
                             {bannersData[item.id]?.d && <img src={getImgUrl(bannersData[item.id].d)} className="w-full h-full object-cover" />}
                          </div>
                          <button disabled={cargando} onClick={() => iniciarCargaFoto(`banner|${item.id}|d`, item.aspect || 1)} className="border border-black px-4 py-2 text-[8px] font-bold uppercase hover:bg-black hover:text-white transition-all disabled:opacity-50">Subir Foto</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {menuActivo === 'productos' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="font-bold tracking-widest uppercase border-b border-gray-200 pb-2">Enriquecimiento de Catálogo</h3>
              
              <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Paso 1: Seleccionar Crudo (De Bodega)</span>
                  <select value={prodSeleccionadoId} onChange={(e) => setProdSeleccionadoId(e.target.value)} className="border p-3 text-xs w-full bg-gray-50 outline-none">
                      <option value="">Selecciona un artículo crudo...</option>
                      {inventarioCrudo.map((prod: any) => (
                        <option key={prod.id} value={prod.id}>SKU: {prod.sku} - {prod.nombre} {prod.estado_web === 1 ? '🌐' : ''}</option>
                      ))}
                  </select>
              </div>

              <div className="bg-white p-6 border border-gray-200 shadow-sm space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Paso 2: Textos y Algoritmo</span>
                  <input type="text" value={nombreWeb} onChange={e => setNombreWeb(e.target.value)} placeholder="Nombre Comercial de Lujo" className="w-full border p-3 text-xs uppercase outline-none focus:border-black" />
                  <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Redactar descripción de lujo..." className="w-full border p-3 text-xs h-24 outline-none focus:border-black"></textarea>
                  
                  <div className="flex gap-4">
                      <select value={categoria} onChange={e => setCategoria(e.target.value)} className="border p-3 text-xs w-full outline-none">
                        <option value="">Categoría</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Niña">Niña</option>
                        <option value="Niño">Niño</option>
                      </select>
                      
                      <select value={tipo} onChange={e => setTipo(e.target.value)} className="border p-3 text-xs w-full outline-none">
                        <option value="">Tipo de Prenda</option>
                        <option value="Jeans">Jeans</option>
                        <option value="Chamarra">Chamarra</option>
                        <option value="Playera">Playera</option>
                        <option value="Accesorio">Accesorio</option>
                        <option value="Vestido">Vestido</option>
                        <option value="Falda">Falda</option>
                        <option value="Top">Top</option>
                        <option value="Sudadera">Sudadera</option>
                      </select>

                      <select value={corte} onChange={e => setCorte(e.target.value)} className="border p-3 text-xs w-full outline-none">
                        <option value="">Corte / Ajuste</option>
                        <optgroup label="Hombre">
                            <option value="baggy">Baggy</option>
                            <option value="cargo">Cargo</option>
                            <option value="recto">Recto</option>
                            <option value="slim">Slim</option>
                        </optgroup>
                        <optgroup label="Mujer">
                            <option value="holgado">Holgado</option>
                            <option value="wide-leg">Wide Leg</option>
                            <option value="recto">Recto</option>
                            <option value="acampanado">Acampanado</option>
                            <option value="cargo">Cargo</option>
                            <option value="skinny">Skinny</option>
                            <option value="colombiano">Colombiano</option>
                            <option value="barrel">Barrel</option>
                        </optgroup>
                      </select>
                  </div>
              </div>

              <div className="bg-white p-6 border border-gray-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-4 block">Paso 3: Las 5 Fotos de Estudio (Recorte 2:3)</span>
                  <div className="grid grid-cols-5 gap-2 mt-4">
                      {fotosProducto.map((foto, index) => (
                          <div key={index} onClick={() => iniciarCargaFoto(`prod_${index}`, 2/3)} className="aspect-[2/3] bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer relative overflow-hidden group">
                              {foto ? (
                                <><img src={foto} alt={`Foto ${index}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center"><span className="text-[8px] text-white font-bold uppercase">Cambiar</span></div></>
                              ) : (
                                <span className="text-[8px] text-gray-400 font-bold uppercase text-center px-1">{index === 0 ? 'Ppal' : `Extra ${index}`}</span>
                              )}
                          </div>
                      ))}
                  </div>
              </div>

              <button onClick={publicarProductoWeb} disabled={cargando} className="w-full bg-green-600 text-white font-bold tracking-widest uppercase py-4 shadow-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors">
                {cargando ? 'ENVIANDO A HOSTINGER...' : '🚀 PUBLICAR EN LA WEB'}
              </button>
            </div>
          )}

          {menuActivo === 'gestion' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="font-bold tracking-widest uppercase border-b border-gray-200 pb-2 text-red-600">Control de Daños y Visibilidad</h3>
              <div className="flex flex-col gap-2">
                {productosEnWeb.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 border border-gray-200"><p className="text-[10px] tracking-widest uppercase text-gray-400">No hay productos públicos en la web.</p></div>
                ) : (
                  productosEnWeb.map((prod) => (
                    <div key={prod.id} className="bg-white p-4 border border-gray-200 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-4">
                        <img src={getImgUrl(prod.url_foto_principal) || "https://via.placeholder.com/50"} alt={prod.nombre_web} className="w-12 h-16 object-cover bg-gray-100 border border-gray-200"/>
                        <div className="flex flex-col">
                          <span className="font-bold text-[11px] uppercase tracking-wider">{prod.nombre_web || prod.nombre}</span>
                          <span className="text-[9px] text-gray-400 tracking-widest uppercase">SKU: {prod.sku} | Bodega: {prod.stock_bodega} pzs</span>
                        </div>
                      </div>
                      <button onClick={() => removerDeLaWeb(prod.id, prod.nombre_web || prod.nombre)} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors">Ocultar</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {menuActivo === 'textos' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="font-bold tracking-widest uppercase border-b border-gray-200 pb-2">Modificador de Textos (En Vivo)</h3>
              <div className="bg-blue-50 border border-blue-200 p-6 rounded text-center">
                <span className="text-3xl mb-4 block">✏️</span>
                <p className="text-[11px] uppercase tracking-widest font-bold text-blue-800 mb-2">Conexión Dinámica Pendiente</p>
              </div>
            </div>
          )}
          
        </div>
      </div>

      <div className="hidden md:flex flex-1 h-full bg-[#e5e5e5] p-6 lg:p-10 flex-col border-l border-black overflow-y-auto items-center">
        <div 
          className={`transition-all duration-500 ease-in-out bg-white overflow-hidden relative my-auto
          ${simuladorModo === 'mobile' 
            ? 'w-[375px] min-w-[375px] h-[812px] min-h-[812px] shrink-0 rounded-[2.5rem] border-[12px] border-black shadow-[0_0_50px_rgba(0,0,0,0.2)]' 
            : 'w-full h-full rounded-2xl shadow-2xl border-[6px] border-black'}`}
        >
          <iframe ref={iframeRef} src="/?preview=true" className="w-full h-full border-none" title="Simulador JP Jeans" />
          {simuladorModo === 'mobile' && (<div className="absolute top-0 inset-x-0 h-6 flex justify-center bg-transparent pointer-events-none"><div className="w-32 h-6 bg-black rounded-b-2xl"></div></div>)}
        </div>
      </div>
    </div>
  );
}
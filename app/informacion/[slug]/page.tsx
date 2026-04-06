import Footer from '@/components/Footer';

// Esta función formatea el final de la URL para usarlo como título principal
function formatTitle(slug: string) {
  const titles: Record<string, string> = {
    'contacto': 'Contacto y Atención al Cliente',
    'envios': 'Políticas de Envíos y Entregas',
    'devoluciones': 'Políticas de Devoluciones',
    'faq': 'Preguntas Frecuentes',
    'nosotros': 'Sobre JP Jeans',
    'tiendas': 'Nuestras Ubicaciones',
    'sustentabilidad': 'Iniciativas de Sustentabilidad',
    'privacidad': 'Aviso y Política de Privacidad',
    'terminos': 'Términos y Condiciones Generales',
    'cookies': 'Política de Cookies'
  };

  return titles[slug] || slug.toUpperCase().replace('-', ' ');
}

export default function InformationPage({ params }: { params: { slug: string } }) {
  const title = formatTitle(params.slug);

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col">
      <div className="w-full h-24 border-b border-white/10" /> {/* Espaciador para el Navbar */}
      
      <main className="flex-grow max-w-4xl mx-auto px-6 py-20 w-full">
        <h1 className="text-3xl md:text-5xl font-serif font-light tracking-[0.2em] uppercase mb-12 border-b border-white/20 pb-6">
          {title}
        </h1>
        
        {/* Aquí es donde tú rellenarás la información a tu gusto más adelante */}
        <div className="prose prose-invert prose-p:font-light prose-p:tracking-wide prose-p:leading-relaxed max-w-none opacity-80">
          <p className="mb-6">
            Página en construcción. Aquí irá el texto legal o informativo correspondiente a <strong>{title}</strong>. 
            El administrador del sistema puede editar el contenido de este bloque en cualquier momento desde el panel de control o modificando el archivo fuente.
          </p>
          <p className="mb-6">
            JP Jeans es una marca registrada en Tlaxcala, México, enfocada en brindar prendas con estética industrial y de alta calidad. 
            Para cualquier duda urgente, por favor comunícate a nuestros canales oficiales de atención.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
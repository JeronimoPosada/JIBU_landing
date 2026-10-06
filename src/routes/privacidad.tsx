import { createFileRoute, Link } from '@tanstack/react-router'
import { Footer } from '../components/jibu/Footer'
import { PreferencesProvider } from '@/lib/preferences'
import { Header } from '@/components/jibu/Header'
import { Shield, Lock, Eye, UserCheck, Mail, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/privacidad')({
  head: () => ({
    meta: [
      { title: 'Política de Privacidad | JIBU' },
      { name: 'description', content: 'Política de privacidad de JIBU. Conoce cómo recopilamos, usamos y protegemos tus datos personales.' },
    ],
  }),
  component: Privacidad,
})

const sections = [
  {
    icon: Eye,
    title: '1. Información que recopilamos',
    content: 'Recopilamos información que usted nos proporciona directamente cuando utiliza nuestros servicios, se registra para obtener una cuenta, o se comunica con nosotros. Esta información puede incluir su nombre, dirección de correo electrónico, empresa, cargo y datos de uso de la plataforma.',
  },
  {
    icon: Shield,
    title: '2. Uso de la información',
    content: 'Utilizamos la información recopilada para operar, mantener y mejorar nuestros servicios, procesar integraciones, y comunicarnos con usted sobre actualizaciones, mejoras del sistema y políticas. Nunca utilizamos sus datos para fines distintos a los declarados.',
  },
  {
    icon: Lock,
    title: '3. Protección de datos',
    content: 'Implementamos medidas de seguridad técnicas y organizativas diseñadas para proteger su información personal contra acceso no autorizado, pérdida, alteración o destrucción. JIBU utiliza encriptación de extremo a extremo (E2E), conexiones TLS y arquitectura de confianza cero.',
  },
  {
    icon: UserCheck,
    title: '4. Compartir información',
    content: 'No vendemos ni alquilamos su información personal a terceros. Podemos compartir información con proveedores de servicios de confianza que nos ayudan a operar nuestro negocio (ej. infraestructura cloud), siempre bajo estrictos acuerdos de confidencialidad (NDA) y con acceso mínimo necesario.',
  },
  {
    icon: Shield,
    title: '5. Cookies y tecnologías similares',
    content: 'Utilizamos cookies técnicas esenciales para el funcionamiento del servicio, y cookies analíticas (con su consentimiento) para mejorar la experiencia de navegación. Puede gestionar sus preferencias a través de nuestro banner de consentimiento o la configuración de su navegador.',
  },
  {
    icon: UserCheck,
    title: '6. Sus derechos (Habeas Data)',
    content: 'De conformidad con la Ley 1581 de 2012 de Colombia y normas concordantes, usted tiene derecho a conocer, actualizar, rectificar y suprimir sus datos personales. También puede revocar la autorización otorgada. Para ejercer estos derechos, contáctenos en la sección de contacto.',
  },
  {
    icon: Mail,
    title: '7. Contacto',
    content: 'Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos a través de nuestro formulario de contacto o enviando un correo a: hola@jibu.co',
  },
]

function Privacidad() {
  return (
    <PreferencesProvider>
      <div className="min-h-screen bg-background flex flex-col text-foreground">
        <Header />
        <main className="flex-grow px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors mb-10">
              <ArrowLeft className="size-3" /> Volver al inicio
            </Link>

            {/* Header */}
            <div className="mb-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-flow mb-3">Legal · Privacidad</p>
              <h1 className="font-display text-5xl md:text-6xl tracking-tight text-foreground mb-4">
                Política de<br /><span className="text-flow">Privacidad</span>
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Última actualización: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Intro */}
            <div className="border border-line rounded-lg p-6 mb-10 bg-surface/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                En <strong className="text-foreground">JIBU</strong>, su privacidad es fundamental. Esta política describe cómo tratamos sus datos personales en cumplimiento de la{' '}
                <strong className="text-foreground">Ley 1581 de 2012 (Colombia)</strong> y demás normativa aplicable en LATAM.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map(({ icon: Icon, title, content }) => (
                <section key={title} className="border-b border-line pb-8 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md border border-flow/30 bg-flow/10">
                      <Icon className="size-4 text-flow" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl text-foreground mb-3">{title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PreferencesProvider>
  )
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { Footer } from '../components/jibu/Footer'
import { PreferencesProvider } from '@/lib/preferences'
import { Header } from '@/components/jibu/Header'
import { FileText, AlertTriangle, Copyright, Settings, Scale, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/terminos')({
  head: () => ({
    meta: [
      { title: 'Términos y Condiciones | JIBU' },
      { name: 'description', content: 'Términos y condiciones de uso de los servicios de JIBU.' },
    ],
  }),
  component: Terminos,
})

const sections = [
  {
    icon: CheckCircle2,
    title: '1. Aceptación de los Términos',
    content: 'Al acceder y utilizar el sitio web y los servicios de JIBU, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios. El acceso a nuestros servicios implica la aceptación plena y sin reservas de estas condiciones.',
  },
  {
    icon: Settings,
    title: '2. Uso de los Servicios',
    content: 'Usted se compromete a utilizar nuestros servicios únicamente con fines legales y empresariales legítimos. Está prohibido el uso de nuestros servicios para actividades ilícitas, incluyendo pero no limitado a: fraude, lavado de activos, o cualquier actividad que viole la legislación colombiana o internacional.',
  },
  {
    icon: FileText,
    title: '3. Cuentas de Usuario',
    content: 'Para acceder a ciertas funciones de nuestros servicios, es posible que deba crear una cuenta. Usted es responsable de mantener la confidencialidad de las credenciales de su cuenta y de toda la actividad que ocurra bajo la misma. Deberá notificarnos inmediatamente de cualquier acceso no autorizado.',
  },
  {
    icon: Copyright,
    title: '4. Propiedad Intelectual',
    content: 'El servicio y su contenido original, características, funcionalidad, metodologías de detección de fraude y algoritmos son y seguirán siendo propiedad exclusiva de JIBU y sus licenciantes. Nuestros servicios están protegidos por derechos de autor, secreto empresarial y demás propiedad intelectual.',
  },
  {
    icon: AlertTriangle,
    title: '5. Limitación de Responsabilidad',
    content: 'JIBU proporciona sus sistemas de detección con la mayor precisión técnica posible. Sin embargo, el resultado de las decisiones empresariales tomadas a partir de los datos proporcionados es responsabilidad exclusiva del cliente. JIBU no será responsable de daños indirectos, incidentales o consecuentes.',
  },
  {
    icon: Settings,
    title: '6. Confidencialidad y NDA',
    content: 'JIBU se compromete a mantener la más estricta confidencialidad sobre los datos financieros y operativos de sus clientes. Todos los empleados y contratistas de JIBU firman acuerdos de no divulgación (NDA). Esta obligación de confidencialidad persiste incluso después de la terminación del contrato de servicios.',
  },
  {
    icon: Scale,
    title: '7. Ley Aplicable y Jurisdicción',
    content: 'Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República de Colombia. Cualquier disputa derivada de estos términos será resuelta en primer lugar mediante mediación amistosa y, de no ser posible, ante los tribunales competentes de la ciudad de Bogotá D.C.',
  },
  {
    icon: Mail,
    title: '8. Contacto',
    content: 'Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos a través de nuestro formulario de contacto o enviando un correo a: hola@jibu.co',
  },
]

function Terminos() {
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
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-flow mb-3">Legal · Condiciones</p>
              <h1 className="font-display text-5xl md:text-6xl tracking-tight text-foreground mb-4">
                Términos y<br /><span className="text-flow">Condiciones</span>
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Última actualización: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Intro */}
            <div className="border border-line rounded-lg p-6 mb-10 bg-surface/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Estos términos regulan el acceso y uso de los servicios de <strong className="text-foreground">JIBU</strong>. Al usar nuestros servicios, usted confirma que tiene capacidad legal para aceptar estos términos en nombre propio o de su empresa.
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

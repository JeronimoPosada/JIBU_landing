import { createFileRoute, Link } from '@tanstack/react-router'
import { Footer } from '../components/jibu/Footer'
import { PreferencesProvider } from '@/lib/preferences'
import { Header } from '@/components/jibu/Header'
import { Shield, Lock, Server, UserCheck, AlertCircle, Mail, ArrowLeft, Key, Eye } from 'lucide-react'

export const Route = createFileRoute('/seguridad')({
  head: () => ({
    meta: [
      { title: 'Política de Seguridad y Habeas Data | JIBU' },
      { name: 'description', content: 'Política de seguridad y cumplimiento de Habeas Data de JIBU Studio. Conoce cómo protegemos tu información.' },
    ],
  }),
  component: Seguridad,
})

const sections = [
  {
    icon: Shield,
    title: '1. Introducción',
    content: 'En JIBU, la seguridad de la información es un pilar estratégico, no un requisito legal. Manejamos datos financieros sensibles de nuestros clientes y asumimos esa responsabilidad con la mayor seriedad técnica y operativa. Esta política describe nuestras medidas de seguridad y el cumplimiento del Habeas Data conforme a la Ley 1581 de 2012.',
  },
  {
    icon: Server,
    title: '2. Infraestructura y Seguridad Técnica',
    content: 'Nuestra infraestructura es cloud-native con arquitectura de confianza cero (Zero Trust). Utilizamos encriptación de extremo a extremo (E2E), conexiones HTTPS/TLS 1.3, separación de entornos (desarrollo / producción), y acceso basado en roles con principio de mínimo privilegio. Los datos en reposo se almacenan encriptados con AES-256.',
  },
  {
    icon: Key,
    title: '3. Control de Acceso',
    content: 'El acceso a los datos de clientes es estrictamente controlado. Solo el personal autorizado con necesidad legítima puede acceder a información sensible. Todos los accesos se registran en logs de auditoría inmutables. Se implementa autenticación multifactor (MFA) obligatoria para todos los operadores internos.',
  },
  {
    icon: Eye,
    title: '4. Monitoreo y Detección de Amenazas',
    content: 'Contamos con monitoreo continuo 24/7 de nuestra infraestructura. Los sistemas de detección de anomalías alertan en tiempo real ante comportamientos inusuales. Realizamos pruebas de penetración periódicas y auditorías de seguridad independientes para identificar y corregir vulnerabilidades proactivamente.',
  },
  {
    icon: UserCheck,
    title: '5. Cumplimiento de Habeas Data (Ley 1581 de 2012)',
    content: 'De conformidad con la legislación colombiana, garantizamos el derecho constitucional al Habeas Data. Todos los datos se recolectan con autorización previa, expresa e informada del titular. La finalidad del tratamiento es exclusivamente la prestación de los servicios contratados. El tratamiento se rige por los principios de legalidad, finalidad, libertad, veracidad, transparencia, acceso restringido y seguridad.',
    list: [
      'Autorización: Consentimiento previo, expreso e informado del titular.',
      'Finalidad: Datos usados únicamente para servicios de verificación y automatización.',
      'Confidencialidad: Todo el personal firma NDA con obligaciones de confidencialidad.',
      'Seguridad: Medidas técnicas y organizativas adecuadas al riesgo.',
      'Transparencia: El titular puede conocer el tratamiento de sus datos en cualquier momento.',
    ],
  },
  {
    icon: UserCheck,
    title: '6. Derechos de los Titulares',
    content: 'Como titular de datos personales, usted tiene los siguientes derechos, ejercibles de forma gratuita:',
    list: [
      'Conocer, actualizar y rectificar sus datos personales.',
      'Solicitar prueba de la autorización otorgada.',
      'Ser informado sobre el uso dado a sus datos.',
      'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).',
      'Revocar la autorización y/o solicitar la supresión de sus datos.',
      'Acceder gratuitamente a sus datos que hayan sido objeto de tratamiento.',
    ],
  },
  {
    icon: AlertCircle,
    title: '7. Gestión de Incidentes',
    content: 'En caso de una brecha de seguridad que afecte datos personales, JIBU se compromete a notificar a los titulares afectados y a la Superintendencia de Industria y Comercio dentro de los plazos legales establecidos, describiendo la naturaleza del incidente, los datos comprometidos y las medidas correctivas adoptadas.',
  },
  {
    icon: Lock,
    title: '8. Retención y Eliminación de Datos',
    content: 'Los datos personales se conservan únicamente durante el tiempo necesario para cumplir los fines declarados o las obligaciones legales aplicables. Al término de la relación contractual, los datos son eliminados de forma segura mediante métodos que impiden su recuperación, salvo que la ley exija su conservación por un período determinado.',
  },
  {
    icon: Mail,
    title: '9. Contacto de Seguridad y Privacidad',
    content: 'Para reportes de vulnerabilidades, ejercicio de derechos de Habeas Data, o cualquier consulta sobre esta política, contáctenos en: hola@jibu.studio — Respondemos todas las solicitudes de datos personales dentro de los 10 días hábiles establecidos por la ley.',
  },
]

function Seguridad() {
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
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-flow mb-3">Legal · Seguridad · Habeas Data</p>
              <h1 className="font-display text-5xl md:text-6xl tracking-tight text-foreground mb-4">
                Política de<br /><span className="text-flow">Seguridad</span>
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Última actualización: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Alert box */}
            <div className="border border-flow/30 rounded-lg p-6 mb-10 bg-flow/5">
              <div className="flex gap-3">
                <Shield className="size-5 text-flow shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Esta política aplica a todos los servicios de <strong className="text-foreground">JIBU Studio</strong> y cumple con la{' '}
                  <strong className="text-foreground">Ley 1581 de 2012</strong> de Colombia (Habeas Data) y el{' '}
                  <strong className="text-foreground">Decreto 1377 de 2013</strong> reglamentario.
                </p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map(({ icon: Icon, title, content, list }) => (
                <section key={title} className="border-b border-line pb-8 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md border border-flow/30 bg-flow/10">
                      <Icon className="size-4 text-flow" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display text-xl text-foreground mb-3">{title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
                      {list && (
                        <ul className="mt-3 space-y-2">
                          {list.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 size-1.5 rounded-full bg-flow shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
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

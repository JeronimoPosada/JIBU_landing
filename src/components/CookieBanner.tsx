import { useState, useEffect } from 'react'

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl bg-card border border-border shadow-2xl rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-card-foreground">
          <p>
            Utilizamos cookies propias y de terceros para mejorar nuestros servicios y mostrarle publicidad relacionada con sus preferencias mediante el análisis de sus hábitos de navegación. 
            Para más información, consulte nuestra <a href="/privacidad" className="text-primary hover:underline">Política de Privacidad</a>.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button 
            onClick={declineCookies}
            className="px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            Rechazar
          </button>
          <button 
            onClick={acceptCookies}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

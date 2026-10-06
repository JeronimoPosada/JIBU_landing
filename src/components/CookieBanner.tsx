import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-4xl bg-panel border border-line shadow-ledger p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <p className="eyebrow mb-2">Aviso de Privacidad</p>
              <p className="text-sm text-muted-foreground">
                Usamos cookies esenciales para operar la plataforma y cookies analíticas para mejorar tu experiencia. 
                Los datos recolectados se gestionan bajo normativas locales. No vendemos tu información. 
                <a href="/privacidad" className="ml-1 text-flow hover:underline focus:outline-none">Leer política</a>.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button 
                onClick={declineCookies}
                className="px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] border border-line bg-surface hover:bg-line text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              >
                Rechazar
              </button>
              <button 
                onClick={acceptCookies}
                className="px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] bg-flow text-background hover:bg-flow/90 transition-colors focus:outline-none"
              >
                Aceptar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

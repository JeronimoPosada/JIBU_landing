import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || '+573105493708'
const WHATSAPP_MESSAGE = (import.meta.env.VITE_WHATSAPP_MESSAGE as string) || '¡Hola JIBU! Me interesa conocer cómo pueden ayudar a mi empresa a detectar fugas financieras.'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenSeen, setHasBeenSeen] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasBeenSeen) setIsOpen(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [hasBeenSeen])

  const handleOpen = () => {
    setIsOpen(!isOpen)
    setHasBeenSeen(true)
  }

  const handleChat = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat bubble popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative w-72 rounded-sm border border-line bg-surface shadow-ledger overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-[#25D366]/10 border-b border-[#25D366]/20 px-4 py-3">
              <div className="relative flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white shrink-0">
                <WhatsAppIcon />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface bg-[#25D366] animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">JIBU</p>
                <p className="text-[10px] text-[#25D366] font-mono uppercase tracking-wide">● En línea ahora</p>
              </div>
              <button
                onClick={() => { setIsOpen(false); setHasBeenSeen(true) }}
                className="ml-auto rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cerrar chat"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Message bubble */}
            <div className="px-4 py-4">
              <div className="rounded-sm rounded-tl-none bg-background border border-line p-3 text-sm font-mono text-muted-foreground leading-relaxed max-w-[90%]">
                👋 ¡Hola! ¿Quieres ver cómo JIBU detecta fugas financieras en tu empresa?
                <p className="mt-1 text-[10px] text-muted-foreground/60 font-mono text-right">Ahora mismo</p>
              </div>
            </div>

            {/* CTA */}
            <div className="px-4 pb-4">
              <button
                onClick={handleChat}
                className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#25D366] hover:bg-[#20bc5a] text-white text-xs uppercase tracking-[0.1em] font-mono py-3 transition-colors duration-200"
                aria-label="Iniciar conversación en WhatsApp"
              >
                <WhatsAppIcon />
                Iniciar conversación
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.div className="relative">
        {/* Ripple rings when closed */}
        {!isOpen && !reduced && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-[#25D366]/20"
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-[#25D366]/10"
              animate={{ scale: [1, 2], opacity: [0.4, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.4, ease: 'easeOut' }}
            />
          </>
        )}
        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault()
            handleOpen()
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#20bc5a] transition-colors duration-200 cursor-pointer"
          aria-label="Contactar por WhatsApp"
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-6"
              >
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </motion.svg>
            ) : (
              <motion.div
                key="whatsapp"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <WhatsAppIcon />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.a>
      </motion.div>
    </div>
  )
}

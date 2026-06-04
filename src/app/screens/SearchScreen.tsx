import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Film, Monitor, Mic, Cast } from 'lucide-react'

const sfPro = `-apple-system,'SF Pro Display','SF Pro Text','Helvetica Neue',sans-serif`

/* ── Filter icons (matching Figma: film, display, mic, airplay/cast) ── */
const FILTERS = [
  { id: 'films',   Icon: Film    },
  { id: 'tv',      Icon: Monitor },
  { id: 'audio',   Icon: Mic     },
  { id: 'cast',    Icon: Cast    },
]

/* ── QWERTY keyboard layout ── */
const KB_ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['⇧','z','x','c','v','b','n','m','⌫'],
]

interface Props { onClose: () => void }

export default function SearchScreen({ onClose }: Props) {
  const [text,         setText]         = useState('')
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [cursorOn,     setCursorOn]     = useState(true)
  const [activeFilter, setActiveFilter] = useState<number>(-1)

  /* blinking cursor */
  useEffect(() => {
    if (!showKeyboard) { setCursorOn(true); return }
    const id = setInterval(() => setCursorOn(v => !v), 530)
    return () => clearInterval(id)
  }, [showKeyboard])

  /* keyboard nav */
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showKeyboard) { setShowKeyboard(false); return }
      onClose(); return
    }
    if (!showKeyboard) {
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        setShowKeyboard(true)
      }
      return
    }
    /* keyboard active — intercept all keys */
    if (e.key === 'Enter') { setShowKeyboard(false); return }
    e.preventDefault()
    if (e.key === 'Backspace') setText(t => t.slice(0, -1))
    else if (e.key.length === 1) setText(t => t + e.key)
  }, [showKeyboard, onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 45,
        background: 'rgba(0,0,0,0.42)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        fontFamily: sfPro,
      }}
    >

      {/* ══════════════════════════════════════════════
          Content cards — switch between states
      ══════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {!showKeyboard ? (

          /* STATE 1 — 4 suggestion cards, single row */
          <motion.div
            key="suggest"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1,  y: 0  }}
            exit={{    opacity: 0,  y: -6, transition: { duration: 0.14 } }}
            transition={{ duration: 0.24 }}
            style={{
              position: 'absolute',
              top: '8vh',
              left: 'calc(110px + 20px)', right: '2.5vw',
              display: 'flex', gap: 'clamp(10px, 1vw, 18px)',
            }}
          >
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1,  y: 0  }}
                transition={{ delay: i * 0.07, duration: 0.22 }}
                style={{
                  flex: 1,
                  aspectRatio: '16 / 9',
                  borderRadius: 'clamp(12px, 1.15vw, 22px)',
                  background: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
            ))}
          </motion.div>

        ) : (

          /* STATE 2 — 2 × 4 result grid */
          <motion.div
            key="results"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1,  y: 0  }}
            exit={{    opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'absolute',
              top: '3.5vh',
              left: 'calc(110px + 20px)', right: '2.5vw',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'clamp(8px, 0.9vw, 14px)',
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1,  scale: 1    }}
                transition={{ delay: i * 0.028, duration: 0.18 }}
                style={{
                  aspectRatio: '16 / 9',
                  borderRadius: 'clamp(10px, 1vw, 18px)',
                  background: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              />
            ))}
          </motion.div>

        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════
          Search bar + filter icons
          Slides up when keyboard opens
      ══════════════════════════════════════════════ */}
      <motion.div
        animate={{ bottom: showKeyboard ? '43.5vh' : '22vh' }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'absolute',
          left: 'calc(110px + 20px)', right: '2.5vw',
          display: 'flex', alignItems: 'center',
          gap: 'clamp(8px, 0.9vw, 14px)',
        }}
      >
        {/* ── Search input ── */}
        <div style={{
          flex: 1,
          height: 'clamp(52px, 5.9vh, 72px)',
          borderRadius: 200,
          background: 'rgba(18,18,22,0.84)',
          border: showKeyboard
            ? '1.5px solid rgba(255,255,255,0.32)'
            : '1px solid rgba(255,255,255,0.16)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center',
          padding: '0 clamp(18px, 1.9vw, 30px)',
          gap: 2,
          transition: 'border 150ms',
          overflow: 'hidden',
        }}>
          <span style={{
            fontSize: 'clamp(14px, 1.35vw, 22px)',
            fontWeight: 400,
            color: text ? '#fff' : 'rgba(255,255,255,0.38)',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap', overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1,
          }}>
            {text || 'Search in the system...'}
          </span>
          {showKeyboard && (
            <span style={{
              flexShrink: 0,
              display: 'inline-block',
              width: 2,
              height: 'clamp(16px, 1.8vh, 24px)',
              background: '#fff',
              opacity: cursorOn ? 1 : 0,
              transition: 'opacity 60ms',
            }} />
          )}
        </div>

        {/* ── 4 filter icon circles ── */}
        {FILTERS.map(({ id, Icon }, i) => {
          const active = activeFilter === i
          return (
            <motion.div
              key={id}
              animate={{ scale: active ? 1.08 : 1 }}
              transition={{ duration: 0.15 }}
              onClick={() => setActiveFilter(i === activeFilter ? -1 : i)}
              style={{
                width:  'clamp(52px, 5.9vh, 72px)',
                height: 'clamp(52px, 5.9vh, 72px)',
                borderRadius: '50%', flexShrink: 0,
                background: active
                  ? 'rgba(255,255,255,0.22)'
                  : 'rgba(18,18,22,0.84)',
                border: active
                  ? '1.5px solid rgba(255,255,255,0.55)'
                  : '1px solid rgba(255,255,255,0.16)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'default',
                transition: 'background 150ms, border 150ms',
              }}
            >
              <Icon
                size={undefined}
                style={{ width: 'clamp(18px, 1.5vw, 26px)', height: 'clamp(18px, 1.5vw, 26px)' }}
                color="#fff"
                strokeWidth={1.7}
              />
            </motion.div>
          )
        })}
      </motion.div>

      {/* ══════════════════════════════════════════════
          On-screen keyboard — slides up from bottom
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showKeyboard && (
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{    y: '110%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              height: '43vh',
              background: 'rgba(38,38,42,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderTopLeftRadius: 20, borderTopRightRadius: 20,
              padding: '0.8vh 2.5vw 1.8vh',
              zIndex: 60,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Predictive suggestions row */}
            <div style={{
              display: 'flex', justifyContent: 'space-around', alignItems: 'center',
              paddingBottom: '0.7vh', marginBottom: '0.7vh',
              borderBottom: '1px solid rgba(255,255,255,0.10)',
              flexShrink: 0,
            }}>
              {['The', 'the', 'to'].map((s, i) => (
                <span
                  key={i}
                  onClick={() => setText(t => t + s + ' ')}
                  style={{
                    flex: 1, textAlign: 'center', cursor: 'pointer',
                    fontSize: 'clamp(13px, 1.25vw, 19px)',
                    color: 'rgba(255,255,255,0.85)',
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                    padding: '1px 0',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Key rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85vh', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              {KB_ROWS.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 'clamp(4px, 0.45vw, 8px)', justifyContent: 'center' }}>
                  {row.map(k => (
                    <KbKey
                      key={k} label={k}
                      special={k === '⇧' || k === '⌫'}
                      onKey={(k) => {
                        if (k === '⌫') setText(t => t.slice(0, -1))
                        else setText(t => t + k)
                      }}
                    />
                  ))}
                </div>
              ))}

              {/* Bottom row */}
              <div style={{ display: 'flex', gap: 'clamp(4px, 0.45vw, 8px)', justifyContent: 'center' }}>
                <KbKey label="🌐"    special w="clamp(38px,3.3vw,60px)"  onKey={() => {}} />
                <KbKey label=".?123" special w="clamp(52px,4.5vw,82px)"  onKey={() => {}} />
                <KbKey label="🎙"    special w="clamp(38px,3.3vw,60px)"  onKey={() => {}} />
                <div
                  onClick={() => setText(t => t + ' ')}
                  style={{
                    width: 'clamp(180px,18vw,340px)',
                    height: 'clamp(38px,4.1vh,54px)',
                    borderRadius: 'clamp(6px,0.6vw,10px)',
                    background: 'rgba(90,90,96,0.92)',
                    border: '0.5px solid rgba(255,255,255,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'clamp(12px,1.1vw,17px)',
                    color: 'rgba(255,255,255,0.45)',
                    boxShadow: '0 1px 0 rgba(0,0,0,0.45)',
                    cursor: 'pointer', userSelect: 'none',
                  }}
                >
                  space
                </div>
                <KbKey label=".?123" special w="clamp(52px,4.5vw,82px)"  onKey={() => {}} />
                <KbKey label="⌨"     special w="clamp(38px,3.3vw,60px)"  onKey={() => {}} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Single keyboard key ── */
function KbKey({
  label, onKey, special = false, w,
}: {
  label: string
  onKey: (k: string) => void
  special?: boolean
  w?: string
}) {
  return (
    <div
      onClick={() => onKey(label)}
      style={{
        width:  w ?? (special ? 'clamp(38px,3.5vw,64px)' : 'clamp(32px,3.05vw,56px)'),
        height: 'clamp(38px,4.1vh,54px)',
        borderRadius: 'clamp(6px,0.6vw,10px)',
        background: special ? 'rgba(60,60,65,0.92)' : 'rgba(90,90,96,0.92)',
        border: '0.5px solid rgba(255,255,255,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', userSelect: 'none', flexShrink: 0,
        boxShadow: '0 1px 0 rgba(0,0,0,0.45)',
        fontSize: special ? 'clamp(11px,1vw,16px)' : 'clamp(14px,1.35vw,22px)',
        fontFamily: sfPro,
        color: 'rgba(255,255,255,0.90)',
      }}
    >
      {label}
    </div>
  )
}

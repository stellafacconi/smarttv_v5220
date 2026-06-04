import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// ─── fonts ────────────────────────────────────────────────────────────────────
const sfPro     = `-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif`
const sfCompact = `'SF Compact Rounded', -apple-system, system-ui, sans-serif`

// ─── SF Symbol codepoints ─────────────────────────────────────────────────────
const SYM_APPLE  = String.fromCodePoint(0x1008FA)
const SYM_PLUS   = String.fromCodePoint(0x10017C)
const SYM_PERSON = String.fromCodePoint(0x10026A)
const SYM_GROUP  = String.fromCodePoint(0x10074B)

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const IMG_LISA   = 'https://www.figma.com/api/mcp/asset/6b56f641-2837-47d1-a723-ea97a41218b0'
const IMG_SIMON  = 'https://www.figma.com/api/mcp/asset/9442e1ff-ef6f-4508-9184-6f6747be75fa'
const IMG_PIGI   = 'https://www.figma.com/api/mcp/asset/268129b2-30ec-4769-9ee0-f0b846594f90'
const IMG_FAM_A  = 'https://www.figma.com/api/mcp/asset/a7ab42b0-8b73-42c3-bd8c-92663c516eeb'
const IMG_REMOTE = 'https://www.figma.com/api/mcp/asset/6d531163-5488-470a-84f0-6bdf9253ac58'
const ORB_C      = 'https://www.figma.com/api/mcp/asset/febd321c-a93b-4369-a24b-d27da3ebf9f2'
const ORB_BL     = 'https://www.figma.com/api/mcp/asset/02ccc8d3-a283-482f-83c1-d92b87fb3c3f'
const ORB_TR     = 'https://www.figma.com/api/mcp/asset/e62bd9ea-07f3-41fb-8669-313998e278b7'
const ORB_BR     = 'https://www.figma.com/api/mcp/asset/fd00821c-5de9-4fa4-b90f-d3e380392c57'
const ORB_TL     = 'https://www.figma.com/api/mcp/asset/a8772944-a5a5-40bb-a28d-3582f1124755'
const IMG_RING   = 'https://www.figma.com/api/mcp/asset/f4c507c5-7fe2-4309-98fc-810326d7bccc'
const IMG_RING_INNER = 'https://www.figma.com/api/mcp/asset/30ffdbaf-9bac-4af1-bcde-f802e30128c1'

// ─── types ────────────────────────────────────────────────────────────────────
export type Step = 'splash' | 'choose' | 'create' | 'setup' | 'remote' | 'tastes'
interface Props {
  onComplete: (profileId?: string) => void
  onCreateGroup?: () => void
  initialStep?: Step
  onStepChange?: (step: Step) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Apple-style screen transition
// ─────────────────────────────────────────────────────────────────────────────
const screenAnim = {
  initial: { opacity: 0, scale: 0.97, filter: 'blur(12px)' },
  animate: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0, scale: 1.015, filter: 'blur(8px)',
    transition: { duration: 0.28, ease: [0.36, 0, 0.66, -0.56] },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Remote navigation hook
// All screens navigate via ArrowLeft/Right (or Up/Down), Enter, Escape/Backspace
// ─────────────────────────────────────────────────────────────────────────────
function useRemote({
  count,
  onSelect,
  onBack,
  axis = 'horizontal',
}: {
  count: number
  onSelect: (i: number) => void
  onBack?: () => void
  axis?: 'horizontal' | 'vertical'
}) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const NEXT = e.key === 'd' || e.key === 'D' || e.key === 's' || e.key === 'S' || e.key === 'ArrowRight' || e.key === 'ArrowDown'
      const PREV = e.key === 'a' || e.key === 'A' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowLeft'  || e.key === 'ArrowUp'
      const OK   = e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' '
      const BACK = e.key === 'Escape' || e.key === 'Backspace'
      if (NEXT)      { e.preventDefault(); setIdx(i => Math.min(i + 1, count - 1)) }
      else if (PREV) { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)) }
      else if (OK)   { e.preventDefault(); onSelect(idx) }
      else if (BACK) { e.preventDefault(); onBack?.() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, count, onSelect, onBack, axis])

  return { idx, setIdx }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

/** Dark background + purple top glow */
function Bg({ bottom = false }: { bottom?: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#080708' }} />
      <div style={{
        position: 'absolute', width: '54%', height: '38%', left: '23%', top: '-22%',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(115,68,148,0.75) 0%, rgba(72,45,102,0.3) 45%, transparent 72%)',
        transform: 'rotate(180deg)',
      }} />
      {bottom && (
        <div style={{
          position: 'absolute', width: '54%', height: '38%', left: '23%', bottom: '-22%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(60,45,110,0.60) 0%, rgba(42,30,82,0.2) 45%, transparent 72%)',
        }} />
      )}
    </div>
  )
}

/** Glass circle — avatar container.
 *  Focus indication is handled by the external FocusGlow, not by this component. */
function GlassCircle({
  focused = false, onClick, children, style,
}: {
  focused?: boolean
  onClick?: () => void
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      onClick={onClick}
      animate={{ scale: focused ? 1.03 : 1 }}
      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
      style={{
        position: 'relative', borderRadius: '50%', cursor: onClick ? 'pointer' : 'default',
        backdropFilter: 'blur(50px)',
        background: focused ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.10)',
        boxShadow: '0 40px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.52)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        transition: 'background 0.28s',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

/** Space-aware traveling glow — lives at ROW level, not inside each item.
 *
 *  On every focus change it:
 *  1. Measures the real DOM positions of source and destination items
 *  2. Phase 1 (~220 ms): stretches into a pill rotated along the travel axis,
 *     width proportional to the distance it must cover
 *  3. Phase 2 (~300 ms): contracts back to match the destination item's shape
 *
 *  z-index: stays at 0; items are z-index 1 in the same stacking context → always on top.
 */
function RowGlow({
  focusIdx,
  itemRefs,
  containerRef,
  shape = 'circle',
}: {
  focusIdx:     number
  itemRefs:     React.MutableRefObject<(HTMLDivElement | null)[]>
  containerRef: React.RefObject<HTMLDivElement>
  shape?:       'circle' | 'pill'
}) {
  const [pos, setPos] = useState<{
    x: number; y: number; w: number; h: number; rotate: number
  } | null>(null)
  const [tr, setTr] = useState<object>({ duration: 0 })
  const prevIdxRef  = useRef(-1)
  const timerRef    = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const container = containerRef.current
    const toEl      = itemRefs.current[focusIdx]
    if (!container || !toEl) return

    const cRect  = container.getBoundingClientRect()
    const toRect = toEl.getBoundingClientRect()

    // Centre of destination relative to container
    const toCx = toRect.left - cRect.left + toRect.width  / 2
    const toCy = toRect.top  - cRect.top  + toRect.height / 2
    // For pills we expand height more; for circles spread evenly
    const toW  = toRect.width  * (shape === 'pill' ? 1.28 : 1.62)
    const toH  = toRect.height * (shape === 'pill' ? 2.20 : 1.62)

    if (prevIdxRef.current === -1) {
      // First paint: snap without animation
      setPos({ x: toCx - toW / 2, y: toCy - toH / 2, w: toW, h: toH, rotate: 0 })
      setTr({ duration: 0 })
      prevIdxRef.current = focusIdx
      return
    }

    const fromEl = itemRefs.current[prevIdxRef.current]
    prevIdxRef.current = focusIdx
    if (!fromEl) {
      setPos({ x: toCx - toW / 2, y: toCy - toH / 2, w: toW, h: toH, rotate: 0 })
      setTr({ duration: 0.3, ease: [0, 0, 0.2, 1] })
      return
    }

    const fromRect = fromEl.getBoundingClientRect()
    const fromCx   = fromRect.left - cRect.left + fromRect.width  / 2
    const fromCy   = fromRect.top  - cRect.top  + fromRect.height / 2

    const dx    = toCx - fromCx
    const dy    = toCy - fromCy
    const dist  = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    const midX  = (fromCx + toCx) / 2
    const midY  = (fromCy + toCy) / 2

    // Stretch width = full travel distance + item diameter; height squashes to ~half
    const stretchW = dist + toW * 0.82
    const stretchH = toH  * 0.48

    // ── Phase 1: expand along travel axis ────────────────────────────────────
    setPos({ x: midX - stretchW / 2, y: midY - stretchH / 2, w: stretchW, h: stretchH, rotate: angle })
    setTr({ duration: 0.22, ease: [0.4, 0, 0.8, 1] })

    // ── Phase 2: contract to destination shape ────────────────────────────────
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setPos({ x: toCx - toW / 2, y: toCy - toH / 2, w: toW, h: toH, rotate: 0 })
      setTr({ duration: 0.32, ease: [0, 0, 0.2, 1] })
    }, 220)
  }, [focusIdx])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  if (!pos) return null

  return (
    <motion.div
      animate={{ x: pos.x, y: pos.y, width: pos.w, height: pos.h, rotate: pos.rotate }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transition={tr as any}
      style={{
        position: 'absolute', top: 0, left: 0,
        borderRadius: 9999,
        background: 'radial-gradient(ellipse at center, rgba(118,68,152,0.68) 0%, rgba(90,52,118,0.34) 44%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

/** SF Compact Rounded pill button
 *  variant="label"  → transparent bg, just white text (used under avatar circles)
 *  variant="action" → glass/white fill (used for CTA buttons like Setup screen)
 */
function Pill({
  label, primary = false, wide = false, focused = false,
  variant = 'action', onClick,
}: {
  label: string
  primary?: boolean
  wide?: boolean
  focused?: boolean
  /** "label" = transparent (Figma default), "action" = glass fill */
  variant?: 'label' | 'action'
  onClick?: () => void
}) {
  const isLabel = variant === 'label'

  return (
    <motion.button
      onClick={onClick}
      animate={{ scale: focused ? 1.05 : 1 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      style={{
        height: 44, borderRadius: 24, padding: '0 22px', border: 'none', cursor: 'pointer',
        // Label pills: no fill at all — Figma Button node has no bg, only backdrop-blur
        backdropFilter: isLabel ? 'none' : 'blur(68px)',
        background: isLabel
          ? 'transparent'
          : primary
            ? focused ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.90)'
            : focused ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.20)',
        fontFamily: sfCompact, fontSize: 17, fontWeight: 600,
        letterSpacing: '0.68px', lineHeight: '22px', whiteSpace: 'nowrap',
        color: isLabel
          ? focused ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.88)'
          : primary ? '#131111' : 'rgba(255,255,255,0.9)',
        width: wide ? '100%' : undefined,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {label}
    </motion.button>
  )
}

/** CSS iPhone outline — Figma ratio 342×709 */
function IPhone({ heightVh, style }: { heightVh: number; style?: React.CSSProperties }) {
  const ratio  = 342 / 709
  const border = `calc(${heightVh}vh * ${18.289 / 709})`
  const radius = `calc(${heightVh}vh * ${54.866 / 709})`
  const pillH  = `calc(${heightVh}vh * ${31.091 / 709})`
  const pillW  = `${(102.417 / 342) * 100}%`
  return (
    <div style={{
      position: 'relative', height: `${heightVh}vh`, width: `calc(${heightVh}vh * ${ratio})`,
      borderRadius: radius, border: `${border} solid rgba(255,255,255,0.22)`,
      background: 'rgba(0,0,0,0.20)', flexShrink: 0, ...style,
    }}>
      <div style={{
        position: 'absolute', width: pillW, height: pillH, borderRadius: 999,
        background: 'rgba(255,255,255,0.22)',
        top: `${(28 / 709) * 100}%`, left: '50%', transform: 'translateX(-50%)',
      }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 1 — Splash
// ─────────────────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div {...screenAnim} key="splash" style={{ position: 'absolute', inset: 0 }}>
      <Bg />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Apple logo — appears with gentle spring scale */}
        <motion.span
          initial={{ opacity: 0, scale: 0.78 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.15 }}
          style={{
            fontFamily: sfPro, fontSize: 'clamp(52px, 6.56vw, 126px)',
            fontWeight: 860, color: '#ffffff',
            textShadow: '0 0 18.6px rgba(0,0,0,0.25)',
            fontVariationSettings: '"wdth" 100', userSelect: 'none',
          }}
        >
          {SYM_APPLE}
        </motion.span>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 2 — Choose Account
// ─────────────────────────────────────────────────────────────────────────────
type ProfileKind = 'photo' | 'family' | 'addnew'
type Profile =
  | { id: string; name: string; kind: 'photo'; img: string }
  | { id: string; name: string; kind: 'family' }
  | { id: string; name: string; kind: 'addnew' }

const PROFILES: Profile[] = [
  { id: 'lisa',   name: 'Lisa',    kind: 'photo',  img: IMG_LISA  },
  { id: 'simon',  name: 'Simon',   kind: 'photo',  img: IMG_SIMON },
  { id: 'pigi',   name: 'Pigi',    kind: 'photo',  img: IMG_PIGI  },
  { id: 'family', name: 'Family',  kind: 'family'                 },
  { id: 'addnew', name: 'Add new', kind: 'addnew'                 },
]

function ChooseScreen({ onSelect, onAddNew }: {
  onSelect: (id: string) => void; onAddNew: () => void
}) {
  const [pressIdx,   setPressIdx]   = useState<number | null>(null)
  const containerRef                = useRef<HTMLDivElement>(null)
  const itemRefs                    = useRef<(HTMLDivElement | null)[]>([])
  const { idx: focusIdx } = useRemote({
    count: PROFILES.length,
    onSelect: useCallback((i: number) => {
      const p = PROFILES[i]
      setPressIdx(i)
      setTimeout(() => {
        setPressIdx(null)
        if (p.kind === 'addnew') onAddNew()
        else onSelect(p.id)
      }, 160)
    }, [onSelect, onAddNew]),
  })

  const SZ = 'clamp(96px, 8vw, 154px)'

  return (
    <motion.div {...screenAnim} key="choose" style={{ position: 'absolute', inset: 0 }}>
      <Bg />

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        style={{
          position: 'absolute', zIndex: 1,
          top: '19.7%', left: 0, right: 0, textAlign: 'center',
          fontFamily: sfPro, fontSize: 'clamp(22px, 3.65vw, 70px)',
          fontWeight: 500, letterSpacing: '-0.02em', color: '#ffffff', margin: 0,
        }}
      >
        Choose account
      </motion.p>

      {/* Profiles row */}
        <div
          ref={containerRef}
          style={{
            position: 'absolute', zIndex: 1,
            left: '50%', top: 'calc(50% + 28px)',
            transform: 'translate(-50%, -50%)',
            display: 'flex', gap: 'clamp(14px, 3.65vw, 70px)', alignItems: 'flex-start',
          }}
        >
          {PROFILES.map((p, i) => {
            const focused = focusIdx === i
            const pressed = pressIdx === i
            const click = p.kind === 'addnew'
              ? () => onAddNew()
              : () => onSelect(p.id)

            return (
              <motion.div
                key={p.id}
                ref={el => { itemRefs.current[i] = el }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.44, delay: 0.1 + i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: SZ }}
              >
                {/* ── Selection card — fades in behind avatar+name ── */}
                <motion.div
                  animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.92 }}
                  transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    position: 'absolute',
                    top: 'clamp(-18px, -1.67vw, -26px)',
                    left: 'clamp(-14px, -1.3vw, -20px)',
                    right: 'clamp(-14px, -1.3vw, -20px)',
                    bottom: 'clamp(-18px, -1.67vw, -26px)',
                    borderRadius: 'clamp(22px, 2.3vw, 30px)',
                    background: 'rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.22)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />

                {/* Avatar circle */}
                <motion.div
                  animate={{ scale: pressed ? 0.93 : 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{ position: 'relative', zIndex: 1, width: SZ, height: SZ, flexShrink: 0 }}
                >
                  <GlassCircle focused={false} onClick={click} style={{ width: '100%', height: '100%' }}>
                    {p.kind === 'photo' && (
                      <img src={p.img} alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    )}
                    {p.kind === 'family' && (
                      <>
                        <div style={{
                          position: 'absolute', left: '42.2%', top: '41.4%',
                          width: '44.2%', height: '44.2%', borderRadius: 10, overflow: 'hidden',
                          backdropFilter: 'blur(50px)',
                          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5)',
                        }}>
                          <img src={IMG_LISA} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{
                          position: 'absolute', left: '16.2%', top: '14.1%',
                          width: '44.9%', height: '44.9%', borderRadius: 10, overflow: 'hidden',
                          backdropFilter: 'blur(50px)',
                          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5)',
                        }}>
                          <img src={IMG_FAM_A} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </>
                    )}
                    {p.kind === 'addnew' && (
                      <span style={{
                        fontFamily: sfPro, fontSize: 'clamp(22px, 2.56vw, 49px)',
                        fontWeight: 300, color: '#ffffff', userSelect: 'none',
                      }}>
                        {SYM_PLUS}
                      </span>
                    )}
                  </GlassCircle>
                </motion.div>

                {/* Name label */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Pill label={p.name} variant="label" focused={focused} onClick={click} />
                </div>
              </motion.div>
            )
          })}
        </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 3 — Create new Account
// ─────────────────────────────────────────────────────────────────────────────
const CREATE_OPTIONS = [
  { label: 'Single', sym: SYM_PERSON },
  { label: 'Group',  sym: SYM_GROUP  },
]

function CreateScreen({ onSingle, onGroup, onBack }: {
  onSingle: () => void; onGroup: () => void; onBack: () => void
}) {
  const handlers     = [onSingle, onGroup]
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs     = useRef<(HTMLDivElement | null)[]>([])
  const { idx: focusIdx } = useRemote({
    count: 2,
    onSelect: useCallback((i: number) => handlers[i](), [onSingle, onGroup]),
    onBack,
  })
  const SZ = 'clamp(96px, 8vw, 154px)'

  return (
    <motion.div {...screenAnim} key="create" style={{ position: 'absolute', inset: 0 }}>
      <Bg />

      {/* Left text column — same layout as SetupScreen */}
      <div style={{
        position: 'absolute', zIndex: 1,
        left: '17.2vw', top: '50%', transform: 'translateY(-50%)',
        width: '31.9vw',
      }}>
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}
        >
          <h1 style={{
            fontFamily: sfPro, fontSize: 'clamp(22px, 3.65vw, 70px)', fontWeight: 500,
            color: '#ffffff', textAlign: 'center', lineHeight: 1.15, margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Create new Account
          </h1>
          <p style={{
            fontFamily: sfPro, fontSize: 'clamp(12px, 1.56vw, 30px)', fontWeight: 500,
            color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.4, margin: 0,
          }}>
            Choose whether to create a single profile or a shared group account for multiple users.
          </p>
        </motion.div>
      </div>

      {/* Right — Single / Group circles */}
      <div style={{
        position: 'absolute', zIndex: 1,
        left: '62vw', top: '50%', transform: 'translateY(-50%)',
      }}>
        <div
          ref={containerRef}
          style={{ display: 'flex', gap: 'clamp(30px, 3.65vw, 70px)', alignItems: 'flex-start' }}
        >
          {CREATE_OPTIONS.map((opt, i) => {
            const focused = focusIdx === i
            return (
              <motion.div
                key={opt.label}
                ref={el => { itemRefs.current[i] = el }}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: SZ }}
              >
                {/* ── Selection card — fades in behind icon+label ── */}
                <motion.div
                  animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.92 }}
                  transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    position: 'absolute',
                    top: 'clamp(-18px, -1.67vw, -26px)',
                    left: 'clamp(-14px, -1.3vw, -20px)',
                    right: 'clamp(-14px, -1.3vw, -20px)',
                    bottom: 'clamp(-18px, -1.67vw, -26px)',
                    borderRadius: 'clamp(22px, 2.3vw, 30px)',
                    background: 'rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.22)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />

                {/* Circle icon */}
                <div style={{ position: 'relative', zIndex: 1, width: SZ, height: SZ, flexShrink: 0 }}>
                  <GlassCircle focused={false} onClick={handlers[i]} style={{ width: '100%', height: '100%' }}>
                    <span style={{
                      fontFamily: sfPro, fontSize: 'clamp(22px, 2.56vw, 49px)',
                      fontWeight: 300, color: '#ffffff', userSelect: 'none',
                    }}>
                      {opt.sym}
                    </span>
                  </GlassCircle>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Pill label={opt.label} variant="label" focused={focused} onClick={handlers[i]} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 4 — Set Up Apple TV Automatically
// ─────────────────────────────────────────────────────────────────────────────
const SETUP_BUTTONS = ['Set Up with iPhone or iPad', 'Set Up Manually']

function SetupScreen({ onAutomatic, onManual, onBack }: {
  onAutomatic: () => void; onManual: () => void; onBack: () => void
}) {
  const handlers     = [onAutomatic, onManual]
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs     = useRef<(HTMLDivElement | null)[]>([])
  const { idx: focusIdx } = useRemote({
    count: 2,
    onSelect: useCallback((i: number) => handlers[i](), [onAutomatic, onManual]),
    onBack,
    axis: 'vertical',
  })

  return (
    <motion.div {...screenAnim} key="setup" style={{ position: 'absolute', inset: 0 }}>
      <Bg />

      {/* Left content — outer div handles centering so Framer Motion x-anim doesn't clobber translateY */}
      <div style={{
        position: 'absolute', zIndex: 1,
        left: '17.2vw', top: '50%', transform: 'translateY(-50%)',
        width: '31.9vw',
      }}>
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}
        >
          <h1 style={{
            fontFamily: sfPro, fontSize: 'clamp(22px, 3.65vw, 70px)', fontWeight: 600,
            color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.15, margin: 0, width: '114%',
            letterSpacing: '-0.02em',
          }}>
            Set Up Apple TV Automatically
          </h1>
          <p style={{
            fontFamily: sfPro, fontSize: 'clamp(12px, 1.56vw, 30px)', fontWeight: 500,
            color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.4, margin: 0,
          }}>
            Use your iPhone or iPad to automatically add your Apple Account and Wi‑Fi network, and configure other settings, or set up manually using your remote.
          </p>

          {/* Buttons */}
          <div
            ref={containerRef}
            style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 262, alignItems: 'center' }}
          >
            {[
              { label: SETUP_BUTTONS[0], primary: true,  onClick: onAutomatic, wide: true  },
              { label: SETUP_BUTTONS[1], primary: false, onClick: onManual,    wide: false },
            ].map((btn, i) => (
              <div key={btn.label} ref={el => { itemRefs.current[i] = el }} style={{ width: btn.wide ? '100%' : 'auto' }}>
                <Pill
                  label={btn.label} primary={btn.primary} wide={btn.wide}
                  focused={focusIdx === i} onClick={btn.onClick}
                />
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: sfPro, fontSize: 'clamp(10px, 1.04vw, 20px)', fontWeight: 500,
            color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 1.4, margin: 0,
          }}>
            This Apple TV will be associated with your Apple Account and will be able to access some of your content stored in iCloud, such as photos.
          </p>
        </motion.div>
      </div>

      {/* Right iPhone outline — outer div handles position, motion handles slide-in */}
      <div style={{ position: 'absolute', zIndex: 1, left: '70.5vw', top: '17.1vh' }}>
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <IPhone heightVh={65.6} />
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 5 — Tap the remote with your iPhones
// Remote centered top, gradient glow pulse, phones below
// ─────────────────────────────────────────────────────────────────────────────

// iPhone left positions scaled to vw — from Figma (367, 788, 1209 / 1920)
const IMG_REMOTE_PAD = 'https://www.figma.com/api/mcp/asset/d349f219-4e71-44a4-92af-c396e0b8a508'
const IMG_REMOTE_V   = 'https://www.figma.com/api/mcp/asset/2cf8aa2d-eda4-4e73-b533-b97ea712cf2a'
const IMG_REMOTE_H   = 'https://www.figma.com/api/mcp/asset/305f41dc-8d44-4f1b-8ca9-8d1d9665adc6'

function Remote({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', width: 173, height: 503, ...style }}>
      <div style={{ position: 'absolute', left: 2.3, top: 0, width: 167.9, height: 503, borderRadius: 30.812, background: 'rgba(255,255,255,0.25)' }} />
      <img src={IMG_REMOTE_PAD} alt="" style={{ position: 'absolute', left: 16.7, top: 50.8, width: 138.65, height: 138.65, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 19, top: 15.4, width: 26.2, height: 26.2, borderRadius: 154, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sfPro, fontSize: 11.5 }}>􀆨</div>
      {/* Clickpad directional dots */}
      <div style={{ position: 'absolute', left: 84.53, top: 57.77, width: 3.08, height: 3.08, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 84.53, top: 183.33, width: 3.08, height: 3.08, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 22.13, top: 120.16, width: 3.08, height: 3.08, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 147.69, top: 120.16, width: 3.08, height: 3.08, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 19.8, top: 224.2, width: 50.84, height: 50.84, borderRadius: 154, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sfPro, fontSize: 18.5 }}>􀯶</div>
      <div style={{ position: 'absolute', left: 101.5, top: 224.2, width: 50.84, height: 50.84, borderRadius: 154, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sfPro, fontSize: 18.5 }}>􀜊</div>
      <div style={{ position: 'absolute', left: 59.9, top: 275, width: 50.84, height: 50.84, borderRadius: 154, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sfPro, fontSize: 18.5 }}>􀂒</div>
      <div style={{ position: 'absolute', left: 170.2, top: 47.8, width: 2.3, height: 72.4, background: 'rgba(255,255,255,0.25)' }} />
      <div style={{ position: 'absolute', left: 0, top: 180.2, width: 2.3, height: 124, background: 'rgba(255,255,255,0.25)' }} />
    </div>
  )
}

export function RemoteScreen({ userCount = 3, onDone, onBack }: { userCount?: number; onDone: () => void; onBack?: () => void }) {
  const phoneCount = Math.min(userCount, 3)

  // Auto-advance after 5s, but also allow Enter/any key to skip
  useEffect(() => {
    const t = setTimeout(onDone, 5500)
    return () => clearTimeout(t)
  }, [onDone])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault()
        onBack?.()
      } else if (['Enter', ' ', 'e', 'E', 'ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault()
        onDone()
      }
    }
    const t = setTimeout(() => window.addEventListener('keydown', onKey), 1200)
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey) }
  }, [onDone, onBack])

  return (
    <motion.div
      {...screenAnim}
      key="remote"
      style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
      onClick={() => onDone()}
    >
      <Bg bottom />

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          position: 'absolute', zIndex: 1,
          top: '12.7%', left: 0, right: 0, textAlign: 'center',
          fontFamily: sfPro, fontSize: 'clamp(14px, 2.08vw, 40px)',
          fontWeight: 500, letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.7)', margin: 0,
        }}
      >
        {phoneCount > 1 ? 'Tap the remote with your iPhones' : 'Tap the remote with your iPhone'}
      </motion.p>

      {/* ── CSS Remote — centered (prevent Framer Motion clobbering transform: translateX) ── */}
      <div style={{
        position: 'absolute', zIndex: 3,
        left: '50%', top: '26.8vh',
        transform: 'translateX(-50%)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.2, type: 'spring', stiffness: 220, damping: 26 }}
        >
          <Remote />
        </motion.div>
      </div>

      {/* ── NFC glowing rings (Figma Ellipse 162 & Ellipse 163) ── */}
      <div style={{
        position: 'absolute', zIndex: 4,
        left: '50%', top: '71.9vh',
        transform: 'translate(-50%, -50%)',
        width: 108, height: 108,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <motion.img
          src={IMG_RING} alt=""
          animate={{ scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: 108, height: 108 }}
        />
        <motion.img
          src={IMG_RING_INNER} alt=""
          animate={{ scale: [1.04, 0.96, 1.04] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: 78, height: 78 }}
        />
      </div>

      {/* ── NFC gradient glow ── */}
      <div style={{
        position: 'absolute', zIndex: 2,
        left: '50%', top: '71.9vh',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}>
        {[0, 0.65, 1.3].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ scale: [0.12, 2.6], opacity: [0.58, 0] }}
            transition={{
              duration: 2.8, repeat: Infinity, delay,
              ease: [0.15, 0.5, 0.72, 1],
            }}
            style={{
              position: 'absolute',
              width: '16vw', height: '16vw',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(160,180,255,0.62) 0%, rgba(110,140,240,0.28) 42%, transparent 68%)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        {/* Steady inner glow core */}
        <motion.div
          animate={{ opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '3.5vw', height: '3.5vw',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(200,215,255,0.75) 0%, rgba(140,160,255,0.35) 55%, transparent 72%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* ── iPhones ── */}
      <div style={{
        position: 'absolute', zIndex: 1,
        left: '50%', top: '80vh',
        transform: 'translateX(-50%)',
        display: 'flex', gap: '2.5vw',
      }}>
        {Array.from({ length: phoneCount }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65, delay: 0.4 + i * 0.14,
              type: 'spring', stiffness: 240, damping: 28,
            }}
          >
            <IPhone heightVh={52} />
          </motion.div>
        ))}
      </div>

      {/* Skip hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{ position: 'absolute', zIndex: 10, bottom: 36, right: 48 }}
        onClick={(e) => e.stopPropagation()} // Stop propagation so it doesn't trigger parent's click handler
      >
        <Pill label="Continua →" onClick={onDone} />
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 6 — Setting up your tastes
// Center orb pulses; 4 small orbs orbit around it
// ─────────────────────────────────────────────────────────────────────────────

// Each small orb: starting angle (CSS clockwise from right), orbital radius (vw),
// orbital period (s), orb image size (vw)
// Angles from Figma positions converted to CSS clockwise coords:
//   BL: ~132° @ ~22vw  TR: ~323° @ ~21vw  BR: ~53° @ ~27vw  TL: ~212° @ ~25vw
const ORBIT_ORBS = [
  { src: ORB_BL, angle: 132, radius: 22, period: 28, size: 7.2 },
  { src: ORB_TR, angle: 323, radius: 21, period: 22, size: 6.8 },
  { src: ORB_BR, angle:  53, radius: 27, period: 32, size: 7.5 },
  { src: ORB_TL, angle: 212, radius: 25, period: 25, size: 7.5 },
]

export function TastesScreen({ onDone, onBack }: { onDone: () => void; onBack?: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4200)
    return () => clearTimeout(t)
  }, [onDone])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault()
        onBack?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBack])

  return (
    <motion.div {...screenAnim} key="tastes" style={{ position: 'absolute', inset: 0 }}>
      <Bg bottom />

      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          position: 'absolute', zIndex: 1,
          top: '12.7%', left: 0, right: 0, textAlign: 'center',
          fontFamily: sfPro, fontSize: 'clamp(14px, 2.08vw, 40px)',
          fontWeight: 500, letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.7)', margin: 0,
        }}
      >
        Setting up your tastes
      </motion.p>

      {/* Orbital system — all orbs share the same anchor at viewport center */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>

        {/* ── Small orbs — each orbits on an arm around center ── */}
        {ORBIT_ORBS.map((orb, i) => (
          <motion.div
            key={i}
            // Orbital arm: zero-size div at viewport center, rotates continuously
            initial={{ rotate: orb.angle }}
            animate={{ rotate: orb.angle + 360 }}
            transition={{ duration: orb.period, repeat: Infinity, ease: 'linear', delay: 0.7 + i * 0.1 }}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: 0, height: 0,
              transformOrigin: '0 0',
            }}
          >
            {/* Orb sitting at orbital radius — counter-rotates to stay upright */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: -orb.angle }}
              animate={{ opacity: 1, scale: 1, rotate: -(orb.angle + 360) }}
              transition={{
                opacity: { duration: 0.6, delay: 0.4 + i * 0.12 },
                scale:   { duration: 0.6, delay: 0.4 + i * 0.12, type: 'spring', stiffness: 180, damping: 18 },
                rotate:  { duration: orb.period, repeat: Infinity, ease: 'linear', delay: 0.7 + i * 0.1 },
              }}
              style={{
                position: 'absolute',
                left: `${orb.radius}vw`,
                top: 0,
                marginLeft: `-${orb.size / 2}vw`,
                marginTop:  `-${orb.size / 2}vw`,
                width:  `${orb.size}vw`,
                height: `${orb.size}vw`,
              }}
            >
              <img src={orb.src} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
            </motion.div>
          </motion.div>
        ))}

        {/* ── Center orb — breathes in place ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.55 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.72, delay: 0.15, type: 'spring', stiffness: 160, damping: 20 }}
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: '15.6vw', height: '15.6vw',
            marginLeft: '-7.8vw', marginTop: '-7.8vw',
          }}
        >
          {/* Breathing pulse */}
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '100%', height: '100%' }}
          >
            <img src={ORB_C} alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────────────────
export default function OnboardingScreen({ onComplete, onCreateGroup, initialStep = 'splash', onStepChange }: Props) {
  const [step, setStep] = useState<Step>(initialStep)

  useEffect(() => {
    onStepChange?.(step)
  }, [step, onStepChange])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <SplashScreen onDone={() => setStep('choose')} />
        )}
        {step === 'choose' && (
          <ChooseScreen
            onSelect={(id) => onComplete(id)}
            onAddNew={() => setStep('create')} />
        )}
        {step === 'create' && (
          <CreateScreen
            onSingle={() => setStep('setup')}
            onGroup={() => {
              if (onCreateGroup) onCreateGroup()
              else setStep('setup')
            }}
            onBack={() => setStep('choose')} />
        )}
        {step === 'setup' && (
          <SetupScreen
            onAutomatic={() => setStep('remote')}
            onManual={() => setStep('tastes')}
            onBack={() => setStep('create')} />
        )}
        {step === 'remote' && (
          <RemoteScreen userCount={1} onDone={() => setStep('tastes')} onBack={() => setStep('setup')} />
        )}
        {step === 'tastes' && (
          <TastesScreen onDone={onComplete} onBack={() => setStep('remote')} />
        )}
      </AnimatePresence>
    </div>
  )
}

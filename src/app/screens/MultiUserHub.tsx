import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Clapperboard, Music, Gamepad2, Images, Mic, Armchair, Shuffle, Monitor, Headphones, Radio, Tv } from 'lucide-react'
import type { TVUser } from '../App'

/* ─────────────────────────────────────────
   Canvas
───────────────────────────────────────── */
const CANVAS_W  = 2700
const CANVAS_H  = 1650
const CARD_W    = 320   // base card width
const CARD_H    = 200   // base card height
const PADDING   = 360
const MIN_SCALE = 0.20
const MAX_SCALE = 0.98
const ICON_SIZE = 38   // fixed — same on every card regardless of depth

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Dir   = 'up' | 'down' | 'left' | 'right'
type Phase = 'explore' | 'converging' | 'randomizing'
type Pos   = { x: number; y: number }

interface GlassIsland {
  id: string; label: string; Icon: React.ElementType
  x: number; y: number   // canvas center
  depth: number          // visual scale factor: 0.78–1.22
}

/* ─────────────────────────────────────────
   Islands — 10-card bento
   depth tiers: hero 1.48 · large 1.18-1.22 · medium 0.78-1.05 · small 0.70-0.76
   layout (col × row):
     [Music sm][Series med][Film HERO ↕][Photobook sm][Podcast sm]
     [Games sm][Relax  lg ][Film HERO ↕][Sing      lg][Radio   sm]
                           [Live    sm ]
───────────────────────────────────────── */
const GLASS_ISLANDS: GlassIsland[] = [
  { id: 'film',      label: 'Film',      Icon: Clapperboard, x: 1100, y:  640, depth: 1.48 }, // hero
  { id: 'series',    label: 'Series',    Icon: Monitor,      x:  810, y:  350, depth: 1.05 }, // medium-large top
  { id: 'music',     label: 'Music',     Icon: Music,        x:  380, y:  390, depth: 0.80 }, // small top-left
  { id: 'photobook', label: 'Photobook', Icon: Images,       x: 1760, y:  450, depth: 0.85 }, // small top-right
  { id: 'podcast',   label: 'Podcast',   Icon: Headphones,   x: 2220, y:  380, depth: 0.76 }, // small far-right
  { id: 'games',     label: 'Games',     Icon: Gamepad2,     x:  370, y:  870, depth: 0.72 }, // small bottom-left
  { id: 'relax',     label: 'Relax',     Icon: Armchair,     x:  810, y:  960, depth: 1.18 }, // large bottom-center-left
  { id: 'sing',      label: 'Sing',      Icon: Mic,          x: 1760, y:  950, depth: 1.22 }, // large bottom-center-right
  { id: 'radio',     label: 'Radio',     Icon: Radio,        x: 2220, y:  940, depth: 0.78 }, // small bottom-right
  { id: 'live',      label: 'Live',      Icon: Tv,           x: 1100, y: 1230, depth: 0.75 }, // small bottom of hero
]

/* Randomize virtual nav node */
const RAND_ISLAND_IDX = GLASS_ISLANDS.length  // 10
const RAND_ISLAND_POS: Pos = { x: 1350, y: 1530 }
const EXPLORE_NAV_PTS: Pos[] = [
  ...GLASS_ISLANDS.map(c => ({ x: c.x, y: c.y })),
  RAND_ISLAND_POS,
]


/* ─────────────────────────────────────────
   Spatial nav
───────────────────────────────────────── */
function findNearest(from: number, dir: Dir, pts: Pos[]): number {
  const f = pts[from]
  let best = from, score = Infinity
  for (let i = 0; i < pts.length; i++) {
    if (i === from) continue
    const dx = pts[i].x - f.x, dy = pts[i].y - f.y
    const ok = dir==='right'?dx>30 : dir==='left'?dx<-30 : dir==='down'?dy>30 : dy<-30
    if (!ok) continue
    const primary   = dir==='left'||dir==='right' ? Math.abs(dx) : Math.abs(dy)
    const secondary = dir==='left'||dir==='right' ? Math.abs(dy) : Math.abs(dx)
    const s = primary + secondary * 2.5
    if (s < score) { score = s; best = i }
  }
  return best
}

/* ─────────────────────────────────────────
   Camera — follows users, tightens on focus
───────────────────────────────────────── */
function computeCamera(
  idxs: number[], pts: Pos[], iW: number, iH: number, vW: number, vH: number
) {
  const xs = idxs.map(i => pts[i].x), ys = idxs.map(i => pts[i].y)
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs) + iW]
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys) + iH]
  const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE,
    Math.min(vW / (maxX - minX + PADDING * 2), vH / (maxY - minY + PADDING * 2))
  ))
  return {
    scale,
    tx: vW / 2 - ((minX + maxX) / 2) * scale,
    ty: vH / 2 - ((minY + maxY) / 2) * scale,
  }
}

/* ─────────────────────────────────────────
   Key bindings
───────────────────────────────────────── */
const BINDINGS: Record<string, [number, Dir]> = {
  w:[0,'up'],s:[0,'down'],a:[0,'left'],d:[0,'right'],
  W:[0,'up'],S:[0,'down'],A:[0,'left'],D:[0,'right'],
  ArrowUp:[1,'up'],ArrowDown:[1,'down'],ArrowLeft:[1,'left'],ArrowRight:[1,'right'],
  i:[2,'up'],k:[2,'down'],j:[2,'left'],l:[2,'right'],
  I:[2,'up'],K:[2,'down'],J:[2,'left'],L:[2,'right'],
}

const USER_COLORS = ['#ff8080', '#9080ff', '#80f0ff', '#80ff80', '#ffb060']

/* ─────────────────────────────────────────
   Slot-machine sequence
───────────────────────────────────────── */
function buildRandSequence(n: number, target: number): number[] {
  const delays = [60, 70, 80, 100, 130, 170, 230, 310, 420]
  return delays.map((_, i) => (i === delays.length - 1 ? target : i % n))
}

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export interface IslandSelection {
  id: string
  label: string
  Icon: React.ElementType
}

interface Props {
  users: TVUser[]
  groupName?: string
  onBack: () => void
  onIslandSelect: (island: IslandSelection) => void
}

export default function MultiUserHub({ users, groupName, onBack, onIslandSelect }: Props) {
  const userCount = Math.min(users.length, 3)

  const [phase,     setPhase]     = useState<Phase>('explore')
  const [islandIdx, setIslandIdx] = useState(0)
  const [countdown, setCountdown] = useState(5)
  const [randFlash, setRandFlash] = useState(-1)
  const [boxes,     setBoxes]     = useState<number[]>(
    Array.from({ length: userCount }, (_, i) => i % GLASS_ISLANDS.length)
  )

  const vpW = useRef(window.innerWidth)
  const vpH = useRef(window.innerHeight)
  useEffect(() => {
    const fn = () => { vpW.current = window.innerWidth; vpH.current = window.innerHeight }
    window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn)
  }, [])

  /* ── Occupants (needed for camera focus) ── */
  const occ: Record<number, { color: string; label: string }[]> = {}
  boxes.forEach((bi, ui) => {
    if (!occ[bi]) occ[bi] = []
    const u = users[ui]
    occ[bi].push({ color: u?.color ?? USER_COLORS[ui], label: u?.name ?? `User ${ui + 1}` })
  })

  /* ── Camera ── */
  // nav pts = top-left corner of each card (for computeCamera bbox)
  const islandNavPts = GLASS_ISLANDS.map(is => ({
    x: is.x - (CARD_W * is.depth) / 2,
    y: is.y - (CARD_H * is.depth) / 2,
  }))

  const validBoxes = boxes.filter(b => b < GLASS_ISLANDS.length)

  // camera centers on the card with the most users; falls back to all occupied cards
  const occKeys = Object.keys(occ).map(Number).filter(k => k < GLASS_ISLANDS.length)
  const maxOcc  = occKeys.length ? Math.max(...occKeys.map(k => occ[k].length)) : 0
  const focusBoxes = maxOcc > 1
    ? occKeys.filter(k => occ[k].length === maxOcc)
    : validBoxes
  const eCAM = computeCamera(
    focusBoxes.length ? focusBoxes : [0],
    islandNavPts,
    CARD_W, CARD_H,
    vpW.current, vpH.current
  )
  const allCAM = computeCamera(
    GLASS_ISLANDS.map((_, i) => i),
    islandNavPts,
    CARD_W, CARD_H,
    vpW.current, vpH.current
  )

  const island = GLASS_ISLANDS[islandIdx]
  const ZOOM   = 2.5
  const zCAM = {
    scale: ZOOM,
    tx: vpW.current / 2 - island.x * ZOOM,
    ty: vpH.current / 2 - island.y * ZOOM,
  }

  const cam    = phase === 'converging' ? zCAM : phase === 'randomizing' ? allCAM : eCAM
  const camDur = phase === 'converging' ? 1.8  : phase === 'randomizing' ? 0.6    : 0.5

  /* ── Guards ── */
  const convRef = useRef(false)
  const coolRef = useRef(false)

  /* ── Effect 1: detect all-same → converging ── */
  useEffect(() => {
    if (phase !== 'explore' || convRef.current || coolRef.current) return
    if (!boxes.every(b => b === boxes[0])) return
    if (boxes[0] === RAND_ISLAND_IDX) return
    convRef.current = true
    setIslandIdx(boxes[0])
    setCountdown(5)
    setPhase('converging')
  }, [boxes, phase])

  /* ── Effect R: all-on-randomize → slot machine ── */
  useEffect(() => {
    if (phase !== 'explore' || convRef.current || coolRef.current) return
    if (!boxes.every(b => b === RAND_ISLAND_IDX)) return
    convRef.current = true
    setPhase('randomizing')
  }, [boxes, phase])

  /* ── Effect 2: countdown 5→1 ── */
  useEffect(() => {
    if (phase !== 'converging') return
    const t1 = setTimeout(() => setCountdown(4), 1000)
    const t2 = setTimeout(() => setCountdown(3), 2000)
    const t3 = setTimeout(() => setCountdown(2), 3000)
    const t4 = setTimeout(() => setCountdown(1), 4000)
    const t5 = setTimeout(() => {
      const isl = GLASS_ISLANDS[islandIdx]
      onIslandSelect({ id: isl.id, label: isl.label, Icon: isl.Icon })
      convRef.current = false
    }, 5000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
  }, [phase, islandIdx, onIslandSelect])

  /* ── Effect 3: escape during converging ── */
  useEffect(() => {
    if (phase !== 'converging') return
    if (boxes.every(b => b === boxes[0])) return
    convRef.current = false
    setCountdown(5)
    setPhase('explore')
  }, [boxes, phase])

  /* ── Effect RAND: slot machine ── */
  useEffect(() => {
    if (phase !== 'randomizing') return
    const target   = Math.floor(Math.random() * GLASS_ISLANDS.length)
    const sequence = buildRandSequence(GLASS_ISLANDS.length, target)
    const delays   = [60, 70, 80, 100, 130, 170, 230, 310, 420]
    const timers: ReturnType<typeof setTimeout>[] = []
    let cum = 0
    delays.forEach((d, i) => {
      cum += d
      timers.push(setTimeout(() => setRandFlash(sequence[i]), cum))
    })
    timers.push(setTimeout(() => {
      setRandFlash(-1)
      setIslandIdx(target)
      setCountdown(5)
      setPhase('converging')
      convRef.current = true
    }, cum + 600))
    return () => timers.forEach(clearTimeout)
  }, [phase])

  /* ── Move ── */
  const moveUser = useCallback((ui: number, dir: Dir) => {
    if (ui >= userCount || (phase !== 'explore' && phase !== 'converging')) return
    setBoxes(prev => {
      const next = [...prev]
      next[ui] = findNearest(next[ui], dir, EXPLORE_NAV_PTS)
      return next
    })
  }, [userCount, phase])

  /* ── Keys ── */
  useEffect(() => {
    if (phase !== 'explore' && phase !== 'converging') return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onBack(); return }
      const b = BINDINGS[e.key]
      if (b) { e.preventDefault(); moveUser(b[0], b[1]) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [moveUser, onBack, phase])

  const randUsers   = occ[RAND_ISLAND_IDX] ?? []
  const randAllHere = randUsers.length === userCount

  /* ────────────────────────────────────── */
  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden',
      background: 'radial-gradient(ellipse 120% 80% at 50% 40%, #0c1828 0%, #070e1a 45%, #020508 100%)',
    }}>

      {/* ══ CANVAS ══ */}
      <motion.div
        animate={{ x: cam.tx, y: cam.ty, scale: cam.scale }}
        transition={{ duration: camDur, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'absolute', top: 0, left: 0,
          transformOrigin: '0 0',
          width: CANVAS_W, height: CANVAS_H,
        }}
      >
        {GLASS_ISLANDS.map((isl, idx) => {
          const o        = occ[idx] ?? []
          const occupied = o.length > 0
          const zooming  = phase === 'converging' && idx === islandIdx
          const flashing = phase === 'randomizing' && idx === randFlash

          /* depth-scaled card dimensions */
          const cW = Math.round(CARD_W * isl.depth)
          const cH = Math.round(CARD_H * isl.depth)

          /* color logic */
          const glowColor = flashing   ? '#ffd60a'
                          : occupied   ? (o.length === 1 ? o[0].color : '#a87cff')
                          : null

          const cardBg = zooming  ? 'rgba(255,255,255,0.20)'
                       : occupied ? 'rgba(255,255,255,0.12)'
                       : 'rgba(255,255,255,0.042)'

          const border = flashing || zooming
            ? `2px solid ${flashing ? '#ffd60a' : 'rgba(255,255,255,0.40)'}`
            : occupied
            ? `2px solid ${glowColor}`
            : '1.5px solid rgba(255,255,255,0.07)'

          const shadow = zooming
            ? '0 0 80px 18px rgba(180,210,255,0.16), 0 0 0 1.5px rgba(255,255,255,0.28), 0 24px 70px rgba(0,0,0,0.60)'
            : flashing
            ? `0 0 50px 12px rgba(255,214,10,0.50), 0 12px 40px rgba(0,0,0,0.55)`
            : occupied
            ? `0 0 32px 6px ${glowColor}3a, 0 14px 44px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,255,255,0.16)`
            : `0 10px 40px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.07)`

          const fontSize  = Math.round(cH * 0.13)
          const iconColor = (occupied || zooming || flashing)
            ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.38)'
          const textColor = (occupied || zooming || flashing)
            ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.38)'
          const padH = Math.round(cH * 0.14)
          const padW = Math.round(cW * 0.11)

          return (
            <div
              key={isl.id}
              style={{
                position: 'absolute',
                left: isl.x,
                top:  isl.y,
                width: cW,
                height: cH,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.div
                animate={{
                  scale: (zooming || flashing) ? 1.06 : 1,
                  boxShadow: shadow,
                  border,
                  background: cardBg,
                }}
                transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  width: '100%', height: '100%',
                  borderRadius: 28,
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: `${padH}px ${padW}px`,
                  boxSizing: 'border-box',
                }}
              >
                <isl.Icon size={ICON_SIZE} color={iconColor} strokeWidth={1.3} />
                <div style={{
                  fontSize, fontWeight: 500, letterSpacing: '-0.3px',
                  color: textColor,
                  fontFamily: "-apple-system,'SF Pro Display',sans-serif",
                }}>
                  {isl.label}
                </div>
              </motion.div>

              {/* User badges */}
              {occupied && (
                <div style={{
                  position: 'absolute',
                  bottom: -30, left: 0,
                  display: 'flex', gap: 5,
                }}>
                  {o.map((u, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: u.color, color: '#fff',
                        fontSize: 11, fontWeight: 700,
                        padding: '3px 10px', borderRadius: 20,
                        whiteSpace: 'nowrap',
                        fontFamily: '-apple-system,sans-serif',
                        boxShadow: `0 2px 10px ${u.color}66`,
                      }}
                    >
                      {u.label}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Countdown bubble */}
              {zooming && (
                <AnimatePresence mode="wait">
                  <motion.div key={countdown}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.28, ease: [0.34, 1.3, 0.64, 1] }}
                    style={{
                      position: 'absolute', top: -22, right: -22,
                      width: 54, height: 54, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.95)',
                      color: '#0b1828',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, fontWeight: 700,
                      fontFamily: "-apple-system,'SF Pro Display',sans-serif",
                      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                      pointerEvents: 'none',
                    }}
                  >
                    {countdown}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Flash ring */}
              {flashing && (
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 0.35, repeat: Infinity }}
                  style={{
                    position: 'absolute', inset: -8,
                    borderRadius: 34,
                    border: '3px solid #ffd60a',
                    boxShadow: '0 0 28px 6px rgba(255,214,10,0.55)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          )
        })}
      </motion.div>

      {/* ══ HUD ══ */}
      <div style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.14)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 50, padding: '7px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 2px 20px rgba(0,0,0,0.35)',
        zIndex: 100, fontFamily: '-apple-system,sans-serif',
      }}>
        {groupName && (
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginRight: 4 }}>
            {groupName}
          </span>
        )}
        {users.slice(0, userCount).map((u, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: '50%',
            border: `2.5px solid ${u.color ?? USER_COLORS[i]}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${u.color ?? USER_COLORS[i]}22`,
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <circle cx="12" cy="8.5" r="3.5" fill={u.color ?? USER_COLORS[i]} />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={u.color ?? USER_COLORS[i]} />
            </svg>
          </div>
        ))}
      </div>

      {/* ══ Randomize button ══ */}
      {(phase === 'explore' || phase === 'randomizing') && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', bottom: 72, left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            zIndex: 100,
          }}
        >
          {randUsers.length > 0 && (
            <div style={{ display: 'flex', gap: 6 }}>
              {randUsers.map((u, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: u.color, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, boxShadow: `0 2px 8px ${u.color}55`, fontFamily: '-apple-system,sans-serif' }}>
                  {u.label}
                </motion.div>
              ))}
            </div>
          )}
          <motion.div
            animate={randAllHere || phase === 'randomizing'
              ? { scale: [1, 1.05, 1], boxShadow: ['0 4px 18px rgba(255,214,10,0.20)', '0 6px 28px rgba(255,214,10,0.50)', '0 4px 18px rgba(255,214,10,0.20)'] }
              : { scale: 1, boxShadow: '0 2px 14px rgba(0,0,0,0.25)' }}
            transition={{ duration: 0.7, repeat: (randAllHere || phase === 'randomizing') ? Infinity : 0 }}
            style={{
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: randUsers.length > 0
                ? `2px solid ${randAllHere ? '#ffd60a' : randUsers[0].color}`
                : '1px solid rgba(255,255,255,0.18)',
              borderRadius: 40, padding: '10px 22px',
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)',
              fontFamily: "-apple-system,'Helvetica Neue',sans-serif",
              cursor: 'default',
            }}
          >
            <Shuffle size={15} color={randAllHere ? '#ffd60a' : 'rgba(255,255,255,0.70)'} />
            {phase === 'randomizing' ? 'Scegliendo…' : 'Randomize'}
          </motion.div>
        </motion.div>
      )}

      {/* ══ Controls hint ══ */}
      {phase === 'explore' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', bottom: 20, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', zIndex: 100, pointerEvents: 'none',
          }}>
          <div style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 30, padding: '8px 20px',
            fontSize: 12, color: 'rgba(255,255,255,0.38)', fontWeight: 500,
            display: 'flex', gap: 14,
            boxShadow: '0 2px 14px rgba(0,0,0,0.25)',
            fontFamily: "-apple-system,'Helvetica Neue',sans-serif", whiteSpace: 'nowrap',
          }}>
            <span><b style={{ color: '#ff8080' }}>WASD</b> User 1</span>
            <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
            <span><b style={{ color: '#9080ff' }}>↑↓←→</b> User 2</span>
            <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
            <span><b style={{ color: '#80f0ff' }}>IJKL</b> User 3</span>
            <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
            <span>Meet on the same card · ↓ Randomize</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}


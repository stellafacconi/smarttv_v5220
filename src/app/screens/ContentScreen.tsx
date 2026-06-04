import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Play } from 'lucide-react'
import type { TVUser } from '../App'
import { getContentForIsland, ytThumb, type ContentItem } from '../data/content'

/* ─────────────────────────────────────────
   Canvas constants
───────────────────────────────────────── */
const CARD_W    = 260
const CARD_H    = 158
const H_GAP     = 28
const V_GAP     = 32
const N_COLS    = 8
const CELL_W    = CARD_W + H_GAP
// Per-column Y offset — creates staggered / scattered feel with zero overlap
const COL_Y_OFF = [0, 115, 48, 172, 22, 138, 72, 192]
const PADDING   = 300
const MIN_SCALE = 0.14
const MAX_SCALE = 0.96

/* ─────────────────────────────────────────
   Types & bindings
───────────────────────────────────────── */
type Dir = 'up' | 'down' | 'left' | 'right'
type Pos = { x: number; y: number }

const BINDINGS: Record<string, [number, Dir]> = {
  w:[0,'up'],  s:[0,'down'],  a:[0,'left'],  d:[0,'right'],
  W:[0,'up'],  S:[0,'down'],  A:[0,'left'],  D:[0,'right'],
  ArrowUp:[1,'up'], ArrowDown:[1,'down'], ArrowLeft:[1,'left'], ArrowRight:[1,'right'],
  i:[2,'up'],  k:[2,'down'],  j:[2,'left'],  l:[2,'right'],
  I:[2,'up'],  K:[2,'down'],  J:[2,'left'],  L:[2,'right'],
}

const USER_COLORS = ['#ff8080', '#9080ff', '#80f0ff', '#80ff80', '#ffb060']
const USER_EMOJI  = ['🐱', '🦊', '🐳', '🐸', '🦋']

/* ─────────────────────────────────────────
   Layout — staggered columns, no overlap
───────────────────────────────────────── */
function buildPositions(n: number): Pos[] {
  const positions: Pos[] = []
  const colCount = new Array(N_COLS).fill(0)
  for (let i = 0; i < n; i++) {
    const col = i % N_COLS
    positions.push({
      x: col * CELL_W,
      y: COL_Y_OFF[col] + colCount[col] * (CARD_H + V_GAP),
    })
    colCount[col]++
  }
  return positions
}

/* ─────────────────────────────────────────
   Spatial nav
───────────────────────────────────────── */
function findNearest(from: number, dir: Dir, pts: Pos[]): number {
  const f = pts[from]
  let best = from, score = Infinity
  for (let i = 0; i < pts.length; i++) {
    if (i === from) continue
    const dx = pts[i].x - f.x, dy = pts[i].y - f.y
    const ok =
      dir === 'right' ? dx > CARD_W * 0.4 :
      dir === 'left'  ? dx < -CARD_W * 0.4 :
      dir === 'down'  ? dy > CARD_H * 0.4 :
                        dy < -CARD_H * 0.4
    if (!ok) continue
    const primary   = dir === 'left' || dir === 'right' ? Math.abs(dx) : Math.abs(dy)
    const secondary = dir === 'left' || dir === 'right' ? Math.abs(dy) : Math.abs(dx)
    const s = primary + secondary * 2.5
    if (s < score) { score = s; best = i }
  }
  return best
}

/* ─────────────────────────────────────────
   Camera — always keeps all cursors visible
───────────────────────────────────────── */
function computeCamera(idxs: number[], pts: Pos[], vW: number, vH: number) {
  const xs = idxs.map(i => pts[i].x)
  const ys = idxs.map(i => pts[i].y)
  const minX = Math.min(...xs), maxX = Math.max(...xs) + CARD_W
  const minY = Math.min(...ys), maxY = Math.max(...ys) + CARD_H
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
   Props
───────────────────────────────────────── */
interface Props {
  islandId: string
  islandLabel: string
  IslandIcon: React.ElementType
  users: TVUser[]
  groupName?: string
  onBack: () => void
}

/* ─────────────────────────────────────────
   YTCard
───────────────────────────────────────── */
function YTCard({ item }: { item: ContentItem }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  return (
    <div style={{
      width: '100%', height: '100%',
      background: errored
        ? 'linear-gradient(135deg,#0d1525 0%,#1a2540 100%)'
        : 'rgba(255,255,255,0.04)',
      borderRadius: 'inherit', overflow: 'hidden', position: 'relative',
    }}>
      {!errored && (
        <img
          src={ytThumb(item.youtubeId)} alt={item.title}
          onLoad={() => setLoaded(true)} onError={() => setErrored(true)}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: loaded ? 1 : 0, transition: 'opacity 280ms',
          }}
        />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.08) 52%, transparent 100%)',
      }} />
    </div>
  )
}

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function ContentScreen({ islandId, islandLabel, IslandIcon, users, groupName, onBack }: Props) {
  const items     = useRef(getContentForIsland(islandId)).current
  const positions = useRef(buildPositions(items.length)).current

  const userCount = Math.min(users.length, 3)

  // Each cursor = index into items[]
  const [cursors, setCursors] = useState<number[]>(
    Array.from({ length: userCount }, (_, i) => i)
  )
  const [preview,    setPreview]    = useState<ContentItem | null>(null)
  const [converging, setConverging] = useState(false)
  const [countdown,  setCountdown]  = useState(3)
  const convergeItemRef = useRef<ContentItem | null>(null)
  // users that have pressed ← at the leftmost edge
  const [backVotes, setBackVotes]   = useState<Set<number>>(new Set())

  const vW = window.innerWidth
  const vH = window.innerHeight
  const cam = computeCamera(cursors, positions, vW, vH)

  /* ── Convergence detection ── */
  const allSame    = cursors.length > 1 && cursors.every(c => c === cursors[0])
  const focusedItem = items[cursors[0]] ?? null

  useEffect(() => {
    if (!allSame || converging || !focusedItem) return
    convergeItemRef.current = focusedItem
    setConverging(true)
    setCountdown(3)
  }, [allSame, converging, focusedItem])

  useEffect(() => {
    if (!converging) return
    const item = convergeItemRef.current
    const t1 = setTimeout(() => setCountdown(2), 1000)
    const t2 = setTimeout(() => setCountdown(1), 2000)
    const t3 = setTimeout(() => { setPreview(item); setConverging(false) }, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [converging])

  useEffect(() => {
    if (!allSame && converging) { setConverging(false); setCountdown(3) }
  }, [allSame, converging])

  /* ── Move ── */
  const move = useCallback((ui: number, dir: Dir) => {
    if (ui >= userCount) return
    setConverging(false)

    if (dir === 'left') {
      const nearest = findNearest(cursors[ui], dir, positions)
      if (nearest === cursors[ui]) {
        // At leftmost edge — cast vote to go back
        setBackVotes(prev => {
          const next = new Set(prev)
          next.add(ui)
          if (next.size >= userCount) { onBack(); return prev }
          return next
        })
        return
      }
      // Moved left normally — cancel own back-vote
      setBackVotes(prev => { const s = new Set(prev); s.delete(ui); return s })
      setCursors(prev => { const n = [...prev]; n[ui] = nearest; return n })
      return
    }

    // Any other direction — cancel own back-vote
    setBackVotes(prev => { const s = new Set(prev); s.delete(ui); return s })
    setCursors(prev => {
      const next = [...prev]
      next[ui] = findNearest(next[ui], dir, positions)
      return next
    })
  }, [userCount, positions, onBack, cursors])

  /* ── Keys ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (preview) { setPreview(null); return }
      if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'q' || e.key === 'Q') { onBack(); return }
      const b = BINDINGS[e.key]
      if (b) { e.preventDefault(); move(b[0], b[1]) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [move, onBack, preview])

  /* ── Occupants ── */
  const occ: Record<number, { color: string; name: string; userIdx: number }[]> = {}
  cursors.forEach((idx, ui) => {
    if (!occ[idx]) occ[idx] = []
    const u = users[ui]
    occ[idx].push({ color: u?.color ?? USER_COLORS[ui], name: u?.name ?? `User ${ui + 1}`, userIdx: ui })
  })

  const convIdx = allSame && converging ? cursors[0] : -1

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200, overflow: 'hidden',
        background: 'radial-gradient(ellipse 110% 80% at 50% 30%, #0c1828 0%, #07101c 50%, #020508 100%)',
        fontFamily: "-apple-system,'SF Pro Display',sans-serif",
      }}
    >
      {/* ── Canvas ── */}
      <motion.div
        animate={{ x: cam.tx, y: cam.ty, scale: cam.scale }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ position: 'absolute', top: 0, left: 0, transformOrigin: '0 0' }}
      >
        {items.map((item, idx) => {
          const pos      = positions[idx]
          const occs     = occ[idx] ?? []
          const focused  = occs.length > 0
          const isConv   = idx === convIdx
          const mainColor = occs.length === 1 ? occs[0].color : '#a87cff'

          return (
            <div key={item.id} style={{ position: 'absolute', left: pos.x, top: pos.y, width: CARD_W, height: CARD_H }}>
              {/* Animoji tags — float above the card, outside overflow */}
              {focused && (
                <div style={{
                  position: 'absolute', top: -36, left: 0,
                  display: 'flex', gap: 5, zIndex: 20,
                  pointerEvents: 'none',
                }}>
                  {occs.map((u, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 8, scale: 0.75 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.22, delay: i * 0.05, ease: [0.34, 1.3, 0.64, 1] }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: u.color,
                        borderRadius: 20, padding: '4px 10px 4px 6px',
                        boxShadow: `0 3px 12px ${u.color}70`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span style={{ fontSize: 15, lineHeight: 1 }}>
                        {USER_EMOJI[u.userIdx] ?? '🎬'}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: '#fff',
                        letterSpacing: '-0.1px',
                      }}>{u.name}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div
                animate={{
                  scale: focused ? 1.07 : 1,
                  boxShadow: focused
                    ? `0 0 0 1.5px ${mainColor}, 0 18px 52px rgba(0,0,0,0.70)`
                    : '0 4px 22px rgba(0,0,0,0.45)',
                }}
                transition={{ duration: 0.18 }}
                style={{
                  width: '100%', height: '100%',
                  borderRadius: 15, overflow: 'hidden', position: 'relative',
                  border: focused ? `1px solid ${mainColor}` : '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                <YTCard item={item} />

                {/* Title */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 11px 9px' }}>
                  <div style={{
                    fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.2px',
                    color: focused ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.72)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{item.title}</div>
                  {item.subtitle && (
                    <div style={{
                      fontSize: 10, color: 'rgba(255,255,255,0.46)', marginTop: 2,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{item.subtitle}</div>
                  )}
                </div>

                {/* Convergence countdown */}
                {isConv && (
                  <AnimatePresence mode="wait">
                    <motion.div key={countdown}
                      initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.6 }}
                      transition={{ duration: 0.22, ease: [0.34, 1.3, 0.64, 1] }}
                      style={{
                        position: 'absolute', top: -16, right: -16,
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.96)', color: '#050810',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700, pointerEvents: 'none',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)', zIndex: 10,
                      }}
                    >{countdown}</motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            </div>
          )
        })}
      </motion.div>

      {/* ── Header ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 72,
        display: 'flex', alignItems: 'center', padding: '0 40px',
        background: 'linear-gradient(to bottom, rgba(2,5,8,0.92) 0%, transparent 100%)',
        zIndex: 300,
      }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 40, padding: '8px 16px',
          color: 'rgba(255,255,255,0.88)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          backdropFilter: 'blur(20px)',
        }}>
          <ArrowLeft size={14} color="rgba(255,255,255,0.70)" />
          <IslandIcon size={14} color="rgba(255,255,255,0.70)" strokeWidth={1.5} />
          <span>{islandLabel}</span>
        </button>
        {groupName && (
          <span style={{ marginLeft: 16, fontSize: 13, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
            {groupName}
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {users.slice(0, userCount).map((u, i) => (
            <div key={i} style={{
              width: 32, height: 32, borderRadius: '50%',
              border: `2.5px solid ${u.color ?? USER_COLORS[i]}`,
              background: `${u.color ?? USER_COLORS[i]}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <circle cx="12" cy="8.5" r="3.5" fill={u.color ?? USER_COLORS[i]} />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={u.color ?? USER_COLORS[i]} />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* ── Back votes indicator ── */}
      <AnimatePresence>
        {backVotes.size > 0 && (
          <motion.div
            key="back-votes"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed', left: 24, top: '50%', transform: 'translateY(-50%)',
              zIndex: 300,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.16)', borderRadius: 20,
              padding: '10px 14px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6,
            }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.40)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Indietro
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {Array.from({ length: userCount }, (_, i) => (
                  <motion.div key={i}
                    animate={{ scale: backVotes.has(i) ? 1.15 : 1, opacity: backVotes.has(i) ? 1 : 0.28 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: users[i]?.color ?? USER_COLORS[i],
                      boxShadow: backVotes.has(i) ? `0 0 8px ${users[i]?.color ?? USER_COLORS[i]}` : 'none',
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.30)' }}>
                {backVotes.size}/{userCount}
              </div>
            </div>
            {/* Arrow hint */}
            <motion.div
              animate={{ x: [-3, 0, -3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 18, color: 'rgba(255,255,255,0.30)' }}
            >
              ←
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls hint ── */}
      <div style={{
        position: 'fixed', bottom: 22, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', zIndex: 300, pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 30, padding: '7px 18px',
          fontSize: 11, color: 'rgba(255,255,255,0.36)', fontWeight: 500,
          display: 'flex', gap: 12, whiteSpace: 'nowrap',
        }}>
          <span><b style={{ color: '#ff8080' }}>WASD</b> User 1</span>
          <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
          <span><b style={{ color: '#9080ff' }}>↑↓←→</b> User 2</span>
          <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
          <span><b style={{ color: '#80f0ff' }}>IJKL</b> User 3</span>
          <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
          <span>Trovate lo stesso contenuto per guardarlo insieme</span>
        </div>
      </div>

      {/* ── Preview modal ── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 500,
              background: 'rgba(0,0,0,0.75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              style={{ width: 680, borderRadius: 24, overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', background: '#0d1525' }}>
                <img src={ytThumb(preview.youtubeId)} alt={preview.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.95)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}>
                    <Play size={28} color="#050810" fill="#050810" />
                  </div>
                </div>
              </div>
              <div style={{
                background: 'rgba(12,20,36,0.98)', backdropFilter: 'blur(20px)',
                padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', letterSpacing: '-0.4px' }}>
                      {preview.title}
                    </div>
                    {preview.subtitle && (
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.52)', marginTop: 3 }}>
                        {preview.subtitle}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginTop: 2 }}>
                    {users.slice(0, userCount).map((u, i) => (
                      <div key={i} style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                        background: `${u.color ?? USER_COLORS[i]}20`,
                        color: u.color ?? USER_COLORS[i],
                        border: `1.5px solid ${u.color ?? USER_COLORS[i]}55`,
                      }}>{u.name}</div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.36)' }}>{preview.year}</span>
                  {preview.duration && (
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.36)' }}>{preview.duration}</span>
                  )}
                  {preview.genres.slice(0, 3).map(g => (
                    <span key={g} style={{
                      fontSize: 11, color: 'rgba(255,255,255,0.44)',
                      background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 10,
                    }}>{g}</span>
                  ))}
                </div>
                <div style={{ marginTop: 14, fontSize: 11, color: 'rgba(255,255,255,0.26)', textAlign: 'center' }}>
                  premi un tasto per tornare
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

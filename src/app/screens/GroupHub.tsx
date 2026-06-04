import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  Film, Music, Gamepad2, Tv, Globe, Camera,
  User, ArrowLeft, Zap,
} from 'lucide-react'
import type { TVUser } from '../App'

interface ContentCard {
  id: string
  title: string
  sub: string
  bg: string
  Icon: React.ElementType
  voters: number[]  // user ids who voted
}

const CONTENT: ContentCard[] = [
  { id: 'c1', title: 'La La Land',       sub: 'Film · 2h 8min',     bg: '#1a237e', Icon: Film,     voters: [1,2] },
  { id: 'c2', title: 'Interstellar',     sub: 'Film · 2h 49min',    bg: '#263238', Icon: Film,     voters: [1] },
  { id: 'c3', title: 'Blinding Lights',  sub: 'Music · The Weeknd', bg: '#880e4f', Icon: Music,    voters: [2] },
  { id: 'c4', title: 'Italian Playlist', sub: 'Music · 34 songs',   bg: '#1b5e20', Icon: Music,    voters: [1,2] },
  { id: 'c5', title: 'Minecraft',        sub: 'Game · Sandbox',     bg: '#33691e', Icon: Gamepad2, voters: [2] },
  { id: 'c6', title: 'Fireplace',        sub: 'Ambience · 4K',      bg: '#bf360c', Icon: Tv,       voters: [1] },
  { id: 'c7', title: 'Travel Vibes',     sub: 'Video · Amalfi Coast',bg: '#006064', Icon: Globe,   voters: [1,2] },
  { id: 'c8', title: 'Family Photos',    sub: 'Photobook · 2023',   bg: '#4a148c', Icon: Camera,   voters: [1,2] },
]

const ROWS = 2
const COLS = 4

interface Props {
  groupName: string
  users: TVUser[]
  onBack: () => void
}

export default function GroupHub({ groupName, users, onBack }: Props) {
  const [focusRow, setFocusRow] = useState(0)
  const [focusCol, setFocusCol] = useState(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight': setFocusCol(c => Math.min(COLS - 1, c + 1)); break
        case 'ArrowLeft':  setFocusCol(c => Math.max(0, c - 1));        break
        case 'ArrowDown':  setFocusRow(r => Math.min(ROWS - 1, r + 1)); break
        case 'ArrowUp':    setFocusRow(r => Math.max(0, r - 1));        break
        case 'Escape':
        case 'Backspace':
        case 'q':
        case 'Q':          onBack(); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onBack])

  const topRow    = CONTENT.slice(0, 4)
  const bottomRow = CONTENT.slice(4, 8)
  const rows      = [topRow, bottomRow]

  return (
    <div style={{
      position: 'relative', zIndex: 1,
      height: '100vh', display: 'flex', flexDirection: 'column',
      padding: '2.8vh 3.8vw',
      color: '#fff',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      userSelect: 'none',
    }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: '2.4vh' }}
      >
        <button
          onClick={onBack}
          style={{
            width: 38, height: 38, borderRadius: '50%', border: 'none',
            background: 'rgba(255,255,255,0.14)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <Zap size={14} color="#ffd60a" fill="#ffd60a" />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.8px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>Party Mode</span>
          </div>
          <div style={{ fontSize: 'clamp(20px,3vw,32px)', fontWeight: 700, letterSpacing: '-0.5px' }}>
            {groupName || 'Group Hub'}
          </div>
        </div>

        {/* Active users */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginRight: 4 }}>Now watching</span>
          <div style={{ display: 'flex' }}>
            {users.map((u, i) => (
              <motion.div
                key={u.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1,    opacity: 1 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: u.color,
                  border: '2px solid rgba(255,255,255,0.50)',
                  marginLeft: i === 0 ? 0 : -10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: users.length - i,
                }}
              >
                <User size={15} color="#fff" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Content grid ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh', overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.60)', letterSpacing: '0.15px' }}>For you all</div>

        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {row.map((card, ci) => {
              const focused = focusRow === ri && focusCol === ci
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (ri * 4 + ci) * 0.04, duration: 0.28 }}
                  onClick={() => { setFocusRow(ri); setFocusCol(ci) }}
                  style={{
                    borderRadius: 20,
                    background: card.bg,
                    aspectRatio: '3/2',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transform: focused ? 'scale(1.07)' : 'scale(1)',
                    boxShadow: focused
                      ? '0 22px 60px rgba(0,0,0,0.58), 0 0 0 3px rgba(255,255,255,0.38)'
                      : '0 4px 20px rgba(0,0,0,0.30)',
                    transition: 'transform 180ms cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 180ms',
                    zIndex: focused ? 10 : 1,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Icon watermark */}
                  <div style={{ position: 'absolute', top: 14, right: 14, opacity: 0.25 }}>
                    <card.Icon size={32} color="#fff" strokeWidth={1.2} />
                  </div>

                  {/* Text */}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{card.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.60)' }}>{card.sub}</div>
                  </div>

                  {/* Voter dots */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    {card.voters.map(uid => {
                      const u = users.find(u => u.id === uid)
                      return u ? (
                        <div key={uid} style={{
                          width: 14, height: 14, borderRadius: '50%',
                          background: u.color,
                          border: '1.5px solid rgba(255,255,255,0.5)',
                        }} />
                      ) : null
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>

      {/* ── Nav hint ── */}
      <div style={{ marginTop: '1.8vh', fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'right' }}>
        ↑ ↓ ← → navigate &nbsp;·&nbsp; Esc back to home
      </div>
    </div>
  )
}

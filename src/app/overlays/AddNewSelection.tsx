import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const sfPro = `-apple-system,'SF Pro Display','SF Pro Text','Helvetica Neue',sans-serif`
const sfCompact = `'SF Compact Rounded','SF Pro Rounded',-apple-system,sans-serif`

const imgImage708 = 'https://www.figma.com/api/mcp/asset/ae02d6c5-f37f-44ac-bfd1-144449026947'
const imgEllipse160 = 'https://www.figma.com/api/mcp/asset/ad5b162b-e0cd-48c8-9442-7f168c4ae915'

const SF_SINGLE = String.fromCodePoint(0x10026A)
const SF_GROUP = String.fromCodePoint(0x10074B)

interface Props {
  onBack: () => void
  onSingle: () => void
  onGroup: () => void
}

type Focus = 'single' | 'group'

export default function AddNewSelection({ onBack, onSingle, onGroup }: Props) {
  const [focus, setFocus] = useState<Focus>('group')
  const [scale, setScale] = useState(1)
  const [canSelect, setCanSelect] = useState(false)

  useEffect(() => {
    const update = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setCanSelect(true), 250)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault()
        onBack()
        return
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        setFocus('single')
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        setFocus('group')
        return
      }
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        if (!canSelect) return
        focus === 'single' ? onSingle() : onGroup()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [canSelect, focus, onBack, onGroup, onSingle])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        overflow: 'hidden',
        background: '#1b1b1b',
        fontFamily: sfPro,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 1920,
          height: 1080,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 487,
            top: -200,
            width: 976,
            height: 350,
            transform: 'rotate(180deg)',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <img
            alt=""
            src={imgEllipse160}
            style={{
              position: 'absolute',
              inset: '-108.63% -38.95%',
              width: '177.9%',
              height: '317.26%',
              objectFit: 'fill',
            }}
          />
        </div>

        <img
          alt=""
          src={imgImage708}
          style={{
            position: 'absolute',
            left: 0,
            top: -1085,
            width: 1920,
            height: 1080,
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          style={{
            position: 'absolute',
            left: 665,
            top: 213,
            width: 589,
            margin: 0,
            fontFamily: sfPro,
            fontSize: 70,
            fontWeight: 500,
            letterSpacing: -1.4,
            lineHeight: 'normal',
            color: '#fff',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          Create new Account
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          style={{
            position: 'absolute',
            left: 729,
            top: 439,
            width: 462,
            height: 258,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 42,
          }}
        >
          <CreateTypeOption
            label="Single"
            symbol={SF_SINGLE}
            focused={focus === 'single'}
            onFocus={() => setFocus('single')}
            onSelect={() => { if (canSelect) onSingle() }}
          />
          <CreateTypeOption
            label="Group"
            symbol={SF_GROUP}
            focused={focus === 'group'}
            onFocus={() => setFocus('group')}
            onSelect={() => { if (canSelect) onGroup() }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

function CreateTypeOption({
  label,
  symbol,
  focused,
  onFocus,
  onSelect,
}: {
  label: string
  symbol: string
  focused: boolean
  onFocus: () => void
  onSelect: () => void
}) {
  return (
    <div
      onMouseEnter={onFocus}
      onClick={onSelect}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, cursor: 'pointer', width: 210 }}
    >
      {/* ── Selection card — fades in behind icon+label, same as ChooseScreen ── */}
      <motion.div
        animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.92 }}
        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'absolute',
          top: -22,
          left: -20,
          right: -20,
          bottom: -22,
          borderRadius: 36,
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.22)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Icon circle */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: 153.769,
          height: 153.769,
          borderRadius: 307.538,
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(50px)',
          WebkitBackdropFilter: 'blur(50px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0px 40px 30px 0px rgba(0,0,0,0.05), inset 0px 1px 1px 0px rgba(255,255,255,0.60)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 15.377,
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontFamily: sfPro, fontSize: 49.206, fontWeight: 300, lineHeight: 'normal', color: '#fff', whiteSpace: 'nowrap' }}>
          {symbol}
        </span>
      </div>

      {/* Label pill */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: 44,
          padding: '8px 22px',
          borderRadius: 24,
          background: focused ? 'rgba(255,255,255,0.86)' : 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(67.955px)',
          WebkitBackdropFilter: 'blur(67.955px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          transition: 'background 0.18s',
        }}
      >
        <span style={{
          fontFamily: sfCompact, fontSize: 17, fontWeight: 600,
          lineHeight: '22px', letterSpacing: 0.68,
          color: focused ? '#131111' : 'rgba(255,255,255,0.9)',
          whiteSpace: 'nowrap',
          transition: 'color 0.18s',
        }}>
          {label}
        </span>
      </div>
    </div>
  )
}

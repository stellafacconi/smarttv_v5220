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
      if (e.key === 'Escape' || e.key === 'Backspace') {
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
    <motion.button
      animate={{
        scale: focused ? 1.02 : 1,
        filter: focused ? 'drop-shadow(0px 0px 24px rgba(255,255,255,0.22))' : 'drop-shadow(0px 0px 0px rgba(255,255,255,0))',
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.18, ease: [0.34, 1.2, 0.64, 1] }}
      onMouseEnter={onFocus}
      onClick={onSelect}
      style={{
        width: 210,
        height: 258,
        padding: '18px 15px 16px',
        border: focused ? '2px solid rgba(255,255,255,0.68)' : '1px solid transparent',
        borderRadius: 36,
        background: focused ? 'rgba(255,255,255,0.075)' : 'transparent',
        backdropFilter: focused ? 'blur(42px)' : 'none',
        WebkitBackdropFilter: focused ? 'blur(42px)' : 'none',
        boxShadow: focused
          ? '0px 0px 34px rgba(255,255,255,0.16), inset 0px 1px 1px rgba(255,255,255,0.42)'
          : 'none',
        outline: 'none',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        cursor: 'pointer',
        color: '#fff',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 153.769,
          height: 153.769,
          borderRadius: 307.538,
          background: focused ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(50px)',
          WebkitBackdropFilter: 'blur(50px)',
          border: focused ? '1px solid rgba(255,255,255,0.36)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: focused
            ? '0px 22px 36px rgba(0,0,0,0.18), inset 0px 1px 1px rgba(255,255,255,0.60)'
            : '0px 40px 30px 0px rgba(0,0,0,0.05), inset 0px 1px 1px 0px rgba(255,255,255,0.60)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 15.377,
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            fontFamily: sfPro,
            fontSize: 49.206,
            fontWeight: 300,
            lineHeight: 'normal',
            color: '#fff',
            whiteSpace: 'nowrap',
          }}
        >
          {symbol}
        </span>
      </div>

      <div
        style={{
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
        }}
      >
        <span
          style={{
            fontFamily: sfCompact,
            fontSize: 17,
            fontWeight: 600,
            lineHeight: '22px',
            letterSpacing: 0.68,
            color: focused ? '#131111' : 'rgba(255,255,255,0.9)',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </div>
    </motion.button>
  )
}

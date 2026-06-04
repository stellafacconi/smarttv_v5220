import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { RemoteScreen, TastesScreen } from './OnboardingScreen'

const sfPro = `-apple-system,'SF Pro Display','SF Pro Text','Helvetica Neue',sans-serif`
const sfCompact = `'SF Compact Rounded',-apple-system,'SF Pro Display','SF Pro Text','Helvetica Neue',sans-serif`

type PartyStep = 'intro1' | 'intro2' | 'intro3' | 'intro4' | 'home' | 'sing'
type PartyTargetId = 'film' | 'music' | 'sing' | 'mood' | 'games'
type PartyNavTargetId = PartyTargetId | 'randomize'
type SingTargetId = 'center' | `card-${number}` | 'randomize'
type PlayerId = 0 | 1 | 2
type Direction = 'left' | 'right' | 'up' | 'down'

const ASSETS = {
  intro1Bg: 'https://www.figma.com/api/mcp/asset/a35a6f68-98ba-4d6e-a1b5-215882d81283',
  intro1TopGlow: 'https://www.figma.com/api/mcp/asset/36e215d7-f64e-4b3f-b136-c87564579143',
  intro1SideGlow: 'https://www.figma.com/api/mcp/asset/4da740cf-c682-43bb-b151-b0603f0d5f12',
  intro2Bg: 'https://www.figma.com/api/mcp/asset/37f3099d-ec8d-421d-90e7-13ee592531d4',
  intro2TopGlow: 'https://www.figma.com/api/mcp/asset/d5951810-c7ee-4e18-b3f7-31e61d841216',
  intro2BottomGlow: 'https://www.figma.com/api/mcp/asset/517221bf-9e10-4f96-b250-4629abe75ec5',
  remotePad: 'https://www.figma.com/api/mcp/asset/d349f219-4e71-44a4-92af-c396e0b8a508',
  remoteV: 'https://www.figma.com/api/mcp/asset/2cf8aa2d-eda4-4e73-b533-b97ea712cf2a',
  remoteH: 'https://www.figma.com/api/mcp/asset/305f41dc-8d44-4f1b-8ca9-8d1d9665adc6',
  intro2Ring: 'https://www.figma.com/api/mcp/asset/f4c507c5-7fe2-4309-98fc-810326d7bccc',
  intro2RingInner: 'https://www.figma.com/api/mcp/asset/30ffdbaf-9bac-4af1-bcde-f802e30128c1',
  intro3Bg: 'https://www.figma.com/api/mcp/asset/9ab7dea8-2ca7-4acd-88af-0b1e28b2d8b1',
  intro3TopGlow: 'https://www.figma.com/api/mcp/asset/56cda9ce-830f-47f9-806d-e697ad9bd5e1',
  intro3BottomGlow: 'https://www.figma.com/api/mcp/asset/f81508da-1b8a-483f-97c2-e26e17fe1eb4',
  podDotRed: 'https://www.figma.com/api/mcp/asset/15a91319-5c91-4128-987c-7080017d602e',
  podDotGreen: 'https://www.figma.com/api/mcp/asset/d2dff3a3-1809-4ddd-8465-5cd6c5986ed0',
  podDotYellow: 'https://www.figma.com/api/mcp/asset/fa3e9a50-dc30-46b0-b618-8d87901a22f6',
  podPad: 'https://www.figma.com/api/mcp/asset/0c5848c3-51a9-4db1-b966-b3e3004fcd4c',
  podH: 'https://www.figma.com/api/mcp/asset/6170788a-248f-4b84-9eca-47975aa2d2d7',
  podV2: 'https://www.figma.com/api/mcp/asset/f55f8666-1143-4bfc-9257-750954fdce97',
  podH2: 'https://www.figma.com/api/mcp/asset/adaac4c3-8c62-49b4-8723-99fc2a0a0f9c',
  intro4Bg: 'https://www.figma.com/api/mcp/asset/7795836e-da20-4832-b475-da169571ece4',
  intro4TopGlow: 'https://www.figma.com/api/mcp/asset/22f074d5-cffa-4bc9-a7da-8df58f6eb19b',
  intro4BottomGlow: 'https://www.figma.com/api/mcp/asset/94fbe170-15eb-4580-8434-08f3c1c9b595',
  tasteMain: 'https://www.figma.com/api/mcp/asset/4b63d8c7-e708-41f2-9931-26f5cd49d527',
  tasteA: 'https://www.figma.com/api/mcp/asset/dfe317db-053f-4bcd-a5c3-9f7bc13a2ce2',
  tasteB: 'https://www.figma.com/api/mcp/asset/dfa74ad0-c16c-4c79-a145-9b8d42c7aa3a',
  tasteC: 'https://www.figma.com/api/mcp/asset/05614068-5458-40cf-ac76-f8b5c0b4960d',
  tasteD: 'https://www.figma.com/api/mcp/asset/dc98e608-f13c-495c-a5b2-2d3dbccadc54',
  partyBg: 'https://www.figma.com/api/mcp/asset/3ae0a82a-b65b-4e9b-847f-97cb81899c6f',
  partyGlow: 'https://www.figma.com/api/mcp/asset/12e2bd39-d53a-4388-9c41-2d77bc872b78',
  memoji0: 'https://www.figma.com/api/mcp/asset/787bd7be-35bc-4e61-afc8-01125f6f4652',
  memoji1: 'https://www.figma.com/api/mcp/asset/60e68afa-1471-40ea-8925-9509d6e473e8',
  memoji2: 'https://www.figma.com/api/mcp/asset/ead40fa6-3188-4c6e-83f7-b33335673898',
  singGlow: 'https://www.figma.com/api/mcp/asset/c87ecd3b-e560-417e-b564-99c04a215a49',
  singBg: 'https://www.figma.com/api/mcp/asset/5f54e68d-bc2b-4dda-9e21-57b270221215',
  sticker: 'https://www.figma.com/api/mcp/asset/ccca53c4-ee3b-4650-84a9-e0a013c9dcc8',
  albumBando: 'https://www.figma.com/api/mcp/asset/7db1283a-b2b9-4f8b-9540-ef5c73c31db8',
  albumAbnormal: 'https://www.figma.com/api/mcp/asset/b2b1689f-7f83-4252-86c0-318490d59874',
  albumParty: 'https://www.figma.com/api/mcp/asset/bb5d5615-f835-4a70-92e6-81e3d5fac804',
  albumMaterial: 'https://www.figma.com/api/mcp/asset/287fc9bd-adc1-4ffd-bb02-cc2773730e61',
  albumHome: 'https://www.figma.com/api/mcp/asset/d79abc30-7c00-47ab-8672-aa5d3f438479',
  albumSpring: 'https://www.figma.com/api/mcp/asset/514fb743-5666-40dd-bcc6-5d5833a2c3ac',
  album360: 'https://www.figma.com/api/mcp/asset/a66ad557-406d-4d04-a85a-aa3546390736',
  albumPink: 'https://www.figma.com/api/mcp/asset/514fa264-19ea-4ea2-ace1-0878a3b6a609',
  albumSacco: 'https://www.figma.com/api/mcp/asset/bef0c2f0-6f0f-4bdb-adc1-4839271d8f2d',
}

const SF = {
  back: '\u{100189}',
  random: '\u{10014C}',
  film: '\u{1003B6}',
  music: '\u{10046A}',
  mic: '\u{10046B}',
  mood: '\u{1008F5}',
  games: '\u{102062}',
}

const PARTY_TARGETS: { id: PartyTargetId; icon: string; label: string; left: number; top: number }[] = [
  { id: 'film', icon: SF.film, label: 'Film', left: 332, top: 243 },
  { id: 'music', icon: SF.music, label: 'Music', left: 546, top: 641 },
  { id: 'sing', icon: SF.mic, label: 'Sing', left: 888, top: 382 },
  { id: 'mood', icon: SF.mood, label: 'Mood', left: 1261, top: 550 },
  { id: 'games', icon: SF.games, label: 'Games', left: 1444, top: 228 },
]

const targetIndex = PARTY_TARGETS.reduce<Record<PartyTargetId, number>>((acc, t, i) => {
  acc[t.id] = i
  return acc
}, {} as Record<PartyTargetId, number>)

const PLAYER_AVATARS = [
  { src: ASSETS.memoji0, bg: '#bef0c6', touchColor: '#bef0c6', keys: 'Host WASD + E', exit: 'Q' },
  { src: ASSETS.memoji1, bg: '#ffc7d6', touchColor: '#ffc7d6', keys: 'Guest 1 Arrows + Enter', exit: 'M' },
  { src: ASSETS.memoji2, bg: '#131313', touchColor: '#ffd60a', keys: 'Guest 2 IJKL + U', exit: 'Y' },
]

export interface SongInfo { title: string; artist: string }

interface PartyScreenProps {
  onClose: () => void
  hasGroup: boolean
  onGroupCreated: () => void
  onSingHome?: (entry: 'browser' | 'browser-guide' | 'singing-guide', song?: SongInfo) => void
  members?: { color: string }[]
  groupName?: string
  onBack?: () => void
}

function useCanvasScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return scale
}

function Img({ src, style }: { src: string; style: React.CSSProperties }) {
  return <img alt="" src={src} style={{ position: 'absolute', pointerEvents: 'none', ...style }} />
}

function ScreenBase({ children, bg, topGlow, bottomGlow, sideGlow }: {
  children: React.ReactNode
  bg?: string
  topGlow?: string
  bottomGlow?: string
  sideGlow?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.35 }}
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', overflow: 'hidden' }}
    >
      {bg && <Img src={bg} style={{ left: 0, top: -1085, width: 1920, height: 1080, objectFit: 'cover' }} />}
      {topGlow && <Img src={topGlow} style={{ left: 107, top: -580, width: 1740, height: 1120, objectFit: 'contain', opacity: 0.95 }} />}
      {bottomGlow && <Img src={bottomGlow} style={{ left: 107, top: 540, width: 1740, height: 1120, objectFit: 'contain', opacity: 0.95 }} />}
      {sideGlow && <Img src={sideGlow} style={{ right: -330, top: 160, width: 760, height: 980, objectFit: 'contain', opacity: 0.9 }} />}
      {children}
    </motion.div>
  )
}

function Button({ children, primary, onClick, style }: {
  children: React.ReactNode
  primary?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}) {
  return (
    <motion.button
      tabIndex={onClick ? 0 : -1}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={onClick}
      style={{
        height: 44,
        border: 'none',
        borderRadius: 24,
        padding: '8px 22px',
        background: primary ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
        color: primary ? '#131111' : 'rgba(255,255,255,0.9)',
        fontFamily: sfCompact,
        fontSize: 17,
        fontWeight: 600,
        lineHeight: '22px',
        letterSpacing: 0.68,
        backdropFilter: 'blur(67.955px)',
        boxShadow: primary ? '0 0 15px 5px rgba(255,255,255,0.25)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        pointerEvents: onClick ? 'auto' : 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </motion.button>
  )
}

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
      const BACK = e.key === 'Escape' || e.key === 'Backspace' || e.key === 'q' || e.key === 'Q'
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

function Pill({
  label, primary = false, wide = false, focused = false,
  variant = 'action', onClick,
}: {
  label: string
  primary?: boolean
  wide?: boolean
  focused?: boolean
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

const SETUP_BUTTONS = ['Set Up with iPhone or iPad', 'Set Up Manually']

function Intro1({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs     = useRef<(HTMLDivElement | null)[]>([])
  const { idx: focusIdx } = useRemote({
    count: 2,
    onSelect: useCallback(() => onNext(), [onNext]),
    onBack,
    axis: 'vertical',
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.35 }}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
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
              { label: SETUP_BUTTONS[0], primary: true,  onClick: onNext, wide: true  },
              { label: SETUP_BUTTONS[1], primary: false, onClick: onNext,    wide: false },
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

function PodCard({ name, dot, active }: { name: string; dot: string; active?: boolean }) {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.58vw',
      alignItems: 'center',
    }}>
      {/* Colored Dot */}
      <img src={dot} alt="" style={{ width: 10, height: 10, objectFit: 'contain' }} />

      {/* Remote body */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
        {/* Grey background */}
        <div style={{
          position: 'absolute', left: '1.3%', top: '1.3%', width: '97.4%', height: '97.4%',
          borderRadius: '20.4%', background: 'rgba(255,255,255,0.25)',
        }} />
        {/* Clickpad (using the clean remotePad without baked-in lines) */}
        <Img src={ASSETS.remotePad} style={{ left: '9.2%', top: '9.8%', width: '81.4%', height: '81.4%' }} />
        {/* Left vertical line rocker */}
        <div style={{ position: 'absolute', left: 0, top: '23%', width: '1.36%', height: '56%', background: 'rgba(255,255,255,0.25)' }} />
        {/* Clickpad directional dots */}
        <div style={{ position: 'absolute', left: '49.1%', top: '13.4%', width: '1.8%', height: '1.8%', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '49.1%', top: '84.8%', width: '1.8%', height: '1.8%', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '13.4%', top: '49.1%', width: '1.8%', height: '1.8%', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '84.8%', top: '49.1%', width: '1.8%', height: '1.8%', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
      </div>

      {/* User Name Pill */}
      <div style={{ zIndex: 10 }}>
        <Pill label={name} primary={active} focused={active} />
      </div>
    </div>
  )
}

function Intro3({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  // Auto-advance or allow skip via keypresses
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault()
        onBack?.()
      } else if (['Enter', ' ', 'e', 'E', 'ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault()
        onNext()
      }
    }
    const t = setTimeout(() => window.addEventListener('keydown', onKey), 1200)
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey) }
  }, [onNext, onBack])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, filter: 'blur(12px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.015, filter: 'blur(8px)' }}
      transition={{ duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
      onClick={onNext}
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
        Pick-up your Pod remote
      </motion.p>

      {/* Central pods container box (prevent Framer Motion clobbering transform: translateX) ── */}
      <div style={{
        position: 'absolute', zIndex: 2,
        left: '50%', top: '30vh',
        transform: 'translateX(-50%)',
        width: '47.4vw', height: '40.5vh',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.16, type: 'spring', stiffness: 200, damping: 24 }}
          style={{
            width: '100%', height: '100%',
            borderRadius: 55,
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '10px solid rgba(255, 255, 255, 0.25)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 24px 60px rgba(0,0,0,0.4)',
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        >
          {[
            { name: 'Pigi',  dot: ASSETS.podDotRed,    active: true,  left: '9.3%'  },
            { name: 'Kikka', dot: ASSETS.podDotGreen,  active: false, left: '30.5%' },
            { name: 'Terry', dot: ASSETS.podDotGreen,  active: true,  left: '51.7%' },
            { name: 'Pigi',  dot: ASSETS.podDotYellow, active: false, left: '72.9%' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.58, delay: 0.35 + i * 0.12,
                type: 'spring', stiffness: 220, damping: 26,
              }}
              style={{
                position: 'absolute',
                left: card.left,
                top: '18.3%',
                width: '17.8%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <PodCard name={card.name} dot={card.dot} active={card.active} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Subtitle / confirmation instructions */}
      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.52, delay: 0.8 }}
        style={{
          position: 'absolute', zIndex: 1,
          top: '83vh', left: 0, right: 0, textAlign: 'center',
          fontFamily: sfPro, fontSize: 'clamp(12px, 1.56vw, 30px)',
          fontWeight: 500, letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.5)', margin: 0,
        }}
      >
        Confirm your pod by clicking on center pad
      </motion.p>
    </motion.div>
  )
}



function PartyBackground({ glow = ASSETS.partyGlow, bg = ASSETS.partyBg }: { glow?: string; bg?: string }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <ScreenBase>
        {/* Programmatic dark background like onboarding */}
        <Bg bottom />

        {/* Breathing soft glows */}
        <motion.img
          src={glow}
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.55, 0.75, 0.55],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: '13.4vw',
            top: '-38.2vh',
            width: '39.58vw',
            height: '39.58vw',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
        <motion.img
          src={glow}
          animate={{
            scale: [1.05, 0.95, 1.05],
            opacity: [0.45, 0.65, 0.45],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: '36.7vw',
            top: '14.5vh',
            width: '39.58vw',
            height: '39.58vw',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
        <motion.img
          src={glow}
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: '64.9vw',
            top: '29.3vh',
            width: '39.58vw',
            height: '39.58vw',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      </ScreenBase>
    </div>
  )
}

function Memoji({ src, bg, size = 45 }: { src: string; bg: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 999, background: bg, border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 0 14.8px rgba(0,0,0,0.25)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
      <img alt="" src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
    </div>
  )
}

function MemojiGroup({ top = 40, inactivePlayers = [] }: { top?: number; inactivePlayers?: number[] }) {
  return (
    <div style={{ position: 'absolute', left: '50%', top, transform: 'translateX(-50%)', display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center', padding: '20px 25px', borderRadius: 109.5, background: 'rgba(255,255,255,0.1)' }}>
      {PLAYER_AVATARS.map((p, i) => (
        <div key={p.src} style={{ opacity: inactivePlayers.includes(i) ? 0.28 : 1, transform: inactivePlayers.includes(i) ? 'scale(0.86)' : 'scale(1)', transition: 'opacity 180ms, transform 180ms' }}>
          <Memoji src={p.src} bg={p.bg} />
        </div>
      ))}
    </div>
  )
}

function SelectionHalo({ player, confirmed, x, y, size }: { player: number; confirmed: boolean; x: number; y: number; size: number }) {
  const avatar = PLAYER_AVATARS[player]
  const color = avatar.touchColor
  return (
    <motion.div
      initial={false}
      animate={{ x, y, scale: confirmed ? 1.05 : 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: size,
        height: size,
        borderRadius: 999,
        zIndex: 20 + player,
        border: `3px solid ${color}`,
        boxShadow: confirmed
          ? `0 0 0 2px rgba(255,255,255,0.34), 0 0 34px ${color}, inset 0 0 28px ${color}55`
          : `0 0 24px ${color}99, inset 0 0 18px ${color}33`,
        background: `${color}10`,
        pointerEvents: 'none',
      }}
    />
  )
}

function SelectionTouchFrame({
  player,
  confirmed,
  x,
  y,
  width,
  height,
  radius,
}: {
  player: number
  confirmed: boolean
  x: number
  y: number
  width: number
  height: number
  radius: number
}) {
  const avatar = PLAYER_AVATARS[player]
  const color = avatar.touchColor
  return (
    <motion.div
      initial={false}
      animate={{ x, y, scale: confirmed ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        borderRadius: radius,
        zIndex: 20 + player,
        border: `3px solid ${color}`,
        boxShadow: confirmed
          ? `0 0 0 2px rgba(255,255,255,0.34), 0 0 34px ${color}, inset 0 0 28px ${color}55`
          : `0 0 24px ${color}99, inset 0 0 18px ${color}33`,
        background: `${color}0d`,
        pointerEvents: 'none',
      }}
    />
  )
}

function PartyOption({
  id,
  icon,
  label,
  left,
  top,
  selectedPlayers = [],
  confirmedPlayers = [],
  consensus,
  onClick,
}: {
  id: PartyTargetId
  icon: string
  label: string
  left: number
  top: number
  selectedPlayers?: number[]
  confirmedPlayers?: number[]
  consensus?: boolean
  onClick?: () => void
}) {
  const selected = selectedPlayers.length > 0
  const confirmed = confirmedPlayers.length > 0
  return (
    <motion.div
      animate={{ scale: consensus ? 1.28 : 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      whileTap={onClick ? { scale: 0.96 } : undefined}
      onClick={onClick}
      style={{
        position: 'absolute',
        left,
        top,
        width: 169,
        height: 214,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        zIndex: consensus ? 18 : 5,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
      }}
    >
      <div style={{
        width: 153.77,
        height: 153.77,
        borderRadius: 307,
        background: consensus ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(50px)',
        border: selected ? '2px solid rgba(255,255,255,0.52)' : '1px solid rgba(255,255,255,0.08)',
        boxSizing: 'border-box',
        boxShadow: consensus
          ? '0 0 48px rgba(255,255,255,0.34), 0 40px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.6)'
          : confirmed
            ? '0 0 34px rgba(190,240,198,0.24), 0 40px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.6)'
            : '0 40px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 180ms, box-shadow 180ms, border 180ms',
      }}>
        <span style={{ fontFamily: sfPro, fontSize: 49.2, fontWeight: 300, color: '#fff' }}>{icon}</span>
      </div>
      <div style={{
        height: 44,
        borderRadius: 24,
        padding: '8px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: consensus ? 'blur(67.955px)' : 'none',
        background: consensus ? 'rgba(255,255,255,0.9)' : 'transparent',
        border: 'none',
        outline: 'none',
      }}>
        <span style={{ fontFamily: sfCompact, fontSize: 17, fontWeight: 600, lineHeight: '22px', letterSpacing: 0.68, color: consensus ? '#131111' : 'rgba(255,255,255,0.9)' }}>{label}</span>
      </div>
      <span style={{ display: 'none' }}>{id}</span>
    </motion.div>
  )
}

function RandomizeButton({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{ position: 'absolute', left: 883, top: 916, width: 154, height: 44, border: 'none', borderRadius: 24, padding: '8px 22px', background: 'rgba(255,255,255,0.9)', color: '#131111', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 0 70.9px 6.966px rgba(255,255,255,0.2)', fontFamily: sfCompact, fontSize: 17, fontWeight: 600, letterSpacing: 0.68, cursor: 'pointer', boxSizing: 'border-box' }}
    >
      <span>{SF.random}</span>
      <span>Randomize</span>
    </motion.button>
  )
}

function PartyHome({ onSing }: { onSing: () => void }) {
  const randomizeTarget = { id: 'randomize' as PartyNavTargetId, left: 883, top: 916, width: 154, height: 44, radius: 24 }
  const partyNavTargets = [
    ...PARTY_TARGETS.map(target => ({ ...target, width: 169, height: 214, radius: 999, id: target.id as PartyNavTargetId })),
    randomizeTarget,
  ]
  const partyNavTargetById = partyNavTargets.reduce<Record<PartyNavTargetId, typeof partyNavTargets[number]>>((acc, target) => {
    acc[target.id] = target
    return acc
  }, {} as Record<PartyNavTargetId, typeof partyNavTargets[number]>)

  const [positions, setPositions] = useState<PartyNavTargetId[]>(['film', 'sing', 'games'])
  const [confirmed, setConfirmed] = useState<boolean[]>([false, false, false])
  const [active, setActive] = useState<boolean[]>([true, true, true])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [consensusTarget, setConsensusTarget] = useState<PartyTargetId | null>(null)

  const movePlayer = useCallback((player: PlayerId, direction: Direction) => {
    setPositions(prev => {
      const next = [...prev] as PartyNavTargetId[]
      const current = partyNavTargetById[next[player]]
      const currentCenter = { x: current.left + current.width / 2, y: current.top + current.height / 2 }
      const candidates = partyNavTargets.filter(target => {
        if (target.id === current.id) return false
        const center = { x: target.left + target.width / 2, y: target.top + target.height / 2 }
        if (direction === 'left') return center.x < currentCenter.x - 20
        if (direction === 'right') return center.x > currentCenter.x + 20
        if (direction === 'up') return center.y < currentCenter.y - 20
        return center.y > currentCenter.y + 20
      })
      if (candidates.length > 0) {
        const randomizeCandidate = candidates.find(target => target.id === 'randomize')
        if (direction === 'down' && current.id === 'sing' && randomizeCandidate) {
          next[player] = randomizeCandidate.id
          return next
        }
        const sorted = candidates.sort((a, b) => {
          const ac = { x: a.left + a.width / 2, y: a.top + a.height / 2 }
          const bc = { x: b.left + b.width / 2, y: b.top + b.height / 2 }
          const primaryA = direction === 'left' || direction === 'right' ? Math.abs(ac.x - currentCenter.x) : Math.abs(ac.y - currentCenter.y)
          const primaryB = direction === 'left' || direction === 'right' ? Math.abs(bc.x - currentCenter.x) : Math.abs(bc.y - currentCenter.y)
          const crossA = direction === 'left' || direction === 'right' ? Math.abs(ac.y - currentCenter.y) : Math.abs(ac.x - currentCenter.x)
          const crossB = direction === 'left' || direction === 'right' ? Math.abs(bc.y - currentCenter.y) : Math.abs(bc.x - currentCenter.x)
          return primaryA * 1.8 + crossA - (primaryB * 1.8 + crossB)
        })
        next[player] = sorted[0].id
      }
      return next
    })
    setConfirmed(prev => {
      const next = [...prev]
      next[player] = false
      return next
    })
    setCountdown(null)
    setConsensusTarget(null)
  }, [])

  const startDecision = useCallback((target: PartyTargetId) => {
    setPositions([target, target, target])
    setConfirmed([true, true, true])
    setActive([true, true, true])
    setConsensusTarget(target)
    setCountdown(5)
  }, [])

  const confirmPlayer = useCallback((player: PlayerId) => {
    if (!active[player]) return
    if (positions[player] === 'randomize') {
      startDecision('sing')
      return
    }
    setConfirmed(prev => {
      const next = [...prev]
      next[player] = true
      return next
    })
  }, [active, positions, startDecision])

  const exitPlayer = useCallback((player: PlayerId) => {
    setActive(prev => {
      const next = [...prev]
      next[player] = false
      return next
    })
    setConfirmed(prev => {
      const next = [...prev]
      next[player] = false
      return next
    })
    setCountdown(null)
    setConsensusTarget(null)
  }, [])

  useEffect(() => {
    const live = active.map((isActive, i) => isActive ? i : -1).filter(i => i >= 0)
    if (live.length === 0 || countdown !== null) return
    const target = positions[live[0]]
    if (target === 'randomize') return
    const sameTarget = live.every(i => positions[i] === target)
    if (sameTarget) {
      setConsensusTarget(target as PartyTargetId)
      setCountdown(5)
    }
  }, [active, positions, countdown])

  useEffect(() => {
    if (countdown === null || consensusTarget === null) return
    const live = active.map((isActive, i) => isActive ? i : -1).filter(i => i >= 0)
    if (live.length === 0 || live.some(i => positions[i] !== consensusTarget)) {
      setCountdown(null)
      setConsensusTarget(null)
    }
  }, [active, consensusTarget, countdown, positions])

  useEffect(() => {
    if (countdown === null) return
    if (countdown <= 0) {
      if (consensusTarget === 'sing') onSing()
      else {
        setCountdown(null)
        setConsensusTarget(null)
      }
      return
    }
    const t = setTimeout(() => setCountdown(v => v === null ? null : v - 1), 1000)
    return () => clearTimeout(t)
  }, [consensusTarget, countdown, onSing])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key
      const mappings: Record<string, () => void> = {
        w: () => movePlayer(0, 'up'),
        W: () => movePlayer(0, 'up'),
        a: () => movePlayer(0, 'left'),
        A: () => movePlayer(0, 'left'),
        s: () => movePlayer(0, 'down'),
        S: () => movePlayer(0, 'down'),
        d: () => movePlayer(0, 'right'),
        D: () => movePlayer(0, 'right'),
        e: () => confirmPlayer(0),
        E: () => confirmPlayer(0),
        q: () => exitPlayer(0),
        Q: () => exitPlayer(0),
        ArrowUp: () => movePlayer(1, 'up'),
        ArrowLeft: () => movePlayer(1, 'left'),
        ArrowDown: () => movePlayer(1, 'down'),
        ArrowRight: () => movePlayer(1, 'right'),
        Enter: () => confirmPlayer(1),
        m: () => exitPlayer(1),
        M: () => exitPlayer(1),
        i: () => movePlayer(2, 'up'),
        I: () => movePlayer(2, 'up'),
        j: () => movePlayer(2, 'left'),
        J: () => movePlayer(2, 'left'),
        k: () => movePlayer(2, 'down'),
        K: () => movePlayer(2, 'down'),
        l: () => movePlayer(2, 'right'),
        L: () => movePlayer(2, 'right'),
        u: () => confirmPlayer(2),
        U: () => confirmPlayer(2),
        y: () => exitPlayer(2),
        Y: () => exitPlayer(2),
      }
      const action = mappings[key]
      if (!action) return
      e.preventDefault()
      action()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmPlayer, exitPlayer, movePlayer])

  const inactivePlayers = active.map((isActive, i) => isActive ? -1 : i).filter(i => i >= 0)
  const zoomTarget = consensusTarget ? PARTY_TARGETS[targetIndex[consensusTarget]] : null

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <MemojiGroup inactivePlayers={inactivePlayers} />
      <motion.div
        animate={{
          scale: zoomTarget ? 1.16 : 1,
          x: zoomTarget ? 960 - (zoomTarget.left + 84.5) : 0,
          y: zoomTarget ? 540 - (zoomTarget.top + 77) : 0,
        }}
        transition={{ type: 'spring', stiffness: 95, damping: 24 }}
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: zoomTarget ? `${zoomTarget.left + 84.5}px ${zoomTarget.top + 77}px` : '50% 50%',
        }}
      >
        {PARTY_TARGETS.map(target => {
          const selectedPlayers = positions.map((p, i) => p === target.id && active[i] ? i : -1).filter(i => i >= 0)
          const confirmedPlayers = selectedPlayers.filter(i => confirmed[i])
          return (
            <PartyOption
              key={target.id}
              id={target.id}
              icon={target.icon}
              label={target.label}
              left={target.left}
              top={target.top}
              selectedPlayers={selectedPlayers}
              confirmedPlayers={confirmedPlayers}
              consensus={consensusTarget === target.id}
              onClick={target.id === 'sing' ? () => startDecision('sing') : undefined}
            />
          )
        })}
        {positions.map((target, player) => {
          if (!active[player]) return null
          if (target === 'randomize') {
            const pad = 3 + player * 4
            return (
              <SelectionTouchFrame
                key={player}
                player={player}
                confirmed={confirmed[player]}
                x={randomizeTarget.left - pad}
                y={randomizeTarget.top - pad}
                width={randomizeTarget.width + pad * 2}
                height={randomizeTarget.height + pad * 2}
                radius={randomizeTarget.radius + pad}
              />
            )
          }
          const option = PARTY_TARGETS[targetIndex[target]]
          const size = 165 + player * 16
          return (
            <SelectionHalo
              key={player}
              player={player}
              confirmed={confirmed[player]}
              size={size}
              x={option.left + 84.5 - size / 2}
              y={option.top + 77 - size / 2}
            />
          )
        })}
        {countdown !== null && (
          (() => {
            const option = consensusTarget ? PARTY_TARGETS[targetIndex[consensusTarget]] : PARTY_TARGETS[targetIndex.sing]
            return (
              <div style={{
                position: 'absolute',
                left: option.left + 84.5,
                top: option.top + 260,
                transform: 'translateX(-50%)',
                width: 128,
                height: 128,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.35)',
                boxShadow: '0 0 44px rgba(255,255,255,0.28)',
                backdropFilter: 'blur(40px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontFamily: sfCompact,
                zIndex: 40,
              }}>
                <span style={{ fontSize: 50, fontWeight: 700, lineHeight: 1 }}>{countdown}</span>
                <span style={{ fontSize: 15, fontWeight: 600, opacity: 0.72, letterSpacing: 0.6 }}>starting</span>
              </div>
            )
          })()
        )}
      </motion.div>
      <div style={{
        position: 'absolute',
        right: 60,
        bottom: 54,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        color: 'rgba(255,255,255,0.36)',
        fontFamily: sfPro,
        fontSize: 13,
        textAlign: 'right',
        pointerEvents: 'none',
      }}>
        {PLAYER_AVATARS.map((p, i) => (
          <span key={p.keys} style={{ opacity: active[i] ? 1 : 0.35 }}>{p.keys} · exit {p.exit}</span>
        ))}
      </div>
      <RandomizeButton onClick={() => startDecision('sing')} />
    </div>
  )
}

const singCards = [
  { src: ASSETS.albumBando, title: 'Bando', artist: 'Anna Pepe', left: 324, top: 128 },
  { src: ASSETS.albumAbnormal, title: 'The New Abnormal', artist: 'The Strokes', left: 595, top: 215 },
  { src: ASSETS.albumParty, title: 'Party 4 u', artist: 'Charli XCX', left: 1122, top: 121 },
  { src: ASSETS.albumMaterial, title: 'Material Girl', artist: 'Madonna', left: 1534, top: 201 },
  { src: ASSETS.albumHome, title: 'Home', artist: 'Edward Sharpe', left: 224, top: 550 },
  { src: ASSETS.albumSpring, title: 'Maledetta Primavera', artist: 'Loretta Goggi', left: 528, top: 632 },
  { src: ASSETS.album360, title: '360', artist: 'Charli XCX', left: 1122, top: 653 },
  { src: ASSETS.albumPink, title: 'Pink pony club', artist: 'Chappel Roan', left: 1300, top: 383 },
  { src: ASSETS.albumSacco, title: 'Riempio il sacco', artist: 'Lito', left: 1509, top: 681 },
]

const SING_TARGETS: { id: SingTargetId; left: number; top: number; width: number; height: number; radius: number }[] = [
  { id: 'center', left: 882.5, top: 386, width: 153.77, height: 153.77, radius: 999 },
  ...singCards.map((card, i) => ({ id: `card-${i}` as SingTargetId, left: card.left + 30, top: card.top, width: 150, height: 150, radius: 40 })),
  { id: 'randomize', left: 883, top: 916, width: 154, height: 44, radius: 24 },
]

const singTargetIndex = SING_TARGETS.reduce<Record<SingTargetId, number>>((acc, t, i) => {
  acc[t.id] = i
  return acc
}, {} as Record<SingTargetId, number>)

function MemojiPin({ left = 32, top = -24 }: { left?: number; top?: number }) {
  return (
    <div style={{ position: 'absolute', left, top, display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: -15 }}><Memoji src={ASSETS.memoji0} bg="#bef0c6" size={48} /></div>
      <div style={{ marginRight: -15 }}><Memoji src={ASSETS.memoji1} bg="#ffc7d6" size={48} /></div>
      <Memoji src={ASSETS.sticker} bg="#131313" size={48} />
    </div>
  )
}

function AlbumCard({ card, selected, consensus, onClick }: { card: typeof singCards[number]; selected?: boolean; consensus?: boolean; onClick?: () => void }) {
  return (
    <motion.div
      animate={{ scale: consensus ? 1.18 : 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      whileTap={onClick ? { scale: 0.96 } : undefined}
      onClick={onClick}
      style={{ position: 'absolute', left: card.left, top: card.top, width: 210, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', cursor: onClick ? 'pointer' : 'default', zIndex: consensus ? 18 : 5 }}
    >
      <div style={{
        position: 'relative',
        width: 150,
        height: 150,
        borderRadius: 40,
        overflow: 'hidden',
        background: consensus ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(50px)',
        border: selected ? '2px solid rgba(255,255,255,0.52)' : 'none',
        boxSizing: 'border-box',
        boxShadow: consensus ? '0 0 48px rgba(255,255,255,0.34), 0 40px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.6)' : '0 40px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.6)',
      }}>
        <img alt="" src={card.src} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
      </div>
      <div style={{ minHeight: 44, borderRadius: 24, padding: '8px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(67.955px)', color: 'rgba(255,255,255,0.9)', fontFamily: sfCompact, fontSize: 17, fontWeight: 600, lineHeight: '22px', letterSpacing: 0.68, whiteSpace: 'nowrap' }}>
        <span>{card.title}</span>
        <span style={{ opacity: 0.3 }}>{card.artist}</span>
      </div>
      <MemojiPin />
    </motion.div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{ position: 'absolute', left: 104, top: 93, height: 44, border: 'none', borderRadius: 24, padding: '8px 22px', display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(67.955px)', fontFamily: sfCompact, fontSize: 17, fontWeight: 600, letterSpacing: 0.68, cursor: 'pointer' }}
    >
      <span>{SF.back}</span>
      <span>back</span>
    </motion.button>
  )
}

function PartySing({ onBack, onSingNow }: { onBack: () => void; onSingNow?: (target: SingTargetId) => void }) {
  const [positions, setPositions] = useState<SingTargetId[]>(['card-0', 'center', 'card-3'])
  const [active, setActive] = useState<boolean[]>([true, true, true])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [consensusTarget, setConsensusTarget] = useState<SingTargetId | null>(null)
  const randomCardTarget = useCallback(() => `card-${Math.floor(Math.random() * singCards.length)}` as SingTargetId, [])

  const movePlayer = useCallback((player: PlayerId, direction: Direction) => {
    setPositions(prev => {
      const next = [...prev] as SingTargetId[]
      const current = SING_TARGETS[singTargetIndex[next[player]]]
      const currentCenter = { x: current.left + current.width / 2, y: current.top + current.height / 2 }
      const candidates = SING_TARGETS.filter(target => {
        if (target.id === current.id) return false
        const center = { x: target.left + target.width / 2, y: target.top + target.height / 2 }
        if (direction === 'left') return center.x < currentCenter.x - 20
        if (direction === 'right') return center.x > currentCenter.x + 20
        if (direction === 'up') return center.y < currentCenter.y - 20
        return center.y > currentCenter.y + 20
      })
      if (candidates.length > 0) {
        const randomizeCandidate = candidates.find(target => target.id === 'randomize')
        if (direction === 'down' && current.id === 'center' && randomizeCandidate) {
          next[player] = randomizeCandidate.id
          return next
        }
        const sorted = candidates.sort((a, b) => {
          const ac = { x: a.left + a.width / 2, y: a.top + a.height / 2 }
          const bc = { x: b.left + b.width / 2, y: b.top + b.height / 2 }
          const primaryA = direction === 'left' || direction === 'right' ? Math.abs(ac.x - currentCenter.x) : Math.abs(ac.y - currentCenter.y)
          const primaryB = direction === 'left' || direction === 'right' ? Math.abs(bc.x - currentCenter.x) : Math.abs(bc.y - currentCenter.y)
          const crossA = direction === 'left' || direction === 'right' ? Math.abs(ac.y - currentCenter.y) : Math.abs(ac.x - currentCenter.x)
          const crossB = direction === 'left' || direction === 'right' ? Math.abs(bc.y - currentCenter.y) : Math.abs(bc.x - currentCenter.x)
          return primaryA * 1.8 + crossA - (primaryB * 1.8 + crossB)
        })
        next[player] = sorted[0].id
      }
      return next
    })
    setCountdown(null)
    setConsensusTarget(null)
  }, [])

  const exitPlayer = useCallback((player: PlayerId) => {
    setActive(prev => {
      const next = [...prev]
      next[player] = false
      return next
    })
    setCountdown(null)
    setConsensusTarget(null)
  }, [])

  const startDecision = useCallback((target: SingTargetId) => {
    setPositions([target, target, target])
    setActive([true, true, true])
    setConsensusTarget(target)
    setCountdown(5)
  }, [])

  const confirmPlayer = useCallback((player: PlayerId) => {
    if (!active[player]) return
    const target = positions[player]
    if (target === 'randomize') {
      startDecision(randomCardTarget())
    }
  }, [active, positions, randomCardTarget, startDecision])

  useEffect(() => {
    const live = active.map((isActive, i) => isActive ? i : -1).filter(i => i >= 0)
    if (live.length === 0 || countdown !== null) return
    const target = positions[live[0]]
    if (live.every(i => positions[i] === target)) {
      if (target === 'randomize') {
        startDecision(randomCardTarget())
        return
      }
      setConsensusTarget(target)
      setCountdown(5)
    }
  }, [active, countdown, positions, randomCardTarget, startDecision])

  useEffect(() => {
    if (countdown === null || consensusTarget === null) return
    const live = active.map((isActive, i) => isActive ? i : -1).filter(i => i >= 0)
    if (live.length === 0 || live.some(i => positions[i] !== consensusTarget)) {
      setCountdown(null)
      setConsensusTarget(null)
    }
  }, [active, consensusTarget, countdown, positions])

  useEffect(() => {
    if (countdown === null) return
    if (countdown <= 0) {
      if (consensusTarget && consensusTarget !== 'randomize') onSingNow?.(consensusTarget)
      return
    }
    const t = setTimeout(() => setCountdown(v => v === null ? null : v - 1), 1000)
    return () => clearTimeout(t)
  }, [consensusTarget, countdown, onSingNow])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mappings: Record<string, () => void> = {
        w: () => movePlayer(0, 'up'),
        W: () => movePlayer(0, 'up'),
        a: () => movePlayer(0, 'left'),
        A: () => movePlayer(0, 'left'),
        s: () => movePlayer(0, 'down'),
        S: () => movePlayer(0, 'down'),
        d: () => movePlayer(0, 'right'),
        D: () => movePlayer(0, 'right'),
        e: () => confirmPlayer(0),
        E: () => confirmPlayer(0),
        q: () => exitPlayer(0),
        Q: () => exitPlayer(0),
        ArrowUp: () => movePlayer(1, 'up'),
        ArrowLeft: () => movePlayer(1, 'left'),
        ArrowDown: () => movePlayer(1, 'down'),
        ArrowRight: () => movePlayer(1, 'right'),
        Enter: () => confirmPlayer(1),
        m: () => exitPlayer(1),
        M: () => exitPlayer(1),
        i: () => movePlayer(2, 'up'),
        I: () => movePlayer(2, 'up'),
        j: () => movePlayer(2, 'left'),
        J: () => movePlayer(2, 'left'),
        k: () => movePlayer(2, 'down'),
        K: () => movePlayer(2, 'down'),
        l: () => movePlayer(2, 'right'),
        L: () => movePlayer(2, 'right'),
        u: () => confirmPlayer(2),
        U: () => confirmPlayer(2),
        y: () => exitPlayer(2),
        Y: () => exitPlayer(2),
      }
      const action = mappings[e.key]
      if (!action) return
      e.preventDefault()
      action()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmPlayer, exitPlayer, movePlayer])

  const inactivePlayers = active.map((isActive, i) => isActive ? -1 : i).filter(i => i >= 0)
  const zoomTarget = consensusTarget ? SING_TARGETS[singTargetIndex[consensusTarget]] : null

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <BackButton onClick={onBack} />
      <MemojiGroup inactivePlayers={inactivePlayers} />
      <motion.div
        animate={{
          scale: zoomTarget ? 1.12 : 1,
          x: zoomTarget ? 960 - (zoomTarget.left + zoomTarget.width / 2) : 0,
          y: zoomTarget ? 540 - (zoomTarget.top + zoomTarget.height / 2) : 0,
        }}
        transition={{ type: 'spring', stiffness: 95, damping: 24 }}
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: zoomTarget ? `${zoomTarget.left + zoomTarget.width / 2}px ${zoomTarget.top + zoomTarget.height / 2}px` : '50% 50%',
        }}
      >
        <PartyOption
          id="sing"
          icon={SF.mic}
          label="Sing"
          left={875}
          top={386}
          selectedPlayers={positions.map((p, i) => p === 'center' && active[i] ? i : -1).filter(i => i >= 0)}
          consensus={consensusTarget === 'center'}
          onClick={() => startDecision('center')}
        />
        {singCards.map((card, i) => {
          const id = `card-${i}` as SingTargetId
          const selectedPlayers = positions.map((p, player) => p === id && active[player] ? player : -1).filter(player => player >= 0)
          return (
            <AlbumCard
              key={`${card.title}-${i}`}
              card={card}
              selected={selectedPlayers.length > 0}
              consensus={consensusTarget === id}
              onClick={() => startDecision(id)}
            />
          )
        })}
        {positions.map((target, player) => {
          if (!active[player]) return null
          const option = SING_TARGETS[singTargetIndex[target]]
          const inset = target === 'randomize' ? -(3 + player * 4) : -8 - player * 7
          return (
            <SelectionTouchFrame
              key={player}
              player={player}
              confirmed={consensusTarget === target}
              width={option.width - inset * 2}
              height={option.height - inset * 2}
              radius={option.radius === 999 ? 999 : option.radius - inset}
              x={option.left + inset}
              y={option.top + inset}
            />
          )
        })}
        {countdown !== null && (
          (() => {
            const option = consensusTarget ? SING_TARGETS[singTargetIndex[consensusTarget]] : SING_TARGETS[1]
            return (
              <div style={{
                position: 'absolute',
                left: option.left + option.width / 2,
                top: option.top + option.height + 42,
                transform: 'translateX(-50%)',
                width: 128,
                height: 128,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.35)',
                boxShadow: '0 0 44px rgba(255,255,255,0.28)',
                backdropFilter: 'blur(40px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontFamily: sfCompact,
                zIndex: 40,
              }}>
                <span style={{ fontSize: 50, fontWeight: 700, lineHeight: 1 }}>{countdown}</span>
                <span style={{ fontSize: 15, fontWeight: 600, opacity: 0.72, letterSpacing: 0.6 }}>starting</span>
              </div>
            )
          })()
        )}
      </motion.div>
      <RandomizeButton onClick={() => startDecision(randomCardTarget())} />
    </div>
  )
}

export default function PartyScreen({ onClose, hasGroup, onGroupCreated, onSingHome, onBack }: PartyScreenProps) {
  const [step, setStep] = useState<PartyStep>(hasGroup ? 'home' : 'intro1')
  const scale = useCanvasScale()

  const advance = useCallback((next: PartyStep) => {
    setStep(next)
    if (next === 'home') onGroupCreated()
  }, [onGroupCreated])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const BACK = e.key === 'Escape' || e.key === 'Backspace' || e.key === 'q' || e.key === 'Q'
      const OK   = e.key === 'e' || e.key === 'E' || e.key === 'Enter'

      if (BACK) {
        e.preventDefault()
        if (step === 'intro1') {
          if (onBack) onBack()
          else onClose()
        }
        else if (step === 'intro4') setStep('intro3')
        else if (step === 'home') onClose()
        else if (step === 'sing') setStep('home')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, onClose])

  const showPartyHomeOrSing = step === 'home' || step === 'sing'
  const isSing = step === 'sing'

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: '#000',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Root full-screen background for Home & Sing steps */}
      <AnimatePresence>
        {showPartyHomeOrSing && (
          <PartyBackground
            key={isSing ? 'sing' : 'home'}
            glow={isSing ? ASSETS.singGlow : ASSETS.partyGlow}
            bg={isSing ? ASSETS.singBg : ASSETS.partyBg}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'intro1' && (
          <Intro1 key="intro1" onNext={() => setStep('intro2')} onBack={onBack || onClose} />
        )}
        {step === 'intro2' && (
          <RemoteScreen key="intro2" userCount={3} onDone={() => setStep('intro3')} onBack={() => setStep('intro1')} />
        )}
        {step === 'intro3' && (
          <Intro3 key="intro3" onNext={() => setStep('intro4')} onBack={() => setStep('intro2')} />
        )}
        {step === 'intro4' && (
          <TastesScreen key="intro4" onDone={() => advance('home')} onBack={() => setStep('intro3')} />
        )}
        {showPartyHomeOrSing && (
          <div key="scaled-container" style={{
            position: 'relative',
            width: 1920,
            height: 1080,
            flexShrink: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            zIndex: 1,
          }}>
            <AnimatePresence mode="wait">
              {step === 'home' && <PartyHome key="home" onSing={() => setStep('sing')} />}
              {step === 'sing' && (
                <PartySing
                  key="sing"
                  onBack={() => setStep('home')}
                  onSingNow={(target) => {
                    const cardIdx = target.startsWith('card-') ? parseInt(target.slice(5)) : -1
                    const song = cardIdx >= 0 ? { title: singCards[cardIdx].title, artist: singCards[cardIdx].artist } : undefined
                    onSingHome?.(target === 'center' ? 'browser-guide' : 'singing-guide', song)
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

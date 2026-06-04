import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus } from 'lucide-react'
import type { Profile } from '../App'
import SearchScreen from './SearchScreen'

/* ══════════════════════════════════════════════════════
   SF Symbols
══════════════════════════════════════════════════════ */
const SF_TV      = String.fromCodePoint(0x100092)  // TV / Home
const SF_REMOTE  = String.fromCodePoint(0x10070A)  // Remote / Settings
const SF_SEARCH  = String.fromCodePoint(0x1003A0)  // Search
const SF_PLAY    = String.fromCodePoint(0x100284)  // Play
const SF_SHARE   = String.fromCodePoint(0x10018A)  // Share / Forward
const SF_GEAR    = String.fromCodePoint(0x10035F)  // Gear (control centre)
const SF_LOCK    = String.fromCodePoint(0x100321)  // Lock
const SF_FT      = String.fromCodePoint(0x10034A)  // Facetime
const SF_MSG     = String.fromCodePoint(0x100325)  // Messages
const SF_ARCADE  = String.fromCodePoint(0x102065)  // Arcade
const SF_TV2     = String.fromCodePoint(0x1002AB)  // Sidebar 3rd icon (HOME_CENTRATA)
const SF_APPS    = String.fromCodePoint(0x100187)  // Chevron up / Apps

/* Control Centre symbols */
const SF_WIFI    = String.fromCodePoint(0x100647)
const SF_MOON    = String.fromCodePoint(0x1001BA)
const SF_HOME_CC = String.fromCodePoint(0x100800)
const SF_VOL     = String.fromCodePoint(0x1002A6)
const SF_BRIGHT  = String.fromCodePoint(0x1001AD)

/* ══════════════════════════════════════════════════════
   Figma assets  (fresh URLs from HOME / PROFILE / LOCK)
══════════════════════════════════════════════════════ */
const IMG_HOTD_LOGO  = 'https://www.figma.com/api/mcp/asset/860c9d9c-5417-4c01-90ae-27fea234c501'
const IMG_ANIMOJI_1  = 'https://www.figma.com/api/mcp/asset/afd5b7d7-f5f7-441f-82bc-e260981b5aee'
const IMG_ANIMOJI_2  = 'https://www.figma.com/api/mcp/asset/97724bd5-2d8c-49fc-8c98-6e4bd783b6e6'

/* App grid icons (fresh from HOME Figma frame) */
const IMG_SPOTIFY    = 'https://www.figma.com/api/mcp/asset/b727962f-bdc2-4228-a25e-01331a84a653'
const IMG_MUSIC_N    = 'https://www.figma.com/api/mcp/asset/8b594486-9a5e-4b2f-8ee4-c5d00b5ca768'
const IMG_NETFLIX_N  = 'https://www.figma.com/api/mcp/asset/cf9e24ec-fdfa-43b2-8091-3bb2e9ea7808'
const IMG_DISNEY     = 'https://www.figma.com/api/mcp/asset/4d2ef0ab-0812-4790-9e47-59d5a41c20d1'
const IMG_APPLETV    = 'https://www.figma.com/api/mcp/asset/88cd3a0d-bddb-41ed-a03b-10089256cee5'
const IMG_SAFARI     = 'https://www.figma.com/api/mcp/asset/66fe7f70-5b9d-4340-bcf0-383a228fb552'
const IMG_PHOTOS     = 'https://www.figma.com/api/mcp/asset/e28d1978-071c-475b-af5b-5d278bb62092'
const IMG_APPSTORE   = 'https://www.figma.com/api/mcp/asset/05e93f9c-ebdb-472a-a04b-768743d19958'

/* ══════════════════════════════════════════════════════
   Video paths  (served from public/video/)
══════════════════════════════════════════════════════ */
const VIDEO_HOTD = '/video/HOTTD.mp4'
const VIDEO_CROSSY = '/video/Crossy- Video.mp4'
const VIDEO_DOJA   = '/video/DojaCat-Video.mp4'
const LOGO_CROSSY  = new URL('../../../VIDEO/Crossy-IMM.webp', import.meta.url).href
const LOGO_DOJA    = new URL('../../../VIDEO/DojaCat-IMM.png',  import.meta.url).href

const HERO_SLIDES = [
  { src: VIDEO_HOTD,    title: 'House of the Dragon', logo: null        },
  { src: VIDEO_CROSSY,  title: 'Crossy Road',         logo: LOGO_CROSSY },
  { src: VIDEO_DOJA,    title: 'Doja Cat',            logo: LOGO_DOJA   },
]

const SNOOPY_VIDEOS = [
  '/video/Snoopy/Snoopy%20Color%201.mov',
  '/video/Snoopy/Snoopy%20Color%202.mov',
  '/video/Snoopy/Snoopy%20Color%203.mov',
  '/video/Snoopy/Snoopy%20B%26W%201.mov',
  '/video/Snoopy/Snoopy%20B%26W%2027.mov',
  '/video/Snoopy/Snoopy%20B%26W%2028.mov',
]

const ANIMOJI_IMAGES = [IMG_ANIMOJI_1, IMG_ANIMOJI_2]

/* ══════════════════════════════════════════════════════
   App icon grid
══════════════════════════════════════════════════════ */
type AppIconDef =
  | { id: string; label: string; kind: 'img';   img: string; bg: string; imgPct?: number }
  | { id: string; label: string; kind: 'sym';   sym: string; bg: string }
  | { id: string; label: string; kind: 'party' }

const ROW1: AppIconDef[] = [
  { id: 'spotify',  label: 'Spotify',    kind: 'img', img: IMG_SPOTIFY,   bg: 'linear-gradient(to bottom,#4a4a4a,#000)',                imgPct: 40 },
  { id: 'music',    label: 'Music',      kind: 'img', img: IMG_MUSIC_N,   bg: 'linear-gradient(to bottom,#ef4e6b,#ee1a39)',             imgPct: 42 },
  { id: 'settings', label: 'Settings',   kind: 'sym', sym: SF_GEAR,       bg: 'linear-gradient(to bottom,#d2d2d2,#808080)' },
  { id: 'party',    label: 'Party mode', kind: 'party' },
]
const ROW2: AppIconDef[] = [
  { id: 'facetime', label: 'Facetime',   kind: 'sym', sym: SF_FT,         bg: 'linear-gradient(to bottom,#59f86e,#10c223)' },
  { id: 'messages', label: 'Messages',   kind: 'sym', sym: SF_MSG,        bg: 'linear-gradient(to bottom,#59f86e,#10c223)' },
  { id: 'safari',   label: 'Safari',     kind: 'img', img: IMG_SAFARI,    bg: 'linear-gradient(180deg,#1da1ec 16%,#1891ec 46%,#1f6de3)', imgPct: 70 },
  { id: 'photos',   label: 'Photos',     kind: 'img', img: IMG_PHOTOS,    bg: '#fcfcfc',                                                 imgPct: 73 },
  { id: 'appstore', label: 'App Store',  kind: 'img', img: IMG_APPSTORE,  bg: 'linear-gradient(180deg,#17b7f2 16%,#1891ec 46%,#1767e2)', imgPct: 70 },
]
const ROW3: AppIconDef[] = [
  { id: 'netflix',  label: 'Netflix',    kind: 'img', img: IMG_NETFLIX_N, bg: 'linear-gradient(to bottom,#3a3a3a,#000)',                imgPct: 43 },
  { id: 'disney',   label: 'Disney+',    kind: 'img', img: IMG_DISNEY,    bg: 'linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),linear-gradient(180deg,#1e7a88,#203941)', imgPct: 57 },
  { id: 'appletv',  label: 'Apple TV',   kind: 'img', img: IMG_APPLETV,   bg: 'linear-gradient(to bottom,#283732 20%,#0f1315 79%)',     imgPct: 59 },
  { id: 'arcade',   label: 'Arcade',     kind: 'sym', sym: SF_ARCADE,     bg: 'linear-gradient(to bottom,#ef4e6b,#ee1a39)' },
]
const ALL_ROWS = [ROW1, ROW2, ROW3]

/* ══════════════════════════════════════════════════════
   Grid navigation helpers
══════════════════════════════════════════════════════ */
function getRowCol(flat: number): [number, number] {
  if (flat < 4) return [0, flat]
  if (flat < 9) return [1, flat - 4]
  return [2, flat - 9]
}
function getFlat(row: number, col: number) {
  if (row === 0) return col
  if (row === 1) return 4 + col
  return 9 + col
}
function nearestCol(col: number, from: number, to: number) {
  return Math.max(0, Math.min(to - 1, Math.round(((col + 0.5) / from) * to - 0.5)))
}

/* ══════════════════════════════════════════════════════
   Layout constants — from Figma HOME_CENTRATA (1920 × 1080)
   Panel:   top:1010, h:894, w:1689  → peek = 70px
   Logo:    centred, top:665, w:339, h:130
   Buttons: centred, top:841
   Dots:    centred, top:916
   Apps:    centred, top:944
══════════════════════════════════════════════════════ */
const PANEL_W_VW    = (1689 / 1920) * 100
const PANEL_H_RATIO = 894 / 1080
const PEEK_VH       = (70 / 1080) * 100     // 6.48 vh

const LOGO_TOP_VH  = (665 / 1080) * 100     // 61.57 vh
const LOGO_W_VW    = (339 / 1920) * 100     // 17.66 vw
const LOGO_H_VH    = (130 / 1080) * 100     // 12.04 vh
const BTNS_TOP_VH  = (841 / 1080) * 100     // 77.87 vh
const DOTS_TOP_VH  = (916 / 1080) * 100     // 84.81 vh
const APPS_TOP_VH  = (944 / 1080) * 100     // 87.41 vh

const PANEL_COLS    = 2

const sfPro     = `-apple-system,'SF Pro Display','SF Pro Text','Helvetica Neue',sans-serif`
const sfCompact = `'SF Compact Rounded','SF Pro Rounded',-apple-system,sans-serif`

/* ══════════════════════════════════════════════════════
   Focus State Machine types
══════════════════════════════════════════════════════ */
type Zone      = 'hero' | 'aside' | 'grid' | 'locked' | 'search' | 'profiles' | 'settings-panel'
type HeroNode  = 'dots' | 'apps' | 'netflix' | 'continue'
type AsideNode = 'profile' | 'home' | 'settings' | 'search' | 'lock'

const ASIDE_ITEMS: AsideNode[] = ['profile', 'home', 'settings', 'search', 'lock']
const CAROUSEL_COUNT = HERO_SLIDES.length

interface Props {
  profiles:        Profile[]
  activeProfileId: string
  onSelectProfile: (p: Profile) => void
  onSelectGroup:   (p: Profile) => void
  onAddNew:        () => void
  onPartyMode:     () => void
}

/* ══════════════════════════════════════════════════════
   HomeScreen
══════════════════════════════════════════════════════ */
export default function HomeScreen({
  profiles, activeProfileId, onSelectProfile, onSelectGroup, onAddNew, onPartyMode,
}: Props) {

  /* ── Focus state ── */
  const [zone,      setZone]      = useState<Zone>('hero')
  const [heroNode,  setHeroNode]  = useState<HeroNode>('dots')
  const [asideNode, setAsideNode] = useState<AsideNode>('home')
  const [carousel,  setCarousel]  = useState(0)
  const [gridFlat,  setGridFlat]  = useState(0)
  const [panelIdx,  setPanelIdx]  = useState(0)

  /* Settings panel sub-navigation */
  const [settingsCard,    setSettingsCard]    = useState(0)   // 0=quickActions 1=volume 2=brightness
  const [settingsBtn,     setSettingsBtn]     = useState(0)   // 0-3 for 2×2 quick-actions grid
  const [settingsSubItem, setSettingsSubItem] = useState(0)   // 0=slider, 1=label (within card 1/2)
  const [volume,          setVolume]          = useState(40)  // 0–100
  const [videoMuted,      setVideoMuted]      = useState(true) // true until first user gesture
  const [brightness,      setBrightness]      = useState(80)  // 0–100

  const [wH, setWH] = useState(window.innerHeight)
  useEffect(() => {
    const fn = () => setWH(window.innerHeight)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const panelH       = wH * PANEL_H_RATIO
  const panelTopHero = wH * (1 - PEEK_VH / 100)
  const panelTopGrid = (wH - panelH) / 2

  const singles      = profiles.filter(p => p.type === 'single')
  const groups       = profiles.filter(p => p.type === 'group')
  const panelItems: (Profile | null)[] = [...singles, ...groups, null]
  const activeProfile = profiles.find(p => p.id === activeProfileId) ?? profiles[0]
  const activeProfileIdx = singles.indexOf(activeProfile)

  function activatePanelItem(idx: number) {
    const item = panelItems[idx]
    if (!item) { onAddNew(); return }
    if (item.type === 'single') onSelectProfile(item)
    else onSelectGroup(item)
  }

  /* ── Video ref ── */
  const videoRef      = useRef<HTMLVideoElement>(null)
  const audioUnlocked = useRef(false)          // true after first user gesture
  const volumeRef     = useRef(40)             // mirrors volume state, safe in closures

  /* ── Lock hold — RAF-based progress ── */
  const lockHoldRef = useRef<{
    startTime: number | null
    rafId: number | null
    hideTimer: ReturnType<typeof setTimeout> | null
    unlocking: boolean
  }>({ startTime: null, rafId: null, hideTimer: null, unlocking: false })

  const [lockUIVisible,  setLockUIVisible]  = useState(false)
  const [holdProgress,   setHoldProgress]   = useState(0)
  const [lockUnlocking,  setLockUnlocking]  = useState(false)

  /* ── (legacy — keep for holdRef in keyUp) ── */
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Keyboard navigation ── */
  const handleKey = useCallback((e: KeyboardEvent) => {

    /* LOCKED — only E key; hold 5s to unlock */
    if (zone === 'locked') {
      const isE = e.key === 'e' || e.key === 'E'
      if (e.type === 'keydown' && isE && !lockHoldRef.current.unlocking) {
        const lh = lockHoldRef.current
        /* Cancel any pending hide timer while holding */
        if (lh.hideTimer) { clearTimeout(lh.hideTimer); lh.hideTimer = null }
        setLockUIVisible(true)

        if (lh.startTime === null) {
          lh.startTime = Date.now()
          const tick = () => {
            if (lh.startTime === null) return
            const p = Math.min((Date.now() - lh.startTime) / 5000, 1)
            setHoldProgress(p)
            if (p < 1) {
              lh.rafId = requestAnimationFrame(tick)
            } else {
              lh.rafId = null
              lh.unlocking = true
              setLockUnlocking(true)
              setTimeout(() => {
                setZone('hero'); setHeroNode('dots')
                setLockUIVisible(false); setHoldProgress(0); setLockUnlocking(false)
                lh.startTime = null; lh.unlocking = false
              }, 700)
            }
          }
          lh.rafId = requestAnimationFrame(tick)
        }
      }
      return
    }

    /* SEARCH overlay */
    if (zone === 'search') {
      if (e.key === 'Escape') { e.preventDefault(); setZone('hero'); setHeroNode('dots') }
      return
    }

    /* ── key aliases: WASD → directions, Space/Enter → confirm ── */
    const UP    = e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp'
    const DOWN  = e.key === 's' || e.key === 'S' || e.key === 'ArrowDown'
    const LEFT  = e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft'
    const RIGHT = e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight'
    const OK    = e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' '
    const BACK  = e.key === 'q' || e.key === 'Q' || e.key === 'Escape'

    if (e.key === 'h' || e.key === 'H') {
      e.preventDefault()
      setZone('hero')
      setHeroNode('dots')
      return
    }
    if (e.key === 'c' || e.key === 'C') {
      e.preventDefault()
      setZone('settings-panel')
      setAsideNode('settings')
      setSettingsCard(0)
      setSettingsBtn(0)
      return
    }
    if (e.key === '+') {
      e.preventDefault()
      setVolume(v => Math.min(100, v + 5))
      return
    }
    if (e.key === '-') {
      e.preventDefault()
      setVolume(v => Math.max(0, v - 5))
      return
    }

    /* PROFILES overlay */
    if (zone === 'profiles') {
      e.preventDefault()
      if (BACK)  { setZone('aside'); setAsideNode('profile') }
      else if (RIGHT) { if (panelIdx + 1 < panelItems.length) setPanelIdx(p => p + 1) }
      else if (LEFT) {
        if (panelIdx > 0) setPanelIdx(p => p - 1)
        else { setZone('aside'); setAsideNode('profile') }
      }
      else if (DOWN) { if (panelIdx + PANEL_COLS < panelItems.length) setPanelIdx(p => p + PANEL_COLS) }
      else if (UP)   { if (panelIdx - PANEL_COLS >= 0) setPanelIdx(p => p - PANEL_COLS) }
      else if (OK)   { activatePanelItem(panelIdx) }
      return
    }

    /* SETTINGS PANEL sub-navigation */
    if (zone === 'settings-panel') {
      e.preventDefault()
      // Card 0: quick-actions 2×2 grid
      if (settingsCard === 0) {
        const row = Math.floor(settingsBtn / 2), col = settingsBtn % 2
        if (UP)         { if (row > 0) setSettingsBtn(b => b - 2) }
        else if (DOWN)  { if (row < 1) setSettingsBtn(b => b + 2) }
        else if (LEFT)  {
          if (col > 0) setSettingsBtn(b => b - 1)
          else { setZone('aside'); setAsideNode('settings') }
        }
        else if (RIGHT) { setSettingsCard(1) }   // da qualsiasi btn → volume
        else if (BACK)  { setZone('aside'); setAsideNode('settings') }
      }
      // Card 1: volume slider (sub=0) ↔ output label (sub=1)
      else if (settingsCard === 1) {
        if (settingsSubItem === 0) {
          // on slider
          if (UP)         { setVolume(v => Math.min(100, v + 5)) }
          else if (DOWN)  { setVolume(v => Math.max(0,   v - 5)) }
          else if (RIGHT) { setSettingsSubItem(1) }         // → output label
          else if (LEFT)  { setSettingsCard(0); setSettingsSubItem(0) }
          else if (BACK)  { setZone('aside'); setAsideNode('settings') }
        } else {
          // on output label
          if (LEFT)       { setSettingsSubItem(0) }         // ← back to slider
          else if (RIGHT) { setSettingsCard(2); setSettingsSubItem(0) }  // → brightness
          else if (BACK)  { setSettingsSubItem(0) }
        }
      }
      // Card 2: brightness slider (sub=0) ↔ screen label (sub=1)
      else if (settingsCard === 2) {
        if (settingsSubItem === 0) {
          // on slider
          if (UP)         { setBrightness(v => Math.min(100, v + 5)) }
          else if (DOWN)  { setBrightness(v => Math.max(10,  v - 5)) }
          else if (RIGHT) { setSettingsSubItem(1) }         // → screen label
          else if (LEFT)  { setSettingsCard(1); setSettingsSubItem(1) }  // ← output label
          else if (BACK)  { setZone('aside'); setAsideNode('settings') }
        } else {
          // on screen/HDMI label
          if (LEFT)       { setSettingsSubItem(0) }
          else if (BACK)  { setSettingsSubItem(0) }
        }
      }
      return
    }

    /* ASIDE */
    if (zone === 'aside') {
      const idx = ASIDE_ITEMS.indexOf(asideNode)
      if (UP)    { e.preventDefault(); if (idx > 0) setAsideNode(ASIDE_ITEMS[idx - 1]) }
      else if (DOWN)  { e.preventDefault(); if (idx < ASIDE_ITEMS.length - 1) setAsideNode(ASIDE_ITEMS[idx + 1]) }
      else if (RIGHT) {
        e.preventDefault()
        if (asideNode === 'settings') { setZone('settings-panel'); setSettingsCard(0); setSettingsBtn(0) }
        else if (asideNode === 'profile') { setZone('profiles'); setPanelIdx(Math.max(0, activeProfileIdx)) }
        else { setZone('hero'); setHeroNode('continue') }
      }
      else if (BACK) { e.preventDefault(); setZone('hero'); setHeroNode('continue') }
      else if (OK) {
        e.preventDefault()
        if (asideNode === 'profile')  { setZone('profiles'); setPanelIdx(0) }
        if (asideNode === 'settings') { setZone('settings-panel'); setSettingsCard(0); setSettingsBtn(0) }
        if (asideNode === 'search')   { setZone('search') }
        if (asideNode === 'lock')     { setZone('locked') }
      }
      return
    }

    /* HERO */
    if (zone === 'hero') {
      if (heroNode === 'dots') {
        if (LEFT) {
          e.preventDefault()
          if (carousel > 0) setCarousel(c => c - 1)
          else setHeroNode('netflix')
        } else if (RIGHT) { e.preventDefault(); if (carousel < CAROUSEL_COUNT - 1) setCarousel(c => c + 1) }
        else if (UP)   { e.preventDefault(); setHeroNode('continue') }
        else if (DOWN) { e.preventDefault(); setHeroNode('apps') }
        return
      }
      if (heroNode === 'apps') {
        if (UP)         { e.preventDefault(); setHeroNode('dots') }
        else if (DOWN || OK) { e.preventDefault(); setZone('grid'); setGridFlat(0) }
        else if (BACK)  { e.preventDefault(); setHeroNode('dots') }
        return
      }
      if (heroNode === 'netflix') {
        if (LEFT)       { e.preventDefault(); setHeroNode('continue') }
        else if (RIGHT) { e.preventDefault(); setHeroNode('dots') }
        else if (DOWN)  { e.preventDefault(); setHeroNode('dots') }
        return
      }
      if (heroNode === 'continue') {
        if (LEFT)       { e.preventDefault(); setZone('aside'); setAsideNode('home') }
        else if (RIGHT) { e.preventDefault(); setHeroNode('netflix') }
        else if (DOWN)  { e.preventDefault(); setHeroNode('dots') }
        return
      }
    }

    /* GRID */
    if (zone === 'grid') {
      const [row, col] = getRowCol(gridFlat)
      const rowSize = ALL_ROWS[row].length
      e.preventDefault()
      if (LEFT)       { if (col > 0) setGridFlat(getFlat(row, col - 1)) }
      else if (RIGHT) { if (col < rowSize - 1) setGridFlat(getFlat(row, col + 1)) }
      else if (UP) {
        if (row > 0) setGridFlat(getFlat(row - 1, nearestCol(col, rowSize, ALL_ROWS[row - 1].length)))
        else { setZone('hero'); setHeroNode('dots') }
      }
      else if (DOWN) {
        if (row < ALL_ROWS.length - 1) setGridFlat(getFlat(row + 1, nearestCol(col, rowSize, ALL_ROWS[row + 1].length)))
      }
      else if (OK) {
        const app = ALL_ROWS[row][col]
        if (app?.id === 'party') onPartyMode()
      }
      else if (BACK) { setZone('hero'); setHeroNode('dots') }
    }
  }, [zone, heroNode, asideNode, carousel, gridFlat, panelIdx, panelItems.length, activeProfileIdx, onPartyMode]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Key-up: cancel hold progress, hide UI after 2s */
  const handleKeyUp = useCallback(() => {
    if (holdRef.current) { clearTimeout(holdRef.current); holdRef.current = null }
    const lh = lockHoldRef.current
    if (lh.startTime !== null && !lh.unlocking) {
      lh.startTime = null
      if (lh.rafId) { cancelAnimationFrame(lh.rafId); lh.rafId = null }
      setHoldProgress(0)
      lh.hideTimer = setTimeout(() => {
        setLockUIVisible(false)
        lh.hideTimer = null
      }, 2000)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKey, handleKeyUp])

  const isGrid      = zone === 'grid'
  const panelOpen   = zone === 'profiles'
  const showProfile = panelOpen || (zone === 'aside' && asideNode === 'profile')
  const showSettings  = zone === 'aside' && asideNode === 'settings' || zone === 'settings-panel'
  const anyPanelOpen  = showProfile || showSettings || zone === 'search'
  const showPanelBlur = showProfile || showSettings   // search has its own overlay

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!videoRef.current) return
    if (anyPanelOpen) videoRef.current.pause()
    else videoRef.current.play().catch(() => {})
  }, [anyPanelOpen])

  /* keep volumeRef in sync so RAF closures always see the latest value */
  useEffect(() => { volumeRef.current = volume }, [volume])

  /* ── Unlock audio on first user gesture (browser autoplay policy) ── */
  useEffect(() => {
    const unlock = () => {
      if (audioUnlocked.current) return
      audioUnlocked.current = true
      setVideoMuted(false)   // React re-renders with muted={false} — survives re-renders
      const vid = videoRef.current
      if (!vid) return
      vid.volume = 0
      const target = volumeRef.current / 100
      const FADE_IN_MS = 1200
      const t0 = performance.now()
      let raf: number
      const step = (now: number) => {
        const t = Math.min((now - t0) / FADE_IN_MS, 1)
        if (vid.isConnected) vid.volume = t * target
        if (t < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    window.addEventListener('keydown', unlock, { once: true })
    window.addEventListener('click',   unlock, { once: true })
    return () => {
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('click',   unlock)
    }
  }, [])

  /* ── Audio fade-in/out when carousel changes (only after unlock) ── */
  useEffect(() => {
    if (!audioUnlocked.current) return
    const vid = videoRef.current
    if (!vid) return
    vid.volume = 0
    const target = volumeRef.current / 100
    let rafId: number
    const FADE_IN_MS = 1200
    const start = performance.now()
    const fadeIn = (now: number) => {
      const t = Math.min((now - start) / FADE_IN_MS, 1)
      if (videoRef.current === vid) vid.volume = t * target
      if (t < 1) rafId = requestAnimationFrame(fadeIn)
    }
    rafId = requestAnimationFrame(fadeIn)
    return () => {
      cancelAnimationFrame(rafId)
      const departing = vid
      const fromVol   = departing.volume
      const FADE_OUT_MS = 450
      const t0 = performance.now()
      let outId: number
      const fadeOut = (now: number) => {
        const p = Math.min((now - t0) / FADE_OUT_MS, 1)
        departing.volume = fromVol * (1 - p)
        if (p < 1) outId = requestAnimationFrame(fadeOut)
      }
      outId = requestAnimationFrame(fadeOut)
      setTimeout(() => cancelAnimationFrame(outId), FADE_OUT_MS + 100)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carousel])

  /* Focus flags */
  const continueFocused = zone === 'hero' && heroNode === 'continue'
  const netflixFocused  = zone === 'hero' && heroNode === 'netflix'
  const dotsFocused     = zone === 'hero' && heroNode === 'dots'
  const appsFocused     = zone === 'hero' && heroNode === 'apps'

  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden',
      fontFamily: sfPro, color: '#fff', userSelect: 'none',
      background: '#111010',
    }}>

      {/* ── HERO VIDEO BACKGROUND — follows carousel ── */}
      <AnimatePresence mode="wait">
        <motion.video
          key={HERO_SLIDES[carousel].src}
          ref={videoRef}
          autoPlay loop muted={videoMuted} playsInline
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.42, ease: [0.37, 0, 0.63, 1] }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        >
          <source src={HERO_SLIDES[carousel].src} type="video/mp4" />
        </motion.video>
      </AnimatePresence>

      {/* ── FIGMA GRADIENT OVERLAY ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(178.89deg, rgba(17,16,16,0) 43%, rgba(17,16,16,0.097) 60.2%, rgba(17,16,16,0.79) 84%, rgb(0,0,0) 98.3%)',
      }} />

      {/* ── DARK OVERLAY in grid state ── */}
      <motion.div
        animate={{ opacity: isGrid ? 0.97 : 0 }}
        transition={{ duration: 0.45 }}
        style={{ position: 'absolute', inset: 0, zIndex: 2, background: '#111010', pointerEvents: 'none' }}
      />

      {/* ── HERO CONTENT — logo centred per slide ── */}
      <AnimatePresence mode="wait">
        {!isGrid && (
          <div key={`hero-logo-${carousel}`} style={{
            position: 'absolute',
            left: '50%', transform: 'translateX(-50%)',
            ...(carousel === 0
              ? { top: `${LOGO_TOP_VH}vh`, width: `${LOGO_W_VW}vw`, height: `${LOGO_H_VH}vh` }
              : { bottom: `${100 - (LOGO_TOP_VH + LOGO_H_VH)}vh`, width: '32vw', height: '22vh' }),
            zIndex: 10,
          }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', height: '100%' }}
            >
              <img
                src={carousel === 0 ? IMG_HOTD_LOGO : HERO_SLIDES[carousel].logo!}
                alt={HERO_SLIDES[carousel].title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: carousel === 0 ? 'center' : 'center bottom' }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CTA BUTTONS centred ── */}
      <AnimatePresence>
        {!isGrid && (
          <div key="hero-buttons" style={{
            position: 'absolute',
            left: '50%', transform: 'translateX(-50%)',
            top: `${BTNS_TOP_VH}vh`,
            zIndex: 10,
          }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, delay: 0.04 }}
              style={{ display: 'flex', gap: 20, alignItems: 'center' }}
            >
              <HeroButton icon={SF_PLAY}  label="Continue playing" sfCompact={sfCompact} focused={continueFocused} />
              <HeroButton icon={SF_SHARE} label="Open in App"      sfCompact={sfCompact} focused={netflixFocused} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CAROUSEL DOTS centred ── */}
      <AnimatePresence>
        {!isGrid && (
          <div key="nav-dots" style={{
            position: 'absolute', zIndex: 10,
            left: '50%', transform: 'translateX(-50%)',
            top: `${DOTS_TOP_VH}vh`,
          }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: 11, alignItems: 'center', padding: '4px 10px' }}
            >
              {Array.from({ length: CAROUSEL_COUNT }).map((_, i) => (
                <div key={i} style={{
                  width: i === carousel ? 80 : 12, height: 12,
                  borderRadius: 40,
                  background: i === carousel ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'width 280ms cubic-bezier(0.34,1.2,0.64,1)',
                }} />
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── APPS BUTTON centred ── */}
      <AnimatePresence>
        {!isGrid && (
          <div key="apps-btn" style={{
            position: 'absolute', zIndex: 10,
            left: '50%', transform: 'translateX(-50%)',
            top: `${APPS_TOP_VH}vh`,
          }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ scale: appsFocused ? 1.06 : 1 }}
              transition={{ duration: 0.18, ease: [0.34, 1.2, 0.64, 1] }}
              style={{
                display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center',
                height: 44, borderRadius: 24, padding: '0 22px',
                backdropFilter: 'blur(68px)',
                background: appsFocused ? 'rgba(255,255,255,0.22)' : 'transparent',
                outline: appsFocused ? '2px solid rgba(255,255,255,0.80)' : '2px solid transparent',
                transition: 'background 160ms, outline 160ms',
              }}
            >
              <span style={{ fontFamily: sfCompact, fontSize: 17, fontWeight: 600, letterSpacing: '0.68px', color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>
                {SF_APPS}
              </span>
              <span style={{ fontFamily: sfCompact, fontSize: 17, fontWeight: 600, letterSpacing: '0.68px', color: 'rgba(255,255,255,0.9)', lineHeight: '22px' }}>
                Apps
              </span>
            </motion.div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── GLASS APP PANEL (peeking → centred) ── */}
      <motion.div
        animate={{ top: isGrid ? panelTopGrid : panelTopHero }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'absolute',
          left: '50%', transform: 'translateX(-50%)',
          width: `${PANEL_W_VW}vw`,
          height: panelH,
          zIndex: 20,
          borderRadius: 40,
          background: 'linear-gradient(90deg,rgba(255,255,255,0.10),rgba(255,255,255,0.10)),linear-gradient(90deg,rgba(0,0,0,0.10),rgba(0,0,0,0.10))',
          backdropFilter: 'blur(68px)',
          WebkitBackdropFilter: 'blur(68px)',
          border: '1px solid rgba(255,255,255,0.95)',
          boxShadow: 'inset -1px 0 4px rgba(255,255,255,0.25),inset 2px 1px 4px rgba(255,255,255,0.25)',
          overflow: 'hidden',
        }}
      >
        <AppGrid rows={ALL_ROWS} focused={isGrid} gridFlat={gridFlat} onAppSelect={(app) => {
          if (app.id === 'party') onPartyMode()
        }} />
      </motion.div>

      {/* ── BLUR + DIM when any panel is open (sits below sidebar) ── */}
      <AnimatePresence>
        {showPanelBlur && (
          <motion.div
            key="panel-blur"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 49,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── LEFT ASIDE SIDEBAR — collapses to circle when locked ── */}
      <div style={{
        position: 'absolute', left: 31, top: 0, bottom: 0,
        display: 'flex', alignItems: 'center',
        zIndex: zone === 'locked' ? 99 : 50,
      }}>
        <AnimatePresence>
          {zone !== 'locked' && (
            /* ── NORMAL PILL — exits by squishing upward (lock icon stays last) ── */
            <motion.div
              key="sidebar-pill"
              initial={{ opacity: 1, scaleY: 1 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] } }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 14, borderRadius: 100, padding: 10,
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)',
                boxShadow: '0px 40px 30px rgba(0,0,0,0.05), inset 0px 1px 1px rgba(255,255,255,0.60)',
                transformOrigin: 'center center',
              }}
            >
              {/* 1. Profile avatar */}
              <motion.div
                onClick={() => { setZone('profiles'); setPanelIdx(0) }}
                animate={{ scale: zone === 'aside' && asideNode === 'profile' ? 1.08 : 1 }}
                transition={{ duration: 0.18, ease: [0.34, 1.2, 0.64, 1] }}
                style={{
                  width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                  outline: (zone === 'aside' && asideNode === 'profile') || showProfile
                    ? '2.5px solid rgba(255,255,255,0.85)'
                    : '2px solid rgba(255,255,255,0.24)',
                  transition: 'outline 160ms',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={ANIMOJI_IMAGES[Math.max(0, activeProfileIdx) % 2]}
                  alt={activeProfile?.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </motion.div>
              {/* Divider */}
              <div style={{ width: 38, height: 1, background: 'rgba(255,255,255,0.20)', flexShrink: 0 }} />
              {/* Icons */}
              {([
                { node: 'home'     as AsideNode, sym: SF_TV     },
                { node: 'settings' as AsideNode, sym: SF_REMOTE },
                { node: 'search'   as AsideNode, sym: SF_TV2    },
                { node: 'lock'     as AsideNode, sym: SF_SEARCH },
              ]).map(({ node, sym }) => (
                <AsideButton key={node} focused={zone === 'aside' && asideNode === node}>
                  <span style={{
                    fontFamily: sfPro, fontSize: 22, fontWeight: 510,
                    fontVariationSettings: '"wdth" 100', lineHeight: 1, color: '#fff',
                  }}>{sym}</span>
                </AsideButton>
              ))}
            </motion.div>
          )}
          {zone === 'locked' && (
            /* ── COLLAPSED LOCK CIRCLE — horizontal: circle left, text right ── */
            <motion.div
              key="sidebar-locked"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.22 } }}
              transition={{ duration: 0.42, ease: [0.34, 1.2, 0.64, 1], delay: 0.22 }}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}
            >
              {/* Ring + circle */}
              <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ position: 'absolute', inset: 0 }} width={72} height={72} viewBox="0 0 72 72">
                  <circle cx={36} cy={36} r={32} fill="rgba(60,60,60,0.70)" />
                  <motion.circle
                    cx={36} cy={36} r={32}
                    fill="none" stroke="white" strokeWidth={3.5} strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 32}
                    animate={{
                      strokeDashoffset: lockUIVisible ? 2 * Math.PI * 32 * (1 - holdProgress) : 2 * Math.PI * 32,
                      opacity: lockUIVisible ? 1 : 0,
                    }}
                    transition={{ duration: 0 }}
                    style={{ rotate: -90, transformOrigin: '36px 36px' }}
                  />
                </svg>
                <motion.div
                  animate={lockUnlocking ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    width: 58, height: 58, borderRadius: '50%',
                    background: 'rgba(50,50,50,0.85)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="11" width="16" height="11" rx="3" fill="white" />
                    <motion.g
                      animate={lockUnlocking ? { y: -5, rotate: -35, opacity: 0.4 } : { y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.45, ease: [0.34, 1.2, 0.64, 1] }}
                      style={{ transformOrigin: '8px 11px' }}
                    >
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.g>
                  </svg>
                </motion.div>
              </div>

              {/* Text — slides in from left when E is pressed */}
              <AnimatePresence>
                {lockUIVisible && !lockUnlocking && (
                  <motion.span
                    key="hold-txt"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, transition: { duration: 0.22 } }}
                    transition={{ duration: 0.5, ease: [0.37, 0, 0.63, 1] }}
                    style={{
                      fontFamily: sfPro,
                      fontSize: 'clamp(16px, 1.56vw, 24px)',
                      fontWeight: 600,
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      letterSpacing: '-0.01em',
                      textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                    }}
                  >
                    Press and hold to unlock
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PROFILE PANEL — stessa posizione di Settings ── */}
      <AnimatePresence>
        {showProfile && (
          <div key="profile-panel" style={{ position: 'absolute', left: 110, top: '50%', transform: 'translateY(-50%)', zIndex: 60 }}>
            <motion.div
              initial={{ opacity: 0, x: -16, scale: 0.97 }}
              animate={{ opacity: 1, x: 0,   scale: 1    }}
              exit={{    opacity: 0, x: -16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ProfilePanel
                panelItems={panelItems}
                singles={singles}
                panelIdx={panelOpen ? panelIdx : -1}
                onSelect={activatePanelItem}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── SETTINGS CONTROL CENTRE — accanto alla sidebar, centrato verticalmente ── */}
      <AnimatePresence>
        {showSettings && (
          <div key="settings-cc" style={{ position: 'absolute', left: 110, top: '50%', transform: 'translateY(-50%)', zIndex: 60 }}>
            <motion.div
              initial={{ opacity: 0, x: -16, scale: 0.97 }}
              animate={{ opacity: 1, x: 0,   scale: 1    }}
              exit={{    opacity: 0, x: -16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <SettingsPanel
                activeCard={zone === 'settings-panel' ? settingsCard : -1}
                activeBtn={settingsBtn}
                activeSubItem={settingsSubItem}
                volume={volume}
                brightness={brightness}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── BRIGHTNESS OVERLAY ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: '#000',
        opacity: (100 - brightness) / 100 * 0.85,
        pointerEvents: 'none',
        transition: 'opacity 120ms linear',
      }} />

      {/* ── SEARCH OVERLAY ── */}
      <AnimatePresence>
        {zone === 'search' && (
          <SearchScreen key="search" onClose={() => { setZone('hero'); setHeroNode('dots') }} />
        )}
      </AnimatePresence>

      {/* ── LOCK SCREEN — Snoopy + dim, sidebar collapses in-place ── */}
      <AnimatePresence>
        {zone === 'locked' && (
          <motion.div
            key="lock-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{ position: 'absolute', inset: 0, zIndex: 98, overflow: 'hidden' }}
          >
            <SnoopyPlayer />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0) 55%)',
              pointerEvents: 'none',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CLOCK ── */}
      <div style={{ position: 'absolute', top: 30, right: 38, zIndex: 40 }}>
        <TimeDisplay />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   Lock Overlay — animated ring + unlock icon
══════════════════════════════════════════════════════ */
function LockOverlay({ visible, progress, unlocking, sfPro }: {
  visible: boolean; progress: number; unlocking: boolean; sfPro: string
}) {
  const R    = 30
  const CIRC = 2 * Math.PI * R

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="lock-ui"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', gap: 16,
          }}
        >
          {/* Ring + icon */}
          <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
            <svg width={72} height={72} viewBox="0 0 72 72" style={{ position: 'absolute', inset: 0 }}>
              {/* BG track */}
              <circle cx={36} cy={36} r={R} fill="rgba(255,255,255,0.12)" />
              {/* Progress arc */}
              <motion.circle
                cx={36} cy={36} r={R}
                fill="none"
                stroke="white"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                animate={{ strokeDashoffset: CIRC * (1 - progress) }}
                transition={{ duration: 0 }}
                style={{ rotate: -90, transformOrigin: '36px 36px' }}
              />
            </svg>

            {/* Lock SVG icon — shackle lifts when unlocking */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                {/* Body */}
                <rect x="4" y="11" width="16" height="11" rx="3" fill="white" />
                {/* Shackle arc — animates open */}
                <motion.g
                  animate={unlocking
                    ? { y: -5, rotate: -35, opacity: 0.4 }
                    : { y:  0, rotate:   0, opacity: 1   }}
                  transition={{ duration: 0.45, ease: [0.34, 1.2, 0.64, 1] }}
                  style={{ transformOrigin: '8px 11px' }}
                >
                  <path
                    d="M8 11V7a4 4 0 0 1 8 0v4"
                    stroke="white" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </motion.g>
              </svg>
            </div>
          </div>

          {/* Text pill */}
          <motion.div
            animate={{ opacity: unlocking ? 0 : 1 }}
            style={{
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              padding: '10px 22px',
              borderRadius: 100,
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            <span style={{ fontFamily: sfPro, fontSize: 18, fontWeight: 550, color: '#fff', whiteSpace: 'nowrap' }}>
              Tieni premuto per sbloccare
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════════════════
   Snoopy video player — random shuffle, no consecutive repeat
══════════════════════════════════════════════════════ */
function shuffleSnoopy(videos: string[], avoidFirst?: string): string[] {
  const arr = [...videos]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  if (avoidFirst && arr[0] === avoidFirst && arr.length > 1) {
    const swap = Math.floor(Math.random() * (arr.length - 1)) + 1
    ;[arr[0], arr[swap]] = [arr[swap], arr[0]]
  }
  return arr
}

function SnoopyPlayer() {
  const [state, setState] = useState<{ playlist: string[]; idx: number }>(
    () => ({ playlist: shuffleSnoopy(SNOOPY_VIDEOS), idx: 0 })
  )

  const handleEnded = useCallback(() => {
    setState(prev => {
      if (prev.idx + 1 < prev.playlist.length) return { ...prev, idx: prev.idx + 1 }
      const last = prev.playlist[prev.playlist.length - 1]
      return { playlist: shuffleSnoopy(SNOOPY_VIDEOS, last), idx: 0 }
    })
  }, [])

  return (
    <video
      key={state.playlist[state.idx]}
      autoPlay muted playsInline
      onEnded={handleEnded}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    >
      <source src={state.playlist[state.idx]} />
    </video>
  )
}

/* ══════════════════════════════════════════════════════
   Profile Panel
══════════════════════════════════════════════════════ */
function ProfilePanel({ panelItems, singles, panelIdx, onSelect }: {
  panelItems: (Profile | null)[]
  singles: Profile[]
  panelIdx: number
  onSelect: (idx: number) => void
}) {
  /* Match settings panel sizing tokens
     Math: CARD_H(270) - 2×PAD(16) = 238px available
     3×CIRCLE(70) + 2×GAP(14) = 238px — fits exactly at max */
  const CARD_H  = 'clamp(130px, 18vh, 200px)'
  const CIRCLE  = 'clamp(48px, 4.2vw, 70px)'
  const GAP     = 'clamp(8px,  0.85vw, 14px)'
  const PAD     = 'clamp(10px, 0.83vw, 16px)'
  const ICON_SZ = 'clamp(14px, 1.2vw,  20px)'
  const BR      = 'clamp(36px, 3.65vw, 70px)'

  return (
    <div style={{
      height: CARD_H,
      display: 'grid',
      gridTemplateColumns: `repeat(2, ${CIRCLE})`,
      gridAutoRows: CIRCLE,
      gap: GAP,
      padding: PAD,
      borderRadius: BR,
      background: 'rgba(255,255,255,0.10)',
      backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)',
      border: '1px solid rgba(255,255,255,0.15)',
      boxShadow: '0 40px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.60)',
      alignContent: 'center',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      {panelItems.map((item, idx) => {
        const focused = panelIdx === idx
        if (!item) return (
          <motion.div key="add" onClick={() => onSelect(idx)} animate={{ scale: focused ? 1.08 : 1 }} style={{
            width: CIRCLE, height: CIRCLE, borderRadius: '50%', flexShrink: 0,
            background: focused ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)',
            outline: focused ? '2px solid rgba(255,255,255,0.70)' : '2px dashed rgba(255,255,255,0.28)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            cursor: 'pointer',
          }}>
            <Plus size={16} strokeWidth={2} color="#fff" />
            <span style={{ fontFamily: sfPro, fontSize: ICON_SZ, color: 'rgba(255,255,255,0.6)', lineHeight: 1 }}>Add</span>
          </motion.div>
        )
        const singleIdx = singles.indexOf(item)
        return (
          <motion.div key={item.id} onClick={() => onSelect(idx)} animate={{ scale: focused ? 1.08 : 1 }} style={{ cursor: 'pointer' }}>
            {item.type === 'single' ? (
              <div style={{
                width: CIRCLE, height: CIRCLE, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                border: focused ? '2.5px solid rgba(255,255,255,0.85)' : '2px solid rgba(255,255,255,0.20)',
                boxShadow: '3px 1.5px 8px rgba(0,0,0,0.25)',
              }}>
                <img
                  src={ANIMOJI_IMAGES[singleIdx >= 0 ? singleIdx % 2 : idx % 2]}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              /* Group avatar — large Animoji top-left, small bottom-right */
              <div style={{
                width: CIRCLE, height: CIRCLE, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', position: 'relative',
                background: 'linear-gradient(to bottom,#b7b2ac,#a09a9b)',
                border: focused ? '2.5px solid rgba(255,255,255,0.85)' : '2px solid rgba(255,255,255,0.18)',
                boxShadow: '3px 1.5px 8px rgba(0,0,0,0.25)',
              }}>
                {/* large avatar — top-left (proportional to 110px original) */}
                <img src={IMG_ANIMOJI_1} alt="" style={{
                  position: 'absolute', left: '10.5%', top: '12.5%',
                  width: '50%', height: '50%', borderRadius: '50%', objectFit: 'cover',
                  border: '1.5px solid rgba(255,255,255,0.55)',
                }} />
                {/* small avatar — bottom-right */}
                <img src={IMG_ANIMOJI_2} alt="" style={{
                  position: 'absolute', left: '50%', top: '54%',
                  width: '33%', height: '33%', borderRadius: '50%', objectFit: 'cover',
                  border: '1.5px solid rgba(255,255,255,0.55)',
                }} />
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   Settings Control Centre
══════════════════════════════════════════════════════ */
function SettingsPanel({ activeCard, activeBtn, activeSubItem, volume, brightness }: {
  activeCard:    number   // -1 = no focus, 0/1/2 = card focused
  activeBtn:     number   // 0-3 for quick actions
  activeSubItem: number   // 0=slider, 1=label (within card 1/2)
  volume:        number   // 0-100
  brightness:    number   // 0-100
}) {
  /* Scale to viewport — designed for 1920×1080 */
  const CARD_H   = 'clamp(180px, 25vh,  270px)'
  const SQ_W     = 'clamp(170px, 14vw,  270px)'
  const RECT_W   = 'clamp(240px, 21.9vw,420px)'
  const SLIDER_W = 'clamp(60px,  5.2vw, 100px)'
  const SLIDER_H = 'clamp(140px, 21.3vh,230px)'
  const LABEL_W  = 'clamp(130px, 13vw,  250px)'
  const BTN_SZ   = 'clamp(58px,  5.2vw, 100px)'
  const ICON_SZ  = 'clamp(18px,  1.67vw, 32px)'
  const GAP      = 'clamp(12px,  1.2vw,  23px)'
  const PAD      = 'clamp(12px,  1.04vw, 20px)'

  const glass = (focused: boolean): React.CSSProperties => ({
    border: focused ? '2px solid rgba(255,255,255,0.75)' : '1px solid rgba(255,255,255,0.15)',
    borderRadius: 'clamp(36px, 3.65vw, 70px)',
    background: focused ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.10)',
    backdropFilter: 'blur(50px)',
    WebkitBackdropFilter: 'blur(50px)',
    boxShadow: focused
      ? '0 0 0 4px rgba(255,255,255,0.08), inset 0 1px 1px rgba(255,255,255,0.60)'
      : '0 40px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.60)',
    position: 'relative', flexShrink: 0,
    transition: 'border 180ms, background 180ms, box-shadow 180ms',
  })
  const iconSym = (s: string, c = '#fff') => (
    <span style={{ fontFamily: sfPro, fontSize: ICON_SZ, color: c, lineHeight: 1 }}>{s}</span>
  )
  const btn = (s: string, idx: number) => {
    const focused = activeCard === 0 && activeBtn === idx
    return (
      <div style={{
        width: BTN_SZ, height: BTN_SZ, borderRadius: 200, flexShrink: 0,
        background: focused ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.10)',
        outline: focused ? '2px solid rgba(255,255,255,0.75)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 160ms, outline 160ms',
      }}>
        {iconSym(s)}
      </div>
    )
  }
  const slider = (s: string, fill: number, cardIdx: number, iconColor = '#fff') => {
    const sliderFocused = activeCard === cardIdx && activeSubItem === 0
    return (
      <div style={{
        width: SLIDER_W, height: SLIDER_H, borderRadius: 200, flexShrink: 0,
        background: 'rgba(255,255,255,0.10)', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        outline: sliderFocused ? '2px solid rgba(255,255,255,0.75)' : '2px solid transparent',
        transition: 'outline 160ms',
      }}>
        <div style={{ position: 'absolute', left: -6, bottom: 0, width: `calc(${SLIDER_W} + 12px)`, height: `${fill}%`, background: '#fff', transition: 'height 120ms ease' }} />
        <span style={{ position: 'relative', zIndex: 1, fontFamily: sfPro, fontSize: ICON_SZ, fontWeight: 600, color: iconColor, lineHeight: 1 }}>{s}</span>
      </div>
    )
  }
  const label = (t: string, cardIdx: number) => {
    const labelFocused = activeCard === cardIdx && activeSubItem === 1
    return (
      <div style={{
        width: LABEL_W, height: SLIDER_H, borderRadius: 'clamp(24px, 2.6vw, 50px)', flexShrink: 0,
        background: labelFocused ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)',
        padding: PAD, display: 'flex', alignItems: 'flex-start',
        outline: labelFocused ? '2px solid rgba(255,255,255,0.75)' : '2px solid transparent',
        transition: 'background 160ms, outline 160ms',
      }}>
        <span style={{ fontFamily: sfPro, fontSize: ICON_SZ, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>{t}</span>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', gap: GAP, alignItems: 'center' }}>
      {/* Card 0 — Quick Actions 2×2 */}
      <div style={{ ...glass(activeCard === 0), width: SQ_W, height: CARD_H, padding: PAD, display: 'flex', flexWrap: 'wrap', gap: GAP, alignContent: 'flex-start', overflow: 'hidden' }}>
        {btn(SF_WIFI, 0)}{btn(SF_MOON, 1)}{btn(SF_GEAR, 2)}{btn(SF_HOME_CC, 3)}
      </div>
      {/* Card 1 — TV Speakers / Volume */}
      <div style={{ ...glass(activeCard === 1), width: RECT_W, height: CARD_H, padding: PAD, display: 'flex', gap: GAP, alignItems: 'flex-start', overflow: 'hidden' }}>
        {slider(SF_VOL, volume, 1)}
        {label('Tv speakers', 1)}
      </div>
      {/* Card 2 — HDMI 1 / Brightness */}
      <div style={{ ...glass(activeCard === 2), width: RECT_W, height: CARD_H, padding: PAD, display: 'flex', gap: GAP, alignItems: 'flex-start', overflow: 'hidden' }}>
        {slider(SF_BRIGHT, brightness, 2, brightness < 40 ? '#fff' : '#040404')}
        {label('HDMI 1', 2)}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   Aside Button
══════════════════════════════════════════════════════ */
function AsideButton({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ scale: focused ? 1.08 : 1 }}
      transition={{ duration: 0.18, ease: [0.34, 1.2, 0.64, 1] }}
      style={{
        width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
        background: focused ? 'rgba(255,255,255,0.30)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 160ms',
      }}
    >
      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════
   App Grid  — absolute rows matching Figma HOME layout
   Panel: 1689 × 894
   Row1: left:321 top:79  w:1091  (4 items)
   Row2: left:149 top:354 w:1435  (5 items)
   Row3: left:321 top:627 w:1091  (4 items)
══════════════════════════════════════════════════════ */
function AppGrid({ rows, focused, gridFlat, onAppSelect }: {
  rows: AppIconDef[][]
  focused: boolean
  gridFlat: number
  onAppSelect: (app: AppIconDef) => void
}) {
  const rowDefs = [
    { left: 321 / 1689 * 100, top: 79  / 894 * 100, w: 1091 / 1689 * 100, offset: 0 },
    { left: 149 / 1689 * 100, top: 354 / 894 * 100, w: 1435 / 1689 * 100, offset: 4 },
    { left: 321 / 1689 * 100, top: 627 / 894 * 100, w: 1091 / 1689 * 100, offset: 9 },
  ]
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {rows.map((row, rowIdx) => {
        const { left, top, w, offset } = rowDefs[rowIdx]
        return (
          <div key={rowIdx} style={{
            position: 'absolute',
            left: `${left}%`, top: `${top}%`, width: `${w}%`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            {row.map((app, colIdx) => (
              <AppIconCell
                key={app.id}
                def={app}
                focused={focused && gridFlat === offset + colIdx}
                onClick={() => onAppSelect(app)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function AppIconCell({ def, focused, onClick }: { def: AppIconDef; focused: boolean; onClick: () => void }) {
  const SZ = 'clamp(80px, 7.66vw, 147px)'
  const inner = (bg: string, extra?: React.CSSProperties, children?: React.ReactNode) => (
    <motion.div
      animate={{ scale: focused ? 1.22 : 1 }}
      transition={{ duration: 0.18, ease: [0.34, 1.2, 0.64, 1] }}
      onClick={onClick}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.85vh', cursor: 'pointer' }}
    >
      <div style={{
        position: 'relative', width: SZ, height: SZ,
        borderRadius: '50%', background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        filter: 'drop-shadow(0 0 7.5px rgba(0,0,0,0.25))',
        ...extra,
      }}>
        {children}
        {focused && (
          <div style={{
            position: 'absolute', inset: -3, borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.85)',
            boxShadow: '0 0 18px rgba(255,255,255,0.22)',
            pointerEvents: 'none',
          }} />
        )}
      </div>
      <span style={{
        fontFamily: sfPro, fontSize: 'clamp(10px, 0.94vw, 18px)',
        fontWeight: 510, color: 'rgba(255,255,255,0.96)',
        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap', letterSpacing: '-0.01em',
        fontVariationSettings: '"wdth" 100',
      }}>{def.label}</span>
    </motion.div>
  )

  if (def.kind === 'party') return inner(
    'linear-gradient(180deg,#f059f8,#999eff 50%,#1ce8ff)',
    { boxShadow: '0 -5px 20px rgba(229,98,249,.5),0 5px 20px rgba(47,221,255,.5)' },
    <>
      <div style={{ position:'absolute', left:0,    top:0,     width:'37%', height:'33%', borderRadius:14, backdropFilter:'blur(17px)', background:'rgba(255,255,255,0.4)' }} />
      <div style={{ position:'absolute', left:'6%', top:'46%', width:'37%', height:'33%', borderRadius:14, backdropFilter:'blur(17px)', background:'rgba(255,255,255,0.4)' }} />
      <div style={{ position:'absolute', right:0,   top:'5%',  width:'37%', height:'33%', borderRadius:14, backdropFilter:'blur(17px)', background:'rgba(255,255,255,0.4)' }} />
      <div style={{ position:'absolute', right:0,   top:'46%', width:'57%', height:'50%', borderRadius:14, backdropFilter:'blur(17px)', background:'rgba(255,255,255,0.4)' }} />
    </>
  )
  if (def.kind === 'sym') return inner(def.bg, undefined,
    <span style={{ fontFamily: sfPro, fontSize: 'clamp(30px,3.125vw,60px)', fontWeight: 510, color: '#fff', fontVariationSettings: '"wdth" 100', lineHeight: 1 }}>
      {def.sym}
    </span>
  )
  return inner(def.bg, undefined,
    <img src={def.img} alt={def.label} style={{ width: `${def.imgPct ?? 65}%`, height: `${def.imgPct ?? 65}%`, objectFit: 'contain' }} />
  )
}

/* ══════════════════════════════════════════════════════
   Hero CTA button
══════════════════════════════════════════════════════ */
function HeroButton({ icon, label, sfCompact, focused }: {
  icon: string; label: string; sfCompact: string; focused: boolean
}) {
  return (
    <motion.div
      animate={{ scale: focused ? 1.06 : 1 }}
      transition={{ duration: 0.18, ease: [0.34, 1.2, 0.64, 1] }}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        height: 44, borderRadius: 24, padding: '0 22px',
        backdropFilter: 'blur(68px)',
        background: focused ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.20)',
        outline: focused ? '2px solid rgba(255,255,255,0.80)' : '2px solid transparent',
        transition: 'background 160ms, outline 160ms',
        cursor: 'default',
      }}
    >
      <span style={{ fontFamily: sfCompact, fontSize: 17, fontWeight: 600, letterSpacing: '0.68px', color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>
        {icon}
      </span>
      <span style={{ fontFamily: sfCompact, fontSize: 17, fontWeight: 600, letterSpacing: '0.68px', color: 'rgba(255,255,255,0.9)', lineHeight: '22px', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════
   Clock
══════════════════════════════════════════════════════ */
function TimeDisplay() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  const h = String(t.getHours()).padStart(2, '0')
  const m = String(t.getMinutes()).padStart(2, '0')
  return (
    <span style={{
      fontFamily: sfPro, fontSize: 14, fontWeight: 300,
      color: 'rgba(255,255,255,0.38)', letterSpacing: '0.8px',
      fontVariantNumeric: 'tabular-nums',
    }}>{h}:{m}</span>
  )
}

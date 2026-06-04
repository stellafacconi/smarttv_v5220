import { useState, useEffect, useRef, useCallback } from 'react'
import type { RefObject } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import lyricsLrc from '../../../music/lyrics.lrc?raw'

const sfPro = `-apple-system,'SF Pro Display','SF Pro Text','Helvetica Neue',sans-serif`

/* ─── Figma asset URLs ─────────────────────────────────── */

// Browser screen (125:1456)
const bMusicCard  = 'https://www.figma.com/api/mcp/asset/8dcd8f80-2e76-4626-8801-91d44cef87a9'
const bMusicCard1 = 'https://www.figma.com/api/mcp/asset/a2b22f74-1bcc-4048-bfe5-f18d896706e8'
const bMusicCard2 = 'https://www.figma.com/api/mcp/asset/b669a86d-42d8-4f84-bad2-92c65ac8aa75'
const bMusicCard3 = 'https://www.figma.com/api/mcp/asset/c8a644cb-d7bf-4392-8184-3fe1ef8dda37'
const bMusicCard4 = 'https://www.figma.com/api/mcp/asset/e671e1fa-5ca5-4e0a-8de9-94feef76f58e'
const bMusicCard5 = 'https://www.figma.com/api/mcp/asset/6aeb936f-9c37-43d1-b51b-c6d470b95633'
const bRect4      = 'https://www.figma.com/api/mcp/asset/af1da56c-2ebb-4d9c-994c-e8311c072968'
const bRect5      = 'https://www.figma.com/api/mcp/asset/ef87e72c-1938-416c-a241-f0cee3f2a524'
const bRect6      = 'https://www.figma.com/api/mcp/asset/f717168b-acbd-4401-b318-89fdc3fd3f5c'
const bRect7      = 'https://www.figma.com/api/mcp/asset/b6b34aa9-a934-4919-8781-08228bec80f3'
const bRect8      = 'https://www.figma.com/api/mcp/asset/ba7b8586-05e5-431a-94ab-981a16e90641'
const bBg         = 'https://www.figma.com/api/mcp/asset/55d9e8be-0d0c-481a-837b-5110a7f5a505'
const bMemoji     = 'https://www.figma.com/api/mcp/asset/341f5e31-6e82-4987-b84b-d5d01f0b6ef6'
const bMemoji1    = 'https://www.figma.com/api/mcp/asset/38ea8012-621d-4cd5-8ef8-b026cf5462a7'
const bMemoji2    = 'https://www.figma.com/api/mcp/asset/2403a448-7455-4d50-9e9a-ac41323ed016'
const bMusicCardState6 = 'https://www.figma.com/api/mcp/asset/7e071ffb-f458-4237-af9a-45e0aaba7b87'
const bDividerFrame    = 'https://www.figma.com/api/mcp/asset/6165ac19-fe63-4c2d-8fc1-3afc522865ef'

// Sing Home guide (125:1396)
const gFrame109         = 'https://www.figma.com/api/mcp/asset/adb78e74-1999-47d3-8265-72b4bcc99cb6'
const gMusicCardState6  = 'https://www.figma.com/api/mcp/asset/d7404b42-9f0d-48b3-8486-72966c179d7b'
const gMusicCardState7  = 'https://www.figma.com/api/mcp/asset/cf4c59a4-90b1-458d-88d2-0bd11f1d2709'
const gMusicCardState8  = 'https://www.figma.com/api/mcp/asset/ced2a588-c848-4c2c-b13b-876991e83063'
const gEllipse164       = 'https://www.figma.com/api/mcp/asset/21d5adba-b580-4a5a-8135-8a83dcd5106e'
const gEllipse160       = 'https://www.figma.com/api/mcp/asset/043bb759-0d49-44b7-bebc-1c5ecd3ccb3d'
const gGroup160         = 'https://www.figma.com/api/mcp/asset/371578f8-4651-41bd-a0a0-d853d25f86de'
const gEllipse128       = 'https://www.figma.com/api/mcp/asset/f141d1e0-06ca-416a-9361-eda3f809d8ab'
const gEllipse107       = 'https://www.figma.com/api/mcp/asset/5d65a9f8-73f1-4cdf-b920-2c09c145d4c8'

// Singing screen (125:1650)
const sAlbumArt   = 'https://www.figma.com/api/mcp/asset/5932e4a3-d4ad-48f2-94e1-330f523edaed'
const sMemoji     = 'https://www.figma.com/api/mcp/asset/0bab11ad-a1c2-4db4-8466-844815214bd0'
const sMemoji1    = 'https://www.figma.com/api/mcp/asset/84a81b45-d2e0-4044-b0cc-3af2699c433b'
const sMemoji2    = 'https://www.figma.com/api/mcp/asset/a452ca0c-e490-4f40-97d8-23dc668403c7'
const sRect4      = 'https://www.figma.com/api/mcp/asset/bf0f47ab-bc67-40a0-979c-2655684ef799'
const sRect5      = 'https://www.figma.com/api/mcp/asset/153d661e-5e73-4289-a892-be1cf1cb13d8'
const sRect6      = 'https://www.figma.com/api/mcp/asset/22702f9b-0f05-4ea5-ba0e-3f932d58f4e1'
const sEllipse161 = 'https://www.figma.com/api/mcp/asset/a1507de9-ec29-4a63-af21-36cf40c85839'
const sEllipse160 = 'https://www.figma.com/api/mcp/asset/0d20ae6a-534f-4553-b17d-07af87580b5f'

// Sing Home sing list (125:1729)
const listAlbumArt = 'https://www.figma.com/api/mcp/asset/5d782884-ee32-4955-829b-fd47cd7f4cb8'
const listRect4    = 'https://www.figma.com/api/mcp/asset/f904b367-840a-474a-9209-b749c6300b16'
const listRect5    = 'https://www.figma.com/api/mcp/asset/a8be1f1c-3177-43c5-8cbe-39b72f15e117'
const listRect6    = 'https://www.figma.com/api/mcp/asset/9d4f82ed-16e4-4b60-9a30-e414368a4e57'
const listRect7    = 'https://www.figma.com/api/mcp/asset/07d2604b-9927-4282-9063-c58768b1ccea'

// Sing Home Search (125:2054)
const srMemoji      = 'https://www.figma.com/api/mcp/asset/4f393153-01c9-45ff-802f-8ad50d4915cc'
const srMemoji1     = 'https://www.figma.com/api/mcp/asset/9ffc2dea-d673-4ba1-a291-914122ce0457'
const srSingerCard  = 'https://www.figma.com/api/mcp/asset/9b8e0c7f-c61f-4786-9b77-9b5a8b63b01a'
const srSingerCard1 = 'https://www.figma.com/api/mcp/asset/d1030d5e-55dc-4f65-8ef6-2e0280650faf'
const srSingerCard2 = 'https://www.figma.com/api/mcp/asset/b5be9b3b-9e1d-4578-8d3e-9e1eff036c71'
const srSingerCard3 = 'https://www.figma.com/api/mcp/asset/7561dae9-3fc2-49ef-aff1-d072a5f7399f'
const srSingerCard4 = 'https://www.figma.com/api/mcp/asset/01b2e8f2-d31b-4dbb-acf0-d1b3ddcf9c6d'
const srSingerCard5 = 'https://www.figma.com/api/mcp/asset/a164105b-6113-4e6a-8ae8-c220eb01d0b2'
const srRect4       = 'https://www.figma.com/api/mcp/asset/5c76d820-d5ef-4af2-8306-6531b3c5d9db'
const srRect5       = 'https://www.figma.com/api/mcp/asset/4ca9f9f5-b1ea-4983-9d6f-fdbc1d13b71d'
const srRect6       = 'https://www.figma.com/api/mcp/asset/8bd5f326-c6f0-48a4-b827-8350330df18b'
const srRect7       = 'https://www.figma.com/api/mcp/asset/c81d0d19-6936-4f33-bddb-7bde65051173'
const srRect8       = 'https://www.figma.com/api/mcp/asset/474866d6-de85-4a35-81e1-39f1d148e623'

// Sing Sidebar Search (125:1815)
const ssMemoji      = 'https://www.figma.com/api/mcp/asset/3d935938-0c6c-4c33-bbd4-eedf7aef5cf0'
const ssMemoji1     = 'https://www.figma.com/api/mcp/asset/0a074fd5-8f59-4ea3-8452-ec6217a23cb6'
const ssMemoji2     = 'https://www.figma.com/api/mcp/asset/9c507c8e-b74c-494c-8932-8630a02214a4'
const ssAlbumArt    = 'https://www.figma.com/api/mcp/asset/5c466e7b-e3c9-4602-9019-4f47d1271600'
const ssBg4         = 'https://www.figma.com/api/mcp/asset/05403581-17c6-4202-ab04-3133ead0cb18'
const ssBg5         = 'https://www.figma.com/api/mcp/asset/b0a12264-2a06-4e9c-a146-b1c5003b97fa'
const ssMusicCard   = 'https://www.figma.com/api/mcp/asset/2338ce77-4dc6-4443-9699-686253fc9f8a'
const ssMusicCard1  = 'https://www.figma.com/api/mcp/asset/f1bc172d-e730-418b-8605-208ea413a603'
const ssMusicCard2  = 'https://www.figma.com/api/mcp/asset/479f3ea3-3d75-45d6-8cb7-a7f86e412c8b'

// Finished screen (125:1959)
const fMemoji     = 'https://www.figma.com/api/mcp/asset/04660d23-6b22-4e60-8065-2b22b1857fde'
const fMemoji1    = 'https://www.figma.com/api/mcp/asset/9e2ee883-b3fa-4d49-ada3-e883c270f942'
const fMemoji2    = 'https://www.figma.com/api/mcp/asset/54367fd2-e467-41bb-be76-156f0ac28b7c'
const fRect4      = 'https://www.figma.com/api/mcp/asset/4e675736-c7f6-4d07-8873-92a0cfc890d6'
const fRect5      = 'https://www.figma.com/api/mcp/asset/73f76374-fe38-403b-a7cd-81062a6bdefe'
const fRect6      = 'https://www.figma.com/api/mcp/asset/df13589a-43f9-452d-b276-e3705f3e7191'
const fEllipse161 = 'https://www.figma.com/api/mcp/asset/3cafacfd-39bc-4b1f-bd42-c0154585e916'
const fEllipse160 = 'https://www.figma.com/api/mcp/asset/333441a7-d0d5-4f39-8b0f-da3fe4c4666b'

/* ─── SF Symbol unicode chars ─────────────────────────── */
const SF = {
  back:        '\u{100189}',
  search:      '\u{1002AB}',
  mic:         '\u{10046B}',
  browser:     '\u{103439}',
  nextup:      '\u{1002FD}',
  playlist:    '\u{1004BC}',
  add:         '\u{10017C}',
  ellipsis:    '\u{100360}',
  queue:       '\u{1002F2}',
  listSearch:  '\u{100184}',
  listHead:    '\u{100187}',
  listMic:     '\u{100188}',
  listAdd:     '\u{10017E}',
  listMore:    '\u{102A93}',
  shuffle:     '\u{10029D}',
  volume:      '\u{1002A5}',
  captions:    '\u{10032E}',
  skipBack:    '\u{10028A}',
  play:        '\u{100284}',
  pause:       '\u{100286}',
  skipFwd:     '\u{10028C}',
  skip10:      '\u{100381}',
}

/* ─── Types ─────────────────────────────────────────────── */
type SingStep = 'guide' | 'browser' | 'search' | 'singing' | 'finished'
type SingHomeEntry = 'browser' | 'browser-guide' | 'singing-guide'
type PlayerId = 0 | 1 | 2
type Direction = 'left' | 'right' | 'up' | 'down'
type TouchTarget = {
  id: string
  left: number
  top: number
  width: number
  height: number
  radius: number
}

type CurrentListRow = {
  title: string
  artist: string
  thumb: string
  overlay?: string
  active?: boolean
}

type LyricLine = {
  time: number
  text: string
  raw: string
}

// Keep these knobs here so the approximate LRC timeline can be adjusted without
// touching the rendering logic.
const LYRIC_TIMING_OFFSET_SECONDS = 0
const LYRIC_ROW_HEIGHT = 104
const LRC_TIME_RE = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g

function parseLrc(raw: string): LyricLine[] {
  return raw
    .split(/\r?\n/)
    .flatMap(line => {
      const matches = [...line.matchAll(LRC_TIME_RE)]
      if (matches.length === 0) return []
      const text = line.replace(LRC_TIME_RE, '').trim()
      if (!text || /^[a-z-]+$/i.test(text)) return []
      return matches.map(match => {
        const minutes = Number(match[1])
        const seconds = Number(match[2])
        const fraction = match[3] ? Number(match[3].padEnd(3, '0')) / 1000 : 0
        return { time: minutes * 60 + seconds + fraction, text, raw: line }
      })
    })
    .sort((a, b) => a.time - b.time)
}

const LYRIC_LINES = parseLrc(lyricsLrc)
const LYRIC_DURATION = LYRIC_LINES.at(-1)?.time ?? 210

/* ─── Song list ─────────────────────────────────────────── */
const SONG_LIST = [
  { title: '360',             artist: 'Charli XCX'        },
  { title: 'Flowers',         artist: 'Miley Cyrus'       },
  { title: 'As It Was',       artist: 'Harry Styles'      },
  { title: 'Anti-Hero',       artist: 'Taylor Swift'      },
  { title: 'Blinding Lights', artist: 'The Weeknd'        },
  { title: 'Espresso',        artist: 'Sabrina Carpenter' },
] as const
type SongEntry = typeof SONG_LIST[number]

type ItunesTrack = { artwork: string | null; previewUrl: string | null; trackName: string | null; artistName: string | null; trackTimeSec: number | null }

function useItunesData(songs: readonly SongEntry[]) {
  const [data, setData] = useState<ItunesTrack[]>(() => songs.map(() => ({ artwork: null, previewUrl: null, trackName: null, artistName: null, trackTimeSec: null })))
  useEffect(() => {
    songs.forEach(async (song, i) => {
      try {
        const q = encodeURIComponent(`${song.title} ${song.artist}`)
        const r = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=10&country=us`)
        const d = await r.json()
        const results: Array<{ trackName: string; artistName: string; artworkUrl100: string; previewUrl: string; trackTimeMillis: number }> = d.results ?? []
        const tl = song.title.toLowerCase()
        const al = song.artist.toLowerCase()
        // best match: exact title + artist; fallback: title only; then first result
        const best =
          results.find(r => r.trackName?.toLowerCase() === tl && r.artistName?.toLowerCase().includes(al.split(' ')[0])) ??
          results.find(r => r.trackName?.toLowerCase().includes(tl)) ??
          results[0]
        if (best) {
          setData(prev => {
            const n = [...prev]
            n[i] = {
              artwork: best.artworkUrl100?.replace('100x100bb', '400x400bb') ?? null,
              previewUrl: best.previewUrl ?? null,
              trackName: best.trackName ?? null,
              artistName: best.artistName ?? null,
              trackTimeSec: best.trackTimeMillis ? best.trackTimeMillis / 1000 : null,
            }
            return n
          })
        }
      } catch {}
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return data
}

// Fetch iTunes data for a single song (used when song comes from PartyScreen)
function useItunesSingle(title: string, artist: string) {
  const [track, setTrack] = useState<ItunesTrack>({ artwork: null, previewUrl: null, trackName: null, artistName: null, trackTimeSec: null })
  useEffect(() => {
    if (!title) return
    setTrack({ artwork: null, previewUrl: null, trackName: null, artistName: null, trackTimeSec: null })
    const q = encodeURIComponent(`${title} ${artist}`)
    fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=10&country=us`)
      .then(r => r.json())
      .then(d => {
        const results: Array<{ trackName: string; artistName: string; artworkUrl100: string; previewUrl: string; trackTimeMillis: number }> = d.results ?? []
        const tl = title.toLowerCase()
        const al = artist.toLowerCase()
        const best =
          results.find(r => r.trackName?.toLowerCase() === tl && r.artistName?.toLowerCase().includes(al.split(' ')[0])) ??
          results.find(r => r.trackName?.toLowerCase().includes(tl)) ??
          results[0]
        if (best) setTrack({
          artwork: best.artworkUrl100?.replace('100x100bb', '400x400bb') ?? null,
          previewUrl: best.previewUrl ?? null,
          trackName: best.trackName ?? null,
          artistName: best.artistName ?? null,
          trackTimeSec: best.trackTimeMillis ? best.trackTimeMillis / 1000 : null,
        })
      })
      .catch(() => {})
  }, [title, artist])
  return track
}

function useLrclib(title: string, artist: string) {
  const [lines, setLines] = useState<LyricLine[] | null>(null)
  useEffect(() => {
    setLines(null)
    const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`
    fetch(url)
      .then(r => r.json())
      .then((d: { syncedLyrics?: string; plainLyrics?: string }) => {
        if (d.syncedLyrics) setLines(parseLrc(d.syncedLyrics))
        else if (d.plainLyrics) {
          const plain = d.plainLyrics.split('\n').filter((l: string) => l.trim())
          setLines(plain.map((text: string, idx: number) => ({ time: idx * 3, text, raw: text })))
        }
      })
      .catch(() => {})
  }, [title, artist])
  return lines
}

function findActiveLyricIndex(lines: LyricLine[], currentTime: number) {
  const syncedTime = currentTime + LYRIC_TIMING_OFFSET_SECONDS
  let active = 0
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].time <= syncedTime) active = i
    else break
  }
  return active
}

function useSyncedLyricTime(audioRef: RefObject<HTMLAudioElement | null>, enabled = true) {
  const [currentTime, setCurrentTime] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) return
    let raf = 0
    const tick = (now: number) => {
      const audio = audioRef.current
      const hasRealAudio = audio && audio.readyState > 0 && Number.isFinite(audio.duration) && audio.duration > 0
      if (hasRealAudio) {
        setCurrentTime(audio.currentTime)
      } else {
        if (startRef.current === null) startRef.current = now
        const elapsed = ((now - startRef.current) / 1000) % Math.max(LYRIC_DURATION + 4, 1)
        setCurrentTime(elapsed)
      }
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [audioRef, enabled])

  return currentTime
}

function SyncedLyrics({
  audioRef,
  compact = false,
  lyricLines,
}: {
  audioRef: RefObject<HTMLAudioElement | null>
  compact?: boolean
  lyricLines?: LyricLine[] | null
}) {
  const lines = (lyricLines && lyricLines.length > 0)
    ? lyricLines
    : LYRIC_LINES.length > 0 ? LYRIC_LINES : [{ time: 0, text: "I'll rise above the fear", raw: '' }]
  const currentTime = useSyncedLyricTime(audioRef)
  const activeIndex = findActiveLyricIndex(lines, currentTime)
  const viewportHeight = compact ? 336 : 364
  const centerOffset = viewportHeight / 2 - LYRIC_ROW_HEIGHT / 2

  return (
    <div style={{
      position: 'relative',
      width: compact ? 820 : 574,
      height: viewportHeight,
      overflow: 'hidden',
      WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)',
      maskImage: 'linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)',
    }}>
      <motion.div
        animate={{ y: centerOffset - activeIndex * LYRIC_ROW_HEIGHT }}
        transition={{ type: 'spring', stiffness: 115, damping: 24, mass: 0.9 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: compact ? 'center' : 'flex-start',
        }}
      >
        {lines.map((line, index) => {
          const distance = Math.abs(index - activeIndex)
          const active = index === activeIndex
          const near = distance === 1
          return (
            <motion.p
              key={`${line.time}-${line.text}-${index}`}
              animate={{
                opacity: active ? 1 : near ? 0.68 : 0.34,
                scale: active ? 1 : near ? 0.88 : 0.76,
              }}
              transition={{ duration: 0.28 }}
              style={{
                height: LYRIC_ROW_HEIGHT,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: compact ? 'center' : 'flex-start',
                fontFamily: sfPro,
                fontSize: active ? (compact ? 46 : 52) : near ? 32 : 24,
                fontWeight: active ? 510 : near ? 510 : 274,
                color: '#fff',
                lineHeight: active ? '1.08' : '1.1',
                letterSpacing: 0,
                margin: 0,
                transformOrigin: compact ? 'center center' : 'left center',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'break-word',
              }}
            >
              {line.text}
            </motion.p>
          )
        })}
      </motion.div>
    </div>
  )
}

const PLAYER_TOUCHES = [
  { color: '#bef0c6', keys: 'WASD + E', exit: 'Q' },
  { color: '#ffc7d6', keys: 'Arrows + Enter', exit: 'M' },
  { color: '#ffd60a', keys: 'IJKL + U', exit: 'Y' },
]

interface SingHomeProps {
  members?: { color: string }[]
  groupName?: string
  onBack: () => void
  initialStep?: SingHomeEntry
  song?: { title: string; artist: string }   // pre-selected song from PartyScreen
}

function useMultiUserTouch(
  targets: TouchTarget[],
  onActivate: (targetId: string, player: PlayerId) => void,
  initialIds?: [string, string, string],
  onMove?: (targetId: string, player: PlayerId, direction: Direction) => void,
  onDirectionalAction?: (currentTargetId: string, player: PlayerId, direction: Direction) => string | false | void,
) {
  const fallback = targets[0]?.id ?? ''
  const [positions, setPositions] = useState<[string, string, string]>(initialIds ?? [fallback, fallback, fallback])
  const [active, setActive] = useState<[boolean, boolean, boolean]>([true, true, true])
  const targetKey = targets.map(t => t.id).join('|')

  useEffect(() => {
    if (targets.length === 0) return
    setPositions(prev => prev.map(id => targets.some(t => t.id === id) ? id : targets[0].id) as [string, string, string])
  }, [targetKey])

  const targetById = useCallback((id: string) => targets.find(t => t.id === id) ?? targets[0], [targets])

  const movePlayer = useCallback((player: PlayerId, direction: Direction) => {
    setPositions(prev => {
      const current = targetById(prev[player])
      if (!current) return prev
      const directionalTarget = onDirectionalAction?.(current.id, player, direction)
      if (directionalTarget) {
        const next = [...prev] as [string, string, string]
        next[player] = directionalTarget
        return next
      }
      if (directionalTarget === false) return prev
      const currentCenter = { x: current.left + current.width / 2, y: current.top + current.height / 2 }
      const candidates = targets.filter(target => {
        if (target.id === current.id) return false
        const center = { x: target.left + target.width / 2, y: target.top + target.height / 2 }
        if (direction === 'left') return center.x < currentCenter.x - 20
        if (direction === 'right') return center.x > currentCenter.x + 20
        if (direction === 'up') return center.y < currentCenter.y - 20
        return center.y > currentCenter.y + 20
      })
      if (candidates.length === 0) return prev
      const sorted = candidates.sort((a, b) => {
        const ac = { x: a.left + a.width / 2, y: a.top + a.height / 2 }
        const bc = { x: b.left + b.width / 2, y: b.top + b.height / 2 }
        const primaryA = direction === 'left' || direction === 'right' ? Math.abs(ac.x - currentCenter.x) : Math.abs(ac.y - currentCenter.y)
        const primaryB = direction === 'left' || direction === 'right' ? Math.abs(bc.x - currentCenter.x) : Math.abs(bc.y - currentCenter.y)
        const crossA = direction === 'left' || direction === 'right' ? Math.abs(ac.y - currentCenter.y) : Math.abs(ac.x - currentCenter.x)
        const crossB = direction === 'left' || direction === 'right' ? Math.abs(bc.y - currentCenter.y) : Math.abs(bc.x - currentCenter.x)
        return primaryA * 1.8 + crossA - (primaryB * 1.8 + crossB)
      })
      const next = [...prev] as [string, string, string]
      next[player] = sorted[0].id
      onMove?.(sorted[0].id, player, direction)
      return next
    })
  }, [onDirectionalAction, onMove, targetById, targets])

  const activatePlayer = useCallback((player: PlayerId) => {
    if (!active[player]) return
    onActivate(positions[player], player)
  }, [active, onActivate, positions])

  const exitPlayer = useCallback((player: PlayerId) => {
    setActive(prev => {
      const next = [...prev] as [boolean, boolean, boolean]
      next[player] = false
      return next
    })
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const mappings: Record<string, () => void> = {
        w: () => movePlayer(0, 'up'),
        W: () => movePlayer(0, 'up'),
        a: () => movePlayer(0, 'left'),
        A: () => movePlayer(0, 'left'),
        s: () => movePlayer(0, 'down'),
        S: () => movePlayer(0, 'down'),
        d: () => movePlayer(0, 'right'),
        D: () => movePlayer(0, 'right'),
        e: () => activatePlayer(0),
        E: () => activatePlayer(0),
        q: () => exitPlayer(0),
        Q: () => exitPlayer(0),
        ArrowUp: () => movePlayer(1, 'up'),
        ArrowLeft: () => movePlayer(1, 'left'),
        ArrowDown: () => movePlayer(1, 'down'),
        ArrowRight: () => movePlayer(1, 'right'),
        Enter: () => activatePlayer(1),
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
        u: () => activatePlayer(2),
        U: () => activatePlayer(2),
        y: () => exitPlayer(2),
        Y: () => exitPlayer(2),
      }
      const action = mappings[e.key]
      if (!action) return
      e.preventDefault()
      action()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [activatePlayer, exitPlayer, movePlayer])

  return { positions, active, targetById }
}

function MultiUserTouchFrames({ targets, positions, active }: {
  targets: TouchTarget[]
  positions: [string, string, string]
  active: [boolean, boolean, boolean]
}) {
  const targetById = (id: string) => targets.find(t => t.id === id)
  return (
    <>
      {positions.map((id, playerIndex) => {
        const player = playerIndex as PlayerId
        if (!active[player]) return null
        const target = targetById(id)
        if (!target) return null
        const isLargeTarget = target.width >= 120 || target.height >= 80
        const pad = isLargeTarget ? 0 : 4 + player * 6
        const touch = PLAYER_TOUCHES[player]
        return (
          <motion.div
            key={player}
            initial={false}
            animate={{ x: target.left - pad, y: target.top - pad }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: target.width + pad * 2,
              height: target.height + pad * 2,
              borderRadius: target.radius === 999 ? 999 : target.radius + pad,
              border: `3px solid ${touch.color}`,
              boxShadow: `0 0 24px ${touch.color}99, inset 0 0 18px ${touch.color}33`,
              background: `${touch.color}0d`,
              zIndex: 60 + player,
              pointerEvents: 'none',
            }}
          />
        )
      })}
    </>
  )
}

/* ─── Shared: MemojiGroup pill ───────────────────────────── */
function MemojiGroupPill({ m0, m1, m2 }: { m0: string; m1: string; m2: string }) {
  return (
    <div style={{
      display: 'flex', gap: 25, alignItems: 'center', justifyContent: 'center',
      padding: '30px 22.5px',
      background: 'rgba(255,255,255,0.10)',
      borderRadius: 109.5,
      width: 315, height: 113,
      position: 'relative',
    }}>
      {[
        { bg: '#bef0c6', src: m0, inset: '0.78% 0 -0.78% 0', objectFit: 'cover' as const },
        { bg: '#ffc7d6', src: m1, inset: '17.97% 0 14.45% 0', objectFit: 'cover' as const },
        { bg: '#131313', src: m2, inset: '0 0 0 0', objectFit: 'cover' as const },
      ].map((m, i) => (
        <div key={i} style={{
          width: 63, height: 62, borderRadius: 999,
          background: m.bg,
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0px 0px 14.8px 0px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative',
        }}>
          <img alt="" src={m.src} style={{
            position: 'absolute', inset: m.inset,
            width: '100%', height: '100%',
            objectFit: m.objectFit,
            pointerEvents: 'none',
          }} />
        </div>
      ))}
    </div>
  )
}

/* ─── Shared: BottomBar (no memoji in center — it's a separate overlay) ── */
function BottomBar({ showTime, isPlaying, isListOpen, onListClick }: {
  showTime?: boolean
  isPlaying?: boolean
  isListOpen?: boolean
  onListClick?: () => void
}) {
  const iconStyle = (size = 28): React.CSSProperties => ({
    fontFamily: "'SF Pro', 'SF Pro Display', -apple-system, sans-serif",
    fontSize: size,
    fontWeight: 700,
    color: '#fff',
    lineHeight: '34px',
    letterSpacing: '0.38px',
    flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 45, height: 45,
  })

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(234,234,234,0.02) 0%, rgba(154,154,154,0.02) 100%)',
      borderRadius: 105,
      boxShadow: '0px 0px 12.769px 0px rgba(0,0,0,0.25)',
      height: 93,
      width: 1224,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '19px 35px',
    }}>
      <div style={{ display: 'flex', gap: 435, alignItems: 'center', justifyContent: 'center' }}>
        {/* Left controls */}
        <div style={{ display: 'flex', alignItems: 'center', width: 371 }}>
          <div style={{ display: 'flex', gap: 33, alignItems: 'center' }}>
            <motion.button
              whileTap={onListClick ? { scale: 0.92 } : undefined}
              onClick={onListClick}
              style={{
                width: isListOpen ? 70 : 45,
                height: isListOpen ? 70 : 45,
                margin: isListOpen ? '-12.5px -12.5px' : 0,
                borderRadius: 105,
                border: 'none',
                padding: 0,
                background: isListOpen
                  ? 'linear-gradient(270deg, rgba(154,154,154,0.08) 0%, rgba(234,234,234,0.08) 100%)'
                  : 'transparent',
                boxShadow: isListOpen ? '0px 0px 12.769px 0px rgba(0,0,0,0.25)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: onListClick ? 'pointer' : 'default',
                color: '#fff',
                flexShrink: 0,
              }}
              aria-label="Open playlist"
            >
              <span style={{ ...iconStyle(isListOpen ? 34 : 28), width: isListOpen ? 70 : 45, height: isListOpen ? 70 : 45 }}>
                {SF.queue}
              </span>
            </motion.button>
            <span style={iconStyle()}>{SF.shuffle}</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 45, height: 45 }}>
              <span style={{ ...iconStyle(), fontSize: 28 }}>{SF.volume}</span>
              <span style={{ position: 'absolute', top: -11, left: 28, fontSize: 12, fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 700, color: '#fff', lineHeight: '34px' }}>{SF.add}</span>
            </div>
            {showTime && (
              <span style={{
                fontFamily: sfPro, fontSize: 17, fontWeight: 590,
                color: 'rgba(255,255,255,0.70)', letterSpacing: '-0.43px',
                whiteSpace: 'nowrap', width: 128, textAlign: 'center',
              }}>02:34 / 03:30</span>
            )}
          </div>
        </div>
        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 33, alignItems: 'center' }}>
            <span style={iconStyle()}>{SF.captions}</span>
            <span style={iconStyle()}>{SF.skipBack}</span>
            <span style={iconStyle()}>{isPlaying ? SF.pause : SF.play}</span>
            <span style={iconStyle()}>{SF.skipFwd}</span>
            <span style={iconStyle()}>{SF.skip10}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── SingMemojiGroup (bottom pill for SingingScreen, matches Figma) ── */
function SingMemojiGroupPill({ m0, m1, m2, activePlayer, onClick }: {
  m0: string; m1: string; m2: string; activePlayer?: PlayerId | null; onClick?: () => void
}) {
  const avatarScale = (player: PlayerId) => activePlayer === player ? 'scale(1.12)' : 'scale(1)'
  const avatarGlow = (player: PlayerId, color: string, base: string) =>
    activePlayer === player ? `0px 0px 22px 4px ${color}, ${base}` : base
  const micBadge = (color: string): React.CSSProperties => ({
    position: 'absolute',
    left: -7,
    bottom: -13,
    width: 31,
    height: 31,
    borderRadius: 999,
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.35)',
    zIndex: 4,
  })

  return (
    <motion.div
      whileTap={{ scale: onClick ? 0.94 : 1 }}
      onClick={onClick}
      style={{
        display: 'flex',
        gap: 36,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 27px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 100%)',
        border: '1.5px solid rgba(255,255,255,0.42)',
        borderRadius: 94,
        width: 335,
        height: 92,
        boxShadow: '0px 0px 14px rgba(255,255,255,0.18), inset 0px 1px 0px rgba(255,255,255,0.32), 0px 14px 28px rgba(0,0,0,0.26)',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 62,
        height: 62,
        borderRadius: 999,
        background: '#bef0c6',
        border: '1.5px solid rgba(255,255,255,0.72)',
        boxShadow: avatarGlow(0, 'rgba(190,240,198,0.82)', '0px 0px 17px rgba(190,240,198,0.60), 0px 0px 10px rgba(0,0,0,0.30)'),
        flexShrink: 0,
        position: 'relative',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        transform: avatarScale(0),
        zIndex: activePlayer === 0 ? 3 : 2,
      }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 999, overflow: 'hidden' }}>
          <img alt="" src={m0} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
        </div>
        <div style={micBadge('#bef0c6')}>
          <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: 18, color: '#bef0c6', lineHeight: 1 }}>{SF.mic}</span>
        </div>
      </div>
      <div style={{
        width: 62,
        height: 62,
        borderRadius: 999,
        background: '#ffc7d6',
        border: '1.5px solid rgba(255,255,255,0.72)',
        boxShadow: avatarGlow(1, 'rgba(255,199,214,0.82)', '0px 0px 17px rgba(255,199,214,0.58), 0px 0px 10px rgba(0,0,0,0.30)'),
        flexShrink: 0,
        position: 'relative',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        transform: avatarScale(1),
        zIndex: activePlayer === 1 ? 3 : 2,
      }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 999, overflow: 'hidden' }}>
          <img alt="" src={m1} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
        </div>
        <div style={micBadge('#f2aaaa')}>
          <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: 18, color: '#f2aaaa', lineHeight: 1 }}>{SF.mic}</span>
        </div>
      </div>
      <div style={{
        width: 68,
        height: 68,
        borderRadius: 999,
        background: '#131313',
        border: '1.5px solid rgba(255,255,255,0.52)',
        boxShadow: avatarGlow(2, 'rgba(255,222,0,0.86)', '0px 0px 10px rgba(19,19,19,0.62)'),
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        transform: avatarScale(2),
        zIndex: activePlayer === 2 ? 3 : 1,
      }}>
        <img alt="" src={m2} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
      </div>
    </motion.div>
  )
}

/* ─── Emoji Arc Picker ──── */
function EmojiArcPicker({ onSelect, left = 918, top = 787, player = 1 }: { onSelect: (emoji: string) => void; left?: number; top?: number; player?: PlayerId }) {
  const variants: Record<PlayerId, {
    gradient: string
    glow: string
    width: number
    height: number
    radius: string
    blob: React.CSSProperties
    items: Record<'🎈' | '👏' | '🎉', React.CSSProperties>
  }> = {
    0: {
      gradient: 'linear-gradient(132deg, rgba(190,240,198,0.76) 0%, rgba(145,225,154,0.48) 34%, rgba(88,159,103,0.30) 67%, rgba(48,77,56,0.10) 100%)',
      glow: 'rgba(190,240,198,0.34)',
      width: 360,
      height: 240,
      radius: '74% 54% 64% 40% / 66% 70% 48% 46%',
      blob: { transform: 'rotate(-31deg)' },
      items: {
        '🎈': { left: 34, top: 122, width: 82, height: 82, fontSize: 58 },
        '👏': { left: 105, top: 40, width: 82, height: 82, fontSize: 51 },
        '🎉': { left: 196, top: 18, width: 86, height: 86, fontSize: 54 },
      },
    },
    1: {
      gradient: 'linear-gradient(180deg, rgba(255,199,214,0.70) 0%, rgba(242,170,170,0.48) 38%, rgba(128,88,102,0.24) 70%, rgba(54,42,47,0.10) 100%)',
      glow: 'rgba(255,199,214,0.34)',
      width: 342,
      height: 210,
      radius: '72% 72% 42% 42% / 86% 86% 36% 36%',
      blob: { transform: 'rotate(0deg)' },
      items: {
        '🎈': { left: 40, top: 73, width: 76, height: 76, fontSize: 54 },
        '👏': { left: 141, top: 18, width: 78, height: 78, fontSize: 49 },
        '🎉': { left: 241, top: 74, width: 76, height: 76, fontSize: 50 },
      },
    },
    2: {
      gradient: 'linear-gradient(218deg, rgba(255,214,10,0.58) 0%, rgba(255,232,122,0.40) 31%, rgba(111,101,65,0.24) 66%, rgba(28,28,28,0.12) 100%)',
      glow: 'rgba(255,214,10,0.30)',
      width: 270,
      height: 225,
      radius: '54% 76% 44% 38% / 50% 74% 42% 42%',
      blob: { transform: 'rotate(31deg)' },
      items: {
        '🎈': { left: 55, top: 16, width: 76, height: 76, fontSize: 54 },
        '👏': { left: 135, top: 50, width: 74, height: 74, fontSize: 47 },
        '🎉': { left: 181, top: 128, width: 72, height: 72, fontSize: 47 },
      },
    },
  }
  const variant = variants[player]
  const renderEmoji = (emoji: '🎈' | '👏' | '🎉') => (
    <motion.div
      key={emoji}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onSelect(emoji)}
      style={{
        position: 'absolute',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.78)',
        border: `2px solid ${PLAYER_TOUCHES[player].color}`,
        boxShadow: '0px 0px 18px rgba(255,255,255,0.36)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        lineHeight: 1,
        zIndex: 2,
        ...variant.items[emoji],
      }}
    >
      {emoji}
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      style={{
        position: 'absolute',
        left, top,
        width: variant.width, height: variant.height,
        zIndex: 16,
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: variant.radius,
        background: variant.gradient,
        boxShadow: `0px 18px 42px rgba(0,0,0,0.24), 0px 0px 34px ${variant.glow}, inset 0px 1px 1px rgba(255,255,255,0.36)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        opacity: 0.94,
        ...variant.blob,
      }} />
      <div style={{
        position: 'absolute',
        left: 18,
        right: 24,
        top: 12,
        height: '42%',
        borderRadius: '70% 62% 50% 45% / 78% 74% 36% 32%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.08) 62%, rgba(255,255,255,0) 100%)',
        filter: 'blur(10px)',
        transform: variant.blob.transform,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: variant.radius,
        background: 'radial-gradient(circle at 35% 24%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 26%, rgba(255,255,255,0) 58%)',
        mixBlendMode: 'screen',
        opacity: 0.85,
        transform: variant.blob.transform,
        pointerEvents: 'none',
      }} />
      {renderEmoji('🎈')}
      {renderEmoji('👏')}
      {renderEmoji('🎉')}
    </motion.div>
  )
}

/* ─── Shared: SearchBar ──────────────────────────────────── */
function SearchBar({ onClick }: { onClick?: () => void }) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        position: 'absolute',
        left: 'calc(50% + 622.5px)',
        top: 89,
        transform: 'translateX(-50%)',
        width: 359, height: 63,
        border: '0.857px solid #fff',
        borderRadius: 105,
        backdropFilter: 'blur(93.596px)',
        background: 'rgba(10,10,10,0.2)',
        display: 'flex', alignItems: 'center',
        padding: '19px 29px',
        gap: 21,
        boxShadow: 'inset 0px 5.509px 5.509px 0px rgba(0,0,0,0.25)',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        zIndex: 10,
      }}
    >
      <span style={{
        fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400,
        fontSize: 22, lineHeight: '28px', letterSpacing: '-0.26px',
        color: 'rgba(235,235,245,0.6)',
      }}>{SF.search}</span>
      <span style={{
        fontFamily: sfPro, fontSize: 22, fontWeight: 400,
        color: 'rgba(235,235,245,0.6)', letterSpacing: '-0.26px', lineHeight: '28px',
      }}>Search</span>
    </motion.div>
  )
}

function SingModeTopBar({
  focusedMode,
  onFocusMode,
  onStaySing,
  onBrowser,
}: {
  focusedMode: 'sing' | 'browser'
  onFocusMode: (mode: 'sing' | 'browser') => void
  onStaySing: () => void
  onBrowser: () => void
}) {
  const itemStyle = (mode: 'sing' | 'browser'): React.CSSProperties => {
    const focused = focusedMode === mode
    return {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '9.278px 23.195px',
      borderRadius: 46.39,
      backdropFilter: 'blur(11.597px)',
      background: focused ? 'linear-gradient(90deg, rgba(79,79,79,0.7) 0%, rgba(79,79,79,0.7) 100%)' : 'transparent',
      boxShadow: focused ? '0px 0px 18px rgba(255,255,255,0.16)' : 'none',
      opacity: focused ? 1 : 0.59,
      cursor: 'pointer',
      border: focused ? '1px solid rgba(255,255,255,0.24)' : '1px solid transparent',
      boxSizing: 'border-box',
    }
  }

  const textStyle = (mode: 'sing' | 'browser'): React.CSSProperties => ({
    fontFamily: sfPro,
    fontSize: 22,
    fontWeight: focusedMode === mode ? 700 : 400,
    color: '#fff',
    lineHeight: '28px',
    letterSpacing: '-0.26px',
    whiteSpace: 'nowrap',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -22, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      style={{
        position: 'absolute',
        left: 768,
        top: 74,
        width: 385,
        height: 78,
        borderRadius: 991,
        border: '1.983px solid #fff',
        background: 'linear-gradient(158.77deg, rgba(255,255,255,0.25) 19.848%, rgba(235,235,235,0.184) 4.204%, rgba(224,224,224,0.144) 13.88%, rgba(212,212,212,0.106) 27.982%, rgba(207,207,207,0.088) 37.795%, rgba(202,202,202,0.072) 44.382%, rgba(200,200,200,0.063) 50.536%, rgba(196,196,196,0.05) 60.215%)',
        display: 'flex',
        alignItems: 'center',
        padding: 15.862,
        gap: 1.858,
        zIndex: 18,
        boxSizing: 'border-box',
      }}
    >
      <motion.div
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => onFocusMode('sing')}
        onClick={onStaySing}
        style={itemStyle('sing')}
      >
        <span style={{
          fontFamily: "'SF Pro', -apple-system, sans-serif",
          fontSize: 22,
          lineHeight: '28px',
          color: '#fff',
          letterSpacing: '-0.26px',
          fontWeight: focusedMode === 'sing' ? 700 : 400,
        }}>{SF.mic}</span>
        <span style={textStyle('sing')}>Sing now</span>
      </motion.div>
      <motion.div
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => onFocusMode('browser')}
        onClick={onBrowser}
        style={itemStyle('browser')}
      >
        <span style={{
          fontFamily: "'SF Pro', -apple-system, sans-serif",
          fontSize: 22,
          lineHeight: '28px',
          color: '#fff',
          letterSpacing: '-0.26px',
          fontWeight: focusedMode === 'browser' ? 700 : 400,
        }}>{SF.browser}</span>
        <span style={textStyle('browser')}>Browser</span>
      </motion.div>
    </motion.div>
  )
}

/* ─── Sing Home Guide (125:1396) ─────────────────────────── */
function GuideScreen({ onContinue }: { onContinue: () => void }) {
  const [confirmed, setConfirmed] = useState<[boolean, boolean, boolean]>([false, false, false])
  const guideTargets: TouchTarget[] = [
    { id: 'continue', left: 888, top: 916, width: 145, height: 44, radius: 24 },
  ]
  const activateGuideTarget = useCallback((targetId: string, player: PlayerId) => {
    if (targetId !== 'continue') return
    setConfirmed(prev => {
      const next = [...prev] as [boolean, boolean, boolean]
      next[player] = true
      return next
    })
  }, [])
  const guideTouch = useMultiUserTouch(guideTargets, activateGuideTarget, ['continue', 'continue', 'continue'])

  useEffect(() => {
    if (!confirmed.some(Boolean)) return
    const t = setTimeout(onContinue, 450)
    return () => clearTimeout(t)
  }, [confirmed, onContinue])

  const cardStyle: React.CSSProperties = {
    width: 332,
    height: 459,
    borderRadius: 30,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.065) 100%)',
    backdropFilter: 'blur(50px)',
    border: '1px solid rgba(255,255,255,0.24)',
    boxShadow: '0px 36px 42px rgba(0,0,0,0.26), inset 0px 1px 1px rgba(255,255,255,0.18)',
    padding: 30,
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  }

  const textBlock = (title: string, body: string) => (
    <>
      <p style={{
        margin: 0,
        width: '100%',
        fontFamily: "'SF Pro Display', -apple-system, sans-serif",
        fontSize: 28,
        fontWeight: 600,
        lineHeight: 'normal',
        color: '#fff',
      }}>{title}</p>
      <p style={{
        margin: '10px 0 0 0',
        width: '100%',
        fontFamily: "'SF Compact Rounded', 'SF Pro Display', -apple-system, sans-serif",
        fontSize: 20,
        fontWeight: 400,
        lineHeight: '19.802px',
        color: 'rgba(255,255,255,0.80)',
      }}>{body}</p>
    </>
  )

  return (
    <motion.div
      key="guide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.28 }}
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.60)', overflow: 'hidden', zIndex: 70 }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #181818 0%, #151515 42%, #080808 100%)' }} />
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        background: 'radial-gradient(circle at 50% 0%, rgba(151,128,196,0.24) 0%, rgba(151,128,196,0.12) 18%, rgba(0,0,0,0) 42%), radial-gradient(circle at 50% 100%, rgba(115,131,202,0.26) 0%, rgba(115,131,202,0.12) 24%, rgba(0,0,0,0) 50%)',
      }} />
      <div style={{ position: 'absolute', left: 487, top: 924, width: 976, height: 350 }}>
        <img src={gEllipse164} alt="" style={{ position: 'absolute', inset: '-108.63% -38.95%', width: '177.9%', height: '317.2%' }} />
      </div>
      <div style={{ position: 'absolute', left: 487, top: -200, width: 976, height: 350, transform: 'rotate(180deg)' }}>
        <img src={gEllipse160} alt="" style={{ position: 'absolute', inset: '-108.63% -38.95%', width: '177.9%', height: '317.2%' }} />
      </div>

      <p style={{
        position: 'absolute',
        left: '50%',
        top: 157,
        transform: 'translateX(-50%)',
        margin: 0,
        fontFamily: "'SF Pro Display', -apple-system, sans-serif",
        fontSize: 40,
        fontWeight: 600,
        color: '#fff',
        whiteSpace: 'nowrap',
      }}>Guide u for choosing the section</p>

      <div style={{
        position: 'absolute',
        left: '50%',
        top: 301,
        transform: 'translateX(-50%)',
        height: 459,
        display: 'flex',
        gap: 30,
        alignItems: 'center',
      }}>
        <div style={cardStyle}>
          {textBlock('Freely navigate your new space', 'Every one can choose the one they prefer')}
          <div style={{
            position: 'absolute',
            left: 82,
            top: 240,
            width: 166,
            height: 166,
            borderRadius: 32,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.18) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
          }}>
            <div style={{
              position: 'absolute',
              left: 31,
              top: 31,
              width: 104,
              height: 104,
              borderRadius: 999,
              background: 'rgba(0,0,0,0.20)',
            }} />
            <div style={{
              position: 'absolute',
              left: 51,
              top: 51,
              width: 64,
              height: 64,
              borderRadius: 999,
              background: 'radial-gradient(circle, rgba(255,60,70,0.72) 0%, rgba(200,35,45,0.42) 46%, rgba(0,0,0,0.16) 100%)',
              boxShadow: '0px 0px 28px rgba(214,45,52,0.44)',
            }} />
            {[
              { left: 82, top: 25 },
              { left: 82, top: 139 },
              { left: 25, top: 82 },
              { left: 139, top: 82 },
            ].map((dot, index) => (
              <div key={index} style={{
                position: 'absolute',
                left: dot.left,
                top: dot.top,
                width: 5,
                height: 5,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.55)',
                transform: 'translate(-50%, -50%)',
              }} />
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={{
            margin: 0,
            width: '100%',
            fontFamily: "'SF Pro Display', -apple-system, sans-serif",
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 'normal',
            letterSpacing: 0,
            color: '#fff',
          }}>Everyone can send the emoji to entrant during the Sing</p>
          <p style={{
            margin: '10px 0 0 0',
            width: '100%',
            fontFamily: "'SF Compact Rounded', 'SF Pro Display', -apple-system, sans-serif",
            fontSize: 20,
            fontWeight: 400,
            lineHeight: '19.802px',
            letterSpacing: 0,
            color: 'rgba(255,255,255,0.80)',
          }}>Users can choose the emoji to send</p>
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: 332, height: 247 }}>
            <div style={{
              position: 'absolute',
              left: -50,
              bottom: 34,
              width: 232,
              height: 132,
              borderRadius: '0 110px 110px 0',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.11) 100%)',
            }} />
            <div style={{
              position: 'absolute',
              left: 62,
              top: 42,
              width: 252,
              height: 224,
              borderRadius: '58% 74% 46% 42% / 44% 65% 52% 58%',
              background: 'linear-gradient(123deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.105) 44%, rgba(255,255,255,0.055) 100%)',
              transform: 'rotate(17deg)',
              transformOrigin: 'center center',
            }} />
            <div style={{
              position: 'absolute',
              left: 32,
              bottom: 55,
              width: 112,
              height: 112,
              borderRadius: 999,
              background: 'rgba(0,0,0,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 61,
                height: 61,
                borderRadius: 999,
                border: '8px solid rgba(255,255,255,0.34)',
                position: 'relative',
                boxSizing: 'border-box',
              }}>
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 12,
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.34)',
                  transform: 'translateX(-50%)',
                }} />
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 8,
                  width: 38,
                  height: 22,
                  borderRadius: '22px 22px 10px 10px',
                  background: 'rgba(255,255,255,0.34)',
                  transform: 'translateX(-50%)',
                }} />
              </div>
            </div>
            {[
              { e: '🎈', left: 74, top: 66, size: 58, font: 35 },
              { e: '👏', left: 161, top: 78, size: 62, font: 36 },
              { e: '🎉', left: 242, top: 156, size: 59, font: 30 },
            ].map(item => (
              <div key={item.e} style={{
                position: 'absolute',
                left: item.left,
                top: item.top,
                width: item.size,
                height: item.size,
                borderRadius: 999,
                background: 'rgba(26,26,26,0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: item.font,
                boxShadow: '0px 12px 26px rgba(0,0,0,0.22)',
                lineHeight: 1,
              }}>{item.e}</div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          {textBlock('Choose the song as everyones prefer', 'The system will let everyone have the chance to choose the song')}
          <div style={{ position: 'absolute', left: 35, top: 219, width: 263, height: 171 }}>
            {[
              { left: 0, top: 0, rotate: 3, image: gMusicCardState7, primary: 'add' },
              { left: 123, top: 31, rotate: -2.69, image: gMusicCardState8, primary: 'sing' },
            ].map((card, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: card.left,
                top: card.top,
                width: 134,
                height: 134,
                transform: `rotate(${card.rotate}deg)`,
                borderRadius: 30,
                overflow: 'hidden',
                border: '0.486px solid rgba(255,255,255,0.5)',
                boxShadow: '0px 0px 14.826px rgba(0,0,0,0.7)',
              }}>
                <img src={gMusicCardState6} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
                <img src={card.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(76,76,76,0.75)' }} />
                <div style={{ position: 'absolute', left: 11, top: 31, width: 112, display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'center' }}>
                  <div style={{
                    width: 115,
                    height: 38,
                    borderRadius: 30,
                    background: 'rgba(255,255,255,0.76)',
                    boxShadow: '0px 0px 13.951px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '0 5px',
                  }}>
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: 33,
                      background: card.primary === 'add' ? '#9fda84' : '#ff8080',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'SF Pro', -apple-system, sans-serif",
                      fontSize: card.primary === 'add' ? 16 : 11,
                      color: '#fff',
                    }}>{card.primary === 'add' ? SF.add : SF.play}</span>
                    <span style={{ fontFamily: sfPro, fontSize: 9.7, fontWeight: 590, color: '#000', whiteSpace: 'nowrap' }}>
                      {card.primary === 'add' ? 'Add to the list' : 'Sing now'}
                    </span>
                  </div>
                  <div style={{
                    width: card.primary === 'add' ? 83 : 86,
                    height: 27,
                    borderRadius: 21,
                    background: 'rgba(255,255,255,0.39)',
                    opacity: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: sfPro,
                    fontSize: 7.3,
                    fontWeight: 590,
                    color: '#000',
                  }}>
                    {card.primary === 'add' ? 'Sing now' : 'Add to the list'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => setConfirmed([true, true, true])}
        style={{
          position: 'absolute',
          left: 'calc(50% + 0.5px)',
          top: 916,
          transform: 'translateX(-50%)',
          width: 145,
          height: 44,
          borderRadius: 24,
          border: 'none',
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(67.955px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          cursor: 'pointer',
          padding: '8px 22px',
        }}
      >
        <span style={{ fontFamily: "'SF Compact Rounded', 'SF Pro Display', -apple-system, sans-serif", fontSize: 17, fontWeight: 600, lineHeight: '22px', letterSpacing: '0.68px', color: '#131111' }}>Continue</span>
        <span style={{ fontFamily: "'SF Compact Rounded', 'SF Pro Display', -apple-system, sans-serif", fontSize: 17, fontWeight: 600, color: '#131111', lineHeight: 'normal' }}>{'\u{10018A}'}</span>
      </motion.button>
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 972,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 20,
      }}>
        {PLAYER_TOUCHES.map((touch, i) => (
          <div key={touch.color} style={{
            width: confirmed[i] ? 15 : 10,
            height: confirmed[i] ? 15 : 10,
            borderRadius: 999,
            background: confirmed[i] ? touch.color : 'rgba(255,255,255,0.18)',
            border: `1px solid ${confirmed[i] ? touch.color : 'rgba(255,255,255,0.35)'}`,
            boxShadow: confirmed[i] ? `0 0 16px ${touch.color}` : 'none',
            transition: 'all 160ms ease',
          }} />
        ))}
      </div>
      <MultiUserTouchFrames targets={guideTargets} positions={guideTouch.positions} active={guideTouch.active} />
    </motion.div>
  )
}

/* ─── Search Screen (125:2054) ───────────────────────────── */
function SearchScreen({ onBack, onSingNow }: { onBack: () => void; onSingNow: () => void }) {
  const [activeKbTab, setActiveKbTab] = useState<'ABC' | 'abc' | '.,#'>('ABC')

  const kbRows = [
    ['A','B','C','D','E','F','G'],
    ['H','I','J','K','L','M','N'],
    ['O','P','Q','R','S','T','U'],
    ['V','W','X','Y','Z'],
  ]
  const kbRowsLower = kbRows.map(r => r.map(c => c.toLowerCase()))
  const kbRowsSym = [['!','@','#','$','%','^','&'],['*','(',')','_','-','+','='],['[',']','{','}','|','\\','/'],['<','>',',','.','?']]
  const displayRows = activeKbTab === 'ABC' ? kbRows : activeKbTab === 'abc' ? kbRowsLower : kbRowsSym

  const singers = [
    { img: srSingerCard1, name: 'Drake',        left: 845 },
    { img: srSingerCard2, name: 'Fujii Kaze',   left: 1036 },
    { img: srSingerCard3, name: 'Billie Eilish', left: 1227 },
    { img: srSingerCard4, name: 'GIVĒON',        left: 1418 },
    { img: srSingerCard5, name: 'JJ',            left: 1609 },
  ]
  const songThumbs = [srRect5, srRect6, srRect7, srRect8]
  const searchTargets: TouchTarget[] = [
    { id: 'back', left: 121, top: 74, width: 78, height: 78, radius: 999 },
    { id: 'search-input', left: 461.5, top: 159, width: 997, height: 89, radius: 105 },
    ...(['ABC', 'abc', '.,#'] as const).map((tab, i) => ({ id: `kb-tab-${tab}`, left: 211 + i * 84, top: 350, width: 76, height: 44, radius: 12 })),
    ...displayRows.flatMap((row, ri) => row.map((ch, ci) => ({ id: `key-${ch}`, left: 223 + ci * 62, top: 435 + ri * 64, width: 54, height: 54, radius: 10 }))),
    { id: 'key-space', left: 223, top: 691, width: 433, height: 54, radius: 10 },
    ...singers.map((s, i) => ({ id: `singer-${i}`, left: s.left, top: 368, width: 145, height: 145, radius: 999 })),
    ...songThumbs.map((_, i) => ({ id: `song-${i}`, left: 792, top: 653 + i * 93, width: 1000, height: 77, radius: 15 })),
    { id: 'bar-list', left: 410, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-shuffle', left: 488, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-volume', left: 566, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-people', left: 803, top: 899, width: 315, height: 113, radius: 109 },
    { id: 'bar-captions', left: 1212, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-back', left: 1290, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-play', left: 1368, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-forward', left: 1446, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-replay', left: 1524, top: 928, width: 45, height: 45, radius: 999 },
  ]
  const activateSearchTarget = useCallback((targetId: string) => {
    if (targetId === 'back') onBack()
    else if (targetId.startsWith('kb-tab-')) setActiveKbTab(targetId.replace('kb-tab-', '') as 'ABC' | 'abc' | '.,#')
    else if (targetId.startsWith('singer-') || targetId.startsWith('song-')) onSingNow()
  }, [onBack, onSingNow])
  const searchTouch = useMultiUserTouch(searchTargets, activateSearchTarget, ['key-A', 'singer-0', 'song-0'])

  return (
    <motion.div
      key="search"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.3 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Background reuse browser bg */}
      <div style={{ position: 'absolute', left: -157, top: -207, width: 2210, height: 1980, zIndex: 0 }}>
        <img src={bBg} alt="" style={{ position: 'absolute', inset: '-9.83% -8.81%', width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* Back button */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={onBack}
        style={{
          position: 'absolute',
          left: 'calc(50% - 795px)',
          top: 74,
          transform: 'translateX(-50%)',
          width: 78, height: 78,
          borderRadius: 105,
          border: '0.857px solid #fff',
          background: 'rgba(10,10,10,0.2)',
          backdropFilter: 'blur(93.596px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'inset 0px 5.509px 5.509px 0px rgba(0,0,0,0.25)',
          zIndex: 10,
        }}
      >
        <span style={{
          fontFamily: "'SF Pro', 'SF Pro Display', -apple-system, sans-serif",
          fontSize: 32, fontWeight: 274, color: '#fff', lineHeight: 'normal',
        }}>{SF.back}</span>
      </motion.button>

      {/* Large search bar */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 159,
        transform: 'translateX(-50%)',
        width: 997, height: 89,
        border: '1px solid rgba(255,255,255,0.6)',
        borderRadius: 105,
        backdropFilter: 'blur(93.596px)',
        background: 'rgba(10,10,10,0.2)',
        display: 'flex', alignItems: 'center',
        padding: '0 29px',
        gap: 16,
        boxShadow: 'inset 0px 5.509px 5.509px 0px rgba(0,0,0,0.25)',
        zIndex: 10,
      }}>
        <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: 28, color: 'rgba(235,235,245,0.6)' }}>{SF.search}</span>
        <span style={{ fontFamily: sfPro, fontSize: 28, fontWeight: 400, color: 'rgba(235,235,245,0.6)', letterSpacing: '-0.26px', flex: 1 }}>Search</span>
        <div style={{
          width: 80, height: 63,
          borderRadius: 105,
          border: '0.857px solid rgba(255,255,255,0.5)',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: 26, color: '#fff' }}>{SF.mic}</span>
        </div>
      </div>

      {/* Left keyboard panel */}
      <div style={{
        position: 'absolute', left: 203, top: 344,
        width: 473,
        zIndex: 5,
      }}>
        {/* Tab row */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 20,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 18, padding: '6px 8px',
          width: 'fit-content',
        }}>
          {(['ABC','abc','.,#'] as const).map(tab => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveKbTab(tab)}
              style={{
                padding: '8px 20px',
                borderRadius: 12,
                border: 'none',
                background: activeKbTab === tab ? 'rgba(255,255,255,0.25)' : 'transparent',
                color: '#fff',
                fontFamily: sfPro,
                fontSize: 18, fontWeight: activeKbTab === tab ? 700 : 400,
                cursor: 'pointer',
              }}
            >{tab}</motion.button>
          ))}
        </div>
        {/* Key grid */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 24, padding: '18px 20px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {displayRows.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 8, justifyContent: 'flex-start' }}>
              {row.map(ch => (
                <motion.button
                  key={ch}
                  whileTap={{ scale: 0.88 }}
                  style={{
                    width: 54, height: 54,
                    borderRadius: 10,
                    border: '0.5px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    fontFamily: sfPro,
                    fontSize: 20, fontWeight: 400,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >{ch}</motion.button>
              ))}
            </div>
          ))}
          {/* Space bar */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            style={{
              width: '100%', height: 54,
              borderRadius: 10,
              border: '0.5px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: sfPro,
              fontSize: 17, fontWeight: 400,
              cursor: 'pointer',
            }}
          >space</motion.button>
        </div>
      </div>

      {/* Singer section heading */}
      <div style={{
        position: 'absolute', left: 808, top: 300,
        fontFamily: sfPro, fontSize: 34, fontWeight: 700, color: '#fff',
        letterSpacing: '0.4px', lineHeight: '41px',
        zIndex: 5,
      }}>Singer</div>

      {/* Singer cards (circular) */}
      {singers.map((s, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={onSingNow}
          style={{
            position: 'absolute',
            left: s.left, top: 368,
            width: 145, height: 145,
            borderRadius: '50%',
            overflow: 'hidden',
            cursor: 'pointer',
            zIndex: 5,
            border: '2px solid rgba(255,255,255,0.25)',
            boxShadow: '0px 0px 14.9px 0px rgba(0,0,0,0.35)',
          }}
        >
          <img src={srSingerCard} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
          <img src={s.img} alt={s.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>
      ))}

      {/* Singer name labels */}
      {singers.map((s, i) => (
        <div key={`name-${i}`} style={{
          position: 'absolute',
          left: s.left + 72.5, top: 368 + 145 + 10,
          transform: 'translateX(-50%)',
          fontFamily: sfPro, fontSize: 17, fontWeight: 590,
          color: '#fff', lineHeight: '22px', letterSpacing: '-0.43px',
          whiteSpace: 'nowrap', textAlign: 'center',
          zIndex: 5,
        }}>{s.name}</div>
      ))}

      {/* Memoji pins above singer cards */}
      <MemojiPin left={855} top={340} mode="2" m0={srMemoji} m1={srMemoji1} m2={srMemoji} />
      <MemojiPin left={1245} top={340} mode="3" m0={srMemoji} m1={srMemoji1} m2={srMemoji1} />

      {/* Song section heading */}
      <div style={{
        position: 'absolute', left: 808, top: 581,
        fontFamily: sfPro, fontSize: 34, fontWeight: 700, color: '#fff',
        letterSpacing: '0.4px', lineHeight: '41px',
        zIndex: 5,
      }}>Song</div>

      {/* Song list */}
      <div style={{
        position: 'absolute', left: 792, top: 653,
        width: 1000,
        display: 'flex', flexDirection: 'column', gap: 16,
        zIndex: 5,
      }}>
        {songThumbs.map((thumb, i) => (
          <motion.div
            key={i}
            whileHover={{ background: 'rgba(255,255,255,0.06)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onSingNow}
            style={{
              display: 'flex', alignItems: 'center', gap: 20,
              padding: '8px 16px', borderRadius: 15,
              background: i === 0 ? 'rgba(255,255,255,0.07)' : 'transparent',
              border: i === 0 ? '1px solid rgba(255,255,255,0.3)' : 'none',
              height: 77, cursor: 'pointer',
              transition: 'background 150ms',
            }}
          >
            <div style={{ width: 61, height: 61, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
              <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: sfPro, fontSize: 20, fontWeight: 590, color: '#fff', lineHeight: '25px', letterSpacing: '-0.45px', margin: 0, marginBottom: 6 }}>Sounds of Summer</p>
              <p style={{ fontFamily: sfPro, fontSize: 17, fontWeight: 400, color: '#c9c9c9', lineHeight: '22px', letterSpacing: '-0.43px', margin: 0 }}>The Beach Boys</p>
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', opacity: 0.7 }}>
              <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: 20, color: '#fff' }}>{SF.add}</span>
              <span style={{ fontFamily: sfPro, fontSize: 17, color: '#fff', width: 40 }}>5"35</span>
              <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: 20, color: '#fff' }}>{SF.ellipsis}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 27px)', top: 909,
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}>
        <BottomBar />
      </div>

      {/* Memoji group pill at bottom */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 0.5px)',
        bottom: 68,
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}>
        <MemojiGroupPill m0={srMemoji} m1={srMemoji1} m2={srMemoji1} />
      </div>
      <MultiUserTouchFrames targets={searchTargets} positions={searchTouch.positions} active={searchTouch.active} />
    </motion.div>
  )
}

/* ─── Sing Sidebar (overlay in singing mode, 125:1815) ───── */
function SingSidebar({ onClose, onSingNow }: { onClose: () => void; onSingNow: () => void }) {
  const qwertyRows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M'],
  ]
  const carouselCards = [ssMusicCard, ssMusicCard1, ssMusicCard2, ssMusicCard]

  return (
    <motion.div
      initial={{ x: 558, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 558, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      {/* Close tap zone on background */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', left: 0, top: 0,
          width: 1362, height: 1080,
          cursor: 'pointer', zIndex: 0,
          pointerEvents: 'auto',
        }}
      />

      {/* Search input bar */}
      <div style={{
        position: 'absolute',
        left: 1402,
        top: 147,
        width: 367,
        height: 63,
        border: '0.857px solid rgba(255,255,255,0.7)',
        borderRadius: 105,
        backdropFilter: 'blur(93.596px)',
        background: 'rgba(10,10,10,0.20)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 14,
        boxShadow: 'inset 0px 5.509px 5.509px 0px rgba(0,0,0,0.25)',
        zIndex: 1,
        pointerEvents: 'auto',
      }}>
        <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: 22, color: 'rgba(235,235,245,0.6)' }}>{SF.search}</span>
        <span style={{ fontFamily: sfPro, fontSize: 22, fontWeight: 400, color: 'rgba(235,235,245,0.6)', flex: 1 }}>Search</span>
        {/* cursor blink */}
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
          style={{ width: 2, height: 26, background: '#fff', borderRadius: 1 }}
        />
        <motion.div
          whileTap={{ scale: 0.92 }}
          style={{
            position: 'absolute',
            left: 375,
            top: 0,
            width: 80,
            height: 63,
            borderRadius: 105,
            border: '0.857px solid rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(93.596px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            boxShadow: 'inset 0px 5.509px 5.509px 0px rgba(0,0,0,0.25)',
          }}
        >
          <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: 22, color: '#fff' }}>{SF.mic}</span>
        </motion.div>
      </div>

      {/* Frosted carousel */}
      <div style={{
        position: 'absolute',
        left: 1402,
        top: 245,
        width: 457,
        height: 210,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 36,
        backdropFilter: 'blur(35px)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: 'inset 0px 0.659px 0px rgba(255,255,255,0.50), 0px 0.33px 7.913px -0.33px rgba(0,0,0,0.18)',
        display: 'flex', alignItems: 'center',
        padding: '0 18px', gap: 16,
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'auto',
      }}>
        {carouselCards.map((card, i) => (
          <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
              onClick={onSingNow}
              style={{
                width: 110, height: 110,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.25)',
                boxShadow: '0px 4px 14px rgba(0,0,0,0.35)',
                cursor: 'pointer',
              }}
            >
              <img src={card} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            {/* mini memoji pin */}
            {i < 3 && (
              <div style={{
                position: 'absolute', top: -8, right: -8,
                display: 'flex',
              }}>
                {[ssMemoji, ssMemoji1, ssMemoji2].slice(0, i === 0 ? 3 : 2).map((m, mi) => (
                  <div key={mi} style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: ['#bef0c6','#ffc7d6','#131313'][mi],
                    border: '1px solid rgba(255,255,255,0.4)',
                    overflow: 'hidden',
                    marginLeft: mi > 0 ? -8 : 0,
                    zIndex: 3 - mi,
                    position: 'relative',
                  }}>
                    <img src={m} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {/* bg art on right */}
        <img src={ssAlbumArt} alt="" style={{
          position: 'absolute', right: 0, top: 0,
          width: 210, height: 210,
          objectFit: 'cover',
          opacity: 0.25,
          borderRadius: '0 36px 36px 0',
        }} />
      </div>

      {/* QWERTY keyboard */}
      <div style={{
        position: 'absolute',
        left: 1402,
        top: 506,
        width: 460,
        height: 317,
        background: 'rgba(255,255,255,0.10)',
        borderRadius: 20,
        padding: '18px 12px',
        display: 'flex', flexDirection: 'column', gap: 8,
        backdropFilter: 'blur(34px)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0px 0.5px 0px rgba(255,255,255,0.25)',
        zIndex: 1,
        boxSizing: 'border-box',
        pointerEvents: 'auto',
      }}>
        {qwertyRows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {row.map(ch => (
              <motion.button
                key={ch}
                whileTap={{ scale: 0.85 }}
                style={{
                  width: ri === 0 ? 43 : ri === 1 ? 46 : 54,
                  height: 46,
                  borderRadius: 8,
                  border: '0.5px solid rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  fontFamily: sfPro,
                  fontSize: 17, fontWeight: 400,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >{ch}</motion.button>
            ))}
          </div>
        ))}
        {/* Space bar */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            style={{
              width: 200, height: 46,
              borderRadius: 8,
              border: '0.5px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: sfPro,
              fontSize: 15, fontWeight: 400,
              cursor: 'pointer',
            }}
          >space</motion.button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── MemojiPin (above album cards) ─────────────────────── */
function MemojiPin({ left, top, mode = '3', m0, m1, m2 }: {
  left: number; top: number; mode?: '2' | '3'
  m0: string; m1: string; m2: string
}) {
  const avatarSize = 40
  const overlap = -15
  const avatars = [
    { bg: '#bef0c6', src: m0, inset: 'calc(0.78% - 0.98px) -1px calc(-0.78% - 1.02px) -1px' },
    { bg: '#ffc7d6', src: m1, inset: 'calc(17.97% - 0.64px) -1px calc(14.45% - 0.71px) -1px' },
    ...(mode === '3' ? [{ bg: '#131313', src: m2, inset: '-1px' }] : []),
  ]
  return (
    <div style={{
      position: 'absolute', left, top,
      display: 'flex', alignItems: 'center',
    }}>
      {avatars.map((a, i) => (
        <div key={i} style={{
          width: avatarSize, height: avatarSize, borderRadius: 999,
          background: a.bg,
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative',
          marginRight: i < avatars.length - 1 ? overlap : 0,
          zIndex: avatars.length - i,
        }}>
          <img alt="" src={a.src} style={{
            position: 'absolute', inset: a.inset,
            width: '100%', height: '100%',
            objectFit: 'cover', pointerEvents: 'none',
          }} />
        </div>
      ))}
    </div>
  )
}

type CardActionMode = 'add' | 'sing'

function MusicCardActionButton({
  mode,
  primary,
  onClick,
}: {
  mode: CardActionMode
  primary: boolean
  onClick: () => void
}) {
  const isAdd = mode === 'add'
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      style={{
        width: primary ? (isAdd ? 237 : 230) : (isAdd ? 177 : 171),
        height: primary ? 79 : 55,
        borderRadius: primary ? 30 : 21.13,
        border: 'none',
        background: primary ? 'rgba(255,255,255,0.76)' : 'rgba(255,255,255,0.39)',
        boxShadow: primary ? '0px 0px 28.7px 0px rgba(0,0,0,0.30)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: primary ? 'flex-start' : 'center',
        padding: primary ? '0 10px' : '0 7.043px',
        cursor: 'pointer',
        opacity: primary ? 1 : 0.5,
        flexShrink: 0,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: primary ? (isAdd ? 32 : 32) : 11.27,
        width: primary ? 196 : 'auto',
      }}>
        <div style={{
          width: primary ? 57 : 40.148,
          height: primary ? 57 : 40.148,
          borderRadius: primary ? 32.885 : 23.162,
          background: isAdd
            ? (primary ? '#9fda84' : 'rgba(6,6,6,0.53)')
            : (primary ? '#ff8080' : 'rgba(6,6,6,0.53)'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'SF Pro', -apple-system, sans-serif",
            fontSize: primary ? (isAdd ? 32.552 : 22) : 15.496,
            fontWeight: 400,
            color: '#fff',
            lineHeight: primary ? '28px' : '20px',
            letterSpacing: primary ? '-0.26px' : '-0.23px',
          }}>
            {isAdd ? SF.add : SF.play}
          </span>
        </div>
        <span style={{
          fontFamily: sfPro,
          fontSize: primary ? 20 : 15,
          fontWeight: 590,
          color: '#000',
          lineHeight: primary ? '25px' : '20px',
          letterSpacing: primary ? '-0.45px' : '-0.23px',
          whiteSpace: 'nowrap',
        }}>
          {isAdd ? 'Add to the list' : 'Sing now'}
        </span>
      </div>
    </motion.button>
  )
}

function MusicCardAddOrSing({
  primaryMode,
  onPrimary,
  onSwap,
}: {
  primaryMode: CardActionMode
  onPrimary: () => void
  onSwap: (mode: CardActionMode) => void
}) {
  const secondaryMode: CardActionMode = primaryMode === 'add' ? 'sing' : 'add'
  return (
    <div style={{
      position: 'relative',
      width: 230,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 15,
      zIndex: 2,
    }}>
      <MusicCardActionButton
        mode={primaryMode}
        primary
        onClick={onPrimary}
      />
      <MusicCardActionButton
        mode={secondaryMode}
        primary={false}
        onClick={() => onSwap(secondaryMode)}
      />
    </div>
  )
}

/* ─── Browser Screen ─────────────────────────────────────── */
function BrowserScreen({ onSingNow, onBack, onSearch, songs, artworks }: {
  onSingNow: (songIdx: number) => void
  onBack: () => void
  onSearch: () => void
  songs: readonly SongEntry[]
  artworks: (string | null)[]
}) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [cardActionMode, setCardActionMode] = useState<CardActionMode>('add')
  const [addingToList, setAddingToList] = useState(false)
  const [addedToList, setAddedToList] = useState(false)
  const albumCards = songs.map((_, i) => artworks[i] ?? bMusicCard1)
  const albumLefts = [194, 450, 706, 962, 1218, 1474]
  const pinData = [
    { left: 351, top: 207, mode: '3' as const },
    { left: 618, top: 207, mode: '2' as const },
    { left: 872, top: 207, mode: '3' as const },
    { left: 1131, top: 207, mode: '2' as const },
    { left: 1393, top: 207, mode: '2' as const },
    { left: 1627, top: 207, mode: '3' as const },
  ]
  const nextUpSongs = [
    { thumb: bRect5, active: false },
    { thumb: bRect6, active: true },
    { thumb: bRect7, active: false },
    { thumb: bRect8, active: false },
  ]
  const playlistThumbs = [bRect4, bRect4, bRect4, bRect4, bRect4, bRect4]
  const selectedLayout = {
    smallLefts: [240, 473, 1011, 1244, 1477],
    smallPinLefts: [362, 618, 1155, 1393, 1604],
    smallPinTops: [216, 219, 220, 220, 221],
    selectedLeft: 706,
    selectedTop: 208,
    selectedPinLeft: 903,
    selectedPinTop: 186,
  }
  const visibleSmallIndexes = selectedCard === null
    ? []
    : albumCards.map((_, i) => i).filter(i => i !== selectedCard)
  const selectedActionTargets: TouchTarget[] = selectedCard === null
    ? []
    : cardActionMode === 'add'
      ? [
          { id: 'action-add', left: selectedLayout.selectedLeft + 22, top: selectedLayout.selectedTop + 63, width: 237, height: 79, radius: 30 },
          { id: 'action-sing', left: selectedLayout.selectedLeft + 52, top: selectedLayout.selectedTop + 157, width: 171, height: 55, radius: 21 },
        ]
      : [
          { id: 'action-sing', left: selectedLayout.selectedLeft + 22, top: selectedLayout.selectedTop + 63, width: 230, height: 79, radius: 30 },
          { id: 'action-add', left: selectedLayout.selectedLeft + 49, top: selectedLayout.selectedTop + 157, width: 177, height: 55, radius: 21 },
        ]
  const startAddToList = useCallback(() => {
    if (addingToList) return
    setAddingToList(true)
    setAddedToList(false)
    window.setTimeout(() => {
      setAddingToList(false)
      setAddedToList(true)
      setCardActionMode('sing')
    }, 680)
  }, [addingToList])
  const browserTargets: TouchTarget[] = [
    ...selectedActionTargets,
    { id: 'back', left: 121, top: 74, width: 78, height: 78, radius: 999 },
    { id: 'tab-sing', left: 779, top: 90, width: 166, height: 48, radius: 46 },
    { id: 'search', left: 1403, top: 89, width: 359, height: 63, radius: 105 },
    { id: 'bar-list', left: 410, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-shuffle', left: 488, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-volume', left: 566, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-time', left: 644, top: 928, width: 128, height: 45, radius: 24 },
    { id: 'bar-people', left: 803, top: 899, width: 315, height: 113, radius: 109 },
    { id: 'bar-captions', left: 1212, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-back', left: 1290, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-play', left: 1368, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-forward', left: 1446, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-replay', left: 1524, top: 928, width: 45, height: 45, radius: 999 },
    ...(selectedCard === null
      ? albumLefts.map((left, i) => ({ id: `album-${i}`, left, top: 233, width: 228, height: 228, radius: 30 }))
      : [
          ...visibleSmallIndexes.map((albumIndex, slot) => ({ id: `album-${albumIndex}`, left: selectedLayout.smallLefts[slot], top: 244, width: 203, height: 203, radius: 30 })),
        ]),
    ...nextUpSongs.map((_, i) => ({ id: `next-${i}`, left: 206, top: 594 + i * 119, width: 668, height: 99, radius: 15 })),
    ...[0, 1, 2].flatMap(row => [0, 1].map(col => ({ id: `playlist-${row}-${col}`, left: 1035 + col * 329, top: 594 + row * 108, width: 285, height: 77, radius: 12 }))),
  ]
  const activateBrowserTarget = useCallback((targetId: string) => {
    if (targetId === 'back') onBack()
    else if (targetId === 'search') onSearch()
    else if (targetId === 'tab-sing') onSingNow(selectedCard ?? 0)
    else if (targetId === 'bar-play' || targetId === 'bar-forward') onSingNow(selectedCard ?? 0)
    else if (targetId === 'action-add') {
      startAddToList()
    } else if (targetId === 'action-sing') {
      onSingNow(selectedCard ?? 0)
    } else if (targetId.startsWith('album-')) {
      const index = Number(targetId.replace('album-', ''))
      if (!Number.isNaN(index)) {
        setSelectedCard(index)
        setCardActionMode('add')
        setAddingToList(false)
        setAddedToList(false)
      }
    } else if (targetId.startsWith('next-') || targetId.startsWith('playlist-')) {
      onSingNow(selectedCard ?? 0)
    }
  }, [onBack, onSearch, onSingNow, selectedCard, startAddToList])
  const handleBrowserMove = useCallback((targetId: string) => {
    if (targetId === 'action-add') setCardActionMode('add')
    else if (targetId === 'action-sing') setCardActionMode('sing')
  }, [])
  const browserTouch = useMultiUserTouch(browserTargets, activateBrowserTarget, ['album-0', 'album-2', 'album-5'], handleBrowserMove)

  return (
    <motion.div
      key="browser"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.3 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', left: -157, top: -207, width: 2210, height: 1980, zIndex: 0 }}>
        <img src={bBg} alt="" style={{ position: 'absolute', inset: '-9.83% -8.81%', width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* Back button */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={onBack}
        style={{
          position: 'absolute',
          left: 'calc(50% - 795px)',
          top: 74,
          transform: 'translateX(-50%)',
          width: 78, height: 78,
          borderRadius: 105,
          border: '0.857px solid #fff',
          background: 'rgba(10,10,10,0.2)',
          backdropFilter: 'blur(93.596px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'inset 0px 5.509px 5.509px 0px rgba(0,0,0,0.25)',
          zIndex: 10,
        }}
      >
        <span style={{
          fontFamily: "'SF Pro', 'SF Pro Display', -apple-system, sans-serif",
          fontSize: 32, fontWeight: 274, color: '#fff', lineHeight: 'normal',
        }}>{SF.back}</span>
      </motion.button>

      {/* Tab pill */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 0.5px)',
        top: 74,
        transform: 'translateX(-50%)',
        width: 385, height: 78,
        borderRadius: 991,
        border: '1.983px solid #fff',
        background: 'linear-gradient(158.77deg, rgba(255,255,255,0.25) 19.848%, rgba(235,235,235,0.184) 4.204%, rgba(224,224,224,0.144) 13.88%, rgba(212,212,212,0.106) 27.982%, rgba(207,207,207,0.088) 37.795%, rgba(202,202,202,0.072) 44.382%, rgba(200,200,200,0.063) 50.536%, rgba(196,196,196,0.05) 60.215%)',
        display: 'flex', alignItems: 'center',
        padding: 15.862,
        gap: 1.858,
        zIndex: 10,
      }}>
        {/* Sing now - inactive */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9.278px 23.195px',
          borderRadius: 46.39,
          backdropFilter: 'blur(11.597px)',
          opacity: 0.59,
          cursor: 'pointer',
        }}>
          <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: 22, lineHeight: '28px', color: '#fff', letterSpacing: '-0.26px' }}>{SF.mic}</span>
          <span style={{ fontFamily: sfPro, fontSize: 22, fontWeight: 400, color: '#fff', lineHeight: '28px', letterSpacing: '-0.26px', whiteSpace: 'nowrap' }}>Sing now</span>
        </div>
        {/* Browser - active */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9.278px 23.195px',
          borderRadius: 46.39,
          backdropFilter: 'blur(11.597px)',
          background: 'linear-gradient(90deg, rgba(79,79,79,0.7) 0%, rgba(79,79,79,0.7) 100%)',
          cursor: 'pointer',
        }}>
          <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: 22, lineHeight: '28px', color: '#fff', letterSpacing: '-0.26px', fontWeight: 700 }}>{SF.browser}</span>
          <span style={{ fontFamily: sfPro, fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: '28px', letterSpacing: '-0.26px', whiteSpace: 'nowrap' }}>Browser</span>
        </div>
      </div>

      {/* Search bar */}
      <SearchBar onClick={onSearch} />

      {/* Memoji pins above album cards */}
      {selectedCard === null && pinData.map((p, i) => (
        <MemojiPin key={i} left={p.left} top={p.top} mode={p.mode} m0={bMemoji} m1={bMemoji1} m2={bMemoji2} />
      ))}
      {selectedCard !== null && visibleSmallIndexes.map((albumIndex, slot) => (
        <MemojiPin
          key={`small-pin-${albumIndex}`}
          left={selectedLayout.smallPinLefts[slot]}
          top={selectedLayout.smallPinTops[slot]}
          mode={albumIndex === 0 || albumIndex === 5 ? '3' : '2'}
          m0={bMemoji}
          m1={bMemoji1}
          m2={bMemoji2}
        />
      ))}
      {selectedCard !== null && (
        <MemojiPin
          left={selectedLayout.selectedPinLeft}
          top={selectedLayout.selectedPinTop}
          mode="3"
          m0={bMemoji}
          m1={bMemoji1}
          m2={bMemoji2}
        />
      )}

      {/* Album cards */}
      {selectedCard === null && albumLefts.map((left, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setSelectedCard(i)
            setCardActionMode('add')
          }}
          style={{
            position: 'absolute',
            left, top: 233,
            width: 228, height: 228,
            borderRadius: 30,
            boxShadow: '0px 0px 14.9px 0px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            cursor: 'pointer',
            zIndex: 5,
          }}
        >
          <img src={bMusicCard} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, borderRadius: 30 }} />
          <img src={albumCards[i]} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 30 }} />
        </motion.div>
      ))}
      {selectedCard !== null && visibleSmallIndexes.map((albumIndex, slot) => (
        <motion.div
          key={`small-card-${albumIndex}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.88, scale: 1 }}
          whileHover={{ scale: 1.04, opacity: 1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setSelectedCard(albumIndex)
            setCardActionMode('add')
          }}
          style={{
            position: 'absolute',
            left: selectedLayout.smallLefts[slot],
            top: 244,
            width: 203,
            height: 203,
            borderRadius: 30,
            boxShadow: '0px 0px 14.9px 0px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            cursor: 'pointer',
            zIndex: 5,
          }}
        >
          <img src={bMusicCard} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, borderRadius: 30 }} />
          <img src={albumCards[albumIndex]} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 30 }} />
        </motion.div>
      ))}
      {selectedCard !== null && (
        <motion.div
          key={`selected-card-${selectedCard}`}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: addingToList ? 0.32 : 1, scale: addingToList ? 0.96 : 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            left: selectedLayout.selectedLeft,
            top: selectedLayout.selectedTop,
            width: 275,
            height: 275,
            borderRadius: 30,
            border: '1px solid rgba(255,255,255,0.50)',
            boxShadow: '0px 0px 30.5px 0px rgba(0,0,0,0.70)',
            overflow: 'hidden',
            zIndex: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '63px 22px',
            boxSizing: 'border-box',
          }}
        >
          <img src={bMusicCard} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, borderRadius: 30 }} />
          <img
            src={selectedCard === 2 ? bMusicCardState6 : albumCards[selectedCard]}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 30 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(76,76,76,0.75)', borderRadius: 30 }} />
          {selectedCard !== null && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '8px 14px 10px',
              background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 0%, transparent 100%)',
              borderRadius: '0 0 30px 30px',
              zIndex: 2,
            }}>
              <p style={{ margin: 0, fontFamily: sfPro, fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: '17px', letterSpacing: '-0.1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{songs[selectedCard].title}</p>
              <p style={{ margin: 0, fontFamily: sfPro, fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.72)', lineHeight: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{songs[selectedCard].artist}</p>
            </div>
          )}
          <MusicCardAddOrSing
            primaryMode={cardActionMode}
            onPrimary={() => {
              if (cardActionMode === 'sing') onSingNow(selectedCard ?? 0)
              else startAddToList()
            }}
            onSwap={setCardActionMode}
          />
        </motion.div>
      )}
      <AnimatePresence>
        {addingToList && selectedCard !== null && (
          <motion.div
            key="add-to-list-motion"
            initial={{
              left: selectedLayout.selectedLeft,
              top: selectedLayout.selectedTop,
              width: 275,
              height: 275,
              opacity: 1,
              borderRadius: 30,
            }}
            animate={{
              left: 206,
              top: 713,
              width: 668,
              height: 99,
              opacity: [1, 0.94, 0],
              borderRadius: 15,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              overflow: 'hidden',
              zIndex: 14,
              border: '1px solid rgba(255,255,255,0.72)',
              boxShadow: '0px 0px 34px rgba(190,240,198,0.28), 0px 18px 36px rgba(0,0,0,0.34)',
              background: 'linear-gradient(180deg, rgba(234,234,234,0.10) 0%, rgba(154,154,154,0.08) 100%)',
              backdropFilter: 'blur(93.596px)',
              pointerEvents: 'none',
            }}
          >
            <img
              src={selectedCard === 2 ? bMusicCardState6 : albumCards[selectedCard]}
              alt=""
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.38,
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(32,51,70,0.55)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Next up" heading */}
      <div style={{
        position: 'absolute', left: 250, top: 521,
        display: 'flex', alignItems: 'center', gap: 19,
        fontFamily: "'SF Pro', -apple-system, sans-serif",
        fontSize: 34, fontWeight: 700, color: '#fff',
        lineHeight: '41px', letterSpacing: '0.4px',
        zIndex: 5,
      }}>
        <span>{SF.nextup}</span>
        <span style={{ width: 131 }}>Next up</span>
      </div>

      {/* "Popular Playlist" heading */}
      <div style={{
        position: 'absolute', left: 1024, top: 521,
        display: 'flex', alignItems: 'center', gap: 19,
        fontFamily: "'SF Pro', -apple-system, sans-serif",
        fontSize: 34, fontWeight: 700, color: '#fff',
        lineHeight: '41px', letterSpacing: '0.4px',
        zIndex: 5,
      }}>
        <span>{SF.playlist}</span>
        <span style={{ width: 252 }}>Popular Playlist</span>
      </div>

      {/* Next up songs list */}
      <div style={{
        position: 'absolute', left: 206, top: 594,
        width: 668,
        display: 'flex', flexDirection: 'column', gap: 20,
        zIndex: 5,
      }}>
        {nextUpSongs.map((song, i) => {
          const active = addedToList ? i === 1 : song.active
          return (
          <motion.div
            key={i}
            onClick={onSingNow}
            whileHover={{ background: 'rgba(255,255,255,0.06)' }}
            animate={{
              scale: active && addedToList ? [1, 1.015, 1] : 1,
              boxShadow: active && addedToList
                ? ['0px 0px 0px rgba(190,240,198,0)', '0px 0px 24px rgba(190,240,198,0.20)', '0px 0px 0px rgba(190,240,198,0)']
                : '0px 0px 0px rgba(190,240,198,0)',
            }}
            transition={{ duration: 0.45 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 60,
              padding: '5px 0',
              borderRadius: 15,
              background: active ? 'linear-gradient(180deg, rgba(234,234,234,0.045) 0%, rgba(154,154,154,0.035) 100%)' : 'transparent',
              border: active ? '1px solid rgba(255,255,255,0.82)' : '1px solid transparent',
              backdropFilter: active ? 'blur(93.596px)' : 'none',
              height: 99,
              cursor: 'pointer',
              transition: 'background 150ms, border-color 150ms',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 25, paddingLeft: 20 }}>
              {/* Play icon (invisible for non-active, visible for active) */}
              <span style={{
                fontFamily: "'SF Pro', -apple-system, sans-serif",
                fontSize: 28, fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,0)',
                lineHeight: '34px', letterSpacing: '0.38px',
                width: 28,
              }}>{SF.play}</span>
              <div style={{
                width: 61, height: 61, borderRadius: 8, overflow: 'hidden',
                flexShrink: 0, position: 'relative',
              }}>
                <img src={song.thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ width: 260 }}>
                <p style={{
                  fontFamily: sfPro, fontSize: active ? 22 : 20,
                  fontWeight: active ? 700 : 590,
                  color: '#fff', lineHeight: active ? '28px' : '25px',
                  letterSpacing: active ? '-0.26px' : '-0.45px',
                  margin: 0, marginBottom: 15,
                }}>Sounds of Summer</p>
                <p style={{
                  fontFamily: sfPro, fontSize: 17, fontWeight: 590,
                  color: '#c9c9c9', lineHeight: '22px', letterSpacing: '-0.43px',
                  margin: 0,
                }}>The Beach Boys</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 25, opacity: 0.80, marginLeft: 'auto', paddingRight: 20 }}>
              <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: active ? 22 : 20, color: '#fff', lineHeight: '25px' }}>{SF.add}</span>
              <span style={{ fontFamily: sfPro, fontSize: active ? 22 : 20, color: '#fff', width: 51 }}>5"35</span>
              <span style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontSize: active ? 22 : 20, color: '#fff' }}>{SF.ellipsis}</span>
            </div>
          </motion.div>
        )})}
      </div>

      {/* Popular Playlist grid */}
      <div style={{
        position: 'absolute', left: 1035, top: 594,
        width: 614,
        display: 'flex', flexDirection: 'column', gap: 31,
        zIndex: 5,
      }}>
        {[0, 1, 2].map(row => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {[0, 1].map(col => (
              <motion.div
                key={col}
                onClick={onSingNow}
                whileHover={{ opacity: 0.8 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 15,
                  width: 285, height: 77,
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: 77, height: 77, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={playlistThumbs[row * 2 + col]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p style={{
                  fontFamily: sfPro, fontSize: 20, fontWeight: 590,
                  color: '#fff', lineHeight: '25px', letterSpacing: '-0.45px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>Top popular Song list</p>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 27px)',
        top: 909,
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}>
        <BottomBar />
      </div>

      {/* Memoji group pill at bottom */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 0.5px)',
        bottom: 68,
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}>
        <MemojiGroupPill m0={bMemoji} m1={bMemoji1} m2={bMemoji2} />
      </div>
      <MultiUserTouchFrames targets={browserTargets} positions={browserTouch.positions} active={browserTouch.active} />
    </motion.div>
  )
}

/* ─── Current Playlist Panel (Sing Home sing list, 125:1729) ── */
function CurrentListPanel({ rows, onSearch, onSongClick, onMoveSong }: {
  rows: CurrentListRow[]
  onSearch: () => void
  onSongClick?: () => void
  onMoveSong: (index: number, direction: 'up' | 'down') => void
}) {
  const panelIconStyle: React.CSSProperties = {
    fontFamily: "'SF Pro', 'SF Pro Display', -apple-system, sans-serif",
    fontSize: 21,
    fontWeight: 700,
    color: '#fff',
    lineHeight: '25px',
    letterSpacing: '0.24px',
    width: 23,
    height: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -34, scale: 0.985 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -28, scale: 0.985 }}
      transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'absolute',
        left: 75,
        top: 147,
        width: 466,
        height: 654,
        borderRadius: 36.207,
        overflow: 'hidden',
        boxShadow: '0px 0.33px 7.913px -0.33px rgba(0,0,0,0.18)',
        zIndex: 12,
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(133.356deg, rgba(163,163,163,0.222) 3.544%, rgba(114,114,114,0.252) 95.146%)',
        backdropFilter: 'blur(35.35px)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 36.207,
        boxShadow: 'inset 0px 0.659px 0px rgba(255,255,255,0.50), inset 0.659px 0px 0px rgba(255,255,255,0.20), inset -0.659px 0px 0px rgba(255,255,255,0.20), inset 0px -0.659px 0px rgba(255,255,255,0.10)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        left: 28,
        top: 26,
        width: 329,
        display: 'flex',
        alignItems: 'center',
        gap: 37,
        zIndex: 2,
      }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onSearch}
          style={{
            width: 51,
            height: 51,
            borderRadius: 85.327,
            border: 'none',
            background: 'rgba(255,255,255,0.20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
          aria-label="Search playlist"
        >
          <span style={{
            fontFamily: "'SF Pro', 'SF Pro Display', -apple-system, sans-serif",
            fontSize: 25,
            fontWeight: 400,
            color: '#fff',
            lineHeight: 'normal',
          }}>{SF.listSearch}</span>
        </motion.button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 40,
          padding: 4,
          borderRadius: 100,
          background: 'rgba(0,0,0,0.15)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{
            height: 32,
            padding: '0 18px',
            borderRadius: 100,
            background: 'rgba(255,255,255,0.26)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 0px 8px rgba(0,0,0,0.18)',
          }}>
            <span style={{ fontFamily: sfPro, fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.43px' }}>Play list</span>
          </div>
          <div style={{
            height: 32,
            padding: '0 18px',
            borderRadius: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.55,
          }}>
            <span style={{ fontFamily: sfPro, fontSize: 17, fontWeight: 590, color: '#fff', letterSpacing: '-0.43px' }}>Interest</span>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        left: 33,
        top: 106,
        width: 406,
        height: 511,
        borderRadius: 20,
        background: 'rgba(10,10,10,0.33)',
        backdropFilter: 'blur(34.221px)',
        boxShadow: 'inset 0px 0.4px 0px rgba(255,255,255,0.25)',
        padding: '35px 25px 25px',
        boxSizing: 'border-box',
        zIndex: 2,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 23 }}>
          {rows.map((row, index) => (
            <motion.div
              key={row.title}
              whileHover={{ background: 'rgba(255,255,255,0.06)' }}
              whileTap={{ scale: 0.985 }}
              onClick={onSongClick}
              style={{
                height: 82,
                borderRadius: 14,
                cursor: onSongClick ? 'pointer' : 'default',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 15,
                marginLeft: -8,
                marginRight: -8,
                padding: '0 8px',
              }}
            >
              <div style={{
                width: 50,
                height: 50,
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                marginTop: 0,
              }}>
                <img src={row.thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                {row.overlay && (
                  <img src={row.overlay} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ width: 117, paddingTop: 2, flexShrink: 0 }}>
                <p style={{
                  fontFamily: sfPro,
                  fontSize: 20,
                  fontWeight: 590,
                  color: '#fff',
                  lineHeight: '25px',
                  letterSpacing: '-0.45px',
                  margin: 0,
                  marginBottom: 3,
                }}>{row.title}</p>
                <p style={{
                  fontFamily: sfPro,
                  fontSize: 17,
                  fontWeight: 590,
                  color: 'rgba(255,255,255,0.58)',
                  lineHeight: '22px',
                  letterSpacing: '-0.43px',
                  margin: 0,
                }}>{row.artist}</p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                paddingTop: 12,
                marginLeft: 'auto',
              }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveSong(index, 'up')
                  }}
                  disabled={index === 0}
                  style={{
                    ...panelIconStyle,
                    opacity: index === 0 ? 0.18 : 0.78,
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    cursor: index === 0 ? 'default' : 'pointer',
                  }}
                >
                  {SF.listHead}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveSong(index, 'down')
                  }}
                  disabled={index === rows.length - 1}
                  style={{
                    ...panelIconStyle,
                    opacity: index === rows.length - 1 ? 0.18 : 0.78,
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    cursor: index === rows.length - 1 ? 'default' : 'pointer',
                  }}
                >
                  {SF.listMic}
                </motion.button>
                <span style={{ ...panelIconStyle, opacity: 0.70 }}>{SF.listAdd}</span>
                <span style={{ ...panelIconStyle, opacity: 0.70 }}>{SF.listMore}</span>
              </div>
              {index < rows.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -11,
                  height: 1,
                  background: 'rgba(255,255,255,0.13)',
                }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Singing Screen ─────────────────────────────────────── */
function SingingScreen({ onFinish, onBack, showGuidanceInitially = false, lyricLines, previewUrl, songTitle, songArtist, artworkUrl }: {
  onFinish: () => void
  onBack: () => void
  showGuidanceInitially?: boolean
  lyricLines?: LyricLine[] | null
  previewUrl?: string | null
  songTitle?: string
  songArtist?: string
  artworkUrl?: string | null
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const finishRef = useRef(onFinish)
  finishRef.current = onFinish
  const [showSidebar, setShowSidebar] = useState(false)
  const [sidebarAnchorPlayer, setSidebarAnchorPlayer] = useState<PlayerId | null>(null)
  const [showList, setShowList] = useState(false)
  const [currentListRows, setCurrentListRows] = useState<CurrentListRow[]>([
    { title: 'Name 01', artist: 'Singer', thumb: listRect4, overlay: listAlbumArt, active: true },
    { title: 'Name 02', artist: 'Band', thumb: listRect5 },
    { title: 'Name 03', artist: 'Solo Artist', thumb: listRect6 },
    { title: 'Name 04', artist: 'Composer', thumb: listRect7 },
  ])
  const [showTopBar, setShowTopBar] = useState(false)
  const [topBarFocus, setTopBarFocus] = useState<'sing' | 'browser'>('sing')
  const [browserLyricsMode, setBrowserLyricsMode] = useState(false)
  const [showGuidance, setShowGuidance] = useState(showGuidanceInitially)
  const [emojiPickerPlayer, setEmojiPickerPlayer] = useState<PlayerId | null>(null)
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number; fontSize: number; rotate: number; blur: number; opacity: number; delay: number }[]>([])
  const singingTargets: TouchTarget[] = [
    { id: 'top-sing', left: 784, top: 90, width: 166, height: 48, radius: 46 },
    { id: 'top-browser', left: 952, top: 90, width: 166, height: 48, radius: 46 },
    { id: 'search', left: 1403, top: 89, width: 359, height: 63, radius: 105 },
    { id: 'bar-list', left: 410, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-shuffle', left: 488, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-volume', left: 566, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-time', left: 644, top: 928, width: 128, height: 45, radius: 24 },
    { id: 'bar-captions', left: 1212, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-back', left: 1290, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-play', left: 1368, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-forward', left: 1446, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-replay', left: 1524, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-people', left: 792.5, top: 905, width: 335, height: 92, radius: 94 },
  ]
  const browserLyricsTargets: TouchTarget[] = browserLyricsMode
    ? [
        { id: 'browse-album-0', left: 160, top: 302, width: 240, height: 240, radius: 26 },
        { id: 'browse-album-1', left: 432, top: 302, width: 240, height: 240, radius: 26 },
        { id: 'browse-album-2', left: 704, top: 302, width: 240, height: 240, radius: 26 },
        { id: 'browse-album-3', left: 976, top: 302, width: 240, height: 240, radius: 26 },
        { id: 'browse-album-4', left: 1248, top: 302, width: 240, height: 240, radius: 26 },
        { id: 'browse-album-5', left: 1520, top: 302, width: 240, height: 240, radius: 26 },
      ]
    : []
  const currentListTargets: TouchTarget[] = showList
    ? [
        { id: 'list-close', left: 103, top: 173, width: 51, height: 51, radius: 999 },
        ...currentListRows.flatMap((_, index) => {
          const rowTop = 281 + index * 105
          const iconTop = 300 + index * 105
          return [
            { id: `list-row-${index}`, left: 108, top: rowTop, width: 292, height: 92, radius: 18 },
            { id: `list-up-${index}`, left: 342, top: iconTop, width: 36, height: 36, radius: 999 },
            { id: `list-down-${index}`, left: 380, top: iconTop, width: 36, height: 36, radius: 999 },
            { id: `list-remove-${index}`, left: 418, top: iconTop, width: 36, height: 36, radius: 999 },
            { id: `list-more-${index}`, left: 456, top: iconTop, width: 36, height: 36, radius: 999 },
          ]
        }),
      ]
    : []
  const sidebarKeyRows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M'],
  ]
  const sidebarTargets: TouchTarget[] = showSidebar
    ? [
        { id: 'sidebar-search', left: 1402, top: 147, width: 367, height: 63, radius: 105 },
        { id: 'sidebar-mic', left: 1777, top: 147, width: 80, height: 63, radius: 105 },
        ...[0, 1, 2, 3].map(index => ({ id: `sidebar-card-${index}`, left: 1420 + index * 126, top: 300, width: 110, height: 110, radius: 999 })),
        ...sidebarKeyRows.flatMap((row, rowIndex) => row.map((_, colIndex) => {
          const keyWidth = rowIndex === 0 ? 43 : rowIndex === 1 ? 46 : 54
          const rowWidth = row.length * keyWidth + (row.length - 1) * 6
          const left = 1402 + 230 - rowWidth / 2 + colIndex * (keyWidth + 6)
          return { id: `sidebar-key-${rowIndex}-${colIndex}`, left, top: 524 + rowIndex * 54, width: keyWidth, height: 46, radius: 8 }
        })),
        { id: 'sidebar-space', left: 1532, top: 686, width: 200, height: 46, radius: 8 },
      ]
    : []

  const emojiAnchors: Record<PlayerId, { pickerLeft: number; pickerTop: number; emitX: number }> = {
    0: { pickerLeft: 692, pickerTop: 758, emitX: 760 },
    1: { pickerLeft: 789, pickerTop: 767, emitX: 960 },
    2: { pickerLeft: 970, pickerTop: 770, emitX: 1115 },
  }
  const emojiTargetLayouts: Record<PlayerId, Record<'emoji-balloon' | 'emoji-clap' | 'emoji-party', TouchTarget>> = {
    0: {
      'emoji-balloon': { id: 'emoji-balloon', left: 726, top: 880, width: 82, height: 82, radius: 999 },
      'emoji-clap': { id: 'emoji-clap', left: 797, top: 798, width: 82, height: 82, radius: 999 },
      'emoji-party': { id: 'emoji-party', left: 888, top: 776, width: 86, height: 86, radius: 999 },
    },
    1: {
      'emoji-balloon': { id: 'emoji-balloon', left: 829, top: 840, width: 76, height: 76, radius: 999 },
      'emoji-clap': { id: 'emoji-clap', left: 930, top: 785, width: 78, height: 78, radius: 999 },
      'emoji-party': { id: 'emoji-party', left: 1030, top: 841, width: 76, height: 76, radius: 999 },
    },
    2: {
      'emoji-balloon': { id: 'emoji-balloon', left: 1025, top: 786, width: 76, height: 76, radius: 999 },
      'emoji-clap': { id: 'emoji-clap', left: 1105, top: 820, width: 74, height: 74, radius: 999 },
      'emoji-party': { id: 'emoji-party', left: 1151, top: 898, width: 72, height: 72, radius: 999 },
    },
  }
  const activeEmojiTargets = emojiPickerPlayer === null ? [] : Object.values(emojiTargetLayouts[emojiPickerPlayer])
  const interactiveSingingTargets = [...singingTargets, ...browserLyricsTargets, ...currentListTargets, ...sidebarTargets, ...activeEmojiTargets]

  const moveCurrentListSong = useCallback((index: number, direction: 'up' | 'down') => {
    setCurrentListRows(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= prev.length) return prev
      const next = [...prev]
      const moving = next[index]
      next[index] = next[targetIndex]
      next[targetIndex] = moving
      return next
    })
  }, [])

  const launchEmoji = (emoji: string, playerOverride?: PlayerId) => {
    const player = playerOverride ?? emojiPickerPlayer ?? 1
    const anchor = emojiAnchors[player]
    setEmojiPickerPlayer(null)
    // Figma shows 4 balloons at varying sizes/rotations/positions
    const templates = [
      { fontSize: 148, x: 680, rotate: 0,     blur: 0,    opacity: 1.0,  delay: 0 },
      { fontSize: 94,  x: 1080, rotate: 15.08, blur: 0,    opacity: 1.0,  delay: 0.22 },
      { fontSize: 62,  x: 860, rotate: 15.08, blur: 0,    opacity: 1.0,  delay: 0.45 },
      { fontSize: 54,  x: 1175, rotate: 15.08, blur: 5.05, opacity: 0.75, delay: 0.68 },
    ]
    const newOnes = templates.map((t, i) => ({
      id: Date.now() + i,
      emoji,
      x: anchor.emitX + (t.x - 960) * 0.45 + (Math.random() - 0.5) * 60,
      fontSize: t.fontSize,
      rotate: t.rotate + (Math.random() - 0.5) * 10,
      blur: t.blur,
      opacity: t.opacity,
      delay: t.delay,
    }))
    setFloatingEmojis(prev => [...prev, ...newOnes])
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => !newOnes.find(n => n.id === e.id)))
    }, 5000)
  }

  const activateSingingTarget = useCallback((targetId: string, player: PlayerId) => {
    if (targetId === 'search') {
      setSidebarAnchorPlayer(player)
      setShowSidebar(true)
    }
    else if (targetId === 'top-browser') {
      setBrowserLyricsMode(true)
      setShowTopBar(true)
      setTopBarFocus('browser')
    }
    else if (targetId === 'top-sing') {
      setBrowserLyricsMode(false)
      setShowTopBar(false)
      setTopBarFocus('sing')
    }
    else if (targetId.startsWith('sidebar-card-')) onSingNow()
    else if (targetId === 'sidebar-mic' || targetId === 'sidebar-search' || targetId.startsWith('sidebar-key-') || targetId === 'sidebar-space') {
      setShowSidebar(true)
    }
    else if (targetId === 'bar-list') setShowList(v => !v)
    else if (targetId === 'list-close') setShowList(false)
    else if (targetId.startsWith('list-row-')) setShowList(false)
    else if (targetId.startsWith('list-up-')) {
      const index = Number(targetId.replace('list-up-', ''))
      if (!Number.isNaN(index)) moveCurrentListSong(index, 'up')
    }
    else if (targetId.startsWith('list-down-')) {
      const index = Number(targetId.replace('list-down-', ''))
      if (!Number.isNaN(index)) moveCurrentListSong(index, 'down')
    }
    else if (targetId.startsWith('list-remove-')) {
      const index = Number(targetId.replace('list-remove-', ''))
      if (!Number.isNaN(index)) setCurrentListRows(prev => prev.length <= 1 ? prev : prev.filter((_, i) => i !== index))
    }
    else if (targetId.startsWith('list-more-')) {
      setShowList(true)
    }
    else if (targetId === 'bar-people') setEmojiPickerPlayer(prev => prev === player ? null : player)
    else if (targetId === 'emoji-balloon') {
      launchEmoji('🎈', player)
    } else if (targetId === 'emoji-clap') {
      launchEmoji('👏', player)
    } else if (targetId === 'emoji-party') {
      launchEmoji('🎉', player)
    }
    else if (targetId === 'bar-back' || targetId === 'bar-replay') {
      // Keep the singing screen active; this mirrors replay/previous without leaving the flow.
      setShowList(false)
      setShowSidebar(false)
      setSidebarAnchorPlayer(null)
    } else if (targetId === 'bar-forward') {
      finishRef.current()
    }
  }, [emojiPickerPlayer, moveCurrentListSong])
  const singingTouch = useMultiUserTouch(
    interactiveSingingTargets,
    activateSingingTarget,
    ['bar-list', 'bar-play', 'bar-people'],
  )

  useEffect(() => {
    if (!showSidebar || sidebarAnchorPlayer === null) return
    const position = singingTouch.positions[sidebarAnchorPlayer]
    const stillInSidebar = position === 'search'
      || position === 'sidebar-search'
      || position === 'sidebar-mic'
      || position === 'sidebar-space'
      || position.startsWith('sidebar-card-')
      || position.startsWith('sidebar-key-')
    if (!singingTouch.active[sidebarAnchorPlayer] || !stillInSidebar) {
      setShowSidebar(false)
      setSidebarAnchorPlayer(null)
    }
  }, [showSidebar, sidebarAnchorPlayer, singingTouch.active, singingTouch.positions])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.key === '1' || e.code === 'Digit1') && !showGuidance) {
        e.preventDefault()
        finishRef.current()
        return
      }
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'i' || e.key === 'I') && emojiPickerPlayer === null) {
        e.preventDefault()
        setShowTopBar(true)
        setTopBarFocus(browserLyricsMode ? 'browser' : 'sing')
        return
      }
      if (showTopBar && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault()
        setTopBarFocus(e.key === 'ArrowRight' ? 'browser' : 'sing')
        return
      }
      if (showTopBar && e.key === 'Enter') {
        e.preventDefault()
        if (topBarFocus === 'browser') {
          setBrowserLyricsMode(true)
          setShowTopBar(true)
        } else {
          setBrowserLyricsMode(false)
          setShowTopBar(false)
        }
        return
      }
      if (showTopBar && e.key === 'ArrowDown') {
        e.preventDefault()
        setShowTopBar(false)
        return
      }
      if (e.key === 'Escape') {
        if (showSidebar) {
          setShowSidebar(false)
          setSidebarAnchorPlayer(null)
        }
        else if (showList) setShowList(false)
        else if (showTopBar) setShowTopBar(false)
        else onBack()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [browserLyricsMode, emojiPickerPlayer, onBack, showGuidance, showSidebar, showList, showTopBar, topBarFocus])

  return (
    <motion.div
      key="singing"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.22 } }}
      transition={{ duration: 0.3 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        if (e.clientY - rect.top < rect.height * 0.18) {
          setShowTopBar(true)
        }
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <audio ref={audioRef} src={previewUrl ?? undefined} aria-hidden="true" preload="auto" autoPlay loop style={{ display: 'none' }} />

      {/* Background glows */}
      <div style={{ position: 'absolute', left: -157, top: 1058, width: 2210, height: 715, overflow: 'hidden', transform: 'rotate(180deg)', zIndex: 0 }}>
        <img src={sEllipse161} alt="" style={{ position: 'absolute', inset: '-27.23% -8.81%', width: '100%', height: '100%', display: 'block' }} />
      </div>
      <div style={{ position: 'absolute', left: -157, top: -207, width: 2210, height: 207, overflow: 'hidden', transform: 'rotate(180deg)', zIndex: 0 }}>
        <img src={sEllipse160} alt="" style={{ position: 'absolute', inset: '-94.06% -8.81%', width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* Next Song badges at top center */}
      {/* Small (Variant2) - behind, top: 73 */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% - 0.42px)',
        top: 73,
        transform: 'translateX(-50%)',
        width: 298, height: 54.111,
        background: 'linear-gradient(180deg, rgba(234,234,234,0.09) 0%, rgba(154,154,154,0.09) 100%)',
        borderRadius: 82.342,
        boxShadow: '0px 0px 10.014px 0px rgba(0,0,0,0.29)',
        opacity: 0.60,
        display: 'flex', alignItems: 'center',
        padding: '0 22.742px',
        zIndex: 5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11.763 }}>
          <div style={{ width: 40, height: 40, borderRadius: 6.274, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
            <img src={sRect4} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <img src={sRect6} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ fontFamily: sfPro, fontSize: 17.253, fontWeight: 700, color: '#fff', lineHeight: '21.958px', letterSpacing: '-0.204px', margin: 0 }}>{songTitle ?? 'Song'}</p>
            <p style={{ fontFamily: sfPro, fontSize: 13.332, fontWeight: 590, color: '#fff', lineHeight: '17.253px', letterSpacing: '-0.337px', opacity: 0.60, margin: 0 }}>{songArtist ?? ''}</p>
          </div>
        </div>
      </div>
      {/* Large (Default) - in front, top: 115 */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 0.5px)',
        top: 115,
        transform: 'translateX(-50%)',
        width: 406.174, height: 73.753,
        background: 'linear-gradient(180deg, rgba(234,234,234,0.09) 0%, rgba(154,154,154,0.09) 100%)',
        borderRadius: 112.232,
        boxShadow: '0px 0px 13.648px 0px rgba(0,0,0,0.29)',
        opacity: 0.80,
        display: 'flex', alignItems: 'center',
        padding: '0 30.997px',
        zIndex: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16.033 }}>
          <div style={{ width: 54, height: 54, borderRadius: 8.551, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
            <img src={sRect4} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <img src={sRect5} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ fontFamily: sfPro, fontSize: 23.515, fontWeight: 700, color: '#fff', lineHeight: '29.929px', letterSpacing: '-0.278px', margin: 0 }}>{songTitle ?? 'Song'}</p>
            <p style={{ fontFamily: sfPro, fontSize: 18.171, fontWeight: 590, color: '#fff', lineHeight: '23.515px', letterSpacing: '-0.46px', opacity: 0.60, margin: 0 }}>{songArtist ?? ''}</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {!showSidebar && (
        <SearchBar onClick={() => {
          setSidebarAnchorPlayer(null)
          setShowSidebar(true)
        }} />
      )}

      <AnimatePresence>
        {(showTopBar || browserLyricsMode) && (
          <SingModeTopBar
            key="sing-mode-top-bar"
            focusedMode={browserLyricsMode ? 'browser' : topBarFocus}
            onFocusMode={setTopBarFocus}
            onStaySing={() => {
              setBrowserLyricsMode(false)
              setShowTopBar(false)
              setTopBarFocus('sing')
            }}
            onBrowser={() => {
              setBrowserLyricsMode(true)
              setShowTopBar(true)
              setTopBarFocus('browser')
            }}
          />
        )}
      </AnimatePresence>

      {browserLyricsMode ? (
        <>
          <div style={{
            position: 'absolute',
            left: 160,
            top: 302,
            display: 'flex',
            gap: 32,
            alignItems: 'flex-start',
            zIndex: 5,
          }}>
            {[bRect5, bMusicCard1, bMusicCard2, bMusicCard3, bMusicCard4, bMusicCard5].map((card, i) => (
              <motion.div
                key={card}
                whileTap={{ scale: 0.96 }}
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 26,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: i === 0 ? '0px 0px 28px rgba(190,240,198,0.55)' : '0px 10px 28px rgba(0,0,0,0.22)',
                  border: i === 0 ? '2px solid rgba(190,240,198,0.9)' : '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <img src={card} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <MemojiPin
                  left={i % 2 === 0 ? 156 : 176}
                  top={-20}
                  mode={i === 0 || i === 2 || i === 5 ? '3' : '2'}
                  m0={bMemoji}
                  m1={bMemoji1}
                  m2={bMemoji2}
                />
              </motion.div>
            ))}
          </div>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 545,
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 780,
            zIndex: 5,
          }}>
            <SyncedLyrics audioRef={audioRef} compact lyricLines={lyricLines} />
          </div>
        </>
      ) : (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 'calc(50% - 22px)',
          transform: 'translate(-50%, -50%)',
          width: 1460, height: 676,
          background: 'linear-gradient(180deg, rgba(234,234,234,0.10) 0%, rgba(154,154,154,0.10) 100%)',
          borderRadius: 100,
          boxShadow: '0px 0px 14.9px 0px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 10,
          zIndex: 5,
        }}>
          <div style={{ display: 'flex', gap: 208, alignItems: 'center', justifyContent: 'center' }}>
            {/* Left: album art + title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 50, alignItems: 'flex-start', width: 301 }}>
              <div style={{ width: 301, height: 302, borderRadius: 20, overflow: 'hidden', position: 'relative', background: '#222' }}>
                <img src={artworkUrl ?? sAlbumArt} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
              </div>
              <div style={{ color: '#fff' }}>
                <p style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: 40, fontWeight: 500, color: '#fff', lineHeight: 'normal', margin: 0 }}>{songTitle ?? 'Song'}</p>
                <p style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: 24, fontWeight: 300, color: '#fff', lineHeight: 'normal', margin: 0 }}>{songArtist ?? ''}</p>
              </div>
            </div>
            {/* Right: lyrics */}
            <div style={{ width: 574 }}>
              <SyncedLyrics audioRef={audioRef} lyricLines={lyricLines} />
            </div>
          </div>
        </div>
      )}

      {/* Floating emojis */}
      {/* Floating emojis — sizes/rotation match Figma */}
      <AnimatePresence>
        {floatingEmojis.map(fe => (
          <motion.div
            key={fe.id}
            initial={{ y: 920, x: fe.x, opacity: 1 }}
            animate={{ y: -100, opacity: 0 }}
            transition={{ duration: 2.6 + fe.delay * 0.3, delay: fe.delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              fontSize: fe.fontSize,
              lineHeight: 1,
              transform: `rotate(${fe.rotate}deg)`,
              filter: fe.blur ? `blur(${fe.blur}px)` : undefined,
              opacity: fe.opacity ?? 1,
              pointerEvents: 'none',
              zIndex: 8,
              userSelect: 'none',
            }}
          >
            {fe.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Emoji arc picker — exact Figma position */}
      <AnimatePresence>
        {emojiPickerPlayer !== null && (
          <>
            <div onClick={() => setEmojiPickerPlayer(null)} style={{ position: 'absolute', inset: 0, zIndex: 14 }} />
            <EmojiArcPicker
              left={emojiAnchors[emojiPickerPlayer].pickerLeft}
              top={emojiAnchors[emojiPickerPlayer].pickerTop}
              player={emojiPickerPlayer}
              onSelect={(emoji) => launchEmoji(emoji)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Current playlist panel — opened from the left list icon */}
      <AnimatePresence>
        {showList && (
          <CurrentListPanel
            key="current-list"
            rows={currentListRows}
            onSearch={() => setShowList(false)}
            onSongClick={() => setShowList(false)}
            onMoveSong={moveCurrentListSong}
          />
        )}
      </AnimatePresence>

      {/* Bottom bar (no memoji inside — it's a separate overlay) */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 27px)',
        top: 909,
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}>
        <BottomBar
          showTime
          isPlaying
          isListOpen={showList}
          onListClick={() => setShowList(v => !v)}
        />
      </div>

      {/* SingMemojiGroup pill — exact Figma design, clickable for emoji picker */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 0.5px)',
        top: 905,
        transform: 'translateX(-50%)',
        zIndex: 15,
      }}>
        <SingMemojiGroupPill
          m0={sMemoji}
          m1={sMemoji1}
          m2={sMemoji2}
          activePlayer={emojiPickerPlayer}
          onClick={() => setEmojiPickerPlayer(prev => prev === 1 ? null : 1)}
        />
      </div>
      <MultiUserTouchFrames targets={interactiveSingingTargets} positions={singingTouch.positions} active={singingTouch.active} />

      {/* Search sidebar overlay */}
      <AnimatePresence>
        {showSidebar && (
          <SingSidebar
            key="sing-sidebar"
            onClose={() => {
              setShowSidebar(false)
              setSidebarAnchorPlayer(null)
            }}
            onSingNow={() => {
              setShowSidebar(false)
              setSidebarAnchorPlayer(null)
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showGuidance && (
          <GuideScreen
            key="singing-guidance"
            onContinue={() => setShowGuidance(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Finished Screen ────────────────────────────────────── */
function FinishedScreen({ onTryAgain, onNext }: {
  onTryAgain: () => void
  onNext: () => void
}) {
  const finishedTargets: TouchTarget[] = [
    { id: 'try-again', left: 686, top: 623, width: 169, height: 53, radius: 55 },
    { id: 'save', left: 875, top: 623, width: 205, height: 53, radius: 55 },
    { id: 'next', left: 1100, top: 623, width: 134, height: 53, radius: 55 },
    { id: 'bar-list', left: 410, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-shuffle', left: 488, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-volume', left: 566, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-time', left: 644, top: 928, width: 128, height: 45, radius: 24 },
    { id: 'bar-captions', left: 1212, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-back', left: 1290, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-play', left: 1368, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-forward', left: 1446, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-replay', left: 1524, top: 928, width: 45, height: 45, radius: 999 },
    { id: 'bar-people', left: 803, top: 899, width: 315, height: 113, radius: 109 },
  ]
  const activateFinishedTarget = useCallback((targetId: string) => {
    if (targetId === 'try-again') onTryAgain()
    else if (targetId === 'next') onNext()
    else if (targetId === 'bar-back' || targetId === 'bar-play') onTryAgain()
    else if (targetId === 'bar-forward') onNext()
  }, [onNext, onTryAgain])
  const finishedTouch = useMultiUserTouch(finishedTargets, activateFinishedTarget, ['try-again', 'save', 'next'])

  return (
    <motion.div
      key="finished"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.22 } }}
      transition={{ duration: 0.3 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Background glows */}
      <div style={{ position: 'absolute', left: -157, top: 1058, width: 2210, height: 715, transform: 'rotate(180deg)', zIndex: 0 }}>
        <img src={fEllipse161} alt="" style={{ position: 'absolute', inset: '-27.23% -8.81%', width: '100%', height: '100%', display: 'block' }} />
      </div>
      <div style={{ position: 'absolute', left: -157, top: -207, width: 2210, height: 207, transform: 'rotate(180deg)', zIndex: 0 }}>
        <img src={fEllipse160} alt="" style={{ position: 'absolute', inset: '-94.06% -8.81%', width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* Blurred next-song badges at top */}
      <div style={{
        position: 'absolute', left: 728, top: 73,
        width: 465,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        opacity: 0.60, filter: 'blur(6px)',
        zIndex: 5,
      }}>
        <div style={{
          width: 298, height: 54.111,
          background: 'linear-gradient(180deg, rgba(234,234,234,0.09) 0%, rgba(154,154,154,0.09) 100%)',
          borderRadius: 82.342, boxShadow: '0px 0px 10.014px 0px rgba(0,0,0,0.29)',
          opacity: 0.60, display: 'flex', alignItems: 'center', padding: '0 22.742px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11.763 }}>
            <div style={{ width: 40, height: 40, borderRadius: 6.274, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              <img src={fRect4} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <img src={fRect6} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <p style={{ fontFamily: sfPro, fontSize: 17.253, fontWeight: 700, color: '#fff', lineHeight: '21.958px', margin: 0 }}>Name 01</p>
              <p style={{ fontFamily: sfPro, fontSize: 13.332, fontWeight: 590, color: '#fff', lineHeight: '17.253px', opacity: 0.60, margin: 0 }}>Singer</p>
            </div>
          </div>
        </div>
        <div style={{
          width: '100%', height: 82.167,
          background: 'linear-gradient(180deg, rgba(234,234,234,0.09) 0%, rgba(154,154,154,0.09) 100%)',
          borderRadius: 112.232, boxShadow: '0px 0px 13.648px 0px rgba(0,0,0,0.29)',
          opacity: 0.80, display: 'flex', alignItems: 'center', padding: '0 30.997px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16.033 }}>
            <div style={{ width: 54, height: 54, borderRadius: 8.551, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              <img src={fRect4} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <img src={fRect5} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <p style={{ fontFamily: sfPro, fontSize: 23.515, fontWeight: 700, color: '#fff', margin: 0 }}>Name 01</p>
              <p style={{ fontFamily: sfPro, fontSize: 18.171, fontWeight: 590, color: '#fff', opacity: 0.60, margin: 0 }}>Singer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score card - centered */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          position: 'absolute',
          left: 'calc(50% - 653px)',
          top: 'calc(50% - 359px)',
          width: 1307, height: 655,
          background: 'linear-gradient(180deg, rgba(234,234,234,0.05) 0%, rgba(154,154,154,0.10) 100%)',
          borderRadius: 100,
          boxShadow: '0px 0px 43px 0px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 10,
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center', width: 706 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'center', width: '100%' }}>
            <p style={{
              fontFamily: sfPro, fontSize: 64, fontWeight: 510,
              color: '#fff', textAlign: 'center', lineHeight: 'normal',
              margin: 0,
            }}>You've finish the song</p>
            {/* Score: 98 + Point overlapping */}
            <div style={{ position: 'relative', display: 'inline-grid', placeItems: 'start', lineHeight: 0 }}>
              <p style={{
                gridColumn: 1, gridRow: 1,
                fontFamily: sfPro, fontSize: 128, fontWeight: 510,
                color: '#fff', textAlign: 'center',
                lineHeight: 'normal', margin: 0,
                width: 160,
              }}>98</p>
              <p style={{
                gridColumn: 1, gridRow: 1,
                fontFamily: sfPro, fontSize: 40, fontWeight: 510,
                color: '#fff', lineHeight: 'normal', margin: 0,
                marginLeft: 177, marginTop: 81,
                width: 110,
              }}>Point</p>
            </div>
          </div>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 20, height: 53, alignItems: 'flex-start', justifyContent: 'center', width: 565 }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onTryAgain}
              style={{
                flex: '1 0 0',
                height: 53,
                backdropFilter: 'blur(67.955px)',
                background: 'rgba(255,255,255,0.20)',
                borderRadius: 55,
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px 22px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontFamily: sfPro, fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: '28px', letterSpacing: '-0.26px', whiteSpace: 'nowrap' }}>Try again</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              style={{
                height: 53,
                backdropFilter: 'blur(67.955px)',
                background: 'rgba(255,255,255,0.20)',
                borderRadius: 55,
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px 22px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: sfPro, fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: '28px', letterSpacing: '-0.26px', whiteSpace: 'nowrap' }}>Save the memory</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              style={{
                height: 53,
                backdropFilter: 'blur(67.955px)',
                background: 'rgba(255,255,255,0.90)',
                borderRadius: 55,
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px 22px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: sfPro, fontSize: 22, fontWeight: 700, color: '#131111', lineHeight: '28px', letterSpacing: '-0.26px', whiteSpace: 'nowrap' }}>Next Song</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 27px)',
        top: 909,
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}>
        <BottomBar showTime />
      </div>

      {/* Memoji group pill at bottom */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 0.5px)',
        bottom: 68,
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}>
        <MemojiGroupPill m0={fMemoji} m1={fMemoji1} m2={fMemoji2} />
      </div>
      <MultiUserTouchFrames targets={finishedTargets} positions={finishedTouch.positions} active={finishedTouch.active} />
    </motion.div>
  )
}

/* ─── Main SingHomeScreen ────────────────────────────────── */
export default function SingHomeScreen({ members, groupName, onBack, initialStep = 'browser', song }: SingHomeProps) {
  const startsWithSingingGuidance = initialStep === 'singing-guide'
  const [step, setStep] = useState<SingStep>(initialStep === 'browser-guide' ? 'guide' : startsWithSingingGuidance ? 'singing' : 'browser')
  const [scale, setScale] = useState(1)
  const [selectedSongIdx, setSelectedSongIdx] = useState(0)

  // If a song was passed in from PartyScreen, use it directly; otherwise use SONG_LIST selection
  const activeSong = song ?? SONG_LIST[selectedSongIdx]

  const itunesData      = useItunesData(SONG_LIST)
  const singleTrack     = useItunesSingle(song?.title ?? '', song?.artist ?? '')
  const currentTrack    = song ? singleTrack : itunesData[selectedSongIdx]
  const lyricLines      = useLrclib(activeSong.title, activeSong.artist)

  useEffect(() => {
    const update = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(0,0,0,0.6)',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Scaled 1920×1080 canvas */}
      <div style={{
        position: 'relative',
        width: 1920, height: 1080,
        flexShrink: 0,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}>

      <AnimatePresence mode="wait">
        {step === 'guide' && (
          <GuideScreen
            key="guide"
            onContinue={() => setStep('browser')}
          />
        )}
        {step === 'browser' && (
          <BrowserScreen
            key="browser"
            onSingNow={(idx) => { setSelectedSongIdx(idx); setStep('singing') }}
            onBack={onBack}
            onSearch={() => setStep('search')}
            songs={SONG_LIST}
            artworks={itunesData.map(d => d.artwork)}
          />
        )}
        {step === 'search' && (
          <SearchScreen
            key="search"
            onBack={() => setStep('browser')}
            onSingNow={() => setStep('singing')}
          />
        )}
        {step === 'singing' && (
          <SingingScreen
            key="singing"
            onFinish={() => setStep('finished')}
            onBack={() => setStep('browser')}
            showGuidanceInitially={startsWithSingingGuidance}
            lyricLines={lyricLines}
            previewUrl={currentTrack?.previewUrl}
            songTitle={activeSong.title}
            songArtist={activeSong.artist}
            artworkUrl={currentTrack?.artwork}
          />
        )}
        {step === 'finished' && (
          <FinishedScreen
            key="finished"
            onTryAgain={() => setStep('singing')}
            onNext={() => setStep('browser')}
          />
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  )
}

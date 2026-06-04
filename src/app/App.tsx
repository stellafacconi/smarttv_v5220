import '../styles/tv.css'
import { useState, useCallback } from 'react'
import HomeScreen from './screens/HomeScreen'
import MultiUserHub from './screens/MultiUserHub'
import AddNewSelection from './overlays/AddNewSelection'
import GroupCreate from './overlays/GroupCreate'
import OnboardingScreen, { type Step as OnboardingStep } from './screens/OnboardingScreen'
import ContentScreen from './screens/ContentScreen'
import PartyScreen, { type SongInfo } from './screens/PartyScreen'
import SingHomeScreen from './screens/SingHomeScreen'
import type { IslandSelection } from './screens/MultiUserHub'

export type AppState = 'ONBOARDING' | 'HOME' | 'ADD_NEW_SELECTION' | 'GROUP_CREATE' | 'GROUP_HUB' | 'CONTENT' | 'PARTY' | 'SING_HOME'

export interface TVUser {
  id: number
  name: string
  color: string
}

export interface Profile {
  id: string
  name: string
  color: string
  type: 'single' | 'group'
  members?: { color: string }[]
}

const DEFAULT_PROFILES: Profile[] = [
  { id: 'p1', name: 'Marco',  color: '#ff375f', type: 'single' },
  { id: 'p2', name: 'Chiara', color: '#0a84ff', type: 'single' },
  {
    id: 'g1', name: 'Family', color: '#ff375f', type: 'group',
    members: [{ color: '#ff375f' }, { color: '#0a84ff' }],
  },
]

export default function App() {
  const [screen,          setScreen]          = useState<AppState>('ONBOARDING')
  const [profiles,        setProfiles]        = useState<Profile[]>(DEFAULT_PROFILES)
  const [activeProfileId, setActiveProfileId] = useState<string>('p1')
  const [activeGroupId,   setActiveGroupId]   = useState<string | null>(null)
  const [groupName,       setGroupName]       = useState('')
  const [selectedIsland,  setSelectedIsland]  = useState<IslandSelection | null>(null)
  const [isNewGroup,      setIsNewGroup]      = useState(false)
  const [singHomeEntry,   setSingHomeEntry]   = useState<'browser' | 'browser-guide' | 'singing-guide'>('browser')
  const [onboardingStep,  setOnboardingStep]  = useState<OnboardingStep>('splash')
  const [partyBackTarget, setPartyBackTarget] = useState<AppState>('HOME')
  const [selectedSong,    setSelectedSong]    = useState<SongInfo | undefined>(undefined)

  const navigate = useCallback((to: AppState) => setScreen(to), [])

  const activeProfile = profiles.find(p => p.id === activeProfileId) ?? profiles[0]
  const activeGroup   = activeGroupId ? profiles.find(p => p.id === activeGroupId) : null

  const handleSelectProfile = (p: Profile) => {
    setActiveProfileId(p.id)
    setScreen('HOME')
  }

  const handleSelectGroup = (p: Profile) => {
    setActiveGroupId(p.id)
    setGroupName(p.name)
    setIsNewGroup(false)   // existing group → skip intro
    setScreen('PARTY')
  }

  const handleGroupCreated = (name: string, members: { color: string }[]) => {
    const newGroup: Profile = {
      id: `g${Date.now()}`,
      name: name || 'New Group',
      color: members[0]?.color ?? '#34c759',
      type: 'group',
      members,
    }
    setProfiles(prev => [...prev, newGroup])
    setActiveGroupId(newGroup.id)
    setGroupName(newGroup.name)
    setIsNewGroup(true)    // new group → show intro sequence
    setScreen('PARTY')
  }

  const handleStartPartyGroupCreation = useCallback(() => {
    handleGroupCreated('Group', [
      { color: '#34c759' },
      { color: '#ff375f' },
      { color: '#0a84ff' },
    ])
  }, [])

  const handleIslandSelect = useCallback((island: IslandSelection) => {
    setSelectedIsland(island)
    setScreen('CONTENT')
  }, [])

  const handlePartyClose  = useCallback(() => navigate('HOME'),      [navigate])
  const handlePartySing   = useCallback((entry: 'browser' | 'browser-guide' | 'singing-guide' = 'browser', song?: SongInfo) => {
    setIsNewGroup(false)
    setSelectedSong(song)
    setSingHomeEntry(entry)
    navigate('SING_HOME')
  }, [navigate])
  const handleSingBack    = useCallback(() => {
    setIsNewGroup(false)
    navigate('PARTY')
  }, [navigate])
  const noop = useCallback(() => {}, [])

  /* Resolve real names for group members */
  const namedHubUsers: TVUser[] = activeGroup?.members
    ? activeGroup.members.map((m, i) => {
        const match = profiles.find(p => p.type === 'single' && p.color === m.color)
        return { id: i + 1, name: match?.name ?? `User ${i + 1}`, color: m.color }
      })
    : [{ id: 1, name: activeProfile.name, color: activeProfile.color }]

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div className="tv-bg" />

      {screen === 'ONBOARDING' && (
        <OnboardingScreen
          initialStep={onboardingStep}
          onStepChange={setOnboardingStep}
          onComplete={(profileId) => {
            if (profileId === 'family') {
              setActiveGroupId('g1')
              setGroupName('Family')
              setScreen('PARTY')
            } else {
              setScreen('HOME')
            }
          }}
          onCreateGroup={() => {
            setPartyBackTarget('ONBOARDING')
            handleStartPartyGroupCreation()
          }}
        />
      )}

      {screen === 'HOME' && (
        <HomeScreen
          profiles={profiles}
          activeProfileId={activeProfileId}
          onSelectProfile={handleSelectProfile}
          onSelectGroup={handleSelectGroup}
          onAddNew={() => navigate('ADD_NEW_SELECTION')}
          onPartyMode={() => {
            setPartyBackTarget('HOME')
            handleStartPartyGroupCreation()
          }}
        />
      )}

      {screen === 'ADD_NEW_SELECTION' && (
        <AddNewSelection
          onBack={() => navigate('HOME')}
          onSingle={() => navigate('HOME')}
          onGroup={() => {
            setPartyBackTarget('ADD_NEW_SELECTION')
            handleStartPartyGroupCreation()
          }}
        />
      )}

      {screen === 'GROUP_CREATE' && (
        <GroupCreate
          onBack={() => navigate('ADD_NEW_SELECTION')}
          onCreated={handleGroupCreated}
        />
      )}

      {screen === 'PARTY' && (
        <PartyScreen
          hasGroup={!isNewGroup}
          members={activeGroup?.members ?? []}
          groupName={groupName}
          onClose={handlePartyClose}
          onGroupCreated={noop}
          onSingHome={handlePartySing}
          onBack={() => setScreen(partyBackTarget)}
        />
      )}

      {screen === 'SING_HOME' && (
        <SingHomeScreen
          members={activeGroup?.members ?? []}
          groupName={groupName}
          onBack={handleSingBack}
          initialStep={singHomeEntry}
          song={selectedSong}
        />
      )}

      {screen === 'GROUP_HUB' && (
        <MultiUserHub
          groupName={groupName}
          users={namedHubUsers}
          onBack={() => navigate('HOME')}
          onIslandSelect={handleIslandSelect}
        />
      )}

      {screen === 'CONTENT' && selectedIsland && (
        <ContentScreen
          islandId={selectedIsland.id}
          islandLabel={selectedIsland.label}
          IslandIcon={selectedIsland.Icon}
          users={namedHubUsers}
          groupName={groupName}
          onBack={() => navigate('GROUP_HUB')}
        />
      )}
    </div>
  )
}

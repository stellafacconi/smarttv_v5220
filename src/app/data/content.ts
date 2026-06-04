/* ═══════════════════════════════════════════════════════════════
   Content library — YouTube-backed
   Thumbnails: https://img.youtube.com/vi/{id}/maxresdefault.jpg
═══════════════════════════════════════════════════════════════ */

export interface ContentItem {
  id: string
  title: string
  subtitle?: string
  year: number
  genres: string[]
  type: 'film' | 'series' | 'music' | 'sing' | 'relax' | 'podcast' | 'live' | 'games'
  youtubeId: string
  duration?: string
  featured?: boolean
}

export const CONTENT_LIBRARY: ContentItem[] = [
  /* ── FILM ── */
  { id:'f1',  title:'Oppenheimer',              year:2023, genres:['Drama','History'],      type:'film',   youtubeId:'uYPbbksJxIg', duration:'3h',      featured:true  },
  { id:'f2',  title:'Dune: Part Two',           year:2024, genres:['Sci-Fi','Adventure'],   type:'film',   youtubeId:'Way9Dexny3w', duration:'2h 47m',  featured:true  },
  { id:'f3',  title:'Top Gun: Maverick',        year:2022, genres:['Action','Drama'],       type:'film',   youtubeId:'giXco2jaZ_4', duration:'2h 11m'                  },
  { id:'f4',  title:'Interstellar',             year:2014, genres:['Sci-Fi','Drama'],       type:'film',   youtubeId:'zSWdZVtXT7E', duration:'2h 49m',  featured:true  },
  { id:'f5',  title:'Avatar: The Way of Water', year:2022, genres:['Sci-Fi','Adventure'],   type:'film',   youtubeId:'a8Gx8wiNbs8', duration:'3h 12m'                  },
  { id:'f6',  title:'The Batman',               year:2022, genres:['Action','Crime'],       type:'film',   youtubeId:'mqqft2x_Aa4', duration:'2h 56m'                  },
  { id:'f7',  title:'Poor Things',              year:2023, genres:['Drama','Fantasy'],      type:'film',   youtubeId:'RlbR5N6veqw', duration:'2h 21m'                  },
  { id:'f8',  title:'Barbie',                   year:2023, genres:['Comedy','Fantasy'],     type:'film',   youtubeId:'pBk4NYhWNMM', duration:'1h 54m',  featured:true  },
  { id:'f9',  title:'Past Lives',               year:2023, genres:['Drama','Romance'],      type:'film',   youtubeId:'J70OElABNVQ', duration:'1h 46m'                  },
  { id:'f10', title:'Killers of the Flower Moon',year:2023,genres:['Crime','History'],      type:'film',   youtubeId:'EP34Yoxs3FQ', duration:'3h 26m'                  },
  { id:'f11', title:'Everything Everywhere',    year:2022, genres:['Comedy','Sci-Fi'],      type:'film',   youtubeId:'wxN1T1uxQ2g', duration:'2h 19m'                  },
  { id:'f12', title:'The Holdovers',            year:2023, genres:['Drama','Comedy'],       type:'film',   youtubeId:'AhKLpJmHgfI', duration:'2h 13m'                  },

  /* ── SERIES ── */
  { id:'s1',  title:'The Last of Us',           year:2023, genres:['Drama','Horror'],       type:'series', youtubeId:'uLtkt8BonwM', duration:'S1',      featured:true  },
  { id:'s2',  title:'Succession',               year:2023, genres:['Drama','Comedy'],       type:'series', youtubeId:'OzYxJV_rmE8', duration:'S4'                      },
  { id:'s3',  title:'House of the Dragon',      year:2022, genres:['Fantasy','Drama'],      type:'series', youtubeId:'0J9N2MQUmjU', duration:'S2',      featured:true  },
  { id:'s4',  title:'Severance',                year:2022, genres:['Thriller','Sci-Fi'],    type:'series', youtubeId:'xEQP4VVuyrY', duration:'S2'                      },
  { id:'s5',  title:'The Bear',                 year:2022, genres:['Drama','Comedy'],       type:'series', youtubeId:'QzMKb4tQLTc', duration:'S3',      featured:true  },
  { id:'s6',  title:'Andor',                    year:2022, genres:['Sci-Fi','Action'],      type:'series', youtubeId:'Dcpbm6NhPec', duration:'S1'                      },
  { id:'s7',  title:'Slow Horses',              year:2022, genres:['Thriller','Drama'],     type:'series', youtubeId:'GMVxoJB2cEo', duration:'S4'                      },
  { id:'s8',  title:'Ripley',                   year:2024, genres:['Crime','Thriller'],     type:'series', youtubeId:'TNDKbPZbFGI', duration:'S1',      featured:true  },
  { id:'s9',  title:'Shogun',                   year:2024, genres:['Drama','History'],      type:'series', youtubeId:'iBoLEMKqHiI', duration:'S1'                      },
  { id:'s10', title:'The Gentlemen',            year:2024, genres:['Crime','Comedy'],       type:'series', youtubeId:'xD9hO2_1lJU', duration:'S1'                      },
  { id:'s11', title:'True Detective S4',        year:2024, genres:['Crime','Thriller'],     type:'series', youtubeId:'4nAKBnGKfb8', duration:'S4'                      },
  { id:'s12', title:'Mr. & Mrs. Smith',         year:2024, genres:['Action','Comedy'],      type:'series', youtubeId:'Pqwpu9V78tY', duration:'S1'                      },

  /* ── MUSIC ── */
  { id:'m1',  title:'As It Was',                subtitle:'Harry Styles',    year:2022, genres:['Pop'],          type:'music', youtubeId:'H5v3kku4y6Q', featured:true },
  { id:'m2',  title:'Flowers',                  subtitle:'Miley Cyrus',     year:2023, genres:['Pop'],          type:'music', youtubeId:'G7KNmW9a75Y'                },
  { id:'m3',  title:'Anti-Hero',                subtitle:'Taylor Swift',    year:2022, genres:['Pop'],          type:'music', youtubeId:'b1kbLwvqugk',  featured:true },
  { id:'m4',  title:'Levitating',               subtitle:'Dua Lipa',        year:2020, genres:['Pop','Disco'],  type:'music', youtubeId:'TUVcZfQe-Kw'                },
  { id:'m5',  title:'Blinding Lights',          subtitle:'The Weeknd',      year:2020, genres:['Synth-Pop'],    type:'music', youtubeId:'4NRXx6U8ABQ',  featured:true },
  { id:'m6',  title:'Bad Guy',                  subtitle:'Billie Eilish',   year:2019, genres:['Electropop'],   type:'music', youtubeId:'DyDfgMOUjCI'                },
  { id:'m7',  title:'Shape of You',             subtitle:'Ed Sheeran',      year:2017, genres:['Pop'],          type:'music', youtubeId:'JGwWNGJdvx8'                },
  { id:'m8',  title:'Watermelon Sugar',         subtitle:'Harry Styles',    year:2020, genres:['Pop'],          type:'music', youtubeId:'E07s5ZYygMg'                },
  { id:'m9',  title:'Peaches',                  subtitle:'Justin Bieber',   year:2021, genres:['Pop','R&B'],    type:'music', youtubeId:'tQ0yjYMIKAI'                },
  { id:'m10', title:'Stay',                     subtitle:'The Kid LAROI',   year:2021, genres:['Pop'],          type:'music', youtubeId:'kTJczUoc26U'                },
  { id:'m11', title:'Heat Waves',               subtitle:'Glass Animals',   year:2020, genres:['Indie','Pop'],  type:'music', youtubeId:'mRD0-GxqHVo'                },
  { id:'m12', title:'Cruel Summer',             subtitle:'Taylor Swift',    year:2019, genres:['Pop','Synth'],  type:'music', youtubeId:'ic8j13piAhQ'                },
  { id:'m13', title:'Espresso',                 subtitle:'Sabrina Carpenter',year:2024,genres:['Pop'],          type:'music', youtubeId:'BRSOgWIVQdQ', featured:true  },
  { id:'m14', title:'Vampire',                  subtitle:'Olivia Rodrigo',  year:2023, genres:['Pop','Rock'],   type:'music', youtubeId:'RlPNh_PBZb4'                },
  { id:'m15', title:'Rich Flex',                subtitle:'Drake & 21 Savage',year:2022,genres:['Hip-Hop'],      type:'music', youtubeId:'oHG57GWtWms'                },
  { id:'m16', title:'unholy',                   subtitle:'Sam Smith',       year:2022, genres:['Pop'],          type:'music', youtubeId:'Uq9gPaIzbe8'                },
  { id:'m17', title:'Miley Cyrus - Used to Be Young',subtitle:'Miley Cyrus',year:2023,genres:['Pop'],           type:'music', youtubeId:'TDWex-UUMTs'                },
  { id:'m18', title:'One of the Girls',         subtitle:'The Weeknd',      year:2023, genres:['Pop','R&B'],    type:'music', youtubeId:'nXBFaJ-CbUs'                },
  { id:'m19', title:'Shake It Off',             subtitle:'Taylor Swift',    year:2014, genres:['Pop'],          type:'music', youtubeId:'nfWlot6h_JM'                },
  { id:'m20', title:'Lose Yourself',            subtitle:'Eminem',          year:2002, genres:['Hip-Hop'],      type:'music', youtubeId:'_Yhyp-_hX2s'                },
  { id:'m21', title:'Rolling in the Deep',      subtitle:'Adele',           year:2010, genres:['Soul','Pop'],   type:'music', youtubeId:'rYEDA3JcQqw', featured:true  },
  { id:'m22', title:'Uptown Funk',              subtitle:'Mark Ronson',     year:2014, genres:['Funk','Pop'],   type:'music', youtubeId:'OPf0YbXqDm0'                },
  { id:'m23', title:'Thinking Out Loud',        subtitle:'Ed Sheeran',      year:2014, genres:['Pop','Soul'],   type:'music', youtubeId:'lp-EO5I60KA'                },
  { id:'m24', title:'Stay With Me',             subtitle:'Sam Smith',       year:2014, genres:['Soul','Pop'],   type:'music', youtubeId:'pB-5XG-DbAA'                },

  /* ── SING ── */
  { id:'k1',  title:'Bohemian Rhapsody',        subtitle:'Queen',           year:1975, genres:['Rock'],         type:'sing', youtubeId:'fJ9rUzIMcZQ', featured:true },
  { id:'k2',  title:'Shallow',                  subtitle:'Lady Gaga',       year:2018, genres:['Pop'],          type:'sing', youtubeId:'bo_efYLyuK8', featured:true },
  { id:'k3',  title:"Don't Stop Me Now",        subtitle:'Queen',           year:1978, genres:['Rock'],         type:'sing', youtubeId:'HgzGwKwLmgM'               },
  { id:'k4',  title:"Livin' on a Prayer",       subtitle:'Bon Jovi',        year:1986, genres:['Rock'],         type:'sing', youtubeId:'lDK9QqIzhwk'               },
  { id:'k5',  title:'Sweet Caroline',           subtitle:'Neil Diamond',    year:1969, genres:['Pop'],          type:'sing', youtubeId:'1vhFnTjia_I'               },
  { id:'k6',  title:'Africa',                   subtitle:'Toto',            year:1981, genres:['Pop','Rock'],   type:'sing', youtubeId:'FTQbiNvZqaY'               },
  { id:'k7',  title:'Perfect',                  subtitle:'Ed Sheeran',      year:2017, genres:['Pop'],          type:'sing', youtubeId:'2Vv-BfVoq4g'               },
  { id:'k8',  title:'Take On Me',               subtitle:'a-ha',            year:1985, genres:['Pop','Synth'],  type:'sing', youtubeId:'djV11Xbc914'               },
  { id:'k9',  title:'I Will Always Love You',   subtitle:'Whitney Houston', year:1992, genres:['Pop','Soul'],   type:'sing', youtubeId:'3JWTaaS7LdU', featured:true },
  { id:'k10', title:"Somebody That I Used to Know", subtitle:'Gotye',       year:2011, genres:['Indie'],        type:'sing', youtubeId:'8UVNT4wvIGY'               },
  { id:'k11', title:'Mr. Brightside',           subtitle:'The Killers',     year:2003, genres:['Rock','Indie'], type:'sing', youtubeId:'gGdGFtwCNBE'               },
  { id:'k12', title:'September',                subtitle:'Earth Wind & Fire',year:1978,genres:['Funk','Soul'],  type:'sing', youtubeId:'Gs069dndIYk'               },
  { id:'k13', title:'Dancing Queen',            subtitle:'ABBA',            year:1976, genres:['Pop','Disco'],  type:'sing', youtubeId:'xFrGuyw1V8s'               },
  { id:'k14', title:'Total Eclipse of the Heart',subtitle:'Bonnie Tyler',   year:1983, genres:['Rock'],         type:'sing', youtubeId:'lcOxhH8N3Bo'               },
  { id:'k15', title:'I Want It That Way',       subtitle:'Backstreet Boys', year:1999, genres:['Pop'],          type:'sing', youtubeId:'4fndeDfaWCg'               },
  { id:'k16', title:'Wonderwall',               subtitle:'Oasis',           year:1995, genres:['Rock','Indie'], type:'sing', youtubeId:'bx1Bh8ZvH84'               },
  { id:'k17', title:"Don't You Want Me",        subtitle:'Human League',    year:1981, genres:['Synth-Pop'],    type:'sing', youtubeId:'uPudE8nDog0'               },
  { id:'k18', title:'Roxanne',                  subtitle:'The Police',      year:1978, genres:['Rock'],         type:'sing', youtubeId:'3T1c7GkzRQQ'               },
  { id:'k19', title:'Since U Been Gone',        subtitle:'Kelly Clarkson',  year:2004, genres:['Pop','Rock'],   type:'sing', youtubeId:'R7UrFYvl5TE'               },
  { id:'k20', title:'Killing Me Softly',        subtitle:'Fugees',          year:1996, genres:['Soul','R&B'],   type:'sing', youtubeId:'4QX7PpAGhJ0'               },
  { id:'k21', title:'Hallelujah',               subtitle:'Jeff Buckley',    year:1994, genres:['Folk','Rock'],  type:'sing', youtubeId:'y8AWFf7EAc4', featured:true },
  { id:'k22', title:'Angels',                   subtitle:'Robbie Williams', year:1997, genres:['Pop'],          type:'sing', youtubeId:'qCkIjpP3yT4'               },
  { id:'k23', title:"Don't Stop Believin'",     subtitle:'Journey',         year:1981, genres:['Rock'],         type:'sing', youtubeId:'1k8craCGpgs'               },
  { id:'k24', title:'Uptown Funk',              subtitle:'Mark Ronson ft. Bruno Mars', year:2014, genres:['Funk','Pop'], type:'sing', youtubeId:'OPf0YbXqDm0' }  ,

  /* ── RELAX ── */
  { id:'r1',  title:'Ocean Waves',              subtitle:'4K Coastal',      year:2024, genres:['Ambient'],      type:'relax', youtubeId:'bn9F19Hi1Lk', featured:true },
  { id:'r2',  title:'Nordic Fireplace',         subtitle:'Cozy Winter',     year:2024, genres:['ASMR'],         type:'relax', youtubeId:'zkYbmNHCCFI'               },
  { id:'r3',  title:'Lofi Hip Hop',             subtitle:'Study Beats',     year:2024, genres:['Lo-fi'],        type:'relax', youtubeId:'jfKfPfyJRdk', featured:true },
  { id:'r4',  title:'Rainy Day Café',           subtitle:'Paris Ambience',  year:2024, genres:['ASMR'],         type:'relax', youtubeId:'2gliGzb2_1I'               },
  { id:'r5',  title:'Mountain Forest',          subtitle:'4K Nature',       year:2024, genres:['Nature'],       type:'relax', youtubeId:'V_IeNFEbHfI'               },
  { id:'r6',  title:'Zen Garden',               subtitle:'Meditation',      year:2024, genres:['Spa'],          type:'relax', youtubeId:'sGNGGCSaYCo'               },
  { id:'r7',  title:'Thunderstorm Sleep',       subtitle:'Deep Relaxation', year:2024, genres:['ASMR'],         type:'relax', youtubeId:'nMfPqeZjc2c'               },
  { id:'r8',  title:'Campfire Night',           subtitle:'Forest Sounds',   year:2024, genres:['Ambient'],      type:'relax', youtubeId:'UgHKb_7884o'               },
  { id:'r9',  title:'Underwater Dreams',        subtitle:'Ocean Floor',     year:2024, genres:['Ambient'],      type:'relax', youtubeId:'3stU1JtKZCg'               },
  { id:'r10', title:'Spring Cherry Blossoms',   subtitle:'Japan 4K',        year:2024, genres:['Nature'],       type:'relax', youtubeId:'Y0MOHuvfSXk'               },
  { id:'r11', title:'Dark Screen Lofi',         subtitle:'Late Night',      year:2024, genres:['Lo-fi'],        type:'relax', youtubeId:'DWcJFNfaw9c'               },
  { id:'r12', title:'Tibetan Singing Bowls',    subtitle:'Sound Bath',      year:2024, genres:['Spa'],          type:'relax', youtubeId:'FSZ_7S_7D2Q'               },
  { id:'r13', title:'Snowy Cabin Window',       subtitle:'Winter Bliss',    year:2024, genres:['ASMR'],         type:'relax', youtubeId:'8Z9MTMa_bVU'               },
  { id:'r14', title:'Japanese Garden Rain',     subtitle:'Kyoto Ambience',  year:2024, genres:['Ambient'],      type:'relax', youtubeId:'bgckHFButG0'               },
  { id:'r15', title:'Desert Sunset',            subtitle:'4K Sahara',       year:2024, genres:['Nature'],       type:'relax', youtubeId:'xNN7iTA57jM'               },
  { id:'r16', title:'Coffee Shop Jazz',         subtitle:'Rainy Window',    year:2024, genres:['Jazz'],         type:'relax', youtubeId:'VMAPTo7RVCo', featured:true },

  /* ── PODCAST ── */
  { id:'p1',  title:'Joe Rogan #2054',          subtitle:'Elon Musk',       year:2024, genres:['Tech'],         type:'podcast', youtubeId:'dSrP4bQHoxM', featured:true },
  { id:'p2',  title:'Lex Fridman #400',         subtitle:'Sam Altman',      year:2024, genres:['Tech','AI'],    type:'podcast', youtubeId:'jvqFAi7vkBc'               },
  { id:'p3',  title:'Diary of a CEO',           subtitle:'Steve Jobs',      year:2023, genres:['Business'],     type:'podcast', youtubeId:'lEA4PWUkME4'               },
  { id:'p4',  title:'Hidden Brain',             subtitle:'Focus',           year:2023, genres:['Science'],      type:'podcast', youtubeId:'OwMRdPi1CqA'               },

  /* ── LIVE ── */
  { id:'l1',  title:'Champions League',         subtitle:'Live',            year:2024, genres:['Sports'],       type:'live', youtubeId:'AEjOUNE7Byg', featured:true },
  { id:'l2',  title:'Coachella 2024',           subtitle:'Live Stream',     year:2024, genres:['Music'],        type:'live', youtubeId:'K-ZCO7_mMIA'              },
  { id:'l3',  title:'Evening News',             subtitle:'Live Now',        year:2024, genres:['News'],         type:'live', youtubeId:'w_Ma8oQLmSM'              },
]

/* ── Helpers ── */

const ISLAND_TYPE_MAP: Record<string, ContentItem['type'][]> = {
  film:      ['film'],
  series:    ['series'],
  music:     ['music'],
  sing:      ['sing'],
  relax:     ['relax'],
  podcast:   ['podcast'],
  radio:     ['music'],
  live:      ['live'],
  games:     ['relax'],
  photobook: ['relax'],
}

/** Return ~48 items for an island, padding with shuffled repeats if needed */
export function getContentForIsland(islandId: string): ContentItem[] {
  const types = ISLAND_TYPE_MAP[islandId] ?? ['film']
  const base   = CONTENT_LIBRARY.filter(c => types.includes(c.type))
  const result = [...base]
  let pass = 1
  while (result.length < 48) {
    result.push(...base.map(c => ({ ...c, id: `${c.id}_${pass}` })))
    pass++
  }
  return result.slice(0, 48)
}

/** Rows for the home screen */
export function getContentRows(): { title: string; items: ContentItem[] }[] {
  return [
    { title: 'Consigliati per te',  items: CONTENT_LIBRARY.filter(c => c.featured) },
    { title: 'Film',                items: CONTENT_LIBRARY.filter(c => c.type === 'film') },
    { title: 'Serie TV',            items: CONTENT_LIBRARY.filter(c => c.type === 'series') },
    { title: 'Musica',              items: CONTENT_LIBRARY.filter(c => c.type === 'music') },
    { title: 'Canta Insieme',       items: CONTENT_LIBRARY.filter(c => c.type === 'sing') },
    { title: 'Relax & Benessere',   items: CONTENT_LIBRARY.filter(c => c.type === 'relax') },
  ]
}

/** YouTube thumbnail URL — hqdefault always exists, maxresdefault only for HD */
export function ytThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

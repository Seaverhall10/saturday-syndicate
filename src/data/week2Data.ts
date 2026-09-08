import type { Game, LeagueMember, Team, WeeklySlate } from '../types/pickem';

// Teams participating in Week 2 (Saturday, September 12, 2026)
export const WEEK_2_TEAMS: Record<string, Team> = {
  // SEC
  TEX: {
    id: 'tex',
    name: 'Texas Longhorns',
    shortName: 'Longhorns',
    abbreviation: 'TEX',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png',
    rank: 5,
    conference: 'SEC',
    record: '1-0',
    primaryColor: '#bf5700',
  },
  OU: {
    id: 'ou',
    name: 'Oklahoma Sooners',
    shortName: 'Sooners',
    abbreviation: 'OU',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/201.png',
    rank: 16,
    conference: 'SEC',
    record: '1-0',
    primaryColor: '#841617',
  },
  ALA: {
    id: 'bama',
    name: 'Alabama Crimson Tide',
    shortName: 'Crimson Tide',
    abbreviation: 'ALA',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
    rank: 13,
    conference: 'SEC',
    record: '1-0',
    primaryColor: '#9e1b32',
  },
  UK: {
    id: 'uk',
    name: 'Kentucky Wildcats',
    shortName: 'Wildcats',
    abbreviation: 'UK',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png',
    conference: 'SEC',
    record: '1-0',
    primaryColor: '#0033a0',
  },
  UGA: {
    id: 'uga',
    name: 'Georgia Bulldogs',
    shortName: 'Bulldogs',
    abbreviation: 'UGA',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png',
    rank: 3,
    conference: 'SEC',
    record: '1-0',
    primaryColor: '#ba0c2f',
  },
  LSU: {
    id: 'lsu',
    name: 'LSU Tigers',
    shortName: 'Tigers',
    abbreviation: 'LSU',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png',
    rank: 11,
    conference: 'SEC',
    record: '1-0',
    primaryColor: '#461d7c',
  },
  TENN: {
    id: 'tenn',
    name: 'Tennessee Volunteers',
    shortName: 'Volunteers',
    abbreviation: 'TENN',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png',
    rank: 15,
    conference: 'SEC',
    record: '1-0',
    primaryColor: '#ff8200',
  },
  MISS: {
    id: 'miss',
    name: 'Ole Miss Rebels',
    shortName: 'Rebels',
    abbreviation: 'MISS',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/145.png',
    rank: 9,
    conference: 'SEC',
    record: '1-0',
    primaryColor: '#ce1126',
  },
  AUB: {
    id: 'aub',
    name: 'Auburn Tigers',
    shortName: 'Tigers',
    abbreviation: 'AUB',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2.png',
    conference: 'SEC',
    record: '1-0',
    primaryColor: '#0c2340',
  },
  FLA: {
    id: 'fla',
    name: 'Florida Gators',
    shortName: 'Gators',
    abbreviation: 'FLA',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png',
    conference: 'SEC',
    record: '1-0',
    primaryColor: '#0021a5',
  },

  // BIG 12 & TCU SPECIAL
  TCU: {
    id: 'tcu',
    name: 'TCU Horned Frogs',
    shortName: 'Horned Frogs',
    abbreviation: 'TCU',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png',
    conference: 'Big 12',
    record: '1-0',
    primaryColor: '#4d1979',
  },
  OKST: {
    id: 'okst',
    name: 'Oklahoma State Cowboys',
    shortName: 'Cowboys',
    abbreviation: 'OKST',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/197.png',
    conference: 'Big 12',
    record: '1-0',
    primaryColor: '#ff7300',
  },

  // BIG TEN
  OSU: {
    id: 'osu',
    name: 'Ohio State Buckeyes',
    shortName: 'Buckeyes',
    abbreviation: 'OSU',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png',
    rank: 1,
    conference: 'Big Ten',
    record: '1-0',
    primaryColor: '#bb0000',
  },
  MICH: {
    id: 'mich',
    name: 'Michigan Wolverines',
    shortName: 'Wolverines',
    abbreviation: 'MICH',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png',
    rank: 10,
    conference: 'Big Ten',
    record: '1-0',
    primaryColor: '#00274c',
  },
  ORE: {
    id: 'ore',
    name: 'Oregon Ducks',
    shortName: 'Ducks',
    abbreviation: 'ORE',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2483.png',
    rank: 2,
    conference: 'Big Ten',
    record: '1-0',
    primaryColor: '#154733',
  },
  PSU: {
    id: 'psu',
    name: 'Penn State Nittany Lions',
    shortName: 'Nittany Lions',
    abbreviation: 'PSU',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/213.png',
    rank: 18,
    conference: 'Big Ten',
    record: '1-0',
    primaryColor: '#041e42',
  },

  // ACC
  GT: {
    id: 'gt',
    name: 'Georgia Tech Yellow Jackets',
    shortName: 'Yellow Jackets',
    abbreviation: 'GT',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/59.png',
    conference: 'ACC',
    record: '1-0',
    primaryColor: '#b3a369',
  },

  // NON-CONFERENCE / OPPONENTS
  GRAM: {
    id: 'gram',
    name: 'Grambling State Tigers',
    shortName: 'Tigers',
    abbreviation: 'GRAM',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2755.png',
    conference: 'FCS',
    record: '0-1',
  },
  WKU: {
    id: 'wku',
    name: 'Western Kentucky Hilltoppers',
    shortName: 'Hilltoppers',
    abbreviation: 'WKU',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/98.png',
    conference: 'C-USA',
    record: '1-0',
  },
  LT: {
    id: 'lt',
    name: 'Louisiana Tech Bulldogs',
    shortName: 'Bulldogs',
    abbreviation: 'LT',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2348.png',
    conference: 'C-USA',
    record: '1-0',
  },
  CLT: {
    id: 'clt',
    name: 'Charlotte 49ers',
    shortName: '49ers',
    abbreviation: 'CLT',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2429.png',
    conference: 'AAC',
    record: '0-1',
  },
  USM: {
    id: 'usm',
    name: 'Southern Miss Golden Eagles',
    shortName: 'Golden Eagles',
    abbreviation: 'USM',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2572.png',
    conference: 'Sun Belt',
    record: '1-0',
  },
  CAMP: {
    id: 'camp',
    name: 'Campbell Fighting Camels',
    shortName: 'Fighting Camels',
    abbreviation: 'CAMP',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2097.png',
    conference: 'FCS',
    record: '0-1',
  },
  TEM: {
    id: 'tem',
    name: 'Temple Owls',
    shortName: 'Owls',
    abbreviation: 'TEM',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/218.png',
    conference: 'AAC',
    record: '0-1',
  },

  // EXCLUDED CANDIDATE TEAMS (To demonstrate auto-select filtering out non-qualifying games)
  EMU: {
    id: 'emu',
    name: 'Eastern Michigan Eagles',
    shortName: 'Eagles',
    abbreviation: 'EMU',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2199.png',
    conference: 'MAC',
    record: '1-0',
  },
  BALL: {
    id: 'ball',
    name: 'Ball State Cardinals',
    shortName: 'Cardinals',
    abbreviation: 'BALL',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2050.png',
    conference: 'MAC',
    record: '0-1',
  },
};

// Realistic Kickoffs for Saturday, September 12, 2026
const satNoon = '2026-09-12T16:00:00Z'; // 12:00 PM ET
const satEarlyAft = '2026-09-12T16:45:00Z'; // 12:45 PM ET
const satAft = '2026-09-12T19:30:00Z'; // 3:30 PM ET
const satLateAft = '2026-09-12T21:30:00Z'; // 5:30 PM ET
const satEarlyEve = '2026-09-12T22:45:00Z'; // 6:45 PM ET
const satEve = '2026-09-12T23:00:00Z'; // 7:00 PM ET
const satPrime = '2026-09-12T23:30:00Z'; // 7:30 PM ET
const satLatePrime = '2026-09-12T23:45:00Z'; // 7:45 PM ET

// FULL WEEK 2 CANDIDATE POOL (Contains Top 25, SEC, TCU, and non-qualifying candidates)
export const WEEK_2_CANDIDATE_POOL: Game[] = [
  // 1. #1 Ohio State @ #5 Texas (NATIONAL GAME OF THE YEAR • ABC PRIMETIME TIEBREAKER)
  {
    id: 'w2-game-1',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satPrime,
    awayTeam: WEEK_2_TEAMS.OSU,
    homeTeam: WEEK_2_TEAMS.TEX,
    spread: 2.5, // Ohio State favored by 2.5 on the road (positive = away favored)
    overUnder: 56.5,
    status: 'pre',
    isTiebreaker: true,
    spreadLocked: true,
    curationReasons: ['⭐ Top 25 Clash (#1 @ #5)', '🏈 SEC Matchup (Longhorns)'],
    location: {
      stadium: 'DKR-Texas Memorial Stadium',
      city: 'Austin',
      state: 'TX',
    },
    weather: {
      temperature: 84,
      condition: 'Clear Night',
      windMph: 7,
      icon: 'sun',
    },
    notes: [
      { id: 'w2-n1', category: 'rivalry', text: 'Top 5 Mega-Clash • Primetime on ABC • Tiebreaker Game', impact: 'high' },
      { id: 'w2-n2', category: 'intel', text: 'Over 102,000 in Austin • Winner instantly takes #1 national ranking', impact: 'high' },
    ],
  },

  // 2. #16 Oklahoma (SEC) @ #10 Michigan (Big Ten) (Noon Kickoff Showcase)
  {
    id: 'w2-game-2',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satNoon,
    awayTeam: WEEK_2_TEAMS.OU,
    homeTeam: WEEK_2_TEAMS.MICH,
    spread: -3.5, // Michigan -3.5 at The Big House
    overUnder: 49.5,
    status: 'pre',
    spreadLocked: true,
    curationReasons: ['⭐ Top 25 Clash (#16 @ #10)', '🏈 SEC Matchup (Sooners)'],
    location: {
      stadium: 'Michigan Stadium ("The Big House")',
      city: 'Ann Arbor',
      state: 'MI',
    },
    weather: {
      temperature: 71,
      condition: 'Sunny & Crisp',
      windMph: 8,
      icon: 'sun',
    },
    notes: [
      { id: 'w2-n3', category: 'intel', text: 'SEC vs Big Ten Marquee Showcase on FOX', impact: 'high' },
      { id: 'w2-n4', category: 'intel', text: 'Over 107,000 at The Big House', impact: 'info' },
    ],
  },

  // 3. #13 Alabama (SEC) @ Kentucky (SEC) (SEC Conference Opener)
  {
    id: 'w2-game-3',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satAft,
    awayTeam: WEEK_2_TEAMS.ALA,
    homeTeam: WEEK_2_TEAMS.UK,
    spread: 10.5, // Alabama favored by 10.5 on the road
    overUnder: 51.5,
    status: 'pre',
    spreadLocked: true,
    curationReasons: ['⭐ Top 25 (#13 Crimson Tide)', '🏈 SEC Conference Clash'],
    location: {
      stadium: 'Kroger Field',
      city: 'Lexington',
      state: 'KY',
    },
    weather: {
      temperature: 75,
      condition: 'Partly Cloudy',
      windMph: 6,
      icon: 'cloud',
    },
    notes: [
      { id: 'w2-n5', category: 'rivalry', text: 'SEC Conference Opener on ABC', impact: 'high' },
      { id: 'w2-n6', category: 'intel', text: 'Alabama first true conference road test of 2026', impact: 'medium' },
    ],
  },

  // 4. #15 Tennessee (SEC) @ Georgia Tech (ACC)
  {
    id: 'w2-game-4',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satEve,
    awayTeam: WEEK_2_TEAMS.TENN,
    homeTeam: WEEK_2_TEAMS.GT,
    spread: 7.5, // Tennessee favored by 7.5
    overUnder: 58.0,
    status: 'pre',
    spreadLocked: true,
    curationReasons: ['⭐ Top 25 (#15 Volunteers)', '🏈 SEC Matchup (Volunteers)'],
    location: {
      stadium: 'Bobby Dodd Stadium',
      city: 'Atlanta',
      state: 'GA',
    },
    weather: {
      temperature: 78,
      condition: 'Clear Skies',
      windMph: 5,
      icon: 'sun',
    },
    notes: [
      { id: 'w2-n7', category: 'rivalry', text: 'Battle for Tech Tower • Historic Regional Border Rivalry on ESPN', impact: 'high' },
      { id: 'w2-n8', category: 'intel', text: 'Tennessee offense generated 512 total yards in Week 1', impact: 'info' },
    ],
  },

  // 5. Grambling State @ TCU Horned Frogs (MANDATORY TCU INCLUSION!)
  {
    id: 'w2-game-5',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satEve,
    awayTeam: WEEK_2_TEAMS.GRAM,
    homeTeam: WEEK_2_TEAMS.TCU,
    spread: -34.5, // TCU favored by 34.5
    overUnder: 62.0,
    status: 'pre',
    isCustomSpread: true,
    spreadLocked: true,
    curationReasons: ['🐸 TCU Special'],
    location: {
      stadium: 'Amon G. Carter Stadium',
      city: 'Fort Worth',
      state: 'TX',
    },
    weather: {
      temperature: 86,
      condition: 'Warm Texas Sunset',
      windMph: 9,
      icon: 'sun',
    },
    notes: [
      { id: 'w2-n9', category: 'intel', text: 'TCU Home Opener in Fort Worth • Hypnotoad return', impact: 'high' },
      { id: 'w2-n10', category: 'intel', text: 'Frogs coming off Dublin Ireland international season opener', impact: 'info' },
    ],
  },

  // 6. Western Kentucky @ #3 Georgia (SEC)
  {
    id: 'w2-game-6',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satEarlyAft,
    awayTeam: WEEK_2_TEAMS.WKU,
    homeTeam: WEEK_2_TEAMS.UGA,
    spread: -31.5, // Georgia -31.5
    overUnder: 54.5,
    status: 'pre',
    spreadLocked: true,
    curationReasons: ['⭐ Top 25 (#3 Bulldogs)', '🏈 SEC Matchup (Bulldogs)'],
    location: {
      stadium: 'Sanford Stadium',
      city: 'Athens',
      state: 'GA',
    },
    weather: {
      temperature: 83,
      condition: 'Humid & Sunny',
      windMph: 5,
      icon: 'sun',
    },
    notes: [
      { id: 'w2-n11', category: 'intel', text: 'Between the Hedges • Georgia home opener on SEC Network', impact: 'info' },
      { id: 'w2-n12', category: 'intel', text: 'Kirby Smart defense held Clemson to 3 points in 2025 simulator', impact: 'high' },
    ],
  },

  // 7. Louisiana Tech @ #11 LSU (SEC)
  {
    id: 'w2-game-7',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satPrime,
    awayTeam: WEEK_2_TEAMS.LT,
    homeTeam: WEEK_2_TEAMS.LSU,
    spread: -24.5, // LSU -24.5
    overUnder: 57.5,
    status: 'pre',
    spreadLocked: true,
    curationReasons: ['⭐ Top 25 (#11 Tigers)', '🏈 SEC Matchup (Tigers)'],
    location: {
      stadium: 'Tiger Stadium ("Death Valley")',
      city: 'Baton Rouge',
      state: 'LA',
    },
    weather: {
      temperature: 81,
      condition: 'Humid Night',
      windMph: 4,
      icon: 'sun',
    },
    notes: [
      { id: 'w2-n13', category: 'rivalry', text: 'Louisiana In-State Clash under the lights of Death Valley', impact: 'medium' },
    ],
  },

  // 8. #2 Oregon @ Oklahoma State
  {
    id: 'w2-game-8',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satNoon,
    awayTeam: WEEK_2_TEAMS.ORE,
    homeTeam: WEEK_2_TEAMS.OKST,
    spread: 14.5, // Oregon favored by 14.5
    overUnder: 65.5,
    status: 'pre',
    spreadLocked: true,
    curationReasons: ['⭐ Top 25 (#2 Ducks)'],
    location: {
      stadium: 'Boone Pickens Stadium',
      city: 'Stillwater',
      state: 'OK',
    },
    weather: {
      temperature: 79,
      condition: 'Breezy & Sunny',
      windMph: 12,
      icon: 'wind',
    },
    notes: [
      { id: 'w2-n14', category: 'intel', text: 'Dan Lanning Ducks on the road in Big 12 territory', impact: 'high' },
      { id: 'w2-n15', category: 'weather', text: '12-15 mph sustained wind gusts in Stillwater', impact: 'medium' },
    ],
  },

  // 9. Charlotte @ #9 Ole Miss (SEC)
  {
    id: 'w2-game-9',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satEarlyEve,
    awayTeam: WEEK_2_TEAMS.CLT,
    homeTeam: WEEK_2_TEAMS.MISS,
    spread: -38.5, // Ole Miss -38.5
    overUnder: 60.5,
    status: 'pre',
    spreadLocked: true,
    curationReasons: ['⭐ Top 25 (#9 Rebels)', '🏈 SEC Matchup (Rebels)'],
    location: {
      stadium: 'Vaught-Hemingway Stadium',
      city: 'Oxford',
      state: 'MS',
    },
    weather: {
      temperature: 79,
      condition: 'Clear Evening',
      windMph: 5,
      icon: 'sun',
    },
    notes: [
      { id: 'w2-n16', category: 'intel', text: 'Lane Kiffin offense eyeing 50+ points in Oxford', impact: 'info' },
    ],
  },

  // 10. Southern Miss @ Auburn (SEC)
  {
    id: 'w2-game-10',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satLatePrime,
    awayTeam: WEEK_2_TEAMS.USM,
    homeTeam: WEEK_2_TEAMS.AUB,
    spread: -21.5, // Auburn -21.5
    overUnder: 50.0,
    status: 'pre',
    spreadLocked: true,
    curationReasons: ['🏈 SEC Matchup (Auburn Tigers)'],
    location: {
      stadium: 'Jordan-Hare Stadium',
      city: 'Auburn',
      state: 'AL',
    },
    weather: {
      temperature: 77,
      condition: 'Clear Night',
      windMph: 4,
      icon: 'sun',
    },
    notes: [
      { id: 'w2-n17', category: 'intel', text: 'Jordan-Hare under the lights on SEC Network', impact: 'info' },
    ],
  },

  // 11. Campbell @ Florida (SEC)
  {
    id: 'w2-game-11',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satLateAft,
    awayTeam: WEEK_2_TEAMS.CAMP,
    homeTeam: WEEK_2_TEAMS.FLA,
    spread: -36.5, // Florida -36.5
    overUnder: 53.5,
    status: 'pre',
    spreadLocked: true,
    curationReasons: ['🏈 SEC Matchup (Florida Gators)'],
    location: {
      stadium: 'Ben Hill Griffin Stadium ("The Swamp")',
      city: 'Gainesville',
      state: 'FL',
    },
    weather: {
      temperature: 85,
      condition: 'Hot & Humid Swamp Heat',
      windMph: 6,
      icon: 'sun',
    },
    notes: [
      { id: 'w2-n18', category: 'weather', text: 'Swamp humidity index 94°F at kickoff', impact: 'medium' },
    ],
  },

  // 12. #18 Penn State @ Temple
  {
    id: 'w2-game-12',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satAft,
    awayTeam: WEEK_2_TEAMS.PSU,
    homeTeam: WEEK_2_TEAMS.TEM,
    spread: 28.5, // Penn State favored by 28.5 on the road
    overUnder: 48.5,
    status: 'pre',
    spreadLocked: true,
    curationReasons: ['⭐ Top 25 (#18 Nittany Lions)'],
    location: {
      stadium: 'Lincoln Financial Field',
      city: 'Philadelphia',
      state: 'PA',
    },
    weather: {
      temperature: 73,
      condition: 'Sunny & Mild',
      windMph: 8,
      icon: 'sun',
    },
    notes: [
      { id: 'w2-n19', category: 'rivalry', text: 'Keystone State Clash at the Linc in Philadelphia', impact: 'medium' },
      { id: 'w2-n20', category: 'intel', text: 'Over 40,000 Penn State fans traveling to Philly', impact: 'info' },
    ],
  },

  // NON-QUALIFYING CANDIDATE: Ball State @ Eastern Michigan (MAC Matchup - neither Top 25, nor SEC, nor TCU)
  {
    id: 'w2-cand-1',
    league: 'CFB',
    season: 2026,
    week: 2,
    kickoffTime: satNoon,
    awayTeam: WEEK_2_TEAMS.BALL,
    homeTeam: WEEK_2_TEAMS.EMU,
    spread: -2.5,
    overUnder: 44.5,
    status: 'pre',
    location: {
      stadium: 'Rynearson Stadium ("The Factory")',
      city: 'Ypsilanti',
      state: 'MI',
    },
  },
];

// The 12 official Curated Games for Week 2 (Top 25 + SEC + TCU)
export const WEEK_2_CURATED_GAMES: Game[] = WEEK_2_CANDIDATE_POOL.filter(
  (g) => g.id.startsWith('w2-game-')
);

export const WEEK_2_SLATE: WeeklySlate = {
  id: '2026-week-2',
  season: 2026,
  week: 2,
  title: 'Week 2 Next Week - Top 25, SEC & TCU Slate',
  lineFreezeTime: satNoon,
  isFrozen: false,
  curationCriteria: 'Top 25 Teams + All SEC Games + TCU Horned Frogs',
  games: WEEK_2_CURATED_GAMES,
};

export const WEEK_2_MEMBERS: LeagueMember[] = [
  {
    id: 'user-current',
    name: 'You (Seaver)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isCurrentUser: true,
    isCommissioner: true,
    weeklyWins: 0,
    weeklyLosses: 0,
    weeklyPushes: 0,
    seasonWins: 6,
    seasonLosses: 2,
    seasonPushes: 0,
    tiebreakerPoints: 58,
    picks: {
      'w2-game-1': { selectedTeamId: 'tex' }, // Texas +2.5
      'w2-game-2': { selectedTeamId: 'mich' }, // Michigan -3.5
      'w2-game-3': { selectedTeamId: 'bama' }, // Alabama -10.5
      'w2-game-4': { selectedTeamId: 'tenn' }, // Tennessee -7.5
      'w2-game-5': { selectedTeamId: 'tcu' }, // TCU -34.5
      'w2-game-6': { selectedTeamId: 'uga' }, // Georgia -31.5
      'w2-game-7': { selectedTeamId: 'lsu' }, // LSU -24.5
      'w2-game-8': { selectedTeamId: 'ore' }, // Oregon -14.5
      'w2-game-9': { selectedTeamId: 'miss' }, // Ole Miss -38.5
      'w2-game-10': { selectedTeamId: 'aub' }, // Auburn -21.5
      'w2-game-11': { selectedTeamId: 'fla' }, // Florida -36.5
      'w2-game-12': { selectedTeamId: 'psu' }, // Penn State -28.5
    },
  },
  {
    id: 'user-dave',
    name: 'Dave Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    weeklyWins: 0,
    weeklyLosses: 0,
    weeklyPushes: 0,
    seasonWins: 5,
    seasonLosses: 3,
    seasonPushes: 0,
    tiebreakerPoints: 52,
    picks: {
      'w2-game-1': { selectedTeamId: 'osu' }, // Ohio State -2.5
      'w2-game-2': { selectedTeamId: 'ou' }, // Oklahoma +3.5
      'w2-game-3': { selectedTeamId: 'bama' },
      'w2-game-4': { selectedTeamId: 'gt' },
      'w2-game-5': { selectedTeamId: 'tcu' },
      'w2-game-6': { selectedTeamId: 'uga' },
      'w2-game-7': { selectedTeamId: 'lt' },
      'w2-game-8': { selectedTeamId: 'okst' },
      'w2-game-9': { selectedTeamId: 'miss' },
      'w2-game-10': { selectedTeamId: 'usm' },
      'w2-game-11': { selectedTeamId: 'fla' },
      'w2-game-12': { selectedTeamId: 'psu' },
    },
  },
  {
    id: 'user-sarah',
    name: 'Sarah Connor',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    weeklyWins: 0,
    weeklyLosses: 0,
    weeklyPushes: 0,
    seasonWins: 4,
    seasonLosses: 4,
    seasonPushes: 0,
    tiebreakerPoints: 63,
    picks: {
      'w2-game-1': { selectedTeamId: 'tex' },
      'w2-game-2': { selectedTeamId: 'mich' },
      'w2-game-3': { selectedTeamId: 'uk' },
      'w2-game-4': { selectedTeamId: 'tenn' },
      'w2-game-5': { selectedTeamId: 'tcu' },
      'w2-game-6': { selectedTeamId: 'wku' },
      'w2-game-7': { selectedTeamId: 'lsu' },
      'w2-game-8': { selectedTeamId: 'ore' },
      'w2-game-9': { selectedTeamId: 'clt' },
      'w2-game-10': { selectedTeamId: 'aub' },
      'w2-game-11': { selectedTeamId: 'camp' },
      'w2-game-12': { selectedTeamId: 'tem' },
    },
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    weeklyWins: 0,
    weeklyLosses: 0,
    weeklyPushes: 0,
    seasonWins: 5,
    seasonLosses: 3,
    seasonPushes: 0,
    tiebreakerPoints: 56,
    picks: {
      'w2-game-1': { selectedTeamId: 'osu' },
      'w2-game-2': { selectedTeamId: 'mich' },
      'w2-game-3': { selectedTeamId: 'bama' },
      'w2-game-4': { selectedTeamId: 'tenn' },
      'w2-game-5': { selectedTeamId: 'gram' },
      'w2-game-6': { selectedTeamId: 'uga' },
      'w2-game-7': { selectedTeamId: 'lsu' },
      'w2-game-8': { selectedTeamId: 'ore' },
      'w2-game-9': { selectedTeamId: 'miss' },
      'w2-game-10': { selectedTeamId: 'aub' },
      'w2-game-11': { selectedTeamId: 'fla' },
      'w2-game-12': { selectedTeamId: 'psu' },
    },
  },
];


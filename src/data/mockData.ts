import type { Game, LeagueMember, WeeklySlate } from '../types/pickem';

// High-resolution ESPN CDN team logos for real 2026 College Football Top 25
export const CFB_TEAMS = {
  OSU: { id: 'osu', name: 'Ohio State Buckeyes', shortName: 'Buckeyes', abbreviation: 'OSU', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png', rank: 1, record: '0-0' },
  BALL: { id: 'ball', name: 'Ball State Cardinals', shortName: 'Cardinals', abbreviation: 'BALL', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2050.png', record: '0-0' },

  ORE: { id: 'ore', name: 'Oregon Ducks', shortName: 'Ducks', abbreviation: 'ORE', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2483.png', rank: 2, record: '0-0' },
  BOISE: { id: 'boise', name: 'Boise State Broncos', shortName: 'Broncos', abbreviation: 'BOIS', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/68.png', record: '0-0' },

  UGA: { id: 'uga', name: 'Georgia Bulldogs', shortName: 'Bulldogs', abbreviation: 'UGA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png', rank: 3, record: '0-0' },
  TNST: { id: 'tnst', name: 'Tennessee State Tigers', shortName: 'Tigers', abbreviation: 'TNST', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2634.png', record: '0-0' },

  TEX: { id: 'tex', name: 'Texas Longhorns', shortName: 'Longhorns', abbreviation: 'TEX', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png', rank: 5, record: '0-0' },
  TXST: { id: 'txst', name: 'Texas State Bobcats', shortName: 'Bobcats', abbreviation: 'TXST', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/324.png', record: '0-0' },

  BAMA: { id: 'bama', name: 'Alabama Crimson Tide', shortName: 'Crimson Tide', abbreviation: 'ALA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png', rank: 13, record: '0-0' },
  ECU: { id: 'ecu', name: 'East Carolina Pirates', shortName: 'Pirates', abbreviation: 'ECU', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/151.png', record: '0-0' },

  LSU: { id: 'lsu', name: 'LSU Tigers', shortName: 'Tigers', abbreviation: 'LSU', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png', rank: 11, record: '0-0' },
  CLEM: { id: 'clem', name: 'Clemson Tigers', shortName: 'Tigers', abbreviation: 'CLEM', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/228.png', rank: 14, record: '0-0' },

  PSU: { id: 'psu', name: 'Penn State Nittany Lions', shortName: 'Nittany Lions', abbreviation: 'PSU', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/213.png', rank: 18, record: '0-0' },
  MRSH: { id: 'mrsh', name: 'Marshall Thundering Herd', shortName: 'Thundering Herd', abbreviation: 'MRSH', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/276.png', record: '0-0' },

  MISS: { id: 'miss', name: 'Ole Miss Rebels', shortName: 'Rebels', abbreviation: 'MISS', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/145.png', rank: 9, record: '0-0' },
  LOU: { id: 'lou', name: 'Louisville Cardinals', shortName: 'Cardinals', abbreviation: 'LOU', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/97.png', rank: 24, record: '0-0' },
};

// Realistic Kickoff Dates for Saturday, September 5, 2026
const satNoon = '2026-09-05T16:00:00Z'; // 12:00 PM ET
const satAfternoon = '2026-09-05T19:30:00Z'; // 3:30 PM ET
const satLate = '2026-09-05T20:00:00Z'; // 4:00 PM ET
const satPrimetime = '2026-09-05T23:30:00Z'; // 7:30 PM ET
const satNight = '2026-09-06T00:00:00Z'; // 8:00 PM ET
const sunShowcase = '2026-09-06T23:30:00Z'; // Sunday 7:30 PM ET

export const INITIAL_GAMES: Game[] = [
  // 1. Marshall @ No. 18 Penn State (Saturday Noon Kickoff)
  {
    id: 'game-1',
    league: 'CFB',
    season: 2026,
    week: 1,
    kickoffTime: satNoon,
    awayTeam: CFB_TEAMS.MRSH,
    homeTeam: CFB_TEAMS.PSU,
    spread: -24.5, // Penn State favored by 24.5
    overUnder: 51.5,
    status: 'pre',
    spreadLocked: true,
    location: {
      stadium: 'Beaver Stadium',
      city: 'University Park',
      state: 'PA',
    },
    weather: {
      temperature: 68,
      condition: 'Partly Cloudy',
      windMph: 7,
      icon: 'cloud',
    },
    notes: [
      { id: 'n1', category: 'intel', text: 'Season Opener in Happy Valley • 107,000+ expected', impact: 'info' },
      { id: 'n2', category: 'injury', text: 'Penn State starting DT Probable after training camp knee scope', impact: 'medium' },
    ],
  },

  // 2. Tennessee State @ No. 3 Georgia (Saturday Noon Kickoff)
  {
    id: 'game-2',
    league: 'CFB',
    season: 2026,
    week: 1,
    kickoffTime: satNoon,
    awayTeam: CFB_TEAMS.TNST,
    homeTeam: CFB_TEAMS.UGA,
    spread: -38.5, // Commish adjusted from CBS dumb -46.5 line!
    overUnder: 56.5,
    status: 'pre',
    isCustomSpread: true,
    spreadLocked: true,
    location: {
      stadium: 'Sanford Stadium',
      city: 'Athens',
      state: 'GA',
    },
    weather: {
      temperature: 82,
      condition: 'Sunny & Humid',
      windMph: 4,
      icon: 'sun',
    },
    notes: [
      { id: 'n3', category: 'intel', text: 'Commish adjusted spread from -46.5 to -38.5 to keep game competitive for pickers', impact: 'high' },
      { id: 'n4', category: 'rivalry', text: 'FCS vs FBS In-State Showcase', impact: 'info' },
    ],
  },

  // 3. Boise State @ No. 2 Oregon (Saturday 3:30 PM ET)
  {
    id: 'game-3',
    league: 'CFB',
    season: 2026,
    week: 1,
    kickoffTime: satAfternoon,
    awayTeam: CFB_TEAMS.BOISE,
    homeTeam: CFB_TEAMS.ORE,
    spread: -24.5, // Oregon favored by 24.5
    overUnder: 61.0,
    status: 'pre',
    spreadLocked: true,
    location: {
      stadium: 'Autzen Stadium',
      city: 'Eugene',
      state: 'OR',
    },
    weather: {
      temperature: 74,
      condition: 'Clear Skies',
      windMph: 5,
      icon: 'sun',
    },
    notes: [
      { id: 'n5', category: 'rivalry', text: 'Pacific Northwest Clash • Historic 2008 & 2009 Boise upsets', impact: 'high' },
      { id: 'n6', category: 'intel', text: 'Autzen crowd noise ranked #3 in nation', impact: 'info' },
    ],
  },

  // 4. Ball State @ No. 1 Ohio State (Saturday 3:30 PM ET)
  {
    id: 'game-4',
    league: 'CFB',
    season: 2026,
    week: 1,
    kickoffTime: satAfternoon,
    awayTeam: CFB_TEAMS.BALL,
    homeTeam: CFB_TEAMS.OSU,
    spread: -35.0, // Commish adjusted from CBS's dumb -50.5 line!
    overUnder: 59.5,
    status: 'pre',
    isCustomSpread: true,
    spreadLocked: true,
    location: {
      stadium: 'Ohio Stadium ("The Horseshoe")',
      city: 'Columbus',
      state: 'OH',
    },
    weather: {
      temperature: 76,
      condition: 'Sunny & Pleasant',
      windMph: 8,
      icon: 'sun',
    },
    notes: [
      { id: 'n7', category: 'intel', text: 'CBS Sports had this at -50.5! Commish re-pegged line to -35.0', impact: 'high' },
      { id: 'n8', category: 'injury', text: 'Ohio State WR2 Questionable (Minor hamstring tightness)', impact: 'medium' },
    ],
  },

  // 5. East Carolina @ No. 13 Alabama (Saturday 4:00 PM ET)
  {
    id: 'game-5',
    league: 'CFB',
    season: 2026,
    week: 1,
    kickoffTime: satLate,
    awayTeam: CFB_TEAMS.ECU,
    homeTeam: CFB_TEAMS.BAMA,
    spread: -27.5, // Alabama -27.5
    overUnder: 53.0,
    status: 'pre',
    spreadLocked: true,
    location: {
      stadium: 'Bryant-Denny Stadium',
      city: 'Tuscaloosa',
      state: 'AL',
    },
    weather: {
      temperature: 86,
      condition: 'Hot & Clear',
      windMph: 6,
      icon: 'sun',
    },
    notes: [
      { id: 'n9', category: 'intel', text: 'Kalen DeBoer Era Year 3 Opener in Tuscaloosa', impact: 'info' },
      { id: 'n10', category: 'weather', text: 'High heat index expected at 4:00 PM kickoff', impact: 'medium' },
    ],
  },

  // 6. Clemson @ No. 11 LSU (MARQUEE SATURDAY NIGHT PRIMETIME)
  {
    id: 'game-6',
    league: 'CFB',
    season: 2026,
    week: 1,
    kickoffTime: satPrimetime,
    awayTeam: CFB_TEAMS.CLEM,
    homeTeam: CFB_TEAMS.LSU,
    spread: -9.5, // LSU -9.5
    overUnder: 56.5,
    status: 'pre',
    spreadLocked: true,
    location: {
      stadium: 'Tiger Stadium ("Death Valley")',
      city: 'Baton Rouge',
      state: 'LA',
    },
    weather: {
      temperature: 80,
      condition: 'Humid Night Game',
      windMph: 5,
      icon: 'sun',
    },
    notes: [
      { id: 'n11', category: 'rivalry', text: 'National Game of the Week • Death Valley Saturday Night', impact: 'high' },
      { id: 'n12', category: 'intel', text: 'Rematch of 2020 National Championship Game', impact: 'high' },
      { id: 'n13', category: 'injury', text: 'Clemson starting Center OUT (high ankle sprain)', impact: 'high' },
    ],
  },

  // 7. Texas State @ No. 5 Texas (Saturday 8:00 PM ET)
  {
    id: 'game-7',
    league: 'CFB',
    season: 2026,
    week: 1,
    kickoffTime: satNight,
    awayTeam: CFB_TEAMS.TXST,
    homeTeam: CFB_TEAMS.TEX,
    spread: -28.5, // Texas -28.5
    overUnder: 64.0,
    status: 'pre',
    spreadLocked: true,
    location: {
      stadium: 'DKR-Texas Memorial Stadium',
      city: 'Austin',
      state: 'TX',
    },
    weather: {
      temperature: 88,
      condition: 'Warm & Clear',
      windMph: 9,
      icon: 'sun',
    },
    notes: [
      { id: 'n14', category: 'rivalry', text: 'In-State Battle • Austin vs San Marcos (30 miles apart)', impact: 'high' },
      { id: 'n15', category: 'intel', text: 'Texas offense averaged 44.8 PPG in season openers', impact: 'info' },
    ],
  },

  // 8. No. 24 Louisville vs No. 9 Ole Miss (SUNDAY PRIMETIME TIEBREAKER)
  {
    id: 'game-8',
    league: 'CFB',
    season: 2026,
    week: 1,
    kickoffTime: sunShowcase,
    awayTeam: CFB_TEAMS.LOU,
    homeTeam: CFB_TEAMS.MISS,
    spread: -4.5, // Ole Miss favored by 4.5
    overUnder: 58.5,
    status: 'pre',
    isTiebreaker: true,
    spreadLocked: true,
    location: {
      stadium: 'Nissan Stadium',
      city: 'Nashville',
      state: 'TN',
      isNeutralSite: true,
    },
    weather: {
      temperature: 75,
      condition: 'Clear Evening',
      windMph: 6,
      icon: 'sun',
    },
    notes: [
      { id: 'n16', category: 'rivalry', text: 'ONLY Ranked vs Ranked Matchup of Opening Weekend! (Top 25)', impact: 'high' },
      { id: 'n17', category: 'intel', text: 'Weekly Tiebreaker: Predict combined total points scored', impact: 'info' },
    ],
  },
];

export const INITIAL_SLATE: WeeklySlate = {
  season: 2026,
  week: 1,
  title: 'Week 1 Opening Saturday - Top 25 Slate',
  lineFreezeTime: satNoon,
  isFrozen: true,
  games: INITIAL_GAMES,
};

export const MOCK_LEAGUE_MEMBERS: LeagueMember[] = [
  {
    id: 'user-current',
    name: 'You (Seaver)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isCurrentUser: true,
    isCommissioner: true,
    weeklyWins: 0,
    weeklyLosses: 0,
    weeklyPushes: 0,
    seasonWins: 0,
    seasonLosses: 0,
    seasonPushes: 0,
    tiebreakerPoints: 55,
    picks: {
      'game-1': { selectedTeamId: 'psu' },
      'game-2': { selectedTeamId: 'uga' },
      'game-3': { selectedTeamId: 'ore' },
      'game-4': { selectedTeamId: 'osu' },
      'game-5': { selectedTeamId: 'bama' },
      'game-6': { selectedTeamId: 'lsu' },
      'game-7': { selectedTeamId: 'tex' },
      'game-8': { selectedTeamId: 'miss' },
    },
  },
  {
    id: 'user-dave',
    name: 'Dave Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    weeklyWins: 0,
    weeklyLosses: 0,
    weeklyPushes: 0,
    seasonWins: 0,
    seasonLosses: 0,
    seasonPushes: 0,
    tiebreakerPoints: 61,
    picks: {
      'game-1': { selectedTeamId: 'mrsh' },
      'game-2': { selectedTeamId: 'uga' },
      'game-3': { selectedTeamId: 'boise' },
      'game-4': { selectedTeamId: 'ball' },
      'game-5': { selectedTeamId: 'bama' },
      'game-6': { selectedTeamId: 'clem' },
      'game-7': { selectedTeamId: 'tex' },
      'game-8': { selectedTeamId: 'lou' },
    },
  },
  {
    id: 'user-sarah',
    name: 'Sarah Connor',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    weeklyWins: 0,
    weeklyLosses: 0,
    weeklyPushes: 0,
    seasonWins: 0,
    seasonLosses: 0,
    seasonPushes: 0,
    tiebreakerPoints: 49,
    picks: {
      'game-1': { selectedTeamId: 'psu' },
      'game-2': { selectedTeamId: 'tnst' },
      'game-3': { selectedTeamId: 'ore' },
      'game-4': { selectedTeamId: 'osu' },
      'game-5': { selectedTeamId: 'ecu' },
      'game-6': { selectedTeamId: 'lsu' },
      'game-7': { selectedTeamId: 'txst' },
      'game-8': { selectedTeamId: 'miss' },
    },
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    weeklyWins: 0,
    weeklyLosses: 0,
    weeklyPushes: 0,
    seasonWins: 0,
    seasonLosses: 0,
    seasonPushes: 0,
    tiebreakerPoints: 58,
    picks: {
      'game-1': { selectedTeamId: 'psu' },
      'game-2': { selectedTeamId: 'uga' },
      'game-3': { selectedTeamId: 'ore' },
      'game-4': { selectedTeamId: 'ball' },
      'game-5': { selectedTeamId: 'bama' },
      'game-6': { selectedTeamId: 'clem' },
      'game-7': { selectedTeamId: 'tex' },
      'game-8': { selectedTeamId: 'lou' },
    },
  },
];

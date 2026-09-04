import type { Game, LeagueMember } from '../types/pickem';

// Real 2024/2025 College Football Opening Week Marquee Matchups & Actual Results
export const HISTORICAL_2025_GAMES: Game[] = [
  {
    id: 'hist-2025-1',
    league: 'CFB',
    season: 2025,
    week: 1,
    overUnder: 51.5,
    homeTeam: {
      id: 'wvu',
      name: 'West Virginia',
      shortName: 'Mountaineers',
      abbreviation: 'WVU',
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/277.png',
      record: '0-0',
      primaryColor: '#002855',
    },
    awayTeam: {
      id: 'psu',
      name: 'Penn State',
      shortName: 'Nittany Lions',
      abbreviation: 'PSU',
      rank: 8,
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/213.png',
      record: '0-0',
      primaryColor: '#041E42',
    },
    kickoffTime: '2025-08-30T16:00:00Z', // Saturday 12:00 PM ET
    spread: 7.5, // WVU +7.5 / PSU -7.5
    homeScore: 12,
    awayScore: 34,
    status: 'post', // PSU 34, WVU 12 (PSU covers -7.5)
    location: {
      stadium: 'Milan Puskar Stadium',
      city: 'Morgantown',
      state: 'WV',
    },
    weather: {
      temperature: 78,
      condition: 'Severe Lightning Storm (2h 19m delay)',
      windMph: 14,
      icon: 'rain',
    },
    notes: [
      {
        id: 'hn-1',
        category: 'weather',
        text: 'Severe lightning halted play at halftime for 2h 19m; play resumed at 4:23 PM ET.',
        impact: 'high',
      },
      {
        id: 'hn-2',
        category: 'intel',
        text: 'Penn State QB Drew Allar threw 3 TDs in debut of Andy Kotelnicki offense.',
        impact: 'info',
      },
    ],
    situation: {
      possessionTeamId: 'wvu',
      downDistanceText: 'Final',
      yardLine: 20,
      lastPlayText: 'Final whistle: Penn State dominates Morgantown 34-12.',
    },
  },
  {
    id: 'hist-2025-2',
    league: 'CFB',
    season: 2025,
    week: 1,
    overUnder: 48.5,
    homeTeam: {
      id: 'uga',
      name: 'Georgia',
      shortName: 'Bulldogs',
      abbreviation: 'UGA',
      rank: 1,
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png',
      record: '0-0',
      primaryColor: '#BA0C2F',
    },
    awayTeam: {
      id: 'clem',
      name: 'Clemson',
      shortName: 'Tigers',
      abbreviation: 'CLEM',
      rank: 14,
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/228.png',
      record: '0-0',
      primaryColor: '#F56600',
    },
    kickoffTime: '2025-08-30T16:00:00Z', // Saturday 12:00 PM ET (Aflac Kickoff Game)
    spread: -13.5, // Georgia -13.5
    homeScore: 34,
    awayScore: 3,
    status: 'post', // Georgia 34, Clemson 3 (Georgia covers -13.5)
    location: {
      stadium: 'Mercedes-Benz Stadium',
      city: 'Atlanta',
      state: 'GA',
      isNeutralSite: true,
    },
    weather: {
      temperature: 72,
      condition: 'Climate Controlled Dome',
      windMph: 0,
      icon: 'dome',
    },
    notes: [
      {
        id: 'hn-3',
        category: 'intel',
        text: 'Georgia defense suffocated Clemson, holding them without a touchdown in Atlanta.',
        impact: 'high',
      },
    ],
    situation: {
      possessionTeamId: 'clem',
      downDistanceText: 'Final',
      yardLine: 35,
      lastPlayText: 'Final: No. 1 Georgia rolls over No. 14 Clemson 34-3.',
    },
  },
  {
    id: 'hist-2025-3',
    league: 'CFB',
    season: 2025,
    week: 1,
    overUnder: 54.0,
    homeTeam: {
      id: 'fla',
      name: 'Florida',
      shortName: 'Gators',
      abbreviation: 'FLA',
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png',
      record: '0-0',
      primaryColor: '#0021A5',
    },
    awayTeam: {
      id: 'mia',
      name: 'Miami',
      shortName: 'Hurricanes',
      abbreviation: 'MIA',
      rank: 19,
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png',
      record: '0-0',
      primaryColor: '#F47321',
    },
    kickoffTime: '2025-08-30T19:30:00Z', // Saturday 3:30 PM ET
    spread: 2.5, // Florida +2.5 / Miami -2.5
    homeScore: 17,
    awayScore: 41,
    status: 'post', // Miami 41, Florida 17 (Miami covers -2.5)
    location: {
      stadium: 'Ben Hill Griffin Stadium',
      city: 'Gainesville',
      state: 'FL',
    },
    weather: {
      temperature: 91,
      condition: 'Oppressive Heat & Humidity',
      windMph: 6,
      icon: 'sun',
    },
    notes: [
      {
        id: 'hn-4',
        category: 'intel',
        text: 'Cam Ward threw for 385 yards and 3 TDs in commanding Miami debut.',
        impact: 'high',
      },
    ],
    situation: {
      possessionTeamId: 'fla',
      downDistanceText: 'Final',
      yardLine: 45,
      lastPlayText: 'Final: Miami blows out Florida 41-17 in The Swamp.',
    },
  },
  {
    id: 'hist-2025-4',
    league: 'CFB',
    season: 2025,
    week: 1,
    overUnder: 64.5,
    homeTeam: {
      id: 'lsu',
      name: 'LSU',
      shortName: 'Tigers',
      abbreviation: 'LSU',
      rank: 13,
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png',
      record: '0-0',
      primaryColor: '#461D7C',
    },
    awayTeam: {
      id: 'usc',
      name: 'USC',
      shortName: 'Trojans',
      abbreviation: 'USC',
      rank: 23,
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/30.png',
      record: '0-0',
      primaryColor: '#990000',
    },
    kickoffTime: '2025-08-31T23:30:00Z', // Sunday 7:30 PM ET (Vegas Kickoff Classic)
    spread: -4.5, // LSU -4.5
    homeScore: 20,
    awayScore: 27,
    status: 'post', // USC 27, LSU 20 (USC covers +4.5 and wins outright)
    location: {
      stadium: 'Allegiant Stadium',
      city: 'Las Vegas',
      state: 'NV',
      isNeutralSite: true,
    },
    weather: {
      temperature: 72,
      condition: 'Indoor Dome',
      windMph: 0,
      icon: 'dome',
    },
    notes: [
      {
        id: 'hn-5',
        category: 'intel',
        text: 'Woody Marks punched in a 13-yard TD with 8 seconds left to stun LSU in Vegas.',
        impact: 'high',
      },
    ],
    situation: {
      possessionTeamId: 'lsu',
      downDistanceText: 'Final',
      yardLine: 50,
      lastPlayText: 'Final: USC upsets No. 13 LSU 27-20 on late touchdown drive.',
    },
  },
  {
    id: 'hist-2025-5',
    league: 'CFB',
    season: 2025,
    week: 1,
    overUnder: 47.0,
    homeTeam: {
      id: 'tamu',
      name: 'Texas A&M',
      shortName: 'Aggies',
      abbreviation: 'TAMU',
      rank: 20,
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/245.png',
      record: '0-0',
      primaryColor: '#500000',
    },
    awayTeam: {
      id: 'nd',
      name: 'Notre Dame',
      shortName: 'Fighting Irish',
      abbreviation: 'ND',
      rank: 7,
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/87.png',
      record: '0-0',
      primaryColor: '#0C2340',
    },
    kickoffTime: '2025-08-30T23:30:00Z', // Saturday 7:30 PM ET
    spread: -3.0, // Texas A&M -3.0
    homeScore: 13,
    awayScore: 23,
    status: 'post', // Notre Dame 23, Texas A&M 13 (ND covers +3.0)
    location: {
      stadium: 'Kyle Field',
      city: 'College Station',
      state: 'TX',
    },
    weather: {
      temperature: 86,
      condition: 'Clear, Sweltering Night',
      windMph: 5,
      icon: 'sun',
    },
    notes: [
      {
        id: 'hn-6',
        category: 'intel',
        text: 'Jadarian Price broke free for a 47-yard TD run in Q4 to ice the game for the Irish.',
        impact: 'high',
      },
    ],
    situation: {
      possessionTeamId: 'tamu',
      downDistanceText: 'Final',
      yardLine: 35,
      lastPlayText: 'Final: Notre Dame wins physical defensive battle 23-13.',
    },
  },
  {
    id: 'hist-2025-6',
    league: 'CFB',
    season: 2025,
    week: 1,
    overUnder: 60.5,
    homeTeam: {
      id: 'colo',
      name: 'Colorado',
      shortName: 'Buffaloes',
      abbreviation: 'COLO',
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/38.png',
      record: '0-0',
      primaryColor: '#CFB87C',
    },
    awayTeam: {
      id: 'ndsu',
      name: 'North Dakota State',
      shortName: 'Bison',
      abbreviation: 'NDSU',
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2449.png',
      record: '0-0',
      primaryColor: '#00563F',
    },
    kickoffTime: '2025-08-29T00:00:00Z', // Thursday Night
    spread: -9.5, // Colorado -9.5
    homeScore: 31,
    awayScore: 26,
    status: 'post', // Colorado 31, NDSU 26 (NDSU covers +9.5!)
    location: {
      stadium: 'Folsom Field',
      city: 'Boulder',
      state: 'CO',
    },
    weather: {
      temperature: 74,
      condition: 'Clear Rocky Mountain Evening',
      windMph: 4,
      icon: 'sun',
    },
    notes: [
      {
        id: 'hn-7',
        category: 'intel',
        text: 'Travis Hunter recorded 3 TD catches, but NDSU Hail Mary fell 4 yards short to cover +9.5.',
        impact: 'high',
      },
    ],
    situation: {
      possessionTeamId: 'ndsu',
      downDistanceText: 'Final',
      yardLine: 4,
      lastPlayText: 'Final: Colorado hangs on 31-26 as NDSU completes Hail Mary at the 4-yard line.',
    },
  },
  {
    id: 'hist-2025-7',
    league: 'CFB',
    season: 2025,
    week: 1,
    overUnder: 63.5,
    homeTeam: {
      id: 'bama',
      name: 'Alabama',
      shortName: 'Crimson Tide',
      abbreviation: 'BAMA',
      rank: 5,
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
      record: '0-0',
      primaryColor: '#9E1B32',
    },
    awayTeam: {
      id: 'wku',
      name: 'Western Kentucky',
      shortName: 'Hilltoppers',
      abbreviation: 'WKU',
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/98.png',
      record: '0-0',
      primaryColor: '#C60C30',
    },
    kickoffTime: '2025-08-30T23:00:00Z', // Saturday 7:00 PM ET
    spread: -31.5, // Alabama -31.5 (Kalen DeBoer debut)
    homeScore: 63,
    awayScore: 0,
    status: 'post', // Alabama 63, WKU 0 (Alabama covers -31.5)
    location: {
      stadium: 'Bryant-Denny Stadium',
      city: 'Tuscaloosa',
      state: 'AL',
    },
    weather: {
      temperature: 84,
      condition: 'Humid Summer Night',
      windMph: 3,
      icon: 'sun',
    },
    notes: [
      {
        id: 'hn-8',
        category: 'intel',
        text: 'Jalen Milroe accounted for 5 total touchdowns in Kalen DeBoer opening blowout.',
        impact: 'high',
      },
    ],
    situation: {
      possessionTeamId: 'wku',
      downDistanceText: 'Final',
      yardLine: 30,
      lastPlayText: 'Final: Alabama blanks Western Kentucky 63-0 in DeBoer opener.',
    },
  },
  {
    id: 'hist-2025-8', // Tiebreaker Game
    league: 'CFB',
    season: 2025,
    week: 1,
    overUnder: 49.5,
    isTiebreaker: true,
    homeTeam: {
      id: 'fsu',
      name: 'Florida State',
      shortName: 'Seminoles',
      abbreviation: 'FSU',
      rank: 10,
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/52.png',
      record: '0-0',
      primaryColor: '#782F40',
    },
    awayTeam: {
      id: 'bc',
      name: 'Boston College',
      shortName: 'Eagles',
      abbreviation: 'BC',
      logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/103.png',
      record: '0-0',
      primaryColor: '#8c2232',
    },
    kickoffTime: '2025-09-01T23:30:00Z', // Labor Day Primetime (Total Points: 41)
    spread: -16.5, // FSU -16.5
    homeScore: 13,
    awayScore: 28,
    status: 'post', // Boston College 28, FSU 13 (BC covers +16.5 and wins outright! Total: 41)
    location: {
      stadium: 'Doak Campbell Stadium',
      city: 'Tallahassee',
      state: 'FL',
    },
    weather: {
      temperature: 82,
      condition: 'Clear, Breezy',
      windMph: 7,
      icon: 'wind',
    },
    notes: [
      {
        id: 'hn-9',
        category: 'intel',
        text: 'Thomas Castellanos torched FSU defense; Bill O\'Brien earns massive road stunner.',
        impact: 'high',
      },
      {
        id: 'hn-10',
        category: 'intel',
        text: 'Official Tiebreaker Game: Actual combined score was 41 (BC 28 + FSU 13).',
        impact: 'high',
      },
    ],
    situation: {
      possessionTeamId: 'fsu',
      downDistanceText: 'Final',
      yardLine: 40,
      lastPlayText: 'Final: Boston College shocks No. 10 Florida State 28-13.',
    },
  },
];

// Historical League Members & Their 2025 Picks for Simulation Testing
export const HISTORICAL_2025_MEMBERS: LeagueMember[] = [
  {
    id: 'm-seaver',
    name: 'Seaver',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isCurrentUser: true,
    isCommissioner: true,
    seasonWins: 6,
    seasonLosses: 2,
    seasonPushes: 0,
    weeklyWins: 6,
    weeklyLosses: 2,
    weeklyPushes: 0,
    tiebreakerPoints: 45, // Actual was 41 (Delta = 4)
    picks: {
      'hist-2025-1': { selectedTeamId: 'psu', result: 'win', isCovering: true }, // WIN (Covered)
      'hist-2025-2': { selectedTeamId: 'uga', result: 'win', isCovering: true }, // WIN (Covered)
      'hist-2025-3': { selectedTeamId: 'mia', result: 'win', isCovering: true }, // WIN (Covered)
      'hist-2025-4': { selectedTeamId: 'lsu', result: 'loss', isCovering: false }, // LOSS (USC won)
      'hist-2025-5': { selectedTeamId: 'nd', result: 'win', isCovering: true }, // WIN (Covered)
      'hist-2025-6': { selectedTeamId: 'ndsu', result: 'win', isCovering: true }, // WIN (Covered)
      'hist-2025-7': { selectedTeamId: 'bama', result: 'win', isCovering: true }, // WIN (Covered)
      'hist-2025-8': { selectedTeamId: 'fsu', result: 'loss', isCovering: false }, // LOSS (BC won)
    },
  },
  {
    id: 'm-dave',
    name: 'Dave "The Bookie"',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    isCurrentUser: false,
    seasonWins: 6,
    seasonLosses: 2,
    seasonPushes: 0,
    weeklyWins: 6,
    weeklyLosses: 2,
    weeklyPushes: 0,
    tiebreakerPoints: 52, // Actual was 41 (Delta = 11)
    picks: {
      'hist-2025-1': { selectedTeamId: 'psu', result: 'win', isCovering: true },
      'hist-2025-2': { selectedTeamId: 'uga', result: 'win', isCovering: true },
      'hist-2025-3': { selectedTeamId: 'mia', result: 'win', isCovering: true },
      'hist-2025-4': { selectedTeamId: 'usc', result: 'win', isCovering: true },
      'hist-2025-5': { selectedTeamId: 'tamu', result: 'loss', isCovering: false },
      'hist-2025-6': { selectedTeamId: 'colo', result: 'loss', isCovering: false },
      'hist-2025-7': { selectedTeamId: 'bama', result: 'win', isCovering: true },
      'hist-2025-8': { selectedTeamId: 'bc', result: 'win', isCovering: true },
    },
  },
  {
    id: 'm-marcus',
    name: 'Marcus Sharp',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    isCurrentUser: false,
    seasonWins: 4,
    seasonLosses: 4,
    seasonPushes: 0,
    weeklyWins: 4,
    weeklyLosses: 4,
    weeklyPushes: 0,
    tiebreakerPoints: 38,
    picks: {
      'hist-2025-1': { selectedTeamId: 'wvu', result: 'loss', isCovering: false },
      'hist-2025-2': { selectedTeamId: 'clem', result: 'loss', isCovering: false },
      'hist-2025-3': { selectedTeamId: 'fla', result: 'loss', isCovering: false },
      'hist-2025-4': { selectedTeamId: 'usc', result: 'win', isCovering: true },
      'hist-2025-5': { selectedTeamId: 'nd', result: 'win', isCovering: true },
      'hist-2025-6': { selectedTeamId: 'ndsu', result: 'win', isCovering: true },
      'hist-2025-7': { selectedTeamId: 'bama', result: 'win', isCovering: true },
      'hist-2025-8': { selectedTeamId: 'fsu', result: 'loss', isCovering: false },
    },
  },
  {
    id: 'm-sarah',
    name: 'Sarah Underdog',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    isCurrentUser: false,
    seasonWins: 5,
    seasonLosses: 3,
    seasonPushes: 0,
    weeklyWins: 5,
    weeklyLosses: 3,
    weeklyPushes: 0,
    tiebreakerPoints: 42,
    picks: {
      'hist-2025-1': { selectedTeamId: 'wvu', result: 'loss', isCovering: false },
      'hist-2025-2': { selectedTeamId: 'uga', result: 'win', isCovering: true },
      'hist-2025-3': { selectedTeamId: 'mia', result: 'win', isCovering: true },
      'hist-2025-4': { selectedTeamId: 'usc', result: 'win', isCovering: true },
      'hist-2025-5': { selectedTeamId: 'nd', result: 'win', isCovering: true },
      'hist-2025-6': { selectedTeamId: 'ndsu', result: 'win', isCovering: true },
      'hist-2025-7': { selectedTeamId: 'wku', result: 'loss', isCovering: false },
      'hist-2025-8': { selectedTeamId: 'fsu', result: 'loss', isCovering: false },
    },
  },
];

// Timeline Scenarios for the Gameday Simulator
export type SimulationPhase = 'pre' | 'noon_kick' | 'halftime_delay' | 'afternoon_kick' | 'primetime_kick' | 'final';

export interface SimulationStep {
  id: SimulationPhase;
  label: string;
  timeDisplay: string;
  description: string;
  gamesState: Partial<Game>[];
}

export const SIMULATION_STEPS: SimulationStep[] = [
  {
    id: 'pre',
    label: 'Friday Night Pre-Game',
    timeDisplay: 'Friday 8:00 PM ET',
    description: 'All picks open and editable. Lines are frozen. Opponents\' picks remain strictly confidential.',
    gamesState: HISTORICAL_2025_GAMES.map((g) => ({
      id: g.id,
      status: 'pre',
      homeScore: 0,
      awayScore: 0,
      situation: undefined,
    })),
  },
  {
    id: 'noon_kick',
    label: 'Noon Slate Kickoff',
    timeDisplay: 'Saturday 12:05 PM ET',
    description: 'Penn State @ West Virginia & Georgia vs Clemson kick off! Noon picks lock permanently and reveal. Later games remain open.',
    gamesState: [
      {
        id: 'hist-2025-1',
        status: 'in',
        homeScore: 0,
        awayScore: 7,
        situation: {
          downDistanceText: '1st & 10 at WVU 35',
          yardLine: 35,
          possessionTeamId: 'psu',
          lastPlayText: 'Allar 35-yd TD strike to Julian Fleming. Extra point GOOD.',
        },
      },
      {
        id: 'hist-2025-2',
        status: 'in',
        homeScore: 3,
        awayScore: 0,
        situation: {
          downDistanceText: '2nd & 6 at UGA 40',
          yardLine: 40,
          possessionTeamId: 'uga',
          lastPlayText: 'Etienne 8-yd rush for 1st down across midfield.',
        },
      },
      { id: 'hist-2025-3', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-4', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-5', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-6', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-7', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-8', status: 'pre', homeScore: 0, awayScore: 0 },
    ],
  },
  {
    id: 'halftime_delay',
    label: 'Halftime Lightning Delay',
    timeDisplay: 'Saturday 1:45 PM ET',
    description: 'Severe storm halts WVU vs Penn State at halftime. Anti-Cheat prevents ghost unlocking! Georgia builds 13-0 lead.',
    gamesState: [
      {
        id: 'hist-2025-1',
        status: 'in',
        homeScore: 6,
        awayScore: 20,
        situation: {
          downDistanceText: 'Halftime ⚡ Storm Delay',
          yardLine: 25,
          possessionTeamId: 'wvu',
          lastPlayText: '⚡ SEVERE WEATHER DELAY: Lightning within 8 miles. Teams sent to locker rooms.',
        },
      },
      {
        id: 'hist-2025-2',
        status: 'in',
        homeScore: 13,
        awayScore: 0,
        situation: {
          downDistanceText: '3rd & 4 at CLEM 12',
          yardLine: 12,
          possessionTeamId: 'uga',
          isRedzone: true,
          lastPlayText: 'Carson Beck screen pass to Bell for 11 yards. Georgia threatening.',
        },
      },
      { id: 'hist-2025-3', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-4', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-5', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-6', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-7', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-8', status: 'pre', homeScore: 0, awayScore: 0 },
    ],
  },
  {
    id: 'afternoon_kick',
    label: 'Afternoon Wave (The Swamp)',
    timeDisplay: 'Saturday 4:15 PM ET',
    description: 'Georgia wraps up 34-3 blowout (covers -13.5). Miami dominates Florida in Q2. West Virginia game resumes.',
    gamesState: [
      {
        id: 'hist-2025-1',
        status: 'in',
        homeScore: 12,
        awayScore: 27,
        situation: {
          downDistanceText: '3rd & 8 at PSU 45',
          yardLine: 45,
          possessionTeamId: 'psu',
          lastPlayText: 'Penn State converts 3rd down in Q3 following 2-hour rain delay.',
        },
      },
      {
        id: 'hist-2025-2',
        status: 'post',
        homeScore: 34,
        awayScore: 3,
        situation: {
          downDistanceText: 'Final',
          yardLine: 35,
          possessionTeamId: 'clem',
          lastPlayText: 'FINAL: Georgia dominates Clemson 34-3, easily covering -13.5.',
        },
      },
      {
        id: 'hist-2025-3',
        status: 'in',
        homeScore: 10,
        awayScore: 24,
        situation: {
          downDistanceText: '2nd & 5 at FLA 18',
          yardLine: 18,
          possessionTeamId: 'mia',
          isRedzone: true,
          lastPlayText: 'Cam Ward 24-yd TD pass to Restrepo in the back corner of the end zone.',
        },
      },
      { id: 'hist-2025-4', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-5', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-6', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-7', status: 'pre', homeScore: 0, awayScore: 0 },
      { id: 'hist-2025-8', status: 'pre', homeScore: 0, awayScore: 0 },
    ],
  },
  {
    id: 'primetime_kick',
    label: 'Primetime Clashes',
    timeDisplay: 'Saturday 8:30 PM ET',
    description: 'Notre Dame @ Texas A&M and USC vs LSU in intense 4th quarter battles. Miami and Penn State final scores locked.',
    gamesState: [
      { id: 'hist-2025-1', status: 'post', homeScore: 12, awayScore: 34 },
      { id: 'hist-2025-2', status: 'post', homeScore: 34, awayScore: 3 },
      { id: 'hist-2025-3', status: 'post', homeScore: 17, awayScore: 41 },
      {
        id: 'hist-2025-4',
        status: 'in',
        homeScore: 17,
        awayScore: 20,
        situation: {
          downDistanceText: '3rd & 2 at LSU 28',
          yardLine: 28,
          possessionTeamId: 'usc',
          lastPlayText: 'Miller Moss bullet to Branch down to the LSU 13-yard line! 1:12 left.',
        },
      },
      {
        id: 'hist-2025-5',
        status: 'in',
        homeScore: 13,
        awayScore: 13,
        situation: {
          downDistanceText: '1st & 10 at TAMU 47',
          yardLine: 47,
          possessionTeamId: 'nd',
          lastPlayText: 'Jadarian Price breaks free for 47-YARD TOUCHDOWN! Irish take 20-13 lead.',
        },
      },
      { id: 'hist-2025-6', status: 'post', homeScore: 31, awayScore: 26 },
      { id: 'hist-2025-7', status: 'post', homeScore: 63, awayScore: 0 },
      { id: 'hist-2025-8', status: 'pre', homeScore: 0, awayScore: 0 },
    ],
  },
  {
    id: 'final',
    label: 'All Games Final & Tiebreaker Settle',
    timeDisplay: 'Labor Day Final',
    description: 'All 8 games final! Boston College upsets FSU 28-13 (Total 41). 6-Tier Tiebreaker evaluates Seaver vs Dave!',
    gamesState: HISTORICAL_2025_GAMES.map((g) => ({
      id: g.id,
      status: 'post',
      homeScore: g.homeScore,
      awayScore: g.awayScore,
      situation: g.situation,
    })),
  },
];

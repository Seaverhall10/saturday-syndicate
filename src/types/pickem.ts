export type SportLeague = 'CFB' | 'CUSTOM';
export type GameStatus = 'pre' | 'in' | 'post';
export type PickResult = 'pending' | 'win' | 'loss' | 'push';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  logoUrl: string;
  record?: string;
  rank?: number;
  primaryColor?: string;
}

export interface GameWeather {
  temperature: number; // Fahrenheit
  condition: string; // e.g., 'Sunny', 'Rain', 'Light Snow', 'Dome', 'Windy'
  windMph: number;
  icon?: 'sun' | 'cloud' | 'rain' | 'snow' | 'dome' | 'wind';
}

export interface GameLocation {
  stadium: string; // e.g., "Bryant-Denny Stadium"
  city: string; // "Tuscaloosa"
  state: string; // "AL"
  isNeutralSite?: boolean;
}

export interface GameNote {
  id: string;
  category: 'injury' | 'intel' | 'rivalry' | 'weather';
  text: string;
  impact?: 'high' | 'medium' | 'info';
}

export interface GameSituation {
  possessionTeamId?: string; // Team currently with the football
  downDistanceText?: string; // e.g. "2nd & 4 at ALA 28"
  yardLine?: number; // 0 to 100
  lastPlayText?: string; // e.g. "J. Milroe 12-yd pass complete to R. Williams"
  isRedzone?: boolean;
}

export interface Game {
  id: string;
  league: SportLeague;
  season: number;
  week: number;
  kickoffTime: string; // ISO 8601 UTC
  homeTeam: Team;
  awayTeam: Team;
  spread: number; // Negative = Home Favored (e.g. -3.5); Positive = Away Favored
  overUnder: number;
  homeScore?: number;
  awayScore?: number;
  gameClock?: string; // e.g., "Q3 04:12"
  status: GameStatus;
  isTiebreaker?: boolean; // Weekly Tiebreaker Game
  isCustomSpread?: boolean;
  spreadLocked?: boolean;
  location?: GameLocation;
  weather?: GameWeather;
  notes?: GameNote[];
  situation?: GameSituation;
}

export interface UserPick {
  gameId: string;
  selectedTeamId: string;
  spreadAtPick: number;
  submittedAt?: string;
}

export interface TiebreakerPick {
  week: number;
  predictedTotalScore: number;
  submittedAt?: string;
}

export interface LeagueMember {
  id: string;
  name: string;
  avatarUrl: string;
  isCurrentUser?: boolean;
  isCommissioner?: boolean;
  weeklyWins: number;
  weeklyLosses: number;
  weeklyPushes: number;
  seasonWins: number;
  seasonLosses: number;
  seasonPushes: number;
  tiebreakerPoints?: number;
  picks: Record<string, {
    selectedTeamId: string;
    result?: PickResult;
    isCovering?: boolean; // Live in-progress status
  }>;
}

export interface WeeklySlate {
  season: number;
  week: number;
  title: string;
  lineFreezeTime: string; // ISO 8601 UTC
  isFrozen: boolean;
  games: Game[];
}

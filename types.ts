
export interface Player {
  name: string;
  position: string;
  rating: number;
  statusNotes?: string;
}

export interface Lineup {
  formation: string;
  startingXI: Player[];
  substitutes: Player[];
}

export interface MatchEvent {
  minute: number;
  extraMinute?: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var' | 'shot_missed' | 'argument' | 'injury' | 'stoppage_time';
  team: 'home' | 'away' | 'none';
  player?: string;
  description: string;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
}

export interface SimulationResult {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  homeScore: number;
  awayScore: number;
  summary: string;
  stoppageTime1: number;
  stoppageTime2: number;
  homeLineup: Lineup;
  awayLineup: Lineup;
  timeline: MatchEvent[];
  stats: MatchStats;
  simulationProcessTimeMs: number;
}

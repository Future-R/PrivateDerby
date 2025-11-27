
export type LocationId = string;

export enum GameMode {
  FREE_ROAM = 'FREE_ROAM',
  CLASS = 'CLASS',
  EVENT = 'EVENT'
}

export enum Subject {
  CHINESE = '语文',
  HISTORY = '历史',
  MATH = '数学',
  BIOLOGY = '生物',
  MUSIC = '音乐',
  ART = '美术',
  MAINTENANCE = '维修',
  HOME_EC = '家政',
}

export interface Attributes {
  // Survival
  energy: number; // 体力
  maxEnergy: number;
  spirit: number; // 精力
  maxSpirit: number;
  health: number; // 健康
  maxHealth: number;
  mood: number; // 心情
  
  // Competition (Hidden in main UI)
  speed: number;
  stamina: number;
  power: number;
  guts: number;
  intelligence: number;
}

export interface AcademicStats {
  [key: string]: {
    exp: number;
    level: string; // S, A, B...
  };
}

export interface LocationData {
  id: LocationId;
  name: string;
  description?: string;
  backgroundImage?: string; // URL or local path
  connections: Record<LocationId, number>; // Target Location ID -> Minutes cost
}

export interface TimeState {
  day: number;
  hour: number;
  minute: number;
  weekday: number; // 0 = Sunday
}

export interface GameState {
  time: TimeState;
  location: LocationId;
  mode: GameMode;
  attributes: Attributes;
  academics: AcademicStats;
  money: number;
  wearingUniform: boolean;
  logs: LogEntry[];
  
  // Class System State
  currentClassSubject?: Subject;
  classTurn: number; // 1 to 5
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'event';
  timestamp: string;
}

export interface Action {
  id: string;
  label: string;
  costMinutes: number;
  condition?: (state: GameState) => boolean;
  execute: (state: GameState) => Partial<GameState> | void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'neutral';
}

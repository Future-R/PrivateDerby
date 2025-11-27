
import { Subject, LocationData } from './types';

export const INITIAL_STATS = {
  energy: 100,
  maxEnergy: 100,
  spirit: 100,
  maxSpirit: 100,
  health: 100,
  maxHealth: 100,
  mood: 80, 
  speed: 100,
  stamina: 100,
  power: 100,
  guts: 100,
  intelligence: 100,
};

export const INITIAL_ACADEMICS = Object.values(Subject).reduce((acc, subject) => {
  acc[subject] = { exp: 0, level: 'G' };
  return acc;
}, {} as Record<string, { exp: number, level: string }>);

// Location Configuration Dictionary
export const LOCATIONS: Record<string, LocationData> = {
  'dorm': {
    id: 'dorm',
    name: '宿舍',
    description: '温暖的小窝，休息的好地方。',
    backgroundImage: '', 
    connections: {
      'school_gate': 5,
      'bathroom': 1
    }
  },
  'bathroom': {
    id: 'bathroom',
    name: '浴室',
    description: '宿舍配备的公共浴室。',
    backgroundImage: '',
    connections: {
      'dorm': 1
    }
  },
  'school_gate': {
    id: 'school_gate',
    name: '学园正门',
    description: '特雷森学园的入口，威严而气派。',
    backgroundImage: '',
    connections: {
      'dorm': 5,
      'classroom': 5,
      'training_field': 5,
      'cafeteria': 5,
      'library': 5
    }
  },
  'classroom': {
    id: 'classroom',
    name: '教室',
    description: '学习文化知识的地方。',
    backgroundImage: '',
    connections: {
      'school_gate': 5,
      'cafeteria': 2,
      'library': 3,
      'training_field': 5
    }
  },
  'cafeteria': {
    id: 'cafeteria',
    name: '餐厅',
    description: '补充能量的地方，胡萝卜汉堡是招牌。',
    backgroundImage: 'https://www.imgccc.com/2025/11/27/21e7601fcc5eb.png',
    connections: {
      'school_gate': 5,
      'classroom': 2,
      'library': 3,
      'training_field': 5
    }
  },
  'library': {
    id: 'library',
    name: '图书馆',
    description: '安静的学习场所。',
    backgroundImage: '',
    connections: {
      'school_gate': 5,
      'classroom': 3,
      'cafeteria': 3
    }
  },
  'training_field': {
    id: 'training_field',
    name: '训练场',
    description: '挥洒汗水，提升实力的操场。',
    backgroundImage: '',
    connections: {
      'school_gate': 5,
      'classroom': 5,
      'cafeteria': 5
    }
  }
};

export const LEVEL_THRESHOLDS = [
  { level: 'S', exp: 320 },
  { level: 'A', exp: 160 },
  { level: 'B', exp: 80 },
  { level: 'C', exp: 60 },
  { level: 'D', exp: 40 },
  { level: 'E', exp: 20 },
  { level: 'F', exp: 10 },
  { level: 'G', exp: 0 },
];

export const DAILY_SCHEDULE = [
  { start: 540, end: 590, subject: Subject.MATH }, // 9:00 - 9:50
  { start: 600, end: 650, subject: Subject.HISTORY }, // 10:00 - 10:50
  { start: 660, end: 710, subject: Subject.BIOLOGY }, // 11:00 - 11:50
  { start: 720, end: 770, subject: Subject.MUSIC }, // 12:00 - 12:50
];
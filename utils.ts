import { AcademicStats, TimeState, Subject } from './types';
import { LEVEL_THRESHOLDS } from './constants';

export const formatTime = (time: TimeState): string => {
  const h = time.hour.toString().padStart(2, '0');
  const m = time.minute.toString().padStart(2, '0');
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${days[time.weekday]} ${h}:${m}`;
};

export const getGameDate = (dayCount: number): string => {
  const startYear = 1;
  // Game starts April 1st
  const monthDays = [30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 28, 31]; // Apr to Mar
  
  let currentYear = startYear + Math.floor((dayCount - 1) / 365);
  let remainingDays = (dayCount - 1) % 365;
  
  let currentMonthIndex = 0;
  while (remainingDays >= monthDays[currentMonthIndex]) {
    remainingDays -= monthDays[currentMonthIndex];
    currentMonthIndex++;
  }
  
  // Map index back to month number (0=April=4, ..., 8=Dec=12, 9=Jan=1)
  let month = currentMonthIndex + 4;
  if (month > 12) month -= 12;
  
  let day = remainingDays + 1;
  
  return `${currentYear}年${month}月${day}日`;
};

export const calculateLevel = (exp: number): string => {
  const threshold = LEVEL_THRESHOLDS.find(t => exp >= t.exp);
  return threshold ? threshold.level : 'G';
};

export const getMinutesFromMidnight = (time: TimeState): number => {
  return time.hour * 60 + time.minute;
};

// Returns a random item from an array
export const randomChoice = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

export const getGradeColor = (level: string) => {
  switch (level) {
    case 'S': return 'text-yellow-500 font-bold';
    case 'A': return 'text-orange-500 font-bold';
    case 'B': return 'text-purple-500';
    case 'C': return 'text-blue-500';
    case 'D': return 'text-green-500';
    default: return 'text-gray-400';
  }
};
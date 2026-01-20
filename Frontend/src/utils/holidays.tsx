import React from 'react';

export type HolidayType = 
  | 'none'
  | 'halloween'
  | 'christmas'
  | 'newyear'
  | 'kings'
  | 'easter'
  | 'mothersday'
  | 'fathersday'
  | 'valentines'
  | 'independence';

export interface HolidayTheme {
  name: string;
  emoji: string | React.ReactNode;
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  darkGradient: string;
  decorations?: (string | React.ReactNode)[];
  animationEffect?: 'snow' | 'rain' | 'confetti' | 'floating-emojis' | 'hearts' | 'none';
  slogan?: string;
}

const ArgentinaFlag = (
  <svg viewBox="0 0 9 6" width="1em" height="0.67em" className="inline-block align-middle transform -translate-y-1">
    <rect width="9" height="6" fill="#75AADB" />
    <rect y="2" width="9" height="2" fill="#fff" />
    <circle cx="4.5" cy="3" r="0.8" fill="#F6B40E" />
  </svg>
);

export const holidays: Record<HolidayType, HolidayTheme> = {
  none: {
    name: 'Normal',
    emoji: '🍽️',
    primaryColor: 'red',
    secondaryColor: 'red',
    gradient: 'from-red-600 to-red-500',
    darkGradient: 'dark:from-red-700 dark:to-red-600',
    animationEffect: 'none',
  },
  halloween: {
    name: 'Halloween',
    emoji: '🎃',
    primaryColor: 'orange',
    secondaryColor: 'purple',
    gradient: 'from-orange-700 via-purple-700 to-orange-600',
    darkGradient: 'dark:from-orange-400 dark:via-purple-400 dark:to-orange-400',
    decorations: ['🎃', '👻', '🦇', '🕷️'],
    animationEffect: 'floating-emojis',
    slogan: '¡Sabores de miedo para una noche terrorífica!',
  },
  christmas: {
    name: 'Navidad',
    emoji: '🎄',
    primaryColor: 'green',
    secondaryColor: 'red',
    gradient: 'from-green-700 via-red-700 to-green-700',
    darkGradient: 'dark:from-green-400 dark:via-red-400 dark:to-green-400',
    decorations: ['🎄', '🎅', '🎁', '⭐', '❄️'],
    animationEffect: 'snow',
    slogan: '¡Celebra la magia de la Navidad con los mejores sabores!',
  },
  newyear: {
    name: 'Año Nuevo',
    emoji: '🎉',
    primaryColor: 'yellow',
    secondaryColor: 'blue',
    gradient: 'from-purple-700 via-blue-700 to-yellow-600',
    darkGradient: 'dark:from-yellow-300 dark:via-blue-400 dark:to-purple-400',
    decorations: ['🎉', '🎊', '⭐', '✨'],
    animationEffect: 'confetti',
    slogan: '¡Empieza el año con el pie derecho y la panza llena!',
  },
  kings: {
    name: 'Día de Reyes',
    emoji: '👑',
    primaryColor: 'yellow',
    secondaryColor: 'purple',
    gradient: 'from-yellow-700 via-purple-700 to-yellow-700',
    darkGradient: 'dark:from-yellow-400 dark:via-purple-400 dark:to-yellow-400',
    decorations: ['👑', '🎁', '⭐'],
    animationEffect: 'floating-emojis',
    slogan: '¡Un banquete digno de reyes!',
  },
  easter: {
    name: 'Pascua',
    emoji: '🐰',
    primaryColor: 'pink',
    secondaryColor: 'yellow',
    gradient: 'from-pink-700 via-purple-600 to-blue-700',
    darkGradient: 'dark:from-pink-400 dark:via-yellow-300 dark:to-blue-400',
    decorations: ['🐰', '🥚', '🌸', '🌷'],
    animationEffect: 'floating-emojis',
    slogan: '¡Pascua llena de sabor y alegría!',
  },
  mothersday: {
    name: 'Día de la Madre',
    emoji: '💐',
    primaryColor: 'pink',
    secondaryColor: 'red',
    gradient: 'from-pink-600 via-red-600 to-pink-600',
    darkGradient: 'dark:from-pink-600 dark:via-red-500 dark:to-pink-500',
    decorations: ['💐', '🌹', '❤️'],
    animationEffect: 'hearts',
    slogan: '¡Mima a mamá con su comida favorita!',
  },
  fathersday: {
    name: 'Día del Padre',
    emoji: '👔',
    primaryColor: 'blue',
    secondaryColor: 'gray',
    gradient: 'from-blue-700 via-gray-600 to-blue-700',
    darkGradient: 'dark:from-blue-700 dark:via-gray-600 dark:to-blue-600',
    decorations: ['👔', '🎩', '💼'],
    animationEffect: 'floating-emojis',
    slogan: '¡El mejor regalo para papá está en la mesa!',
  },
  valentines: {
    name: 'San Valentín',
    emoji: '💝',
    primaryColor: 'pink',
    secondaryColor: 'red',
    gradient: 'from-pink-600 via-red-600 to-pink-600',
    darkGradient: 'dark:from-pink-600 dark:via-red-600 dark:to-pink-500',
    decorations: ['💝', '❤️', '💕', '🌹'],
    animationEffect: 'hearts',
    slogan: '¡Enamórate del sabor en cada bocado!',
  },
  independence: {
    name: 'Día de la Independencia',
    emoji: ArgentinaFlag,
    primaryColor: 'blue',
    secondaryColor: 'yellow',
    gradient: 'from-blue-700 via-yellow-600 to-blue-600',
    darkGradient: 'dark:from-blue-700 dark:via-yellow-500 dark:to-blue-600',
    decorations: [ArgentinaFlag, '⭐'],
    animationEffect: 'confetti',
    slogan: '¡Celebra la patria con los sabores más nuestros!',
  },
};

// Calcular fecha de Pascua (algoritmo de Meeus/Jones/Butcher)
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Día de la Madre (segundo domingo de mayo en Argentina)
function getMothersDay(year: number): Date {
  const firstSunday = new Date(year, 4, 1); // 1 de mayo
  const dayOfWeek = firstSunday.getDay();
  const daysToAdd = dayOfWeek === 0 ? 7 : 14 - dayOfWeek;
  return new Date(year, 4, 1 + daysToAdd);
}

// Día del Padre (tercer domingo de junio en Argentina)
function getFathersDay(year: number): Date {
  const firstSunday = new Date(year, 5, 1); // 1 de junio
  const dayOfWeek = firstSunday.getDay();
  const daysToAdd = dayOfWeek === 0 ? 14 : 21 - dayOfWeek;
  return new Date(year, 5, 1 + daysToAdd);
}

function isWithinRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

export function getCurrentHoliday(): HolidayType {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Halloween: 25 octubre - 2 noviembre
  if ((month === 10 && day >= 25) || (month === 11 && day <= 2)) {
    return 'halloween';
  }

  // Navidad: 1-31 diciembre
  if (month === 12) {
    return 'christmas';
  }

  // Año Nuevo: 31 diciembre - 2 enero
  if ((month === 12 && day === 31) || (month === 1 && day <= 2)) {
    return 'newyear';
  }

  // Día de Reyes: 3-8 enero
  if (month === 1 && day >= 3 && day <= 8) {
    return 'kings';
  }

  // San Valentín: 10-16 febrero
  if (month === 2 && day >= 10 && day <= 16) {
    return 'valentines';
  }

  // Pascua: 3 días antes hasta 7 días después
  const easter = getEasterDate(year);
  const easterStart = new Date(easter);
  easterStart.setDate(easterStart.getDate() - 3);
  const easterEnd = new Date(easter);
  easterEnd.setDate(easterEnd.getDate() + 7);
  if (isWithinRange(now, easterStart, easterEnd)) {
    return 'easter';
  }

  // Día de la Madre: 3 días antes y 1 día después
  const mothersDay = getMothersDay(year);
  const mothersDayStart = new Date(mothersDay);
  mothersDayStart.setDate(mothersDayStart.getDate() - 3);
  const mothersDayEnd = new Date(mothersDay);
  mothersDayEnd.setDate(mothersDayEnd.getDate() + 1);
  if (isWithinRange(now, mothersDayStart, mothersDayEnd)) {
    return 'mothersday';
  }

  // Día del Padre: 3 días antes y 1 día después
  const fathersDay = getFathersDay(year);
  const fathersDayStart = new Date(fathersDay);
  fathersDayStart.setDate(fathersDayStart.getDate() - 3);
  const fathersDayEnd = new Date(fathersDay);
  fathersDayEnd.setDate(fathersDayEnd.getDate() + 1);
  if (isWithinRange(now, fathersDayStart, fathersDayEnd)) {
    return 'fathersday';
  }

  // Día de la Independencia Argentina: 7-12 julio
  if (month === 7 && day >= 7 && day <= 12) {
    return 'independence';
  }

  return 'none';
}

export function getHolidayTheme(holiday: HolidayType = getCurrentHoliday()): HolidayTheme {
  return holidays[holiday];
}

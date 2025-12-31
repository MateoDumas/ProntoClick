import { useHoliday } from '../contexts/HolidayContext';

export function useHolidayStyles() {
  const { theme: holidayTheme, holiday } = useHoliday();

  const isHoliday = holiday !== 'none';

  return {
    holiday,
    holidayTheme,
    isHoliday,
    // Clases de gradiente para hero sections
    heroGradient: `bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient}`,
    heroOverlay: `bg-gradient-to-r ${holidayTheme.gradient}`,
    // Clases para botones primarios
    primaryButton: `bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient}`,
    // Clases para textos con gradiente
    gradientText: `bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient} bg-clip-text text-transparent`,
    // Clases para badges y destacados
    badgeGradient: `bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient}`,
  };
}

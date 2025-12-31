import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentHoliday, getHolidayTheme, type HolidayType, type HolidayTheme } from '../utils/holidays';

interface HolidayContextType {
  holiday: HolidayType;
  theme: HolidayTheme;
}

const HolidayContext = createContext<HolidayContextType | undefined>(undefined);

export function HolidayProvider({ children }: { children: ReactNode }) {
  const [holiday, setHoliday] = useState<HolidayType>(() => getCurrentHoliday());
  const theme = getHolidayTheme(holiday);

  useEffect(() => {
    // Verificar si cambió el día (para cuando pasa medianoche)
    const checkHoliday = () => {
      const currentHoliday = getCurrentHoliday();
      if (currentHoliday !== holiday) {
        setHoliday(currentHoliday);
      }
    };

    // Verificar cada hora
    const interval = setInterval(checkHoliday, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [holiday]);

  return (
    <HolidayContext.Provider value={{ holiday, theme }}>
      {children}
    </HolidayContext.Provider>
  );
}

export function useHoliday() {
  const context = useContext(HolidayContext);
  if (context === undefined) {
    throw new Error('useHoliday must be used within a HolidayProvider');
  }
  return context;
}

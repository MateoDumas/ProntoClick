import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentHoliday, getHolidayTheme, type HolidayType, type HolidayTheme } from '../utils/holidays';

interface HolidayContextType {
  holiday: HolidayType;
  theme: HolidayTheme;
  setOverrideHoliday: (holiday: HolidayType | null) => void;
  overrideHoliday: HolidayType | null;
}

const HolidayContext = createContext<HolidayContextType | undefined>(undefined);

export function HolidayProvider({ children }: { children: ReactNode }) {
  const [overrideHoliday, setOverrideHolidayState] = useState<HolidayType | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('holiday_override');
      return saved as HolidayType | null;
    }
    return null;
  });

  const [currentRealHoliday, setCurrentRealHoliday] = useState<HolidayType>(() => getCurrentHoliday());

  const setOverrideHoliday = (holiday: HolidayType | null) => {
    setOverrideHolidayState(holiday);
    if (holiday) {
      localStorage.setItem('holiday_override', holiday);
    } else {
      localStorage.removeItem('holiday_override');
    }
  };

  const holiday = overrideHoliday || currentRealHoliday;
  const theme = getHolidayTheme(holiday);

  useEffect(() => {
    // Verificar si cambió el día (para cuando pasa medianoche)
    const checkHoliday = () => {
      const newRealHoliday = getCurrentHoliday();
      if (newRealHoliday !== currentRealHoliday) {
        setCurrentRealHoliday(newRealHoliday);
      }
    };

    // Verificar cada hora
    const interval = setInterval(checkHoliday, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentRealHoliday]);

  return (
    <HolidayContext.Provider value={{ holiday, theme, setOverrideHoliday, overrideHoliday }}>
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

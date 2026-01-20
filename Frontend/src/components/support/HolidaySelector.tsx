import { useState, useRef, useEffect } from 'react';
import { useHoliday } from '../../contexts/HolidayContext';
import { holidays, HolidayType } from '../../utils/holidays';

export default function HolidaySelector() {
  const { setOverrideHoliday, overrideHoliday } = useHoliday();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSelect = (type: HolidayType | null) => {
    setOverrideHoliday(type);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleOpen}
        className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors border border-gray-700 dark:border-gray-600 shadow-sm"
        title="Selector de Festividades (Modo Soporte)"
      >
        <span>🛠️</span>
        <span className="hidden lg:inline">
            {overrideHoliday ? `Modo: ${holidays[overrideHoliday].name}` : 'Festividad: Auto'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Vista previa de festividades
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              Solo visible para ti (Soporte)
            </p>
          </div>
          
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => handleSelect(null)}
              className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${
                !overrideHoliday 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🔄</span>
                <span>Automático (Fecha actual)</span>
              </span>
              {!overrideHoliday && <span>✓</span>}
            </button>
            
            <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2"></div>

            {(Object.keys(holidays) as HolidayType[]).map((key) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${
                  overrideHoliday === key
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg w-6 text-center">{holidays[key].emoji}</span>
                  <span>{holidays[key].name}</span>
                </span>
                {overrideHoliday === key && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

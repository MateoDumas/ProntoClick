import { useHoliday } from '../../contexts/HolidayContext';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const { theme: holidayTheme, holiday } = useHoliday();
  const isHoliday = holiday !== 'none';
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 mb-6 custom-scrollbar">
      {categories.length > 0 && (
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-medium relative overflow-hidden group ${
            activeCategory === null
              ? `${isHoliday ? `bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient}` : 'bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-600'} text-white shadow-glow scale-105`
              : 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-red-50 dark:hover:from-red-900/30 hover:to-red-50 dark:hover:to-red-900/30 hover:text-red-600 dark:hover:text-red-300 hover:scale-105 border border-gray-200 dark:border-gray-600'
          }`}
        >
          <span className="relative z-10">Todos</span>
          {activeCategory === null && (
            <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          )}
        </button>
      )}
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-medium relative overflow-hidden group ${
            activeCategory === category
              ? `${isHoliday ? `bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient}` : 'bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-600'} text-white shadow-glow scale-105`
              : 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-red-50 dark:hover:from-red-900/30 hover:to-red-50 dark:hover:to-red-900/30 hover:text-red-600 dark:hover:text-red-300 hover:scale-105 border border-gray-200 dark:border-gray-600'
          }`}
        >
          <span className="relative z-10">{category}</span>
          {activeCategory === category && (
            <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          )}
        </button>
      ))}
    </div>
  );
}


import React from 'react';
import { useHoliday } from '../../contexts/HolidayContext';

export default function Preloader() {
  const { theme } = useHoliday();

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="relative w-64 h-64">
        {/* SVG Container */}
        <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="scooterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" /> {/* red-600 */}
              <stop offset="100%" stopColor="#F97316" /> {/* orange-500 */}
            </linearGradient>
            <filter id="motionBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2,0" />
            </filter>
          </defs>

          {/* Speed Lines (Wind) */}
          <g className="animate-pulse opacity-70">
            <path d="M20 120 H60" stroke="#F97316" strokeWidth="3" strokeLinecap="round" className="animate-[dash_1s_linear_infinite]" />
            <path d="M10 140 H50" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" className="animate-[dash_1.5s_linear_infinite]" />
            <path d="M30 100 H70" stroke="#F97316" strokeWidth="3" strokeLinecap="round" className="animate-[dash_1.2s_linear_infinite]" />
          </g>

          {/* Scooter & Driver Group - Bouncing Animation */}
          <g className="animate-[bounce_1s_infinite]">
            {/* Scooter Body */}
            <path 
              d="M70 140 L100 140 L110 110 L100 110 L105 90 L85 90 L80 110 L70 140" 
              fill="url(#scooterGradient)" 
              stroke="white" 
              strokeWidth="2"
            />
            
            {/* Delivery Box */}
            <rect x="65" y="100" width="30" height="30" rx="4" fill="#DC2626" stroke="white" strokeWidth="2" />
            <text x="80" y="120" fontSize="16" textAnchor="middle" fill="white" fontWeight="bold">P</text>

            {/* Wheels */}
            <circle cx="75" cy="145" r="12" fill="#374151" stroke="white" strokeWidth="2" className="animate-[spin_1s_linear_infinite]" />
            <circle cx="125" cy="145" r="12" fill="#374151" stroke="white" strokeWidth="2" className="animate-[spin_1s_linear_infinite]" />

            {/* Driver Body */}
            <path d="M105 90 Q115 80 125 90 L130 120 L110 120 Z" fill="#EF4444" />
            
            {/* Driver Head */}
            <circle cx="115" cy="75" r="10" fill="#FDBA74" />
            <path d="M105 75 Q115 65 125 75" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" /> {/* Helmet visor/hair */}
            <circle cx="115" cy="75" r="10" fill="none" stroke="#DC2626" strokeWidth="2" /> {/* Helmet */}
            
            {/* Arms/Handlebars */}
            <path d="M115 90 L135 100" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" />
            <path d="M135 100 L125 105" stroke="#374151" strokeWidth="2" /> {/* Handlebar grip */}
          </g>

          {/* Road */}
          <path d="M10 160 H190" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeDasharray="10 10" className="animate-[dash_0.5s_linear_infinite]" />
        </svg>
      </div>

      <div className="flex flex-col items-center mt-4">
        <h2 className={`text-3xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent animate-pulse`}>
          ProntoClick
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 animate-bounce">
          Tu pedido en camino...
        </p>
      </div>

      <style jsx global>{`
        @keyframes dash {
          from { stroke-dasharray: 10 10; stroke-dashoffset: 20; }
          to { stroke-dasharray: 10 10; stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

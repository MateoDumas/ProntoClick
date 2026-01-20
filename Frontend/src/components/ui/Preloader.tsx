import React from 'react';
import { useHoliday } from '../../contexts/HolidayContext';

export default function Preloader() {
  const { theme } = useHoliday();

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="relative w-64 h-64">
        {/* SVG Container */}
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" /> {/* red-600 */}
              <stop offset="100%" stopColor="#F97316" /> {/* orange-500 */}
            </linearGradient>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9CA3AF" />
              <stop offset="100%" stopColor="#4B5563" />
            </linearGradient>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="0" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Speed Lines (Wind) */}
          <g className="opacity-60">
            <path d="M40 80 H100" stroke="#F97316" strokeWidth="3" strokeLinecap="round" className="animate-[wind_1s_linear_infinite]" />
            <path d="M20 120 H80" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" className="animate-[wind_1.3s_linear_infinite_0.3s]" />
            <path d="M50 150 H120" stroke="#F97316" strokeWidth="3" strokeLinecap="round" className="animate-[wind_0.9s_linear_infinite_0.6s]" />
          </g>

          {/* Scooter Assembly - Bouncing Animation */}
          <g className="animate-[bounce_0.6s_ease-in-out_infinite]">
            
            {/* Rear Wheel */}
            <g transform="translate(90, 150)">
              <circle r="22" fill="#1F2937" /> {/* Tire */}
              <circle r="15" fill="#D1D5DB" stroke="#4B5563" strokeWidth="2" /> {/* Rim */}
              <g className="animate-[spin_0.6s_linear_infinite]">
                 <rect x="-2" y="-15" width="4" height="30" fill="#9CA3AF" />
                 <rect x="-15" y="-2" width="30" height="4" fill="#9CA3AF" />
              </g>
            </g>
            
            {/* Front Wheel */}
            <g transform="translate(210, 150)">
              <circle r="22" fill="#1F2937" /> {/* Tire */}
              <circle r="15" fill="#D1D5DB" stroke="#4B5563" strokeWidth="2" /> {/* Rim */}
              <g className="animate-[spin_0.6s_linear_infinite]">
                 <rect x="-2" y="-15" width="4" height="30" fill="#9CA3AF" />
                 <rect x="-15" y="-2" width="30" height="4" fill="#9CA3AF" />
              </g>
              <rect x="-4" y="-45" width="8" height="50" fill="#4B5563" transform="rotate(-15)" /> {/* Fork */}
            </g>

            {/* Main Body (Vespa Style) */}
            <path 
              d="M70 150 
                 Q 60 120, 80 110 
                 L 140 110 
                 Q 160 110, 170 130 
                 L 190 130 
                 L 200 100 
                 L 190 60 
                 Q 190 50, 200 50 
                 L 210 50 
                 Q 220 50, 220 60 
                 L 215 110 
                 L 180 150 
                 Z" 
              fill="url(#bodyGradient)" 
              filter="url(#dropShadow)"
              stroke="#B91C1C"
              strokeWidth="1"
            />

            {/* Floorboard */}
            <path d="M140 150 L 190 150 L 200 130 L 140 130 Z" fill="#374151" />

            {/* Seat */}
            <path d="M85 110 Q 90 100, 130 100 Q 140 100, 140 110 Z" fill="#1F2937" />

            {/* Handlebars & Headlight */}
            <g transform="translate(205, 55)">
               <rect x="-20" y="-5" width="40" height="6" rx="3" fill="#374151" /> {/* Bars */}
               <path d="M5 -15 L 5 0 L 15 0 L 15 -15 Z" fill="url(#bodyGradient)" /> {/* Headlight housing */}
               <circle cx="15" cy="-8" r="6" fill="#FEF3C7" className="animate-pulse" /> {/* Light */}
            </g>

            {/* Delivery Box (Back) */}
            <g transform="translate(50, 80)">
               <rect x="0" y="0" width="45" height="40" rx="4" fill="#DC2626" stroke="#991B1B" strokeWidth="2" filter="url(#dropShadow)" />
               <path d="M0 10 L45 10" stroke="#991B1B" strokeWidth="1" />
               <text x="22.5" y="28" fontSize="20" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="Arial">P</text>
            </g>

            {/* Windshield (Optional) */}
            <path d="M205 50 L 205 30 Q 205 20, 215 20 L 220 20" fill="none" stroke="#A5F3FC" strokeWidth="2" opacity="0.5" />

          </g>

          {/* Road */}
          <g className="animate-[road_0.6s_linear_infinite]">
             <rect x="0" y="175" width="60" height="3" rx="1.5" fill="#9CA3AF" />
             <rect x="100" y="175" width="80" height="3" rx="1.5" fill="#9CA3AF" />
             <rect x="220" y="175" width="40" height="3" rx="1.5" fill="#9CA3AF" />
             <rect x="300" y="175" width="60" height="3" rx="1.5" fill="#9CA3AF" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col items-center -mt-4">
        <h2 className={`text-2xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
          ProntoClick
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-[bounce_1s_infinite_0ms]"></span>
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-[bounce_1s_infinite_200ms]"></span>
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-[bounce_1s_infinite_400ms]"></span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wind {
          0% { transform: translateX(0); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateX(100px); opacity: 0; }
        }
        @keyframes road {
          from { transform: translateX(0); }
          to { transform: translateX(-100px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}

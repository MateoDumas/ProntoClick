import React from 'react';
import { useHoliday } from '../../contexts/HolidayContext';

export default function Preloader() {
  const { theme } = useHoliday();

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="relative w-48 h-48">
        {/* SVG Container */}
        <svg viewBox="0 0 200 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="scooterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" /> {/* red-600 */}
              <stop offset="100%" stopColor="#F97316" /> {/* orange-500 */}
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
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

          {/* Speed Lines (Wind) - Background */}
          <g className="opacity-40">
            <path d="M20 60 H80" stroke="#F97316" strokeWidth="2" strokeLinecap="round" className="animate-[wind_1s_linear_infinite]" />
            <path d="M10 90 H60" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" className="animate-[wind_1.2s_linear_infinite_0.2s]" />
            <path d="M30 120 H90" stroke="#F97316" strokeWidth="2" strokeLinecap="round" className="animate-[wind_0.8s_linear_infinite_0.5s]" />
          </g>

          {/* Scooter Group - Bouncing Animation */}
          <g className="animate-[bounce_0.8s_infinite]">
            
            {/* Rear Wheel */}
            <circle cx="60" cy="110" r="14" fill="#374151" className="animate-[spin_0.8s_linear_infinite]" />
            <circle cx="60" cy="110" r="8" fill="#D1D5DB" className="animate-[spin_0.8s_linear_infinite]" />
            
            {/* Front Wheel */}
            <circle cx="140" cy="110" r="14" fill="#374151" className="animate-[spin_0.8s_linear_infinite]" />
            <circle cx="140" cy="110" r="8" fill="#D1D5DB" className="animate-[spin_0.8s_linear_infinite]" />

            {/* Scooter Body Frame */}
            <path 
              d="M60 110 L90 110 L105 100 L130 100 L140 110" 
              fill="none" 
              stroke="#4B5563" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Main Body Fairing */}
            <path 
              d="M85 110 Q85 70 115 50 L125 50 L135 110 L85 110 Z" 
              fill="url(#scooterGradient)" 
              filter="url(#shadow)"
            />
            
            {/* Handlebars */}
            <path d="M115 50 L110 40 L130 40" fill="none" stroke="#374151" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Delivery Box */}
            <rect x="45" y="65" width="40" height="35" rx="4" fill="#DC2626" filter="url(#shadow)" />
            <rect x="45" y="65" width="40" height="10" rx="2" fill="#B91C1C" /> {/* Box lid */}
            
            {/* Logo on Box */}
            <text x="65" y="90" fontSize="16" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="Arial">P</text>

            {/* Headlight */}
            <path d="M125 55 L128 55" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Road Moving Effect */}
          <g className="animate-[road_0.8s_linear_infinite]">
             <rect x="0" y="128" width="40" height="2" rx="1" fill="#E5E7EB" />
             <rect x="60" y="128" width="60" height="2" rx="1" fill="#E5E7EB" />
             <rect x="140" y="128" width="30" height="2" rx="1" fill="#E5E7EB" />
             <rect x="200" y="128" width="40" height="2" rx="1" fill="#E5E7EB" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col items-center mt-2">
        <h2 className={`text-2xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent animate-pulse`}>
          ProntoClick
        </h2>
        <div className="flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[bounce_1s_infinite_0ms]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[bounce_1s_infinite_200ms]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-[bounce_1s_infinite_400ms]"></span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); transform-origin: center; }
          to { transform: rotate(360deg); transform-origin: center; }
        }
        @keyframes wind {
          0% { transform: translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100px); opacity: 0; }
        }
        @keyframes road {
          from { transform: translateX(0); }
          to { transform: translateX(-100px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

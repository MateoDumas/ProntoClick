import { useEffect, useState } from 'react';
import { useHoliday } from '../../contexts/HolidayContext';

export default function HolidayOverlay() {
  const { theme, holiday } = useHoliday();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || holiday === 'none' || theme.animationEffect === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Styles for animations */}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) translateX(0); opacity: 1; }
          100% { transform: translateY(110vh) translateX(20px); opacity: 0.3; }
        }
        @keyframes rise {
          0% { transform: translateY(110vh) scale(0.5); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-10vh) scale(1.5); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(15px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Snow Effect */}
      {theme.animationEffect === 'snow' && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white text-opacity-80 select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                fontSize: `${Math.random() * 1.5 + 0.5}rem`,
                animation: `fall ${Math.random() * 5 + 5}s linear infinite`,
                animationDelay: `-${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {/* Confetti Effect */}
      {theme.animationEffect === 'confetti' && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => {
            const colors = [theme.primaryColor, theme.secondaryColor, 'yellow', 'blue', 'white'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-sm"
                style={{
                  backgroundColor: color, // Fallback
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  animation: `fall ${Math.random() * 3 + 2}s linear infinite, spin ${Math.random() * 2 + 1}s linear infinite`,
                  animationDelay: `-${Math.random() * 5}s`,
                  // Note: we can't easily use tailwind colors in inline styles without a map, 
                  // so we might need a mapping or just rely on CSS variables if available.
                  // For simplicity, we'll use a style prop with hardcoded colors or simple names
                  // if the theme colors are simple names (red, blue, etc).
                }}
              />
            );
          })}
        </div>
      )}

      {/* Floating Emojis Effect */}
      {theme.animationEffect === 'floating-emojis' && theme.decorations && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl select-none opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `rise ${Math.random() * 15 + 10}s linear infinite`,
                animationDelay: `-${Math.random() * 15}s`,
                fontSize: `${Math.random() * 2 + 2}rem`,
              }}
            >
              {theme.decorations![Math.floor(Math.random() * theme.decorations!.length)]}
            </div>
          ))}
        </div>
      )}

      {/* Hearts Effect */}
      {theme.animationEffect === 'hearts' && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-red-500 select-none"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: '-10%',
                fontSize: `${Math.random() * 2 + 1}rem`,
                animation: `rise ${Math.random() * 6 + 4}s ease-in infinite`,
                animationDelay: `-${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.5,
              }}
            >
              {['❤️', '💖', '💗', '💓'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

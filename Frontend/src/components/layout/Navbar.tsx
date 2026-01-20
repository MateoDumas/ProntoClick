import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCurrentUser } from '../../hooks/useAuth';
import { useHoliday } from '../../contexts/HolidayContext';
import SearchBar from '../search/SearchBar';
import UserMenu from './UserMenu';
import PointsDisplay from '../rewards/PointsDisplay';
import ThemeToggle from '../ui/ThemeToggle';
import HolidaySelector from '../support/HolidaySelector';

export default function Navbar() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { theme: holidayTheme } = useHoliday();

  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  const navLinks = [
    { href: '/restaurants', label: 'Restaurantes' },
    { href: '/promotions', label: 'Promociones' },
    ...(user ? [{ href: '/saved-lists', label: 'Mis Listas' }] : []),
  ];

  return (
    <nav className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className={`w-10 h-10 bg-gradient-to-br ${holidayTheme.gradient} ${holidayTheme.darkGradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r ${holidayTheme.gradient} bg-clip-text text-transparent dark:bg-none dark:text-red-400`}>
              ProntoClick
            </span>
          </Link>

          {/* Search Bar - Solo en desktop */}
          <div className="hidden lg:flex max-w-xs mx-2">
            <SearchBar />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? `bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient} text-white shadow-md`
                    : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {(user?.role === 'support' || user?.role === 'admin') && (
              <HolidaySelector />
            )}
            <ThemeToggle />
            {user ? (
              <>
                <div className="hidden sm:block">
                  <PointsDisplay />
                </div>
                <UserMenu />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className={`px-4 py-2 bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all shadow-sm`}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

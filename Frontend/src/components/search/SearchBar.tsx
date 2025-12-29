import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { searchAll } from '../../services/search.service';
import type { SearchResults } from '../../services/search.service';
import Link from 'next/link';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Limpiar la query antes de buscar (eliminar puntos innecesarios)
    const cleanQuery = query
      .replace(/\.(\s|$)/g, '$1') // Eliminar punto seguido de espacio o al final
      .replace(/\./g, '') // Eliminar todos los puntos restantes
      .trim();
    
    if (cleanQuery.length >= 2) {
      setLoading(true);
      const timeoutId = setTimeout(async () => {
        try {
          // Usar la query limpia para la búsqueda
          const searchResults = await searchAll(cleanQuery);
          setResults(searchResults);
          setIsOpen(true);
        } catch (error) {
          console.error('Error searching:', error);
          setResults(null);
        } finally {
          setLoading(false);
        }
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    } else {
      setResults(null);
      setIsOpen(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Limpiar la query antes de enviar (eliminar todos los puntos)
    const cleanQuery = query.replace(/\./g, '').trim();
    if (cleanQuery) {
      router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
      setIsOpen(false);
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta búsqueda por voz');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let transcript = event.results[0][0].transcript;
      // Limpiar puntos y espacios extra del reconocimiento de voz
      transcript = transcript
        .replace(/\./g, '') // Eliminar todos los puntos
        .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
        .trim(); // Eliminar espacios al inicio y final
      setQuery(transcript);
      setIsListening(false);
      recognition.stop();
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognition.stop();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glassmorphism background with gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 via-red-400/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
        
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Busca productos, platos, restaurantes..."
            value={query}
            onChange={(e) => {
              // Limpiar puntos automáticos que puedan agregarse
              let value = e.target.value;
              // Eliminar todos los puntos automáticos (el reconocimiento de voz los agrega)
              // Mantener solo el texto sin puntos
              value = value.replace(/\./g, ''); // Eliminar todos los puntos
              setQuery(value);
            }}
            onFocus={() => {
              if (results) setIsOpen(true);
            }}
            className="w-full px-4 py-2.5 pl-12 pr-20 rounded-xl text-sm font-medium
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
              border-2 border-gray-200/80 dark:border-gray-700/80
              shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50
              focus:bg-white dark:focus:bg-gray-800
              focus:border-red-400 dark:focus:border-red-500
              focus:shadow-xl focus:shadow-red-500/20
              focus:ring-4 focus:ring-red-500/10
              focus:outline-none
              transition-all duration-300 ease-out
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              hover:border-red-300 dark:hover:border-red-500 hover:shadow-xl hover:shadow-red-200/30
              group-hover:scale-[1.01]
              text-gray-900 dark:text-gray-100"
          />
          
          {/* Search Icon with animation */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {/* Voice Search Button - Enhanced */}
          <button
            type="button"
            onClick={isListening ? stopVoiceSearch : startVoiceSearch}
            className={`absolute right-10 top-1/2 transform -translate-y-1/2 
              p-1.5 rounded-lg transition-all duration-300
              ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50 animate-pulse scale-110'
                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50/80 hover:scale-110 active:scale-95'
              }`}
            title={isListening ? 'Detener búsqueda por voz' : 'Búsqueda por voz'}
          >
            {isListening ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          {/* Loading Spinner - Enhanced */}
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="relative">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-200 dark:border-red-800"></div>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-red-600 dark:border-red-400 absolute top-0 left-0"></div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Dropdown de resultados - Enhanced */}
      {isOpen && results && (
        <div className="absolute top-full mt-3 w-full 
          bg-white/95 backdrop-blur-xl
          rounded-2xl 
          shadow-2xl shadow-gray-900/10
          border border-gray-200/80
          z-50 max-h-96 overflow-y-auto custom-scrollbar
          animate-fade-in-down
          overflow-hidden">
          {results.total === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No se encontraron resultados</p>
              <p className="text-sm text-gray-400 mt-1">Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <>
              {/* Productos - PRIORIDAD (mostrar primero) */}
              {results.products.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <span>🍕</span>
                    Productos ({results.products.length})
                  </h3>
                  <div className="space-y-2">
                    {results.products.map((product) => (
                      <Link
                        key={product.id}
                        href={
                          product.restaurantId === 'market'
                            ? `/market/${product.category}`
                            : `/restaurants/${product.restaurantId}`
                        }
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl 
                          hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50/50 
                          transition-all duration-200 group
                          hover:shadow-sm hover:scale-[1.01]"
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {product.restaurant?.name || 'Mercado'}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-red-600">
                          ${product.price.toFixed(2)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Restaurantes - Secundario */}
              {results.restaurants.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <span>🏪</span>
                    Restaurantes ({results.restaurants.length})
                  </h3>
                  <div className="space-y-2">
                    {results.restaurants.map((restaurant) => (
                      <Link
                        key={restaurant.id}
                        href={`/restaurants/${restaurant.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl 
                          hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50/50 
                          transition-all duration-200 group
                          hover:shadow-sm hover:scale-[1.01]"
                      >
                        {restaurant.image ? (
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {restaurant.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                            {restaurant.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {restaurant.description}
                          </p>
                        </div>
                        {restaurant.rating && (
                          <div className="flex items-center gap-1 text-yellow-500">
                            <span className="text-sm">⭐</span>
                            <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}


              {/* Ver todos los resultados */}
              <div className="p-4 border-t border-gray-100">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 px-4 
                    bg-gradient-to-r from-red-600 to-red-500 
                    text-white rounded-xl 
                    hover:from-red-700 hover:to-red-600 
                    transition-all duration-300 
                    font-semibold
                    shadow-lg shadow-red-500/30
                    hover:shadow-xl hover:shadow-red-500/40
                    hover:scale-[1.02] active:scale-[0.98]"
                >
                  Ver todos los resultados ({results.total})
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}


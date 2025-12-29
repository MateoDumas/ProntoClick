import Link from 'next/link';
import type { Restaurant } from '../../types/restaurant';
import FavoriteButton from '../favorites/FavoriteButton';

export default function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <Link href={`/restaurants/${r.id}`} className="block group">
      <article className="glass rounded-3xl overflow-hidden hover-lift relative card-3d border border-white/30">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:via-red-500/10 group-hover:to-red-500/10 transition-all duration-500 rounded-3xl"></div>
        
        {/* Image Container with Overlay */}
        <div className="relative h-56 w-full bg-gradient-to-br from-gray-200 via-red-100 to-red-50 overflow-hidden">
          {r.image ? (
            <>
              <img
                src={r.image}
                alt={r.name}
                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Shimmer overlay */}
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-400 to-red-500">
              <svg
                className="w-20 h-20 text-white opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          )}
          
          {/* Rating Badge - Floating */}
          {r.rating && (
            <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-glow transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 z-10">
              <span className="text-yellow-500 text-base animate-pulse float">⭐</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{r.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-4 left-4 z-10">
            <FavoriteButton type="restaurant" id={r.id} />
          </div>

          {/* Fast Delivery Badge */}
          {r.deliveryTime && parseInt(r.deliveryTime.split('-')[0]) <= 25 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-glow flex items-center gap-1 transform group-hover:scale-110 transition-transform duration-300 z-10 pulse-glow">
              <span className="animate-pulse">⚡</span>
              <span>Rápido</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-white/90 dark:from-gray-800/90 via-white/80 dark:via-gray-800/80 to-gray-50/90 dark:to-gray-900/90 backdrop-blur-sm relative z-10 transition-colors duration-200">
          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 dark:group-hover:from-red-400 group-hover:via-red-500 dark:group-hover:via-red-400 group-hover:to-red-600 dark:group-hover:to-red-400 transition-all duration-500">
            {r.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">{r.description}</p>
          
          {/* Info Row */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
              {r.deliveryTime && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">{r.deliveryTime}</span>
                </div>
              )}
              {r.minOrder && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">Min. ${r.minOrder.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            {/* Arrow Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-red-500 to-red-600 rounded-full flex items-center justify-center transform group-hover:translate-x-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-glow group-hover:shadow-glow-lg">
              <svg
                className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

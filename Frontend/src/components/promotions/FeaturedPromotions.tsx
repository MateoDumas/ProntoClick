import { useEffect, useState } from 'react';
import { getFeaturedPromotions } from '../../services/promotion.service';
import type { Promotion } from '../../types/promotion';
import PromotionCard from './PromotionCard';
import Link from 'next/link';

export default function FeaturedPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await getFeaturedPromotions(3);
      setPromotions(data);
    } catch (error) {
      console.error('Error loading featured promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || promotions.length === 0) {
    return null;
  }

  return (
    <section className="fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Promociones del Día
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Ofertas especiales que cambian cada día
          </p>
        </div>
        <Link
          href="/promotions"
          className="px-5 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
        >
          Ver todas →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {promotions.map((promotion, index) => (
          <div
            key={promotion.id}
            className="fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PromotionCard promotion={promotion} />
          </div>
        ))}
      </div>
    </section>
  );
}


import Link from 'next/link';

interface MarketCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

const categories: MarketCategory[] = [
  {
    id: 'tecnologia',
    name: 'Tecnología',
    icon: '💻',
    description: 'Dispositivos, accesorios y más',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'almacen',
    name: 'Almacén',
    icon: '🛒',
    description: 'Productos de primera necesidad',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'farmacia',
    name: 'Farmacia',
    icon: '💊',
    description: 'Medicamentos y productos de salud',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    icon: '🥤',
    description: 'Bebidas y refrescos',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'limpieza',
    name: 'Limpieza',
    icon: '🧹',
    description: 'Productos de limpieza e higiene',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'mascotas',
    name: 'Mascotas',
    icon: '🐾',
    description: 'Alimentos y accesorios para mascotas',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'bebes',
    name: 'Bebés',
    icon: '👶',
    description: 'Productos para bebés y niños',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'deportes',
    name: 'Deportes',
    icon: '⚽',
    description: 'Artículos deportivos y fitness',
    color: 'from-indigo-500 to-indigo-600',
  },
];

export default function MarketCategories() {
  return (
    <section className="fade-in">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Mercado
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-300">
          Explora nuestras categorías y encuentra todo lo que necesitas
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-5">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/market/${category.id}`}
            className="group block"
          >
            <div
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white hover-lift relative overflow-hidden transition-all duration-300 transform hover:scale-105`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500 rounded-2xl"></div>
              
              {/* Icon */}
              <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10">
                {category.icon}
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1 group-hover:text-white transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-white/90 opacity-90 group-hover:opacity-100 transition-opacity">
                  {category.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <svg
                  className="w-5 h-5 text-white"
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
          </Link>
        ))}
      </div>
    </section>
  );
}


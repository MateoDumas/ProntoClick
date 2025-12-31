import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700 mt-20 relative overflow-hidden transition-colors duration-200">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-50/20 to-white dark:via-red-900/20 dark:to-gray-950 transition-colors duration-200"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
                ProntoClick
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base max-w-md leading-relaxed mb-4">
              Tu plataforma de delivery favorita. Pedidos rápidos, comida deliciosa,
              todo en un solo lugar.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                <span className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-lg">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                <span className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-lg">📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                <span className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-lg">🐦</span>
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/restaurants" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Promociones
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  ProntoPuntos
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Buscar
                </Link>
              </li>
            </ul>
          </div>

          {/* Mi Cuenta */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Mi Cuenta</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/orders" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link href="/addresses" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Direcciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Información</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium inline-block transform hover:translate-x-1">
                  Recomendaciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Contacto</h3>
              <ul className="space-y-3">
                <li className="text-gray-600 dark:text-gray-300 text-sm">
                  <a href="mailto:soporte@prontoclick.com" className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <span>📧</span>
                    <span>soporte@prontoclick.com</span>
                  </a>
                </li>
                <li className="text-gray-600 dark:text-gray-300 text-sm">
                  <a href="tel:+15551234567" className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <span>📞</span>
                    <span>+1 (555) 123-4567</span>
                  </a>
                </li>
                <li className="text-gray-600 dark:text-gray-300 text-sm">
                  <span className="flex items-center gap-2">
                    <span>📍</span>
                    <span>Lun - Dom: 9:00 AM - 10:00 PM</span>
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Newsletter</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                Suscríbete para recibir ofertas exclusivas y promociones
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-sm transition-colors"
                />
                <button className="px-6 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-medium text-sm">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} ProntoClick. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium">
              Términos
            </Link>
            <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm transition-all duration-300 font-medium">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

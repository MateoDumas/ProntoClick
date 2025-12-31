export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-4">
              Sobre Nosotros
            </h1>
            <p className="text-xl text-gray-600">
              Tu plataforma de delivery favorita
            </p>
          </div>

          {/* Mission Section */}
          <section className="bg-white rounded-2xl p-8 md:p-12 mb-8 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              En ProntoClick, nos dedicamos a conectar a nuestros usuarios con los mejores restaurantes y productos de su ciudad, 
              ofreciendo una experiencia de delivery rápida, confiable y deliciosa.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Creemos que la comida es más que nutrición; es una experiencia que une a las personas y crea momentos memorables. 
              Por eso, trabajamos incansablemente para hacer que cada pedido sea perfecto.
            </p>
          </section>

          {/* Values Section */}
          <section className="bg-white rounded-2xl p-8 md:p-12 mb-8 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestros Valores</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Rapidez</h3>
                <p className="text-gray-600 text-sm">
                  Entregas rápidas y eficientes para que disfrutes tu comida cuando la necesites.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Calidad</h3>
                <p className="text-gray-600 text-sm">
                  Trabajamos solo con los mejores restaurantes y productos para garantizar la excelencia.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❤️</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Compromiso</h3>
                <p className="text-gray-600 text-sm">
                  Tu satisfacción es nuestra prioridad. Estamos aquí para ti en cada paso del camino.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-2xl p-8 md:p-12 mb-8 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Por qué elegir ProntoClick?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Amplia variedad</h3>
                  <p className="text-gray-600">
                    Desde restaurantes locales hasta productos de mercado, tenemos todo lo que necesitas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Sistema de puntos</h3>
                  <p className="text-gray-600">
                    Gana ProntoPuntos con cada compra y canjéalos por increíbles recompensas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Promociones diarias</h3>
                  <p className="text-gray-600">
                    Ofertas especiales que cambian cada día para darte siempre las mejores opciones.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pago seguro</h3>
                  <p className="text-gray-600">
                    Múltiples métodos de pago con total seguridad y protección de datos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
            <p className="text-xl text-red-100 mb-6">
              Únete a miles de usuarios que ya disfrutan de ProntoClick
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/register"
                className="px-8 py-3 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-lg"
              >
                Crear Cuenta
              </a>
              <a
                href="/restaurants"
                className="px-8 py-3 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-900 transition-colors border border-red-500"
              >
                Ver Restaurantes
              </a>
            </div>
          </section>
        </div>
      </div>
  );
}


export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 dark:border-gray-700 space-y-8 transition-colors duration-200">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. Aceptación de los Términos</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Al acceder y utilizar ProntoClick, aceptas estar sujeto a estos Términos y Condiciones. 
                Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">2. Uso del Servicio</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                ProntoClick es una plataforma que conecta usuarios con restaurantes y proveedores de productos. 
                Nos comprometemos a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Proporcionar un servicio confiable y seguro</li>
                <li>Proteger la privacidad de nuestros usuarios</li>
                <li>Ofrecer una experiencia de usuario excepcional</li>
                <li>Mantener la calidad de los productos y servicios ofrecidos</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">3. Cuentas de Usuario</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Para utilizar ciertas funcionalidades de ProntoClick, debes crear una cuenta. Eres responsable de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Mantener la confidencialidad de tu contraseña</li>
                <li>Proporcionar información precisa y actualizada</li>
                <li>Notificarnos inmediatamente de cualquier uso no autorizado</li>
                <li>Ser mayor de edad o tener el consentimiento de un tutor legal</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">4. Pedidos y Pagos</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Al realizar un pedido:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Los precios pueden variar según el restaurante o proveedor</li>
                <li>Los tiempos de entrega son estimados y pueden variar</li>
                <li>Los pagos se procesan de forma segura</li>
                <li>Las políticas de cancelación y reembolso dependen del restaurante o proveedor</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">5. Sistema de ProntoPuntos</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Nuestro sistema de puntos tiene las siguientes características:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Los puntos se otorgan según el monto de cada pedido</li>
                <li>Los puntos pueden canjearse por recompensas disponibles</li>
                <li>Nos reservamos el derecho de modificar el sistema de puntos con previo aviso</li>
                <li>Los puntos no tienen valor monetario y no son transferibles</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">6. Limitación de Responsabilidad</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                ProntoClick actúa como intermediario entre usuarios y restaurantes/proveedores. 
                No somos responsables de la calidad, seguridad o entrega de los productos ordenados. 
                Cualquier disputa relacionada con un pedido debe resolverse directamente con el restaurante o proveedor.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">7. Modificaciones</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Las modificaciones entrarán en vigor al publicarse en esta página. 
                Te recomendamos revisar periódicamente estos términos.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">8. Contacto</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos en:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> <a href="mailto:legal@prontoclick.com" className="text-red-600 dark:text-red-400 hover:underline">legal@prontoclick.com</a>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Teléfono:</strong> <a href="tel:+15551234567" className="text-red-600 dark:text-red-400 hover:underline">+1 (555) 123-4567</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
  );
}


export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent mb-4">
              Política de Privacidad
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg dark:shadow-xl dark:shadow-black/20 border border-gray-200 dark:border-gray-700/50 space-y-8 transition-all duration-200">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. Información que Recopilamos</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Recopilamos información que nos proporcionas directamente, incluyendo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Información de cuenta (nombre, email, contraseña)</li>
                <li>Información de perfil (dirección, teléfono, preferencias)</li>
                <li>Información de pedidos (historial, direcciones de entrega)</li>
                <li>Información de pago (métodos de pago guardados, historial de transacciones)</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">2. Cómo Usamos tu Información</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Procesar y gestionar tus pedidos</li>
                <li>Mejorar nuestros servicios y experiencia de usuario</li>
                <li>Enviarte notificaciones sobre tu cuenta y pedidos</li>
                <li>Personalizar recomendaciones y ofertas</li>
                <li>Procesar pagos y prevenir fraudes</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">3. Compartir Información</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Compartimos tu información únicamente en las siguientes circunstancias:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li><strong>Restaurantes y Proveedores:</strong> Información necesaria para procesar y entregar tus pedidos</li>
                <li><strong>Proveedores de Servicios:</strong> Empresas que nos ayudan a operar (procesamiento de pagos, entrega)</li>
                <li><strong>Cumplimiento Legal:</strong> Cuando sea requerido por ley o para proteger nuestros derechos</li>
                <li><strong>Con tu Consentimiento:</strong> En cualquier otra situación con tu autorización explícita</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">4. Seguridad de los Datos</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal, incluyendo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mt-4">
                <li>Encriptación de datos sensibles</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo regular de nuestros sistemas</li>
                <li>Capacitación del personal en seguridad de datos</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">5. Tus Derechos</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Tienes derecho a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Acceder a tu información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Exportar tus datos en formato legible</li>
                <li>Retirar tu consentimiento en cualquier momento</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">6. Cookies y Tecnologías Similares</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso del sitio y personalizar contenido. 
                Puedes gestionar tus preferencias de cookies a través de la configuración de tu navegador.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">7. Retención de Datos</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Conservamos tu información personal durante el tiempo necesario para cumplir con los propósitos descritos en esta política, 
                a menos que la ley requiera o permita un período de retención más largo.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">8. Cambios a esta Política</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios significativos 
                publicando la nueva política en esta página y actualizando la fecha de "última actualización".
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">9. Contacto</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Si tienes preguntas o inquietudes sobre esta Política de Privacidad o sobre cómo manejamos tu información, contáctanos:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> <a href="mailto:privacidad@prontoclick.com" className="text-red-600 dark:text-red-400 hover:underline">privacidad@prontoclick.com</a>
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


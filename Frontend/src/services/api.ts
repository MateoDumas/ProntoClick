import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // si usas cookies httpOnly
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No hay token JWT en localStorage. La petición puede fallar con 401.');
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si no hay respuesta, el servidor no está disponible
    if (!error.response) {
      const connectionError = new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3001');
      (connectionError as any).isConnectionError = true;
      return Promise.reject(connectionError);
    }

    if (error.response?.status === 401) {
      // Token inválido o expirado
      console.warn('⚠️ Error 401: Token inválido o expirado. Eliminando token del localStorage.');
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        console.log('Token encontrado pero inválido. Eliminándolo...');
        localStorage.removeItem('token');
        // Redirigir al login solo si estamos en el cliente
        if (typeof window !== 'undefined') {
          // Esperar un momento antes de redirigir para evitar loops
          setTimeout(() => {
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
              window.location.href = '/login';
            }
          }, 100);
        }
      } else {
        console.warn('⚠️ No hay token en localStorage. El usuario necesita iniciar sesión.');
      }
    }
    return Promise.reject(error);
  }
);

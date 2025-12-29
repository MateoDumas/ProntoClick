// Utilidades para Google Maps

export interface Location {
  lat: number;
  lng: number;
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * @returns Distancia en kilómetros
 */
export function calculateDistance(
  point1: Location,
  point2: Location
): number {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Redondear a 1 decimal
}

/**
 * Calcula el tiempo estimado de entrega basado en la distancia
 * @param distanceKm Distancia en kilómetros
 * @returns Tiempo estimado en minutos
 */
export function estimateDeliveryTime(distanceKm: number): number {
  // Velocidad promedio: 30 km/h en ciudad
  const averageSpeed = 30;
  const timeInHours = distanceKm / averageSpeed;
  const timeInMinutes = timeInHours * 60;
  
  // Tiempo mínimo de preparación: 15 minutos
  const preparationTime = 15;
  
  return Math.round(timeInMinutes + preparationTime);
}

/**
 * Calcula el costo de envío basado en la distancia
 * @param distanceKm Distancia en kilómetros
 * @returns Costo de envío
 */
export function calculateDeliveryFee(distanceKm: number): number {
  // Tarifa base
  const baseFee = 2.99;
  
  // Tarifa por kilómetro adicional después de 5km
  if (distanceKm <= 5) {
    return baseFee;
  }
  
  const additionalKm = distanceKm - 5;
  const additionalFee = additionalKm * 0.5; // $0.50 por km adicional
  
  return Math.round((baseFee + additionalFee) * 100) / 100;
}

/**
 * Obtiene la ubicación actual del usuario
 */
export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no está disponible'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Convierte grados a radianes
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Formatea la distancia para mostrar
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Formatea el tiempo de entrega
 */
export function formatDeliveryTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}


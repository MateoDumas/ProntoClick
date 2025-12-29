/**
 * Utilidades para reproducir sonidos de notificaciones
 */

interface SoundOptions {
  frequency?: number;
  duration?: number;
  volume?: number;
  type?: 'beep' | 'success' | 'warning' | 'notification';
}

/**
 * Reproduce un sonido usando la Web Audio API
 */
// Mantener una referencia global del AudioContext para reutilizarlo
let globalAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!globalAudioContext || globalAudioContext.state === 'closed') {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return globalAudioContext;
}

export function playSound(options: SoundOptions = {}) {
  try {
    const {
      frequency = 800,
      duration = 200,
      volume = 0.3,
      type = 'beep',
    } = options;

    const audioContext = getAudioContext();
    
    // Si el contexto está suspendido, reanudarlo
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configurar el tipo de sonido según el estado
    switch (type) {
      case 'success':
        // Sonido de éxito: dos tonos ascendentes
        playSuccessSound(audioContext);
        break;
      case 'warning':
        // Sonido de advertencia: tono medio
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.value = volume;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
        break;
      case 'notification':
        // Sonido de notificación: tono suave
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration / 1000);
        break;
      default:
        // Beep simple
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.value = volume;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }
  } catch (error) {
    console.warn('No se pudo reproducir el sonido:', error);
  }
}

/**
 * Reproduce un sonido de éxito (dos tonos ascendentes)
 */
function playSuccessSound(audioContext: AudioContext) {
  // Si el contexto está suspendido, reanudarlo
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  const frequencies = [523.25, 659.25]; // Do y Mi
  let currentIndex = 0;
  const oscillators: OscillatorNode[] = [];

  function playTone(index: number) {
    if (index >= frequencies.length) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillators.push(oscillator);

    oscillator.frequency.value = frequencies[index];
    oscillator.type = 'sine';

    const startTime = audioContext.currentTime + index * 0.15;
    const duration = 0.2;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    
    // Limpiar el oscilador después de que termine
    oscillator.onended = () => {
      const idx = oscillators.indexOf(oscillator);
      if (idx > -1) {
        oscillators.splice(idx, 1);
      }
    };

    currentIndex++;
    if (currentIndex < frequencies.length) {
      setTimeout(() => playTone(currentIndex), 150);
    }
  }

  playTone(0);
}

/**
 * Sonidos específicos para cada estado del pedido
 */
export const orderStatusSounds = {
  confirmed: () => playSound({ type: 'success', volume: 0.3 }),
  preparing: () => playSound({ type: 'notification', frequency: 600, duration: 300, volume: 0.25 }),
  ready: () => playSound({ type: 'success', volume: 0.35 }),
  on_the_way: () => playSound({ type: 'notification', frequency: 700, duration: 400, volume: 0.3 }),
  delivered: () => {
    // Sonido especial de entrega: tres tonos ascendentes
    playSound({ type: 'success', volume: 0.4 });
    setTimeout(() => playSound({ type: 'success', volume: 0.4 }), 200);
    setTimeout(() => playSound({ type: 'success', volume: 0.4 }), 400);
  },
  cancelled: () => playSound({ type: 'warning', frequency: 400, duration: 300, volume: 0.3 }),
};


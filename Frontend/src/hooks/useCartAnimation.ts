import { useState, useEffect } from 'react';

interface UseCartAnimationReturn {
  isAnimating: boolean;
  triggerAnimation: () => void;
}

export function useCartAnimation(): UseCartAnimationReturn {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return { isAnimating, triggerAnimation };
}


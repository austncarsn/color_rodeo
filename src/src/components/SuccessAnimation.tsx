import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SuccessAnimationProps {
  trigger: boolean;
  colors: string[];
}

export function SuccessAnimation({ trigger, colors }: SuccessAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger && colors.length > 0) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, colors.length]);

  if (!show || colors.length === 0) return null;

  // Generate particles using the palette colors
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    delay: Math.random() * 0.3,
    duration: 1 + Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: particle.color }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { CountdownState } from '@/lib/countdown';
import { useCountdown } from '@/hooks/useCountdown';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CountdownProps {
  targetDate: Date;
  initialState?: CountdownState;
  className?: string;
}

function CountdownComponent({
  targetDate,
  initialState,
  className = '',
}: CountdownProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    targetDate,
    initialState
  );
  const shouldReduceMotion = useReducedMotion();

  if (isExpired) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-xl font-serif text-wedding-accent">
          O grande dia chegou! 🎉
        </p>
      </div>
    );
  }

  const timeUnits = [
    { value: days, label: 'Dias' },
    { value: hours, label: 'Horas' },
    { value: minutes, label: 'Minutos' },
    { value: seconds, label: 'Segundos' },
  ];

  return (
    <div className={`bg-wedding-primary text-white py-3 sm:py-4 ${className}`} role="timer" aria-live="polite" aria-label="Contagem regressiva para o casamento">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-2">
          <p className="text-xs sm:text-sm font-medium text-wedding-sky">Contagem Regressiva</p>
        </div>
        <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center min-w-15 sm:min-w-17.5">
              <motion.div
                key={unit.value}
                initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-white"
                aria-label={`${unit.value} ${unit.label}`}
              >
                {String(unit.value).padStart(2, '0')}
              </motion.div>
              <div className="text-xs sm:text-sm text-wedding-sky-light mt-1">
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Countdown = memo(CountdownComponent);

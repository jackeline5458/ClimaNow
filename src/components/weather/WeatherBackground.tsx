// ============================================================
// WeatherBackground.tsx — fundo dinâmico animado por clima
// ============================================================

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { getBackgroundCSS, getWeatherCategory } from '@/utils/weatherHelpers';

interface WeatherBackgroundProps {
  weatherCode: number;
  isDay: boolean;
  children: React.ReactNode;
}

export function WeatherBackground({ weatherCode, isDay, children }: WeatherBackgroundProps) {
  const category = getWeatherCategory(weatherCode, isDay);
  const bgCSS = getBackgroundCSS(weatherCode, isDay);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradiente animado de fundo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          className="absolute inset-0"
          style={{ background: bgCSS }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Partículas decorativas por condição */}
      <WeatherParticles category={category} />

      {/* Overlay escuro sutil para legibilidade */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Conteúdo */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** Partículas / elementos decorativos por categoria de clima */
function WeatherParticles({ category }: { category: string }) {
  if (category.includes('rain') || category === 'drizzle') {
    return <RainParticles />;
  }
  if (category.includes('snow')) {
    return <SnowParticles />;
  }
  if (category === 'thunderstorm') {
    return <ThunderEffect />;
  }
  if (category === 'clear_day' || category === 'partly_cloudy_day') {
    return <SunRays />;
  }
  if (category === 'clear_night') {
    return <Stars />;
  }
  return null;
}

function RainParticles() {
  const drops = Array.from({ length: 20 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-white/20 rounded-full"
          style={{
            height: `${Math.random() * 20 + 10}px`,
            left: `${Math.random() * 100}%`,
            top: '-20px',
          }}
          animate={{
            y: ['0vh', '110vh'],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 1 + 0.8,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

function SnowParticles() {
  const flakes = Array.from({ length: 15 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((i) => (
        <motion.div
          key={i}
          className="absolute text-white/40 select-none"
          style={{
            fontSize: `${Math.random() * 10 + 8}px`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: ['-20px', '110vh'],
            x: [0, Math.random() * 60 - 30],
            rotate: [0, 360],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'linear',
          }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
}

function ThunderEffect() {
  return (
    <motion.div
      className="absolute inset-0 bg-white/5 pointer-events-none"
      animate={{ opacity: [0, 0, 0, 0.3, 0, 0.15, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatDelay: Math.random() * 5 + 3,
        times: [0, 0.4, 0.5, 0.52, 0.54, 0.56, 0.6],
      }}
    />
  );
}

function SunRays() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,150,0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function Stars() {
  const stars = Array.from({ length: 30 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

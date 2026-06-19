// ============================================================
// LoadingSkeleton.tsx — skeleton de carregamento
// ============================================================

'use client';

import { motion } from 'framer-motion';

/** Pulso de animação para skeletons */
const pulse = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <motion.div
      {...pulse}
      className={`bg-white/20 rounded-xl ${className}`}
    />
  );
}

/** Skeleton do card principal de temperatura */
function CurrentWeatherSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 space-y-4">
      <div className="space-y-2">
        <SkeletonBox className="h-7 w-40" />
        <SkeletonBox className="h-4 w-24" />
      </div>
      <div className="flex items-end justify-between">
        <SkeletonBox className="h-24 w-36" />
        <SkeletonBox className="h-20 w-20 rounded-2xl" />
      </div>
      <SkeletonBox className="h-5 w-32" />
      <div className="flex gap-3">
        <SkeletonBox className="h-4 w-16" />
        <SkeletonBox className="h-4 w-16" />
        <SkeletonBox className="h-4 w-24" />
      </div>
    </div>
  );
}

/** Skeleton do grid de métricas */
function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-4 space-y-2">
          <SkeletonBox className="h-3 w-16" />
          <SkeletonBox className="h-6 w-20" />
          <SkeletonBox className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton da previsão horária */
function HourlySkeleton() {
  return (
    <div className="glass-card rounded-3xl p-5 space-y-3">
      <SkeletonBox className="h-3 w-32" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
            <SkeletonBox className="h-3 w-10" />
            <SkeletonBox className="h-8 w-8 rounded-lg" />
            <SkeletonBox className="h-4 w-10" />
            <SkeletonBox className="w-1 h-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton da previsão semanal */
function WeeklySkeleton() {
  return (
    <div className="glass-card rounded-3xl p-5 space-y-4">
      <SkeletonBox className="h-3 w-28" />
      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonBox className="h-4 w-14" />
            <SkeletonBox className="h-6 w-6 rounded-md" />
            <SkeletonBox className="h-3 w-8" />
            <div className="flex-1 flex items-center gap-2">
              <SkeletonBox className="h-3 w-8" />
              <SkeletonBox className="flex-1 h-1.5 rounded-full" />
              <SkeletonBox className="h-3 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton das dicas */
function TipsSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-5 space-y-3">
      <SkeletonBox className="h-3 w-36" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/10 p-3 flex gap-3">
          <SkeletonBox className="h-8 w-8 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton completo da página */
export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-4 max-w-2xl mx-auto"
    >
      <CurrentWeatherSkeleton />
      <MetricsSkeleton />
      <HourlySkeleton />
      <WeeklySkeleton />
      <TipsSkeleton />
    </motion.div>
  );
}

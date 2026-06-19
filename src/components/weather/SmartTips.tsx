// ============================================================
// SmartTips.tsx — dicas inteligentes baseadas no clima
// ============================================================

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { generateSmartTips, getTipCategoryLabel } from '@/utils/weatherHelpers';
import type { CurrentWeather, SmartTip } from '@/types/weather.types';

interface SmartTipsProps {
  current: CurrentWeather;
}

const CATEGORY_COLORS: Record<string, string> = {
  alert: 'border-red-400/40 bg-red-500/10',
  health: 'border-green-400/40 bg-green-500/10',
  clothing: 'border-blue-400/40 bg-blue-500/10',
  activity: 'border-purple-400/40 bg-purple-500/10',
};

const PRIORITY_BADGE: Record<string, string> = {
  high: 'bg-red-500/30 text-red-200',
  medium: 'bg-yellow-500/30 text-yellow-200',
  low: 'bg-white/20 text-white/60',
};

export function SmartTips({ current }: SmartTipsProps) {
  const tips = generateSmartTips(current);
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  if (tips.length === 0) return null;

  const displayedTips = showAll ? tips : tips.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-3xl text-white overflow-hidden"
    >
      {/* Header — clicável para expandir/colapsar */}
      <button
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2 text-white/60">
          <span className="text-sm">💡</span>
          <span className="text-xs font-medium uppercase tracking-wider">
            Dicas inteligentes
          </span>
          <span className="ml-1 text-xs bg-white/20 text-white/80 px-2 py-0.5 rounded-full">
            {tips.length}
          </span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/40" />
        </motion.div>
      </button>

      {/* Lista de dicas */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              <AnimatePresence mode="popLayout">
                {displayedTips.map((tip, index) => (
                  <TipCard key={tip.id} tip={tip} index={index} />
                ))}
              </AnimatePresence>

              {/* Botão "Ver mais" */}
              {tips.length > 3 && (
                <button
                  className="w-full text-xs text-white/50 hover:text-white/80 transition-colors py-1"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Ver menos' : `+ ${tips.length - 3} dicas`}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── TipCard ─────────────────────────────────────────────────

interface TipCardProps {
  tip: SmartTip;
  index: number;
}

function TipCard({ tip, index }: TipCardProps) {
  const [open, setOpen] = useState(false);
  const colorClass = CATEGORY_COLORS[tip.category] ?? 'border-white/20 bg-white/5';
  const badgeClass = PRIORITY_BADGE[tip.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className={`rounded-2xl border p-3 cursor-pointer ${colorClass} transition-all`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start gap-3">
        {/* Ícone */}
        <span className="text-2xl flex-shrink-0 mt-0.5">{tip.icon}</span>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium">{tip.title}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${badgeClass}`}>
              {getTipCategoryLabel(tip.category)}
            </span>
          </div>

          <AnimatePresence>
            {open && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-xs text-white/70 leading-relaxed overflow-hidden"
              >
                {tip.description}
              </motion.p>
            )}
          </AnimatePresence>

          {!open && (
            <p className="text-xs text-white/50 truncate">{tip.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

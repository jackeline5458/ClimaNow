// ============================================================
// ErrorMessage.tsx — exibição de erros com ações de recovery
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, MapPin, Search } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  type?: 'network' | 'location' | 'notfound' | 'generic';
  onRetry?: () => void;
  onRequestLocation?: () => void;
}

const ERROR_CONFIG = {
  network: {
    icon: '🌐',
    title: 'Sem conexão',
    hint: 'Verifique sua internet e tente novamente.',
  },
  location: {
    icon: '📍',
    title: 'Localização indisponível',
    hint: 'Permita o acesso à localização ou busque uma cidade manualmente.',
  },
  notfound: {
    icon: '🔍',
    title: 'Cidade não encontrada',
    hint: 'Tente um nome diferente ou use sua localização atual.',
  },
  generic: {
    icon: '⚠️',
    title: 'Algo deu errado',
    hint: 'Erro inesperado. Tente novamente em alguns instantes.',
  },
};

export function ErrorMessage({
  message,
  type = 'generic',
  onRetry,
  onRequestLocation,
}: ErrorMessageProps) {
  const config = ERROR_CONFIG[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-3xl p-8 text-white text-center mx-4 max-w-md mx-auto"
    >
      {/* Ícone */}
      <motion.span
        className="text-5xl block mb-4"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        role="img"
        aria-hidden
      >
        {config.icon}
      </motion.span>

      {/* Título e mensagem */}
      <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
      <p className="text-sm text-white/60 mb-2">{message}</p>
      <p className="text-xs text-white/40 mb-6">{config.hint}</p>

      {/* Ações */}
      <div className="flex flex-col gap-2 items-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium
              w-full justify-center"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
        )}

        {onRequestLocation && (
          <button
            onClick={onRequestLocation}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-white/10 hover:bg-white/20 transition-colors text-sm text-white/80
              w-full justify-center"
          >
            <MapPin className="w-4 h-4" />
            Usar minha localização
          </button>
        )}
      </div>
    </motion.div>
  );
}

/** Mensagem de boas-vindas quando nenhuma localização foi selecionada */
export function WelcomeMessage({ onRequestLocation }: { onRequestLocation: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center text-white"
    >
      <motion.span
        className="text-6xl mb-6 block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        🌤️
      </motion.span>

      <h1 className="text-3xl font-semibold mb-2">ClimaNow</h1>
      <p className="text-white/60 mb-8 max-w-xs">
        Previsão do tempo inteligente, direto ao ponto.
      </p>

      <button
        onClick={onRequestLocation}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl
          bg-white/25 hover:bg-white/35 backdrop-blur-md border border-white/30
          transition-all text-base font-medium mb-4 w-full max-w-xs justify-center"
      >
        <MapPin className="w-5 h-5" />
        Usar minha localização
      </button>

      <p className="text-white/40 text-sm flex items-center gap-1">
        <Search className="w-3.5 h-3.5" />
        ou busque uma cidade acima
      </p>
    </motion.div>
  );
}

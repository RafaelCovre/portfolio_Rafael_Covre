/**
 * Componente de carregamento cinematográfico para a Sala de Cinema Virtual.
 * Filosofia: Neo-Noir Cinemático com animações teatrais, luz âmbar progressiva
 * e feedback visual que remete ao acender de uma sala de projeção.
 */
import { useEffect, useState } from "react";
import { Loader2, Radio, Zap } from "lucide-react";

export type LoadingStage = "initializing" | "connecting" | "loading-jitsi" | "ready" | "error";

interface CinemaLoadingStageProps {
  stage: LoadingStage;
  roomName: string;
  errorMessage?: string;
  onRetry?: () => void;
}

const stageConfig = {
  initializing: {
    title: "Preparando a cabine",
    description: "Inicializando a sala de cinema virtual",
    icon: Radio,
    duration: 1200,
  },
  connecting: {
    title: "Conectando ao palco",
    description: "Estabelecendo conexão com o servidor Jitsi",
    icon: Zap,
    duration: 1800,
  },
  "loading-jitsi": {
    title: "Acendendo o projetor",
    description: "Carregando interface de vídeo ao vivo",
    icon: Loader2,
    duration: 2400,
  },
  ready: {
    title: "Sala pronta",
    description: "Você pode entrar na sessão agora",
    icon: Radio,
    duration: 600,
  },
  error: {
    title: "Problema na cabine",
    description: "Não foi possível carregar a sala",
    icon: Radio,
    duration: 0,
  },
};

export function CinemaLoadingStage({
  stage,
  roomName,
  errorMessage,
  onRetry,
}: CinemaLoadingStageProps) {
  const [progress, setProgress] = useState(0);
  const config = stageConfig[stage];
  const Icon = config.icon;

  useEffect(() => {
    if (stage === "error" || stage === "ready") {
      setProgress(100);
      return;
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 35;
        return next > 95 ? 95 : next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="relative flex flex-col items-center justify-center gap-8 rounded-[2rem] border border-amber-100/15 bg-gradient-to-br from-black/60 via-[#0d0907]/70 to-black/80 p-8 backdrop-blur-xl md:p-12">
      {/* Fundo decorativo com gradiente cinematográfico */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-[2rem]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-300/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-red-900/5 blur-3xl" />
      </div>

      {/* Ícone animado com luz âmbar */}
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-amber-300/20 blur-2xl" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full border-2 border-amber-300/40 bg-black/50">
          {stage === "loading-jitsi" ? (
            <Icon className="h-10 w-10 animate-spin text-amber-300" />
          ) : stage === "ready" ? (
            <div className="h-10 w-10 text-emerald-400">
              <svg
                className="h-full w-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : stage === "error" ? (
            <div className="h-10 w-10 text-red-400">
              <svg
                className="h-full w-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : (
            <Icon className="h-10 w-10 text-amber-200" />
          )}
        </div>
      </div>

      {/* Título e descrição */}
      <div className="space-y-2 text-center">
        <h3 className="font-display text-3xl font-semibold text-stone-50">
          {config.title}
        </h3>
        <p className="text-sm text-stone-400">{config.description}</p>
        {roomName && (
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-amber-100/60">
            Sala: {roomName}
          </p>
        )}
      </div>

      {/* Barra de progresso cinematográfica */}
      {stage !== "ready" && stage !== "error" && (
        <div className="w-full max-w-xs space-y-3">
          <div className="h-1 overflow-hidden rounded-full border border-amber-100/20 bg-black/50">
            <div
              className="h-full bg-gradient-to-r from-amber-300/0 via-amber-300 to-amber-300/0 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center font-mono text-[0.62rem] uppercase tracking-[0.22em] text-amber-100/50">
            {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* Mensagem de erro com botão de retry */}
      {stage === "error" && (
        <div className="w-full max-w-md space-y-4">
          <div className="rounded-2xl border border-red-300/30 bg-red-900/20 p-4">
            <p className="text-sm leading-6 text-red-200">
              {errorMessage ||
                "Não foi possível carregar o Jitsi Meet. Verifique sua conexão e tente novamente."}
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full rounded-full bg-amber-300 px-6 py-3 font-semibold text-black transition hover:bg-amber-200"
            >
              Tentar novamente
            </button>
          )}
        </div>
      )}

      {/* Dicas de status */}
      {stage !== "error" && stage !== "ready" && (
        <div className="w-full max-w-md space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-stone-500">
            Dicas
          </p>
          <ul className="space-y-2 text-[0.75rem] text-stone-400">
            <li className="flex gap-2">
              <span className="text-amber-300">•</span>
              <span>Certifique-se de que seu navegador permite acesso à câmera e microfone.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-300">•</span>
              <span>Se o carregamento demorar, recarregue a página.</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Indicador de status para a Sala de Cinema Virtual.
 * Exibe o estado atual da conexão com animações sutis e cores cinematográficas.
 */
import { CheckCircle2, AlertCircle, Wifi, WifiOff } from "lucide-react";

export type StatusType = "idle" | "connecting" | "connected" | "error" | "disconnected";

interface StatusIndicatorProps {
  status: StatusType;
  message?: string;
  compact?: boolean;
}

const statusConfig: Record<StatusType, { icon: typeof Wifi; color: string; bgColor: string; borderColor: string; label: string; animate?: boolean }> = {
  idle: {
    icon: Wifi,
    color: "text-stone-400",
    bgColor: "bg-stone-400/10",
    borderColor: "border-stone-400/20",
    label: "Pronto",
  },
  connecting: {
    icon: Wifi,
    color: "text-amber-300",
    bgColor: "bg-amber-300/10",
    borderColor: "border-amber-300/30",
    label: "Conectando...",
    animate: true,
  },
  connected: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/30",
    label: "Conectado",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
    label: "Erro",
  },
  disconnected: {
    icon: WifiOff,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30",
    label: "Desconectado",
  },
};

export function StatusIndicator({
  status,
  message,
  compact = false,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 rounded-full ${config.bgColor} ${config.borderColor} border px-3 py-1.5`}>
        <Icon
          className={`h-3.5 w-3.5 ${config.color} ${config.animate ? "animate-pulse" : ""}`}
        />
        <span className={`font-mono text-[0.62rem] uppercase tracking-[0.22em] ${config.color}`}>
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl ${config.bgColor} ${config.borderColor} border p-4`}>
      <div className="flex items-start gap-3">
        <Icon
          className={`mt-1 h-5 w-5 shrink-0 ${config.color} ${config.animate ? "animate-pulse" : ""}`}
        />
        <div className="flex-1 space-y-1">
          <p className={`font-semibold ${config.color}`}>{config.label}</p>
          {message && <p className="text-sm text-stone-400">{message}</p>}
        </div>
      </div>
    </div>
  );
}

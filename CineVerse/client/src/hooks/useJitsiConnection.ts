/**
 * Hook customizado para gerenciar o ciclo de vida de conexão do Jitsi Meet.
 * Fornece estados progressivos de carregamento e feedback de erro.
 */
import { useEffect, useRef, useState } from "react";
import type { LoadingStage } from "@/components/CinemaLoadingStage";

type JitsiApi = {
  dispose: () => void;
  executeCommand: (command: string, ...args: unknown[]) => void;
};

type JitsiOptions = {
  roomName: string;
  parentNode: HTMLElement;
  width: string | number;
  height: string | number;
  userInfo?: {
    displayName?: string;
  };
  configOverwrite?: Record<string, unknown>;
  interfaceConfigOverwrite?: Record<string, unknown>;
};

interface UseJitsiConnectionOptions {
  roomName: string;
  displayName: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export function useJitsiConnection({
  roomName,
  displayName,
  containerRef,
  onReady,
  onError,
}: UseJitsiConnectionOptions) {
  const [stage, setStage] = useState<LoadingStage>("initializing");
  const [error, setError] = useState<string | null>(null);
  const apiRef = useRef<JitsiApi | null>(null);
  const scriptTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar script externo do Jitsi
  const loadJitsiScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Se já está carregado, resolver imediatamente
      if ((window as any).JitsiMeetExternalAPI) {
        resolve();
        return;
      }

      // Verificar se o script já está sendo carregado
      const existing = document.querySelector<HTMLScriptElement>('script[data-jitsi="external-api"]');
      if (existing) {
        const onLoad = () => {
          existing.removeEventListener("load", onLoad);
          existing.removeEventListener("error", onError);
          resolve();
        };
        const onError = () => {
          existing.removeEventListener("load", onLoad);
          existing.removeEventListener("error", onError);
          reject(new Error("Falha ao carregar o script externo do Jitsi Meet."));
        };
        existing.addEventListener("load", onLoad, { once: true });
        existing.addEventListener("error", onError, { once: true });
        return;
      }

      // Criar e carregar o script
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.dataset.jitsi = "external-api";

      const onLoad = () => {
        script.removeEventListener("load", onLoad);
        script.removeEventListener("error", onError);
        if (scriptTimeoutRef.current) clearTimeout(scriptTimeoutRef.current);
        resolve();
      };

      const onError = () => {
        script.removeEventListener("load", onLoad);
        script.removeEventListener("error", onError);
        if (scriptTimeoutRef.current) clearTimeout(scriptTimeoutRef.current);
        reject(new Error("Falha ao carregar o script externo do Jitsi Meet."));
      };

      script.addEventListener("load", onLoad);
      script.addEventListener("error", onError);

      // Timeout de 15 segundos para o carregamento do script
      scriptTimeoutRef.current = setTimeout(() => {
        script.removeEventListener("load", onLoad);
        script.removeEventListener("error", onError);
        document.body.removeChild(script);
        reject(new Error("Timeout ao carregar o script do Jitsi Meet."));
      }, 15000);

      document.body.appendChild(script);
    });
  };

  // Montar instância do Jitsi
  const mountJitsi = async () => {
    try {
      // Fase 1: Inicializando
      setStage("initializing");
      setError(null);

      // Fase 2: Conectando
      await new Promise((resolve) => {
        setStage("connecting");
        setTimeout(resolve, 800);
      });

      // Fase 3: Carregando Jitsi
      setStage("loading-jitsi");
      await loadJitsiScript();

      if (!containerRef.current || !(window as any).JitsiMeetExternalAPI) {
        return;
      }

      // Limpar instância anterior
      apiRef.current?.dispose();
      containerRef.current.innerHTML = "";

      // Criar nova instância
      const JitsiAPI = (window as any).JitsiMeetExternalAPI;
      apiRef.current = new JitsiAPI("meet.jit.si", {
        roomName,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        userInfo: {
          displayName,
        },
        configOverwrite: {
          prejoinPageEnabled: true,
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          DEFAULT_BACKGROUND: "#080605",
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "desktop",
            "fullscreen",
            "chat",
            "raisehand",
            "tileview",
            "hangup",
            "settings",
          ],
        },
      });

      // Timeout de 10 segundos para conexão
      connectionTimeoutRef.current = setTimeout(() => {
        setStage("error");
        setError("Timeout ao conectar com o servidor Jitsi.");
        onError?.(new Error("Timeout ao conectar com o servidor Jitsi."));
      }, 10000);

      // Aguardar um pouco antes de marcar como pronto
      await new Promise((resolve) => {
        setTimeout(resolve, 600);
      });

      if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
      setStage("ready");
      onReady?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido ao carregar o Jitsi Meet.";
      setStage("error");
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  };

  // Efeito principal
  useEffect(() => {
    if (!containerRef.current) return;

    mountJitsi();

    return () => {
      if (scriptTimeoutRef.current) clearTimeout(scriptTimeoutRef.current);
      if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [roomName, displayName]);

  const retry = () => {
    setStage("initializing");
    setError(null);
    mountJitsi();
  };

  return {
    stage,
    error,
    api: apiRef.current,
    retry,
  };
}

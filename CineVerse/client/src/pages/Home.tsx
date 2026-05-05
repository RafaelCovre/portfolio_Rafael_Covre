/**
 * Filosofia visual aplicada: Neo-Noir Cinemático.
 * Esta página deve reforçar a sensação de sala escura premium: palco assimétrico,
 * luz âmbar, painéis de cabine, molduras luminosas e tipografia teatral.
 * Ao decidir qualquer elemento, perguntar: esta escolha reforça ou dilui o cinema neo-noir?
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  CalendarClock,
  Clapperboard,
  Copy,
  Film,
  Headphones,
  Link2,
  MessageCircle,
  MonitorPlay,
  Play,
  Radio,
  RefreshCw,
  Sparkles,
  Ticket,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CinemaLoadingStage } from "@/components/CinemaLoadingStage";
import { StatusIndicator } from "@/components/StatusIndicator";
import { useJitsiConnection } from "@/hooks/useJitsiConnection";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: JitsiOptions) => JitsiApi;
  }
}

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

const HERO_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663627944736/EZgnpSvRnJq7T22eHS2Ex6/cinema-hero-noir-kojqLdSWKqF6hQqFERHL9h.webp";
const CABIN_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663627944736/EZgnpSvRnJq7T22eHS2Ex6/jitsi-cabin-panel-9Yj637tAaguq3KtPdepx4e.webp";
const TICKET_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663627944736/EZgnpSvRnJq7T22eHS2Ex6/movie-ticket-room-ivmWMSh4ECd4hUffQVeqzH.webp";

const sanitizeRoomName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);

const createRoomName = () => {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SalaCinema-${suffix}`;
};

const getInitialRoom = () => {
  if (typeof window === "undefined") return createRoomName();
  const query = new URLSearchParams(window.location.search);
  const sala = query.get("sala");
  return sanitizeRoomName(sala || "") || createRoomName();
};

function JitsiStage({ roomName, displayName, sessionKey }: { roomName: string; displayName: string; sessionKey: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { stage, error, retry } = useJitsiConnection({
    roomName,
    displayName,
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
  });

  return (
    <section className="cinema-screen relative overflow-hidden rounded-[2rem] border border-amber-300/25 bg-black/70 shadow-[0_0_80px_rgba(245,158,11,0.14)]">
      <div className="absolute inset-0 pointer-events-none rounded-[2rem] border border-amber-100/10" />
      <div className="absolute left-8 right-8 top-4 z-10 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.34em] text-amber-100/60">
        <span>palco social ao vivo</span>
        <span>{roomName}</span>
      </div>
      <div ref={containerRef} className="relative z-[1] h-[520px] min-h-[420px] w-full pt-9 md:h-[640px]" />
      {stage !== "ready" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#070504]/90 pt-9">
          <CinemaLoadingStage
            stage={stage}
            roomName={roomName}
            errorMessage={error || undefined}
            onRetry={retry}
          />
        </div>
      )}
    </section>
  );
}

const stats = [
  { label: "Vídeo ao vivo", value: "Jitsi", icon: Video },
  { label: "Entrada", value: "Link", icon: Link2 },
  { label: "Convidados", value: "Livre", icon: Users },
];

export default function Home() {
  const [roomName, setRoomName] = useState(getInitialRoom);
  const [draftRoom, setDraftRoom] = useState(roomName);
  const [displayName, setDisplayName] = useState("Convidado do Cinema");
  const [movieTitle, setMovieTitle] = useState("Sessão de estreia");
  const [contentLink, setContentLink] = useState("");
  const [sessionKey, setSessionKey] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected">("idle");

  useEffect(() => {
    setConnectionStatus("idle");
  }, []);

  useEffect(() => {
    if (sessionKey > 0) {
      setConnectionStatus("connecting");
      const timer = setTimeout(() => setConnectionStatus("connected"), 3000);
      return () => clearTimeout(timer);
    }
  }, [sessionKey]);

  const inviteUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("sala", roomName);
    return url.toString();
  }, [roomName]);

  const startRoom = () => {
    const nextRoom = sanitizeRoomName(draftRoom) || createRoomName();
    setRoomName(nextRoom);
    setDraftRoom(nextRoom);
    setSessionKey((current) => current + 1);
    setConnectionStatus("connecting");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("sala", nextRoom);
      window.history.replaceState(null, "", url.toString());
    }
    toast.success("Sala preparada", {
      description: `A cabine abriu a sessão ${nextRoom}.`,
    });
  };

  const createNewRoom = () => {
    const nextRoom = createRoomName();
    setDraftRoom(nextRoom);
    setRoomName(nextRoom);
    setSessionKey((current) => current + 1);
    setConnectionStatus("connecting");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("sala", nextRoom);
      window.history.replaceState(null, "", url.toString());
    }
    toast("Nova sala gerada", {
      description: "Compartilhe o ingresso digital com seus convidados.",
    });
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Convite copiado", {
        description: "Envie este link para quem vai assistir com você.",
      });
    } catch {
      toast.error("Não foi possível copiar", {
        description: "Copie o endereço diretamente da barra do navegador.",
      });
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#070504] text-stone-100 selection:bg-amber-300 selection:text-black">
      <section className="relative isolate min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.20),transparent_26%),linear-gradient(90deg,rgba(7,5,4,0.98)_0%,rgba(7,5,4,0.82)_38%,rgba(7,5,4,0.66)_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px)] [background-size:72px_72px]" />

        <header className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 border-b border-amber-100/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-amber-300/30 bg-amber-300/10 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <Clapperboard className="h-5 w-5 text-amber-200" />
            </div>
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-amber-200/70">Cinema remoto</p>
              <h1 className="font-display text-xl font-semibold tracking-wide text-stone-50">CineVerse</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusIndicator status={connectionStatus} compact />
            <Button onClick={copyInvite} className="hidden rounded-full bg-amber-300 px-5 font-semibold text-black hover:bg-amber-200 md:inline-flex">
              <Copy className="mr-2 h-4 w-4" /> Copiar convite
            </Button>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1500px] gap-6 py-8 lg:grid-cols-[minmax(0,1.45fr)_440px] xl:gap-8">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1fr]">
              <article className="cinema-card relative overflow-hidden rounded-[2rem] border border-amber-100/15 bg-black/45 p-6 shadow-2xl backdrop-blur-xl md:p-8">
                <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />
                <div className="relative space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-100/10 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-amber-100/75">
                    <Radio className="h-3.5 w-3.5" /> integração Jitsi Meet
                  </div>
                  <div>
                    <h2 className="max-w-2xl font-display text-5xl font-semibold leading-[0.92] text-stone-50 md:text-7xl">
                      Reúna todos antes das luzes se apagarem.
                    </h2>
                    <p className="mt-5 max-w-xl text-base leading-7 text-stone-300">
                      Crie uma sala, compartilhe o ingresso digital e use o Jitsi Meet embutido para conversar com seus convidados durante a sessão. A experiência foi desenhada como uma cabine de projeção: social, escura e pronta para a estreia.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {stats.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <item.icon className="mb-3 h-4 w-4 text-amber-200" />
                        <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-stone-500">{item.label}</p>
                        <p className="mt-1 font-display text-2xl text-stone-100">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <aside className="relative overflow-hidden rounded-[2rem] border border-amber-100/15 bg-black/50 p-5 backdrop-blur-xl">
                <img src={TICKET_IMAGE} alt="Ingresso digital escuro com acabamento cinematográfico" className="absolute inset-0 h-full w-full object-cover opacity-35" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/70 to-black/90" />
                <div className="relative flex h-full min-h-[360px] flex-col justify-between">
                  <div className="space-y-3">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-amber-200/80">ingresso da sessão</p>
                    <h3 className="font-display text-4xl leading-none text-white">{movieTitle || "Sessão sem título"}</h3>
                    <p className="max-w-sm text-sm leading-6 text-stone-300">
                      Este app não transmite conteúdo protegido por direitos autorais; ele organiza o encontro e a conversa por vídeo. Use seu serviço de streaming ou arquivo autorizado em outra janela.
                    </p>
                  </div>
                  <div className="grid gap-3 rounded-3xl border border-white/10 bg-black/45 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-stone-400">Sala</span>
                      <span className="font-mono text-amber-100">{roomName}</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
                    <Button onClick={copyInvite} className="rounded-full bg-stone-50 font-semibold text-black hover:bg-amber-100 md:hidden">
                      <Copy className="mr-2 h-4 w-4" /> Copiar convite
                    </Button>
                  </div>
                </div>
              </aside>
            </div>

            <JitsiStage roomName={roomName} displayName={displayName} sessionKey={sessionKey} />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <section className="relative overflow-hidden rounded-[2rem] border border-amber-100/15 bg-[#100b08]/85 p-6 shadow-2xl backdrop-blur-xl">
              <img src={CABIN_IMAGE} alt="Painel de cabine cinematográfica com luz âmbar" className="absolute inset-0 h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-[#100b08]/85 to-black/95" />
              <div className="relative space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-amber-200/75">cabine da sala</p>
                    <h2 className="mt-2 font-display text-4xl leading-none text-white">Preparar sessão</h2>
                  </div>
                  <div className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-emerald-200">
                    online
                  </div>
                </div>

                <label className="block space-y-2">
                  <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-stone-400">
                    <Ticket className="h-3.5 w-3.5 text-amber-200" /> nome da sala
                  </span>
                  <input
                    value={draftRoom}
                    onChange={(event) => setDraftRoom(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 font-mono text-sm text-stone-100 outline-none transition focus:border-amber-200/50 focus:ring-2 focus:ring-amber-300/20"
                    placeholder="SalaCinema-NoiteDeFilme"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-stone-400">
                    <Users className="h-3.5 w-3.5 text-amber-200" /> seu nome no Jitsi
                  </span>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-200/50 focus:ring-2 focus:ring-amber-300/20"
                    placeholder="Como você aparecerá na chamada"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-stone-400">
                    <Film className="h-3.5 w-3.5 text-amber-200" /> título da sessão
                  </span>
                  <input
                    value={movieTitle}
                    onChange={(event) => setMovieTitle(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-200/50 focus:ring-2 focus:ring-amber-300/20"
                    placeholder="Ex.: Clássicos de sexta-feira"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-stone-400">
                    <MonitorPlay className="h-3.5 w-3.5 text-amber-200" /> link do conteúdo autorizado
                  </span>
                  <input
                    value={contentLink}
                    onChange={(event) => setContentLink(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-200/50 focus:ring-2 focus:ring-amber-300/20"
                    placeholder="Cole aqui o link do streaming, se desejar"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={startRoom} className="rounded-full bg-amber-300 py-6 font-semibold text-black hover:bg-amber-200">
                    <Play className="mr-2 h-4 w-4" /> Abrir sala
                  </Button>
                  <Button onClick={createNewRoom} variant="outline" className="rounded-full border-amber-100/20 bg-black/30 py-6 text-amber-100 hover:bg-amber-100/10 hover:text-white">
                    <RefreshCw className="mr-2 h-4 w-4" /> Nova
                  </Button>
                </div>

                {contentLink && (
                  <a
                    href={contentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-amber-100/15 bg-amber-100/10 p-4 text-sm text-amber-50 transition hover:bg-amber-100/15"
                  >
                    <span className="flex items-center gap-2"><Link2 className="h-4 w-4" /> Abrir conteúdo em outra janela</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-amber-200/70">roteiro de uso</p>
              <div className="mt-5 space-y-4">
                {[
                  { icon: BadgeCheck, title: "1. Gere uma sala", text: "Defina o nome, seu apelido e abra o palco Jitsi integrado." },
                  { icon: Copy, title: "2. Envie o convite", text: "Compartilhe o link com o parâmetro da sala já incluído." },
                  { icon: Headphones, title: "3. Assistam juntos", text: "Usem o Jitsi para conversar enquanto cada pessoa abre o conteúdo autorizado." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 rounded-2xl border border-white/8 bg-black/25 p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-300/10 text-amber-200">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-100">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-stone-400">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-amber-100/15 bg-[#0d0907] p-6">
              <div className="flex items-center gap-3 text-amber-100">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-display text-2xl">Próximas extensões</h3>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-stone-400">
                <p className="flex gap-3"><CalendarClock className="mt-0.5 h-4 w-4 text-amber-200" /> Agendamento de sessões e lembretes.</p>
                <p className="flex gap-3"><MessageCircle className="mt-0.5 h-4 w-4 text-amber-200" /> Chat persistente e lista de convidados exigem backend.</p>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

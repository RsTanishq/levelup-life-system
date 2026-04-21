import { useState, useEffect, useCallback } from "react";
import { Zap, Sword, Brain, Sparkles, Shield, Heart, Flame, MessageCircle, Lock, Trophy } from "lucide-react";
import { LucideIcon } from "lucide-react";

type NotificationType = "level-up" | "stat-boost" | "skill-unlock" | "quest-complete" | "rank-up";

interface SystemNotification {
  id: string;
  type: NotificationType;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
}

const colorStyles: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  blue: {
    border: "border-neon-blue/50",
    bg: "bg-neon-blue/10",
    text: "text-neon-blue",
    glow: "shadow-[0_0_30px_hsl(217_91%_60%/0.4),0_0_60px_hsl(217_91%_60%/0.15),inset_0_0_30px_hsl(217_91%_60%/0.1)]",
  },
  red: {
    border: "border-neon-red/50",
    bg: "bg-neon-red/10",
    text: "text-neon-red",
    glow: "shadow-[0_0_30px_hsl(0_84%_60%/0.4),0_0_60px_hsl(0_84%_60%/0.15),inset_0_0_30px_hsl(0_84%_60%/0.1)]",
  },
  cyan: {
    border: "border-neon-cyan/50",
    bg: "bg-neon-cyan/10",
    text: "text-neon-cyan",
    glow: "shadow-[0_0_30px_hsl(192_91%_56%/0.4),0_0_60px_hsl(192_91%_56%/0.15),inset_0_0_30px_hsl(192_91%_56%/0.1)]",
  },
  purple: {
    border: "border-neon-purple/50",
    bg: "bg-neon-purple/10",
    text: "text-neon-purple",
    glow: "shadow-[0_0_30px_hsl(265_89%_62%/0.4),0_0_60px_hsl(265_89%_62%/0.15),inset_0_0_30px_hsl(265_89%_62%/0.1)]",
  },
  green: {
    border: "border-neon-green/50",
    bg: "bg-neon-green/10",
    text: "text-neon-green",
    glow: "shadow-[0_0_30px_hsl(142_71%_45%/0.4),0_0_60px_hsl(142_71%_45%/0.15),inset_0_0_30px_hsl(142_71%_45%/0.1)]",
  },
  gold: {
    border: "border-neon-gold/50",
    bg: "bg-neon-gold/10",
    text: "text-neon-gold",
    glow: "shadow-[0_0_30px_hsl(45_93%_47%/0.4),0_0_60px_hsl(45_93%_47%/0.15),inset_0_0_30px_hsl(45_93%_47%/0.1)]",
  },
  orange: {
    border: "border-neon-orange/50",
    bg: "bg-neon-orange/10",
    text: "text-neon-orange",
    glow: "shadow-[0_0_30px_hsl(25_95%_53%/0.4),0_0_60px_hsl(25_95%_53%/0.15),inset_0_0_30px_hsl(25_95%_53%/0.1)]",
  },
};

const SystemNotificationToast = ({ notification, onDone }: { notification: SystemNotification; onDone: () => void }) => {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const cs = colorStyles[notification.color] || colorStyles.blue;
  const isLevelUp = notification.type === "level-up";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 50);
    const t2 = setTimeout(() => setPhase("exit"), isLevelUp ? 3500 : 2500);
    const t3 = setTimeout(onDone, isLevelUp ? 4000 : 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone, isLevelUp]);

  const enterExit = phase === "enter" || phase === "exit";
  const Icon = notification.icon;

  return (
    <div
      className={`pointer-events-none transition-all duration-500 ease-out ${
        enterExit ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* Holographic panel */}
      <div className={`
        relative overflow-hidden rounded-xl border-2 ${cs.border} ${cs.glow}
        backdrop-blur-2xl bg-background/70
        ${isLevelUp ? "px-8 py-6" : "px-5 py-3.5"}
      `}>
        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute left-0 right-0 h-px opacity-30"
            style={{
              background: `linear-gradient(90deg, transparent, hsl(var(--${notification.color === "blue" ? "neon-blue" : `neon-${notification.color}`})), transparent)`,
              animation: "holographic-scan 2s linear infinite",
            }}
          />
        </div>

        {/* Corner accents */}
        <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${cs.border} rounded-tl-xl`} />
        <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${cs.border} rounded-tr-xl`} />
        <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${cs.border} rounded-bl-xl`} />
        <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${cs.border} rounded-br-xl`} />

        <div className="relative flex items-center gap-3">
          <div className={`shrink-0 ${isLevelUp ? "w-12 h-12" : "w-9 h-9"} rounded-lg ${cs.bg} flex items-center justify-center`}>
            <Icon className={`${isLevelUp ? "w-6 h-6" : "w-4 h-4"} ${cs.text}`} />
          </div>
          <div>
            {isLevelUp && (
              <p className="text-[9px] font-heading uppercase tracking-[0.3em] text-muted-foreground mb-0.5">— System Alert —</p>
            )}
            <p className={`font-heading font-bold tracking-wider uppercase ${cs.text} ${isLevelUp ? "text-xl" : "text-sm"}`}>
              {notification.title}
            </p>
            {notification.subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{notification.subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Preset notifications
const presets: SystemNotification[] = [
  { id: "1", type: "level-up", title: "LEVEL UP!", subtitle: "You've reached Level 25", icon: Zap, color: "blue" },
  { id: "2", type: "stat-boost", title: "+5 Strength", subtitle: "Quest reward applied", icon: Sword, color: "red" },
  { id: "3", type: "stat-boost", title: "+3 Focus", subtitle: "Deep work session complete", icon: Brain, color: "cyan" },
  { id: "4", type: "skill-unlock", title: "New Skill Unlocked", subtitle: "Flow State — Deep Focus Path", icon: Sparkles, color: "purple" },
  { id: "5", type: "stat-boost", title: "+2 Discipline", subtitle: "Daily streak maintained", icon: Shield, color: "green" },
  { id: "6", type: "quest-complete", title: "Quest Complete!", subtitle: "+50 XP, +10 Coins", icon: Trophy, color: "gold" },
];

let globalPush: ((n: SystemNotification) => void) | null = null;

export const pushSystemNotification = (n: SystemNotification) => {
  globalPush?.(n);
};

export const triggerDemoNotifications = () => {
  presets.forEach((n, i) => {
    setTimeout(() => pushSystemNotification({ ...n, id: `${n.id}-${Date.now()}` }), i * 800);
  });
};

const SystemNotifications = () => {
  const [queue, setQueue] = useState<SystemNotification[]>([]);

  const push = useCallback((n: SystemNotification) => {
    setQueue((prev) => [...prev, n]);
  }, []);

  useEffect(() => {
    globalPush = push;
    return () => { globalPush = null; };
  }, [push]);

  const remove = useCallback((id: string) => {
    setQueue((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 items-end max-w-sm w-full pointer-events-none">
      {queue.map((n) => (
        <SystemNotificationToast key={n.id} notification={n} onDone={() => remove(n.id)} />
      ))}
    </div>
  );
};

export default SystemNotifications;

import { useState } from "react";
import { Crown, Lock, Check, Sparkles } from "lucide-react";
import { pushSystemNotification } from "@/components/SystemNotifications";

type Title = {
  name: string;
  condition: string;
  unlocked: boolean;
  color: string;
  progress?: { current: number; total: number };
};

const initialTitles: Title[] = [
  { name: "Focus Monk", condition: "Complete 50 deep work sessions", unlocked: true, color: "neon-blue" },
  { name: "Code Warrior", condition: "Code 100 hours total", unlocked: true, color: "neon-cyan" },
  { name: "Shadow Learner", condition: "Study after 10pm for 14 days", unlocked: true, color: "neon-purple" },
  { name: "Consistency King", condition: "Maintain 14-day streak", unlocked: false, color: "neon-gold", progress: { current: 8, total: 14 } },
  { name: "Elite Hunter", condition: "Reach Level 50", unlocked: false, color: "neon-orange", progress: { current: 24, total: 50 } },
  { name: "Deep Work Master", condition: "Complete 200 focus sessions", unlocked: false, color: "neon-green", progress: { current: 87, total: 200 } },
];

const Titles = () => {
  const [titles] = useState(initialTitles);
  const [equipped, setEquipped] = useState("Code Warrior");

  const equip = (name: string) => {
    setEquipped(name);
    pushSystemNotification({
      id: `title-${Date.now()}`, type: "skill-unlock",
      title: "Title Equipped", subtitle: name,
      icon: Crown, color: "gold",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-gold/10 flex items-center justify-center">
          <Crown className="w-5 h-5 text-neon-gold" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Titles</h1>
          <p className="text-sm text-muted-foreground">Identity titles • Equipped: <span className="text-neon-gold font-heading">{equipped}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {titles.map((t) => {
          const isEquipped = t.unlocked && equipped === t.name;
          const pct = t.progress ? Math.round((t.progress.current / t.progress.total) * 100) : 0;
          return (
            <div
              key={t.name}
              className={`glass-panel p-5 relative overflow-hidden transition-all ${
                t.unlocked ? `border-${t.color}/40 hover:neon-border` : "opacity-70"
              } ${isEquipped ? "neon-border" : ""}`}
              style={isEquipped ? { boxShadow: `0 0 25px hsl(var(--${t.color}) / 0.4)` } : undefined}
            >
              {isEquipped && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-neon-gold/15 border border-neon-gold/40">
                  <span className="text-[9px] font-heading font-bold uppercase tracking-wider text-neon-gold">Equipped</span>
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                t.unlocked ? `bg-${t.color}/15 border border-${t.color}/40` : "bg-secondary border border-glass-border/40"
              }`}>
                {t.unlocked ? <Sparkles className={`w-6 h-6 text-${t.color}`} /> : <Lock className="w-6 h-6 text-muted-foreground" />}
              </div>
              <h3 className={`font-heading font-bold text-base ${t.unlocked ? `text-${t.color}` : "text-muted-foreground"}`}>
                {t.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{t.condition}</p>

              {t.progress && !t.unlocked && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-heading uppercase tracking-wider mb-1">
                    <span className="text-muted-foreground">{t.progress.current} / {t.progress.total}</span>
                    <span className={`text-${t.color}`}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                    <div className={`h-full bg-${t.color}`} style={{ width: `${pct}%`, boxShadow: `0 0 8px hsl(var(--${t.color}) / 0.6)` }} />
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-glass-border/30">
                {t.unlocked ? (
                  <button
                    onClick={() => equip(t.name)}
                    disabled={isEquipped}
                    className={`w-full px-3 py-2 rounded-md text-[10px] font-heading font-bold uppercase tracking-wider transition-opacity flex items-center justify-center gap-1.5 ${
                      isEquipped
                        ? "bg-secondary border border-neon-gold/40 text-neon-gold cursor-default"
                        : "gradient-neon text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {isEquipped ? <><Check className="w-3.5 h-3.5" /> Equipped</> : "Equip Title"}
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
                    <Lock className="w-3 h-3" /> Locked
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Titles;

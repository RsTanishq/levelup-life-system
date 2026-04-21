import { useState } from "react";
import { Skull, Trophy, Coins, Award, Check } from "lucide-react";
import { pushSystemNotification } from "@/components/SystemNotifications";

const initialTasks = [
  { id: 1, title: "Complete 5 deep work sessions", done: false, damage: 20 },
  { id: 2, title: "Skip social media for 3 days", done: false, damage: 15 },
  { id: 3, title: "Finish 1 hard project task daily", done: false, damage: 25 },
  { id: 4, title: "Wake up before 7am for 5 days", done: false, damage: 20 },
  { id: 5, title: "Read 50 pages this week", done: false, damage: 20 },
];

const BossBattles = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const totalDamage = tasks.filter((t) => t.done).reduce((s, t) => s + t.damage, 0);
  const health = Math.max(0, 100 - totalDamage);
  const defeated = health === 0;

  const toggleTask = (id: number) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      const task = updated.find((t) => t.id === id);
      if (task?.done) {
        pushSystemNotification({
          id: `boss-${Date.now()}`,
          type: "stat-boost",
          title: `−${task.damage} BOSS HP`,
          subtitle: "Critical hit!",
          icon: Skull,
          color: "red",
        });
      }
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-red/10 flex items-center justify-center">
          <Skull className="w-5 h-5 text-neon-red" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Boss Battles</h1>
          <p className="text-sm text-muted-foreground">Weekly challenge — defeat the boss</p>
        </div>
      </div>

      <div className="glass-panel-strong p-6 neon-border relative overflow-hidden">
        <div className="absolute inset-0 gradient-neon-purple opacity-5" />
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-heading text-neon-red uppercase tracking-[0.3em] mb-1">Weekly Boss</p>
              <h2 className="font-heading text-3xl font-black text-foreground">Procrastination Demon</h2>
              <p className="text-sm text-muted-foreground mt-1">A shadow that feeds on wasted time</p>
            </div>
            <div className="text-6xl animate-float">👹</div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs font-heading mb-2">
              <span className="text-muted-foreground uppercase tracking-wider">Boss HP</span>
              <span className="text-neon-red font-bold">{health} / 100</span>
            </div>
            <div className="h-4 bg-secondary/50 rounded-full overflow-hidden border border-glass-border/40">
              <div
                className="h-full bg-gradient-to-r from-neon-red to-neon-orange transition-all duration-500"
                style={{ width: `${health}%`, boxShadow: "0 0 20px hsl(var(--neon-red) / 0.6)" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass-panel p-3 text-center">
              <Trophy className="w-4 h-4 mx-auto mb-1 text-neon-blue" />
              <p className="text-[10px] text-muted-foreground uppercase">XP Reward</p>
              <p className="font-heading font-bold text-neon-blue">+500</p>
            </div>
            <div className="glass-panel p-3 text-center">
              <Coins className="w-4 h-4 mx-auto mb-1 text-neon-gold" />
              <p className="text-[10px] text-muted-foreground uppercase">Coins</p>
              <p className="font-heading font-bold text-neon-gold">+250</p>
            </div>
            <div className="glass-panel p-3 text-center">
              <Award className="w-4 h-4 mx-auto mb-1 text-neon-purple" />
              <p className="text-[10px] text-muted-foreground uppercase">Badge</p>
              <p className="font-heading font-bold text-neon-purple text-xs">Demon Slayer</p>
            </div>
          </div>

          {defeated && (
            <div className="glass-panel p-4 neon-border text-center mb-4 animate-level-up">
              <p className="font-heading text-lg font-black text-neon-gold">BOSS DEFEATED!</p>
              <p className="text-xs text-muted-foreground mt-1">Rewards claimed</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-2">Required Tasks</p>
            {tasks.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  t.done
                    ? "border-neon-red/40 bg-neon-red/5"
                    : "border-glass-border/40 bg-secondary/30 hover:border-neon-red/30"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 ${
                    t.done ? "border-neon-red bg-neon-red/20" : "border-glass-border"
                  }`}
                >
                  {t.done && <Check className="w-4 h-4 text-neon-red" />}
                </div>
                <span className={`flex-1 text-sm ${t.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {t.title}
                </span>
                <span className="text-xs font-heading font-bold text-neon-red">−{t.damage} HP</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BossBattles;

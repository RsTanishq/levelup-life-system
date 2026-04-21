import { useState } from "react";
import { Award, Lock, Check, Sparkles, Trophy, Star } from "lucide-react";
import { pushSystemNotification } from "@/components/SystemNotifications";

type Achievement = {
  title: string;
  desc: string;
  xp: number;
  icon: string;
  rare?: boolean;
  progress?: { current: number; total: number };
};

const unlocked: Achievement[] = [
  { title: "First Quest Completed", desc: "Complete your very first daily quest", xp: 50, icon: "🏆" },
  { title: "Joined First Guild", desc: "Become part of a guild", xp: 100, icon: "⚔️" },
  { title: "Defeated First Boss", desc: "Win your first weekly boss battle", xp: 150, icon: "💀", rare: true },
];

const inProgress: Achievement[] = [
  { title: "Knowledge Level 25", desc: "Reach Knowledge stat 25", xp: 200, icon: "🧠", progress: { current: 18, total: 25 } },
  { title: "7-Day Streak Master", desc: "Maintain a 7-day quest streak", xp: 120, icon: "🔥", progress: { current: 5, total: 7 } },
  { title: "Consistency King", desc: "Maintain a 14-day streak", xp: 250, icon: "👑", progress: { current: 8, total: 14 }, rare: true },
];

const locked: Achievement[] = [
  { title: "Boss Slayer", desc: "Defeat 10 weekly bosses", xp: 500, icon: "⚡" },
  { title: "Guild Leader", desc: "Lead a guild to Top 3", xp: 800, icon: "🏰", rare: true },
  { title: "Elite Hunter", desc: "Reach Level 50", xp: 1000, icon: "✨", rare: true },
  { title: "Skill Tree Master", desc: "Unlock 20 skills", xp: 600, icon: "🌳" },
];

const Card = ({ a, status }: { a: Achievement; status: "unlocked" | "progress" | "locked" }) => {
  const isUnlocked = status === "unlocked";
  const isLocked = status === "locked";
  const pct = a.progress ? Math.round((a.progress.current / a.progress.total) * 100) : 0;

  return (
    <div
      className={`glass-panel p-4 relative overflow-hidden transition-all ${
        isUnlocked ? "neon-border" : isLocked ? "opacity-60" : "border-neon-orange/30"
      }`}
      style={a.rare && isUnlocked ? { boxShadow: "0 0 25px hsl(var(--neon-gold) / 0.35)" } : undefined}
    >
      {a.rare && isUnlocked && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-gold/15 border border-neon-gold/40">
          <Star className="w-3 h-3 text-neon-gold" />
          <span className="text-[9px] font-heading font-bold uppercase tracking-wider text-neon-gold">Rare</span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className={`text-3xl shrink-0 ${isLocked ? "grayscale" : ""}`}>{a.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm text-foreground">{a.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
        </div>
        <div className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${
          isUnlocked ? "bg-neon-green/20 border border-neon-green/40" :
          isLocked ? "bg-secondary border border-glass-border/40" :
          "bg-neon-orange/20 border border-neon-orange/40"
        }`}>
          {isUnlocked ? <Check className="w-3.5 h-3.5 text-neon-green" /> :
           isLocked ? <Lock className="w-3.5 h-3.5 text-muted-foreground" /> :
           <Sparkles className="w-3.5 h-3.5 text-neon-orange" />}
        </div>
      </div>

      {a.progress && status === "progress" && (
        <div className="mt-3">
          <div className="flex justify-between text-[10px] font-heading uppercase tracking-wider mb-1">
            <span className="text-muted-foreground">{a.progress.current} / {a.progress.total}</span>
            <span className="text-neon-orange">{pct}%</span>
          </div>
          <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
            <div className="h-full bg-neon-orange transition-all" style={{ width: `${pct}%`, boxShadow: "0 0 8px hsl(var(--neon-orange) / 0.6)" }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-glass-border/30">
        <span className={`text-[10px] font-heading uppercase tracking-wider ${
          isUnlocked ? "text-neon-green" : isLocked ? "text-muted-foreground" : "text-neon-orange"
        }`}>
          {isUnlocked ? "Unlocked" : isLocked ? "Locked" : "In Progress"}
        </span>
        <span className="text-xs font-heading font-bold text-neon-gold">+{a.xp} XP</span>
      </div>
    </div>
  );
};

const Achievements = () => {
  const [demoCount, setDemoCount] = useState(0);

  const triggerUnlockDemo = () => {
    setDemoCount((c) => c + 1);
    pushSystemNotification({
      id: `ach-${Date.now()}`,
      type: "skill-unlock",
      title: "ACHIEVEMENT UNLOCKED",
      subtitle: "Consistency King • +150 XP",
      icon: Trophy,
      color: "gold",
    });
  };

  const total = unlocked.length + inProgress.length + locked.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-gold/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-neon-gold" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Achievements</h1>
            <p className="text-sm text-muted-foreground">{unlocked.length} of {total} unlocked</p>
          </div>
        </div>
        <button
          onClick={triggerUnlockDemo}
          className="hidden md:flex px-3 py-2 rounded-lg gradient-neon-purple text-[10px] font-heading font-bold uppercase tracking-wider text-foreground hover:opacity-90 transition-opacity"
        >
          Demo Unlock {demoCount > 0 && `(${demoCount})`}
        </button>
      </div>

      <section>
        <h3 className="font-heading text-sm font-bold text-neon-green uppercase tracking-wider mb-3">Unlocked</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unlocked.map((a) => <Card key={a.title} a={a} status="unlocked" />)}
        </div>
      </section>

      <section>
        <h3 className="font-heading text-sm font-bold text-neon-orange uppercase tracking-wider mb-3">In Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inProgress.map((a) => <Card key={a.title} a={a} status="progress" />)}
        </div>
      </section>

      <section>
        <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Locked</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locked.map((a) => <Card key={a.title} a={a} status="locked" />)}
        </div>
      </section>
    </div>
  );
};

export default Achievements;

import { Flame } from "lucide-react";

const StreakWidget = () => {
  const current = 6;
  const longest = 12;
  const weeklyRate = 85;

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-neon-orange animate-pulse-neon" />
        <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Streak</h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl gradient-neon-purple flex items-center justify-center neon-glow">
            <Flame className="w-8 h-8 text-foreground animate-float" />
          </div>
        </div>
        <div>
          <p className="font-heading text-3xl font-black text-neon-orange">{current}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Day Streak</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-center p-2 rounded-lg bg-secondary/40">
          <p className="text-[10px] text-muted-foreground uppercase">Longest</p>
          <p className="font-heading font-bold text-foreground">{longest}d</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-secondary/40">
          <p className="text-[10px] text-muted-foreground uppercase">This Week</p>
          <p className="font-heading font-bold text-neon-green">{weeklyRate}%</p>
        </div>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${i < current ? "bg-neon-orange" : "bg-secondary/50"}`}
            style={i < current ? { boxShadow: "0 0 8px hsl(var(--neon-orange) / 0.6)" } : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default StreakWidget;

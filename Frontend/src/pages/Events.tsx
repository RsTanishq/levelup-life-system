import { useEffect, useState } from "react";
import { CalendarClock, Snowflake, BookOpen, Shield, Trophy, Coins, Award } from "lucide-react";

const events = [
  {
    name: "Winter Focus Sprint",
    icon: Snowflake, color: "neon-cyan",
    desc: "Complete 25 deep work sessions in 30 days",
    current: 14, total: 25,
    reward: "Frost Badge + 300 Coins",
    endsIn: 1000 * 60 * 60 * 24 * 12 + 1000 * 60 * 30,
  },
  {
    name: "Exam Mode Challenge",
    icon: BookOpen, color: "neon-blue",
    desc: "Earn 1,000 Knowledge XP this season",
    current: 720, total: 1000,
    reward: "Scholar Title + 200 Coins",
    endsIn: 1000 * 60 * 60 * 24 * 5,
  },
  {
    name: "30-Day Discipline Challenge",
    icon: Shield, color: "neon-purple",
    desc: "Maintain a 30-day streak without breaking",
    current: 18, total: 30,
    reward: "Iron Will Badge + 500 Coins",
    endsIn: 1000 * 60 * 60 * 24 * 18,
  },
];

const eventLeaderboard = [
  { rank: 1, name: "Rahul", xp: 2400, color: "neon-gold" },
  { rank: 2, name: "Tanishq", xp: 2150, color: "neon-cyan" },
  { rank: 3, name: "Ananya", xp: 1980, color: "neon-purple" },
  { rank: 4, name: "You", xp: 1720, color: "neon-blue", you: true },
  { rank: 5, name: "Vihaan", xp: 1540, color: "neon-green" },
];

const formatCountdown = (ms: number) => {
  if (ms <= 0) return "Ended";
  const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${d}d ${h}h ${m}m`;
};

const Events = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-orange/10 flex items-center justify-center">
          <CalendarClock className="w-5 h-5 text-neon-orange" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Seasonal Events</h1>
          <p className="text-sm text-muted-foreground">Active challenges & limited-time rewards</p>
        </div>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {events.map((e) => {
          const pct = Math.round((e.current / e.total) * 100);
          return (
            <div key={e.name} className="glass-panel-strong p-5 neon-border relative overflow-hidden" data-tick={tick}>
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-${e.color}/10 blur-3xl`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-${e.color}/15 border border-${e.color}/40 flex items-center justify-center`}>
                    <e.icon className={`w-6 h-6 text-${e.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-heading uppercase tracking-wider text-muted-foreground">Ends In</p>
                    <p className={`text-xs font-heading font-bold text-${e.color} animate-pulse-neon`}>
                      {formatCountdown(e.endsIn)}
                    </p>
                  </div>
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">{e.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{e.desc}</p>

                <div className="mb-3">
                  <div className="flex justify-between text-[10px] font-heading uppercase tracking-wider mb-1">
                    <span className="text-muted-foreground">{e.current} / {e.total}</span>
                    <span className={`text-${e.color}`}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-secondary/60 rounded-full overflow-hidden">
                    <div className={`h-full bg-${e.color} transition-all`} style={{ width: `${pct}%`, boxShadow: `0 0 10px hsl(var(--${e.color}) / 0.6)` }} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-glass-border/30">
                  <Trophy className="w-4 h-4 text-neon-gold shrink-0" />
                  <p className="text-xs text-foreground"><span className="text-muted-foreground">Reward:</span> {e.reward}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Leaderboard */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-neon-gold" />
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Winter Focus Sprint — Top Participants</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-neon-gold" />
            <span className="text-xs font-heading font-bold text-neon-gold">+1,720 XP</span>
          </div>
        </div>
        <div className="space-y-2">
          {eventLeaderboard.map((u) => (
            <div
              key={u.name}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                u.you
                  ? "border-primary/50 bg-primary/10 neon-border"
                  : "border-glass-border/30 bg-secondary/20 hover:bg-secondary/40"
              }`}
            >
              <span className={`font-heading font-black text-sm w-7 text-center ${u.rank <= 3 ? `text-${u.color}` : "text-muted-foreground"}`}>
                #{u.rank}
              </span>
              <div className={`w-9 h-9 rounded-full bg-${u.color}/20 border border-${u.color}/40 flex items-center justify-center text-[10px] font-heading font-bold text-foreground`}>
                {u.name.slice(0, 2).toUpperCase()}
              </div>
              <p className="flex-1 font-semibold text-sm text-foreground">
                {u.name} {u.you && <span className="text-[10px] font-heading text-primary uppercase tracking-wider ml-1">(you)</span>}
              </p>
              <span className={`font-heading font-bold text-sm text-${u.color}`}>+{u.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;

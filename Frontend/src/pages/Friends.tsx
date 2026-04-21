import { useState } from "react";
import { Users, UserPlus, Check, X, Eye, Swords, Sword, Brain, Sparkles, Shield, Heart, Flame, MessageCircle, Activity } from "lucide-react";
import { pushSystemNotification } from "@/components/SystemNotifications";

type Friend = {
  name: string;
  level: number;
  rank: string;
  online: boolean;
  color: string;
  stats: { STR: number; FOC: number; KNW: number; DIS: number; HP: number; CRE: number; COM: number };
};

const myStats = { STR: 42, FOC: 38, KNW: 55, DIS: 31, HP: 60, CRE: 47, COM: 35 };

const initialFriends: Friend[] = [
  { name: "Rahul", level: 14, rank: "Silver Hunter", online: true, color: "neon-cyan",
    stats: { STR: 50, FOC: 30, KNW: 48, DIS: 35, HP: 55, CRE: 40, COM: 42 } },
  { name: "Tanishq", level: 12, rank: "Bronze Hunter", online: false, color: "neon-orange",
    stats: { STR: 32, FOC: 45, KNW: 60, DIS: 28, HP: 48, CRE: 52, COM: 30 } },
  { name: "Ananya", level: 9, rank: "Bronze Hunter", online: true, color: "neon-green",
    stats: { STR: 25, FOC: 50, KNW: 42, DIS: 38, HP: 50, CRE: 45, COM: 48 } },
];

const initialPending = [
  { name: "Vihaan", level: 8, rank: "Bronze Hunter", color: "neon-blue" },
  { name: "Priya", level: 11, rank: "Silver Hunter", color: "neon-purple" },
];

const initialSuggested = [
  { name: "Arjun", level: 16, rank: "Silver Hunter", color: "neon-cyan", mutual: 4 },
  { name: "Kavya", level: 13, rank: "Bronze Hunter", color: "neon-green", mutual: 2 },
  { name: "Rohan", level: 19, rank: "Gold Hunter", color: "neon-gold", mutual: 6 },
];

const friendActivity = [
  { user: "Rahul", action: "reached Level 15", color: "neon-cyan", icon: Sparkles },
  { user: "Ananya", action: "unlocked Focus Monk title", color: "neon-purple", icon: Sparkles },
  { user: "Coding Clan", action: "completed weekly mission", color: "neon-gold", icon: Activity },
  { user: "Tanishq", action: "defeated Boss: Doom Scroller", color: "neon-red", icon: Sword },
];

const statIcons = { STR: Sword, FOC: Brain, KNW: Sparkles, DIS: Shield, HP: Heart, CRE: Flame, COM: MessageCircle };
const statColors: Record<string, string> = {
  STR: "neon-red", FOC: "neon-blue", KNW: "neon-cyan", DIS: "neon-purple",
  HP: "neon-green", CRE: "neon-orange", COM: "neon-gold",
};

const Friends = () => {
  const [friends, setFriends] = useState(initialFriends);
  const [pending, setPending] = useState(initialPending);
  const [suggested, setSuggested] = useState(initialSuggested);
  const [compareWith, setCompareWith] = useState<Friend | null>(null);

  const acceptRequest = (name: string) => {
    const p = pending.find((x) => x.name === name);
    if (!p) return;
    setPending((prev) => prev.filter((x) => x.name !== name));
    setFriends((prev) => [...prev, {
      ...p, online: true,
      stats: { STR: 30, FOC: 30, KNW: 30, DIS: 30, HP: 30, CRE: 30, COM: 30 },
    }]);
    pushSystemNotification({
      id: `friend-${Date.now()}`, type: "skill-unlock",
      title: "Friend Added", subtitle: `${name} joined your party`,
      icon: UserPlus, color: "cyan",
    });
  };

  const declineRequest = (name: string) => setPending((prev) => prev.filter((x) => x.name !== name));

  const removeFriend = (name: string) => setFriends((prev) => prev.filter((x) => x.name !== name));

  const sendRequest = (name: string) => {
    setSuggested((prev) => prev.filter((x) => x.name !== name));
    pushSystemNotification({
      id: `req-${Date.now()}`, type: "skill-unlock",
      title: "Friend Request Sent", subtitle: `Awaiting ${name}'s response`,
      icon: UserPlus, color: "blue",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-neon-cyan" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Friends</h1>
          <p className="text-sm text-muted-foreground">Your hunter network</p>
        </div>
      </div>

      {/* Friend List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Friend List</h3>
          <span className="text-[10px] font-heading text-neon-green uppercase tracking-wider">
            {friends.filter((f) => f.online).length} Online
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((f) => (
            <div key={f.name} className="glass-panel p-4 hover:neon-border transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-${f.color}/20 border border-${f.color}/40 flex items-center justify-center text-sm font-heading font-bold text-foreground`}>
                    {f.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${f.online ? "bg-neon-green" : "bg-muted-foreground/60"}`}
                    style={f.online ? { boxShadow: "0 0 8px hsl(var(--neon-green) / 0.8)" } : undefined}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-foreground truncate">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">Level {f.level} • {f.rank}</p>
                  <p className={`text-[10px] font-heading uppercase tracking-wider ${f.online ? "text-neon-green" : "text-muted-foreground"}`}>
                    {f.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button className="px-2 py-1.5 rounded-md bg-secondary/50 border border-glass-border/40 text-[10px] font-heading uppercase tracking-wider text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" /> View
                </button>
                <button
                  onClick={() => setCompareWith(f)}
                  className="px-2 py-1.5 rounded-md gradient-neon text-[10px] font-heading font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                >
                  <Swords className="w-3 h-3" /> Compare
                </button>
                <button
                  onClick={() => removeFriend(f.name)}
                  className="px-2 py-1.5 rounded-md bg-secondary/50 border border-neon-red/30 text-[10px] font-heading uppercase tracking-wider text-neon-red hover:bg-neon-red/10 transition-colors flex items-center justify-center gap-1"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compare Stats Panel */}
      {compareWith && (
        <div className="glass-panel-strong p-6 neon-border relative overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-foreground uppercase tracking-wider">
              Stat Comparison
            </h3>
            <button onClick={() => setCompareWith(null)} className="text-muted-foreground hover:text-neon-red transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <div className="w-12 h-12 mx-auto rounded-xl gradient-neon-purple flex items-center justify-center text-xs font-heading font-bold text-foreground mb-1">SH</div>
              <p className="font-heading font-bold text-sm text-neon-purple">You</p>
            </div>
            <div className="flex items-center justify-center">
              <Swords className="w-6 h-6 text-neon-cyan animate-pulse" />
            </div>
            <div>
              <div className={`w-12 h-12 mx-auto rounded-xl bg-${compareWith.color}/20 border border-${compareWith.color}/40 flex items-center justify-center text-xs font-heading font-bold text-foreground mb-1`}>
                {compareWith.name.slice(0, 2).toUpperCase()}
              </div>
              <p className={`font-heading font-bold text-sm text-${compareWith.color}`}>{compareWith.name}</p>
            </div>
          </div>
          <div className="space-y-2">
            {(Object.keys(myStats) as Array<keyof typeof myStats>).map((s) => {
              const mine = myStats[s];
              const theirs = compareWith.stats[s];
              const youAhead = mine > theirs;
              const Icon = statIcons[s];
              const color = statColors[s];
              return (
                <div key={s} className="grid grid-cols-7 items-center gap-3 p-2 rounded-lg bg-secondary/30 border border-glass-border/30">
                  <span
                    className={`col-span-2 text-right font-heading font-bold ${youAhead ? `text-${color}` : "text-muted-foreground"}`}
                    style={youAhead ? { textShadow: `0 0 12px hsl(var(--${color}) / 0.7)` } : undefined}
                  >
                    {mine}
                  </span>
                  <div className="col-span-3 flex items-center justify-center gap-2">
                    <Icon className={`w-4 h-4 text-${color}`} />
                    <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">{s}</span>
                  </div>
                  <span
                    className={`col-span-2 font-heading font-bold ${!youAhead ? `text-${color}` : "text-muted-foreground"}`}
                    style={!youAhead ? { textShadow: `0 0 12px hsl(var(--${color}) / 0.7)` } : undefined}
                  >
                    {theirs}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
            {(() => {
              const wins = (Object.keys(myStats) as Array<keyof typeof myStats>).filter((s) => myStats[s] > compareWith.stats[s]);
              const losses = (Object.keys(myStats) as Array<keyof typeof myStats>).filter((s) => myStats[s] < compareWith.stats[s]);
              return (
                <p className="text-xs font-heading text-foreground">
                  {wins.length > 0 && <>You are ahead in <span className="text-neon-cyan font-bold">{wins.join(", ")}</span>. </>}
                  {losses.length > 0 && <span className="text-muted-foreground">{compareWith.name} is ahead in <span className={`text-${compareWith.color} font-bold`}>{losses.join(", ")}</span>.</span>}
                </p>
              );
            })()}
          </div>
        </div>
      )}

      {/* Pending Requests */}
      <div>
        <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Pending Requests <span className="text-neon-orange ml-1">({pending.length})</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pending.map((p) => (
            <div key={p.name} className="glass-panel p-3 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-${p.color}/20 border border-${p.color}/40 flex items-center justify-center text-xs font-heading font-bold text-foreground`}>
                {p.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">Lv {p.level} • {p.rank}</p>
              </div>
              <button
                onClick={() => acceptRequest(p.name)}
                className="w-8 h-8 rounded-md gradient-neon flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Accept"
              >
                <Check className="w-4 h-4 text-primary-foreground" />
              </button>
              <button
                onClick={() => declineRequest(p.name)}
                className="w-8 h-8 rounded-md bg-secondary/50 border border-neon-red/30 flex items-center justify-center hover:bg-neon-red/10 transition-colors"
                aria-label="Decline"
              >
                <X className="w-4 h-4 text-neon-red" />
              </button>
            </div>
          ))}
          {pending.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No pending requests</p>
          )}
        </div>
      </div>

      {/* Suggested Users */}
      <div>
        <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Suggested Hunters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {suggested.map((s) => (
            <div key={s.name} className="glass-panel p-4 hover:neon-border transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 rounded-lg bg-${s.color}/20 border border-${s.color}/40 flex items-center justify-center text-xs font-heading font-bold text-foreground`}>
                  {s.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">Lv {s.level} • {s.rank}</p>
                  <p className="text-[10px] text-neon-cyan">{s.mutual} mutual friends</p>
                </div>
              </div>
              <button
                onClick={() => sendRequest(s.name)}
                className="w-full px-3 py-2 rounded-md gradient-neon text-[10px] font-heading font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Friend
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Friend Activity Feed */}
      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-neon-blue" />
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Friend Activity Feed</h3>
        </div>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {friendActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30 border border-glass-border/30 hover:border-neon-blue/30 transition-all">
              <div className={`w-8 h-8 rounded-lg bg-${a.color}/10 border border-${a.color}/30 flex items-center justify-center`}>
                <a.icon className={`w-4 h-4 text-${a.color}`} />
              </div>
              <p className="text-sm text-foreground">
                <span className={`font-heading font-bold text-${a.color}`}>{a.user}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;

import { useRef, useState } from "react";
import { User, Upload, Crown, Lock, Check, Sparkles, Award, Shield } from "lucide-react";
import { pushSystemNotification } from "@/components/SystemNotifications";

const frames = [
  { name: "Bronze Frame", color: "neon-orange", unlocked: true },
  { name: "Silver Frame", color: "neon-cyan", unlocked: true },
  { name: "Gold Frame", color: "neon-gold", unlocked: true },
  { name: "Shadow Aura Frame", color: "neon-purple", unlocked: false },
];

const allBadges = [
  { name: "7-Day Streak", icon: "🔥", color: "neon-orange" },
  { name: "First Boss Defeated", icon: "💀", color: "neon-red" },
  { name: "Guild Member", icon: "⚔️", color: "neon-cyan" },
  { name: "Knowledge Lv 25", icon: "🧠", color: "neon-blue" },
  { name: "Iron Will", icon: "🛡️", color: "neon-purple" },
  { name: "Early Bird", icon: "🌅", color: "neon-gold" },
];

const titles = ["Code Warrior", "Focus Monk", "Shadow Learner"];

const Avatar = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [frame, setFrame] = useState("Silver Frame");
  const [equippedBadges, setEquippedBadges] = useState<string[]>(["7-Day Streak", "Guild Member", "Knowledge Lv 25"]);
  const [title, setTitle] = useState("Code Warrior");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatar(url);
    pushSystemNotification({
      id: `av-${Date.now()}`, type: "skill-unlock",
      title: "Avatar Updated", subtitle: "Your hunter portrait was changed",
      icon: User, color: "cyan",
    });
  };

  const toggleBadge = (name: string) => {
    setEquippedBadges((prev) => {
      if (prev.includes(name)) return prev.filter((b) => b !== name);
      if (prev.length >= 3) return [prev[1], prev[2], name];
      return [...prev, name];
    });
  };

  const frameColor = frames.find((f) => f.name === frame)?.color || "neon-cyan";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
          <User className="w-5 h-5 text-neon-purple" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Character Identity</h1>
          <p className="text-sm text-muted-foreground">Customize your hunter avatar</p>
        </div>
      </div>

      {/* Character Profile Panel */}
      <div className="glass-panel-strong p-6 neon-border relative overflow-hidden">
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-${frameColor}/10 blur-3xl`} />
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-32 h-32 rounded-2xl border-4 border-${frameColor} flex items-center justify-center overflow-hidden bg-secondary`}
              style={{ boxShadow: `0 0 30px hsl(var(--${frameColor}) / 0.5)` }}
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-heading font-black text-foreground">SH</span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3 px-3 py-1.5 rounded-md gradient-neon text-[10px] font-heading font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Upload className="w-3 h-3" /> Upload
            </button>
          </div>

          <div className="md:col-span-2 space-y-2 text-center md:text-left">
            <p className="text-[10px] font-heading uppercase tracking-[0.3em] text-neon-cyan">{title}</p>
            <h2 className="font-heading text-3xl font-black text-gradient-neon">Shadow Hunter</h2>
            <p className="text-sm text-muted-foreground">Level 24 • Silver Hunter • <span className="text-neon-cyan">Coding Clan</span></p>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-heading uppercase tracking-wider mb-1">
                <span className="text-muted-foreground">3,450 / 5,000 XP</span>
                <span className="text-neon-blue">69%</span>
              </div>
              <div className="h-2 bg-secondary/60 rounded-full overflow-hidden">
                <div className="h-full gradient-neon" style={{ width: "69%", boxShadow: "0 0 10px hsl(var(--neon-blue) / 0.6)" }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              {equippedBadges.map((b) => {
                const badge = allBadges.find((x) => x.name === b);
                return badge ? (
                  <span key={b} className={`px-2.5 py-1 rounded-md bg-${badge.color}/10 border border-${badge.color}/40 text-[10px] font-heading font-bold uppercase tracking-wider text-${badge.color} flex items-center gap-1`}>
                    <span>{badge.icon}</span> {badge.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Frames */}
      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-neon-cyan" />
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Rank Frames</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {frames.map((f) => {
            const selected = frame === f.name;
            return (
              <button
                key={f.name}
                onClick={() => f.unlocked && setFrame(f.name)}
                disabled={!f.unlocked}
                className={`p-4 rounded-xl border-2 transition-all relative ${
                  selected ? `border-${f.color}` : f.unlocked ? "border-glass-border/40 hover:border-foreground/30" : "border-glass-border/20 opacity-50 cursor-not-allowed"
                }`}
                style={selected ? { boxShadow: `0 0 20px hsl(var(--${f.color}) / 0.5)` } : undefined}
              >
                <div className={`w-12 h-12 mx-auto rounded-lg border-2 border-${f.color} flex items-center justify-center mb-2`}>
                  {f.unlocked ? <Sparkles className={`w-5 h-5 text-${f.color}`} /> : <Lock className="w-5 h-5 text-muted-foreground" />}
                </div>
                <p className={`text-xs font-heading font-bold uppercase tracking-wider ${f.unlocked ? `text-${f.color}` : "text-muted-foreground"}`}>
                  {f.name}
                </p>
                {selected && (
                  <Check className="w-4 h-4 absolute top-2 right-2 text-neon-green" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-neon-gold" />
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Display Badges</h3>
          </div>
          <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">{equippedBadges.length} / 3 active</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allBadges.map((b) => {
            const active = equippedBadges.includes(b.name);
            return (
              <button
                key={b.name}
                onClick={() => toggleBadge(b.name)}
                className={`p-3 rounded-lg border transition-all flex items-center gap-3 text-left ${
                  active ? `border-${b.color}/50 bg-${b.color}/10` : "border-glass-border/30 bg-secondary/20 hover:bg-secondary/40"
                }`}
                style={active ? { boxShadow: `0 0 15px hsl(var(--${b.color}) / 0.3)` } : undefined}
              >
                <span className="text-2xl">{b.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-heading font-bold ${active ? `text-${b.color}` : "text-foreground"}`}>{b.name}</p>
                  <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
                    {active ? "Equipped" : "Tap to equip"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title Selector */}
      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-neon-gold" />
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Display Title</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {titles.map((t) => {
            const active = title === t;
            return (
              <button
                key={t}
                onClick={() => setTitle(t)}
                className={`p-3 rounded-lg border transition-all ${
                  active ? "border-neon-gold/50 bg-neon-gold/10" : "border-glass-border/30 bg-secondary/20 hover:bg-secondary/40"
                }`}
                style={active ? { boxShadow: "0 0 15px hsl(var(--neon-gold) / 0.3)" } : undefined}
              >
                <p className={`font-heading font-bold text-sm ${active ? "text-neon-gold" : "text-foreground"}`}>{t}</p>
                <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">{active ? "Active" : "Available"}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Avatar;

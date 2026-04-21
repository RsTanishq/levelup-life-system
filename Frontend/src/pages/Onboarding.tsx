import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ChevronRight, ChevronLeft, Check, Sword, Brain, Sparkles, Shield, Heart, Flame, MessageCircle } from "lucide-react";
import { PATHS, PathConfig } from "@/lib/paths";
import { usePlayerStore } from "@/lib/store";

const statIcons: Record<string, typeof Sword> = {
  Strength: Sword, Focus: Brain, Knowledge: Sparkles, Discipline: Shield,
  Health: Heart, Creativity: Flame, Communication: MessageCircle,
};

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string; ring: string }> = {
  cyan:   { border: "border-neon-cyan/50",   bg: "bg-neon-cyan/10",   text: "text-neon-cyan",   glow: "shadow-[0_0_25px_hsl(192_91%_56%/0.3)]", ring: "ring-neon-cyan/60" },
  red:    { border: "border-neon-red/50",    bg: "bg-neon-red/10",    text: "text-neon-red",    glow: "shadow-[0_0_25px_hsl(0_84%_60%/0.3)]",   ring: "ring-neon-red/60" },
  blue:   { border: "border-neon-blue/50",   bg: "bg-neon-blue/10",   text: "text-neon-blue",   glow: "shadow-[0_0_25px_hsl(217_91%_60%/0.3)]", ring: "ring-neon-blue/60" },
  orange: { border: "border-neon-orange/50", bg: "bg-neon-orange/10", text: "text-neon-orange", glow: "shadow-[0_0_25px_hsl(25_95%_53%/0.3)]",  ring: "ring-neon-orange/60" },
  gold:   { border: "border-neon-gold/50",   bg: "bg-neon-gold/10",   text: "text-neon-gold",   glow: "shadow-[0_0_25px_hsl(45_93%_47%/0.3)]",  ring: "ring-neon-gold/60" },
};

const STEPS = ["Welcome", "Choose Path", "Preview Stats", "Begin"];

const Onboarding = () => {
  const navigate = useNavigate();
  const { setOnboarded, setHunterName, setSelectedPath } = usePlayerStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<PathConfig | null>(null);

  const canNext = step === 0 ? name.trim().length >= 2 : step === 1 ? !!selected : true;

  const handleFinish = () => {
    if (!selected) return;
    setHunterName(name.trim());
    setSelectedPath(selected);
    setOnboarded(true);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* BG effects */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 transition-all duration-300 ${
                i < step ? "text-primary" : i === step ? "text-foreground" : "text-muted-foreground/40"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold border-2 transition-all duration-300 ${
                  i < step
                    ? "bg-primary/20 border-primary text-primary"
                    : i === step
                    ? "border-primary neon-border text-primary"
                    : "border-glass-border/30 text-muted-foreground/40"
                }`}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px transition-colors ${i < step ? "bg-primary" : "bg-glass-border/30"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-panel-strong neon-glow p-8">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-neon flex items-center justify-center neon-glow-strong">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-foreground mb-2">SYSTEM INITIALIZING</h2>
                <p className="text-muted-foreground text-sm">Welcome, Hunter. Enter your name to begin.</p>
              </div>
              <div className="max-w-xs mx-auto">
                <label className="block text-xs font-heading text-muted-foreground uppercase tracking-wider mb-2 text-left">Hunter Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-glass-border/40 text-foreground placeholder:text-muted-foreground/50 font-body text-sm focus:outline-none focus:border-primary focus:neon-border transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && canNext && setStep(1)}
                />
              </div>
            </div>
          )}

          {/* Step 1: Choose Path */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="font-heading text-xl font-black text-foreground mb-1">CHOOSE YOUR PATH</h2>
                <p className="text-muted-foreground text-sm">Select your primary progression path, {name}</p>
              </div>
              <div className="grid gap-3">
                {PATHS.map((path) => {
                  const cm = colorMap[path.color];
                  const isSelected = selected?.id === path.id;
                  return (
                    <button
                      key={path.id}
                      onClick={() => setSelected(path)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-xl ${
                        isSelected
                          ? `${cm.border} ${cm.bg} ${cm.glow} ring-2 ${cm.ring}`
                          : "border-glass-border/20 bg-glass/30 hover:border-glass-border/40 hover:bg-glass/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{path.icon}</span>
                        <div className="flex-1">
                          <p className={`font-heading text-sm font-bold uppercase tracking-wide ${isSelected ? cm.text : "text-foreground"}`}>
                            {path.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{path.subtitle}</p>
                        </div>
                        {isSelected && (
                          <div className={`w-6 h-6 rounded-full ${cm.bg} flex items-center justify-center`}>
                            <Check className={`w-3.5 h-3.5 ${cm.text}`} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Preview Stats */}
          {step === 2 && selected && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-xs font-heading text-muted-foreground uppercase tracking-widest mb-1">— Starting Stats —</p>
                <h2 className="font-heading text-xl font-black text-foreground mb-1">{selected.icon} {selected.name}</h2>
                <p className="text-muted-foreground text-sm">Your initial stat allocation based on chosen path</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(selected.stats).map(([stat, value]) => {
                  const Icon = statIcons[stat] || Sparkles;
                  return (
                    <div key={stat} className="glass-panel p-3 text-center">
                      <Icon className={`w-4 h-4 mx-auto mb-1 ${colorMap[selected.color]?.text || "text-primary"}`} />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat}</p>
                      <p className="font-heading font-bold text-lg text-foreground">{value}</p>
                      <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full gradient-neon rounded-full" style={{ width: `${(value / 35) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <p className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-2">Recommended Quests</p>
                <div className="space-y-2">
                  {selected.quests.slice(0, 3).map((q, i) => (
                    <div key={i} className="glass-panel p-3 flex items-center justify-between">
                      <span className="text-sm text-foreground">{q.title}</span>
                      <span className="text-xs text-primary font-heading">+{q.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Begin */}
          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 mx-auto rounded-full gradient-neon neon-glow-strong flex items-center justify-center animate-pulse-neon">
                <Zap className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-heading text-muted-foreground uppercase tracking-widest mb-2">— System Ready —</p>
                <h2 className="font-heading text-2xl font-black text-foreground mb-2">
                  WELCOME, <span className="text-gradient-neon">{name.toUpperCase()}</span>
                </h2>
                <p className="text-muted-foreground text-sm">
                  Path: <span className="text-foreground font-semibold">{selected?.name}</span> • Starting Level: 1
                </p>
              </div>
              <button
                onClick={handleFinish}
                className="px-10 py-4 rounded-xl gradient-neon font-heading font-bold text-sm tracking-wider text-primary-foreground neon-glow-strong hover:scale-105 transition-transform duration-300 uppercase"
              >
                Enter the System
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-glass-border/20">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  step === 0 ? "text-muted-foreground/30 cursor-not-allowed" : "text-muted-foreground hover:text-foreground"
                }`}
                disabled={step === 0}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext}
                className={`flex items-center gap-1 px-5 py-2 rounded-lg font-heading text-xs font-bold uppercase tracking-wider transition-all ${
                  canNext
                    ? "gradient-neon text-primary-foreground neon-glow hover:opacity-90"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

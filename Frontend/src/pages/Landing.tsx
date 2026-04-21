import { useNavigate } from "react-router-dom";
import { Zap, Shield, Brain, Flame, Heart, Sparkles, Sword } from "lucide-react";

const floatingStats = [
  { name: "STR", value: 42, icon: Sword, color: "text-neon-red" },
  { name: "FOC", value: 38, icon: Brain, color: "text-neon-blue" },
  { name: "KNW", value: 55, icon: Sparkles, color: "text-neon-cyan" },
  { name: "DIS", value: 31, icon: Shield, color: "text-neon-purple" },
  { name: "HP", value: 60, icon: Heart, color: "text-neon-green" },
  { name: "CRE", value: 47, icon: Flame, color: "text-neon-orange" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* BG grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-xl gradient-neon flex items-center justify-center neon-glow-strong">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold tracking-wider text-foreground">LEVELUP</h2>
            <p className="text-[10px] font-heading tracking-[0.4em] text-muted-foreground">LIFE SYSTEM</p>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-5xl md:text-7xl font-black text-center mb-4 leading-tight">
          <span className="text-foreground">Level Up Your</span>
          <br />
          <span className="text-gradient-neon neon-text">Real Life</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl text-center max-w-lg mb-10 font-body">
          Track progress like an RPG character. Build real-world stats. Become your best self.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/onboarding")}
          className="px-8 py-4 rounded-xl gradient-neon font-heading font-bold text-sm tracking-wider text-primary-foreground neon-glow-strong hover:scale-105 transition-transform duration-300 uppercase"
        >
          Start Your Journey
        </button>

        {/* Floating stat panel */}
        <div className="mt-16 glass-panel neon-glow p-6 max-w-md w-full animate-float">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-neon-purple" />
              <div>
                <p className="text-sm font-bold text-foreground">Shadow Hunter</p>
                <p className="text-xs text-muted-foreground">Lv. 24 • Silver Rank</p>
              </div>
            </div>
            <span className="text-xs font-heading text-primary">3,450 XP</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {floatingStats.map((s) => (
              <div key={s.name} className="bg-secondary/30 rounded-lg p-2 text-center">
                <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
                <p className="text-[10px] text-muted-foreground">{s.name}</p>
                <p className={`text-sm font-heading font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

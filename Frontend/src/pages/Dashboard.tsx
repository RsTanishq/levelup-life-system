import { useState } from "react";
import { Sword, Brain, Sparkles, Shield, Heart, Flame, MessageCircle, Coins } from "lucide-react";
import StatCard from "@/components/StatCard";
import XPBar from "@/components/XPBar";
import LevelUpPopup from "@/components/LevelUpPopup";
import StreakWidget from "@/components/StreakWidget";
import AICoach from "@/components/AICoach";
import NotificationCenter from "@/components/NotificationCenter";
import { triggerDemoNotifications } from "@/components/SystemNotifications";
import { usePlayerStore } from "@/lib/store";

const statIcons = { Strength: Sword, Focus: Brain, Knowledge: Sparkles, Discipline: Shield, Health: Heart, Creativity: Flame, Communication: MessageCircle };
const statColors: Record<string, string> = { Strength: "red", Focus: "blue", Knowledge: "cyan", Discipline: "purple", Health: "green", Creativity: "orange", Communication: "gold" };

const defaultStats = [
  { name: "Strength", value: 42, maxValue: 100, icon: Sword, color: "red", increase: 3 },
  { name: "Focus", value: 38, maxValue: 100, icon: Brain, color: "blue", increase: 5 },
  { name: "Knowledge", value: 55, maxValue: 100, icon: Sparkles, color: "cyan", increase: 2 },
  { name: "Discipline", value: 31, maxValue: 100, icon: Shield, color: "purple", increase: 4 },
  { name: "Health", value: 60, maxValue: 100, icon: Heart, color: "green", increase: 1 },
  { name: "Creativity", value: 47, maxValue: 100, icon: Flame, color: "orange", increase: 3 },
  { name: "Communication", value: 35, maxValue: 100, icon: MessageCircle, color: "gold", increase: 2 },
];

const Dashboard = () => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const { hunterName, selectedPath } = usePlayerStore();

  const stats = selectedPath
    ? Object.entries(selectedPath.stats).map(([name, value]) => ({
        name,
        value,
        maxValue: 100,
        icon: statIcons[name as keyof typeof statIcons] || Sparkles,
        color: statColors[name] || "blue",
        increase: Math.floor(Math.random() * 4) + 1,
      }))
    : defaultStats;

  const displayName = hunterName || "Hunter";

  return (
    <div className="space-y-6">
      <LevelUpPopup show={showLevelUp} level={selectedPath ? 2 : 25} onClose={() => setShowLevelUp(false)} />

      {/* Top Header */}
      <div className="glass-panel p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-neon-purple flex items-center justify-center neon-glow text-base font-heading font-black text-foreground shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] font-heading text-primary uppercase tracking-[0.3em]">
              Level {selectedPath ? 1 : 24} • Silver Hunter
            </p>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">{displayName}</h1>
            <p className="text-xs text-muted-foreground">Welcome back, hunter</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="glass-panel px-3 py-2 flex items-center gap-2">
            <Coins className="w-4 h-4 text-neon-gold" />
            <span className="font-heading font-bold text-neon-gold text-sm">145</span>
          </div>
          <NotificationCenter />
          <button onClick={() => triggerDemoNotifications()} className="px-3 py-2 rounded-lg glass-panel neon-border text-[10px] font-heading font-bold text-primary hover:bg-primary/10 transition-colors uppercase">
            Alert
          </button>
          <button onClick={() => setShowLevelUp(true)} className="px-3 py-2 rounded-lg gradient-neon text-[10px] font-heading font-bold text-primary-foreground neon-glow hover:opacity-90 transition-opacity uppercase">
            Level Up
          </button>
        </div>
      </div>

      <XPBar current={selectedPath ? 150 : 3450} max={selectedPath ? 500 : 5000} level={selectedPath ? 1 : 24} />

      {selectedPath && (
        <div className="glass-panel p-4 neon-border">
          <p className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-1">Active Path</p>
          <p className="font-heading font-bold text-foreground">{selectedPath.icon} {selectedPath.name}</p>
          <p className="text-xs text-muted-foreground">{selectedPath.subtitle}</p>
        </div>
      )}

      {/* Streak + AI Coach */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StreakWidget />
        <div className="lg:col-span-2">
          <AICoach />
        </div>
      </div>

      <div>
        <h2 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Character Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.name} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

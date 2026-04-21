import { useState } from "react";
import { Check, Coins, Zap, TrendingUp, Trophy } from "lucide-react";
import { pushSystemNotification } from "./SystemNotifications";

interface QuestCardProps {
  title: string;
  xp: number;
  coins: number;
  stat: string;
  completed?: boolean;
}

const QuestCard = ({ title, xp, coins, stat, completed: initialCompleted = false }: QuestCardProps) => {
  const [completed, setCompleted] = useState(initialCompleted);

  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      pushSystemNotification({
        id: `quest-${Date.now()}`,
        type: "quest-complete",
        title: "Quest Complete!",
        subtitle: `+${xp} XP, +${coins} Coins • ${stat}`,
        icon: Trophy,
        color: "gold",
      });
    }
  };

  return (
    <div className={`glass-panel p-4 transition-all duration-300 ${completed ? "border-neon-green/30 opacity-70" : "hover:neon-glow"}`}>
      <div className="flex items-center gap-4">
        <button
          onClick={handleComplete}
          className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
            completed
              ? "bg-neon-green/20 border-neon-green text-neon-green"
              : "border-glass-border hover:border-primary"
          }`}
        >
          {completed && <Check className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {title}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-neon-blue">
              <Zap className="w-3 h-3" /> {xp} XP
            </span>
            <span className="flex items-center gap-1 text-xs text-neon-gold">
              <Coins className="w-3 h-3" /> {coins}
            </span>
            <span className="flex items-center gap-1 text-xs text-neon-green">
              <TrendingUp className="w-3 h-3" /> {stat}
            </span>
          </div>
        </div>

        {!completed && (
          <button
            onClick={handleComplete}
            className="px-3 py-1.5 text-xs font-heading font-bold rounded-lg gradient-neon text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
          >
            COMPLETE
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestCard;

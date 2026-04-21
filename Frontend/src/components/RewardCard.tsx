import { Lock, Coins } from "lucide-react";

interface RewardCardProps {
  name: string;
  type: string;
  requiredLevel: number;
  requiredCoins: number;
  unlocked: boolean;
  image?: string;
}

const RewardCard = ({ name, type, requiredLevel, requiredCoins, unlocked }: RewardCardProps) => {
  return (
    <div className={`glass-panel p-5 transition-all duration-300 relative overflow-hidden ${unlocked ? "hover:neon-glow cursor-pointer" : "opacity-60"}`}>
      {!unlocked && (
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center z-10">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
      <div className="w-full h-24 rounded-lg bg-secondary/50 mb-3 flex items-center justify-center">
        <span className="text-3xl">🏆</span>
      </div>
      <p className="font-semibold text-sm text-foreground mb-1">{name}</p>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">{type}</p>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-primary">Lv. {requiredLevel}</span>
        <span className="flex items-center gap-1 text-neon-gold">
          <Coins className="w-3 h-3" /> {requiredCoins}
        </span>
      </div>
    </div>
  );
};

export default RewardCard;

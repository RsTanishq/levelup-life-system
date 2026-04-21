import { LucideIcon } from "lucide-react";

interface StatCardProps {
  name: string;
  value: number;
  maxValue: number;
  icon: LucideIcon;
  color: string;
  increase?: number;
}

const colorMap: Record<string, { bg: string; text: string; bar: string; glow: string }> = {
  blue: { bg: "bg-neon-blue/10", text: "text-neon-blue", bar: "bg-neon-blue", glow: "shadow-[0_0_15px_hsl(217_91%_60%/0.3)]" },
  cyan: { bg: "bg-neon-cyan/10", text: "text-neon-cyan", bar: "bg-neon-cyan", glow: "shadow-[0_0_15px_hsl(192_91%_56%/0.3)]" },
  purple: { bg: "bg-neon-purple/10", text: "text-neon-purple", bar: "bg-neon-purple", glow: "shadow-[0_0_15px_hsl(265_89%_62%/0.3)]" },
  green: { bg: "bg-neon-green/10", text: "text-neon-green", bar: "bg-neon-green", glow: "shadow-[0_0_15px_hsl(142_71%_45%/0.3)]" },
  orange: { bg: "bg-neon-orange/10", text: "text-neon-orange", bar: "bg-neon-orange", glow: "shadow-[0_0_15px_hsl(25_95%_53%/0.3)]" },
  red: { bg: "bg-neon-red/10", text: "text-neon-red", bar: "bg-neon-red", glow: "shadow-[0_0_15px_hsl(0_84%_60%/0.3)]" },
  gold: { bg: "bg-neon-gold/10", text: "text-neon-gold", bar: "bg-neon-gold", glow: "shadow-[0_0_15px_hsl(45_93%_47%/0.3)]" },
};

const StatCard = ({ name, value, maxValue, icon: Icon, color, increase }: StatCardProps) => {
  const c = colorMap[color] || colorMap.blue;
  const pct = Math.min((value / maxValue) * 100, 100);

  return (
    <div className={`glass-panel p-4 hover:neon-glow transition-all duration-300 group cursor-default ${c.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${c.text}`} />
        </div>
        {increase !== undefined && increase > 0 && (
          <span className="text-neon-green text-xs font-heading font-bold animate-pulse">+{increase}</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{name}</p>
      <p className={`text-2xl font-heading font-bold ${c.text}`}>{value}</p>
      <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default StatCard;

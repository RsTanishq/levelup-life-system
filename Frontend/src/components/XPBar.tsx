interface XPBarProps {
  current: number;
  max: number;
  level: number;
}

const XPBar = ({ current, max, level }: XPBarProps) => {
  const pct = (current / max) * 100;

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-neon flex items-center justify-center neon-glow-strong">
            <span className="font-heading font-bold text-lg text-primary-foreground">{level}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Level</p>
            <p className="font-heading font-bold text-foreground">Silver Hunter</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">XP Progress</p>
          <p className="font-heading font-bold text-primary">{current} <span className="text-muted-foreground font-normal">/ {max}</span></p>
        </div>
      </div>
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full gradient-neon rounded-full transition-all duration-1000 relative"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default XPBar;

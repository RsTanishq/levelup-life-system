import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface LevelUpPopupProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

const LevelUpPopup = ({ show, level, onClose }: LevelUpPopupProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="animate-level-up text-center">
        <div className="w-32 h-32 mx-auto rounded-full gradient-neon neon-glow-strong flex items-center justify-center mb-6">
          <Zap className="w-16 h-16 text-primary-foreground" />
        </div>
        <h2 className="font-heading text-4xl font-black text-gradient-neon neon-text mb-2">LEVEL UP!</h2>
        <p className="font-heading text-6xl font-black text-foreground">{level}</p>
        <p className="text-muted-foreground mt-2 text-sm">You've reached a new level</p>
      </div>
    </div>
  );
};

export default LevelUpPopup;

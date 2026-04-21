import RewardCard from "@/components/RewardCard";
import { Gift } from "lucide-react";

const digitalRewards = [
  { name: "Shadow Hunter Badge", type: "Badge", requiredLevel: 10, requiredCoins: 100, unlocked: true },
  { name: "Neon Glow Theme", type: "Theme", requiredLevel: 15, requiredCoins: 250, unlocked: true },
  { name: "Gold Frame", type: "Profile Frame", requiredLevel: 25, requiredCoins: 500, unlocked: false },
  { name: "Elite Badge", type: "Badge", requiredLevel: 30, requiredCoins: 750, unlocked: false },
];

const physicalRewards = [
  { name: "LevelUp T-Shirt", type: "T-Shirt", requiredLevel: 20, requiredCoins: 1000, unlocked: true },
  { name: "Hunter Hoodie", type: "Hoodie", requiredLevel: 30, requiredCoins: 2000, unlocked: false },
  { name: "Sticker Pack", type: "Stickers", requiredLevel: 5, requiredCoins: 50, unlocked: true },
  { name: "Premium Notebook", type: "Accessory", requiredLevel: 35, requiredCoins: 1500, unlocked: false },
];

const Rewards = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-gold/10 flex items-center justify-center">
          <Gift className="w-5 h-5 text-neon-gold" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Rewards Store</h1>
          <p className="text-sm text-muted-foreground">Redeem your hard-earned coins</p>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Digital Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {digitalRewards.map((r, i) => <RewardCard key={i} {...r} />)}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Physical Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {physicalRewards.map((r, i) => <RewardCard key={i} {...r} />)}
        </div>
      </div>
    </div>
  );
};

export default Rewards;

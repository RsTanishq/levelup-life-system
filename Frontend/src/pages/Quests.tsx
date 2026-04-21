import QuestCard from "@/components/QuestCard";
import { Swords, Calendar } from "lucide-react";
import { usePlayerStore } from "@/lib/store";

const defaultQuests = [
  { title: "Study for 45 minutes", xp: 50, coins: 10, stat: "+2 Knowledge" },
  { title: "Workout for 20 minutes", xp: 40, coins: 8, stat: "+3 Strength" },
  { title: "Drink 2L of water", xp: 20, coins: 5, stat: "+1 Health" },
  { title: "Read 10 pages", xp: 35, coins: 7, stat: "+2 Focus" },
  { title: "Meditate for 10 minutes", xp: 30, coins: 6, stat: "+2 Discipline" },
  { title: "Practice a creative skill", xp: 45, coins: 9, stat: "+3 Creativity" },
  { title: "Have a meaningful conversation", xp: 25, coins: 5, stat: "+2 Communication" },
];

const Quests = () => {
  const { selectedPath } = usePlayerStore();
  const quests = selectedPath ? selectedPath.quests : defaultQuests;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
            <Swords className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Daily Quests</h1>
            <p className="text-sm text-muted-foreground">
              {selectedPath ? `${selectedPath.name} — Recommended quests` : "Complete quests to earn XP and coins"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground glass-panel px-3 py-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
        </div>
      </div>

      <div className="space-y-3">
        {quests.map((q, i) => (
          <QuestCard key={i} {...q} />
        ))}
      </div>
    </div>
  );
};

export default Quests;

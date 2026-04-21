import { LucideIcon } from "lucide-react";

export interface PathConfig {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  stats: {
    Strength: number;
    Focus: number;
    Knowledge: number;
    Discipline: number;
    Health: number;
    Creativity: number;
    Communication: number;
  };
  quests: { title: string; xp: number; coins: number; stat: string }[];
}

export const PATHS: PathConfig[] = [
  {
    id: "engineer",
    name: "Engineer Path",
    subtitle: "Master code, systems & AI",
    icon: "⚙️",
    color: "cyan",
    stats: { Strength: 10, Focus: 25, Knowledge: 30, Discipline: 20, Health: 10, Creativity: 15, Communication: 10 },
    quests: [
      { title: "Code for 60 minutes", xp: 60, coins: 12, stat: "+3 Knowledge" },
      { title: "Solve an algorithm problem", xp: 50, coins: 10, stat: "+2 Focus" },
      { title: "Read tech documentation", xp: 35, coins: 7, stat: "+2 Knowledge" },
      { title: "Build a mini project", xp: 80, coins: 15, stat: "+3 Creativity" },
      { title: "Review someone's code", xp: 30, coins: 6, stat: "+2 Communication" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness Warrior Path",
    subtitle: "Build strength & endurance",
    icon: "⚔️",
    color: "red",
    stats: { Strength: 30, Focus: 10, Knowledge: 5, Discipline: 25, Health: 30, Creativity: 5, Communication: 10 },
    quests: [
      { title: "Workout for 30 minutes", xp: 50, coins: 10, stat: "+3 Strength" },
      { title: "Run 3 kilometers", xp: 45, coins: 9, stat: "+2 Health" },
      { title: "Drink 3L of water", xp: 25, coins: 5, stat: "+1 Health" },
      { title: "Meal prep healthy food", xp: 40, coins: 8, stat: "+2 Discipline" },
      { title: "Stretch for 15 minutes", xp: 20, coins: 4, stat: "+1 Health" },
    ],
  },
  {
    id: "focus",
    name: "Deep Focus Student",
    subtitle: "Master learning & concentration",
    icon: "🧠",
    color: "blue",
    stats: { Strength: 5, Focus: 30, Knowledge: 25, Discipline: 25, Health: 10, Creativity: 10, Communication: 10 },
    quests: [
      { title: "Study for 45 minutes (Pomodoro)", xp: 50, coins: 10, stat: "+3 Focus" },
      { title: "Read 20 pages", xp: 40, coins: 8, stat: "+2 Knowledge" },
      { title: "Meditate for 15 minutes", xp: 30, coins: 6, stat: "+2 Discipline" },
      { title: "Take handwritten notes", xp: 35, coins: 7, stat: "+2 Knowledge" },
      { title: "No social media for 4 hours", xp: 45, coins: 9, stat: "+3 Focus" },
    ],
  },
  {
    id: "creative",
    name: "Creative Artist Path",
    subtitle: "Unlock imagination & expression",
    icon: "🎨",
    color: "orange",
    stats: { Strength: 5, Focus: 15, Knowledge: 10, Discipline: 10, Health: 5, Creativity: 35, Communication: 20 },
    quests: [
      { title: "Create art for 30 minutes", xp: 50, coins: 10, stat: "+3 Creativity" },
      { title: "Write 500 words", xp: 40, coins: 8, stat: "+2 Creativity" },
      { title: "Learn a new design technique", xp: 35, coins: 7, stat: "+2 Knowledge" },
      { title: "Share work & get feedback", xp: 30, coins: 6, stat: "+2 Communication" },
      { title: "Study a masterpiece", xp: 25, coins: 5, stat: "+1 Knowledge" },
    ],
  },
  {
    id: "entrepreneur",
    name: "Entrepreneur Path",
    subtitle: "Build ventures & lead teams",
    icon: "🚀",
    color: "gold",
    stats: { Strength: 10, Focus: 15, Knowledge: 20, Discipline: 20, Health: 5, Creativity: 15, Communication: 30 },
    quests: [
      { title: "Work on business plan 30 min", xp: 50, coins: 10, stat: "+2 Knowledge" },
      { title: "Network with 1 new person", xp: 40, coins: 8, stat: "+3 Communication" },
      { title: "Read business/startup content", xp: 30, coins: 6, stat: "+2 Knowledge" },
      { title: "Practice a pitch or presentation", xp: 45, coins: 9, stat: "+3 Communication" },
      { title: "Analyze a competitor", xp: 35, coins: 7, stat: "+2 Focus" },
    ],
  },
];

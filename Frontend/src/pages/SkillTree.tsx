import { GitBranch, Lock, CheckCircle } from "lucide-react";

const paths = [
  {
    name: "AI Engineer Path",
    color: "neon-cyan",
    nodes: [
      { name: "Python Basics", unlocked: true },
      { name: "Data Structures", unlocked: true },
      { name: "ML Fundamentals", unlocked: true },
      { name: "Deep Learning", unlocked: false },
      { name: "LLM Engineering", unlocked: false },
    ],
  },
  {
    name: "Fitness Path",
    color: "neon-red",
    nodes: [
      { name: "Cardio Basics", unlocked: true },
      { name: "Weight Training", unlocked: true },
      { name: "Nutrition Plan", unlocked: false },
      { name: "Advanced HIIT", unlocked: false },
      { name: "Marathon Ready", unlocked: false },
    ],
  },
  {
    name: "Deep Focus Path",
    color: "neon-blue",
    nodes: [
      { name: "Pomodoro Mastery", unlocked: true },
      { name: "Flow State", unlocked: false },
      { name: "Distraction Guard", unlocked: false },
      { name: "Deep Work Pro", unlocked: false },
    ],
  },
  {
    name: "Communication Mastery",
    color: "neon-gold",
    nodes: [
      { name: "Active Listening", unlocked: true },
      { name: "Public Speaking", unlocked: true },
      { name: "Negotiation", unlocked: false },
      { name: "Leadership", unlocked: false },
    ],
  },
  {
    name: "Creative Mind Path",
    color: "neon-orange",
    nodes: [
      { name: "Ideation Basics", unlocked: true },
      { name: "Visual Design", unlocked: false },
      { name: "Storytelling", unlocked: false },
      { name: "Innovation Lab", unlocked: false },
    ],
  },
];

const colorClasses: Record<string, string> = {
  "neon-cyan": "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10",
  "neon-red": "text-neon-red border-neon-red/30 bg-neon-red/10",
  "neon-blue": "text-neon-blue border-neon-blue/30 bg-neon-blue/10",
  "neon-gold": "text-neon-gold border-neon-gold/30 bg-neon-gold/10",
  "neon-orange": "text-neon-orange border-neon-orange/30 bg-neon-orange/10",
};

const SkillTree = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
          <GitBranch className="w-5 h-5 text-neon-purple" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Skill Tree</h1>
          <p className="text-sm text-muted-foreground">Unlock skills as your stats grow</p>
        </div>
      </div>

      <div className="space-y-6">
        {paths.map((path) => {
          const cc = colorClasses[path.color];
          return (
            <div key={path.name} className="glass-panel p-5">
              <h3 className={`font-heading text-sm font-bold uppercase tracking-wider mb-4 ${cc.split(" ")[0]}`}>
                {path.name}
              </h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {path.nodes.map((node, i) => (
                  <div key={i} className="flex items-center gap-3 shrink-0">
                    <div className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      node.unlocked ? cc : "border-glass-border/30 bg-secondary/20 text-muted-foreground"
                    }`}>
                      {node.unlocked ? (
                        <CheckCircle className="w-4 h-4 mb-0.5" />
                      ) : (
                        <Lock className="w-4 h-4 mb-0.5" />
                      )}
                      <p className="text-[8px] text-center leading-tight px-1">{node.name}</p>
                    </div>
                    {i < path.nodes.length - 1 && (
                      <div className={`w-8 h-0.5 ${node.unlocked ? cc.split(" ")[2] : "bg-glass-border/30"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillTree;

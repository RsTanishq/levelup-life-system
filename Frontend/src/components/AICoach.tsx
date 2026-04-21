import { Sparkles, Brain, Zap } from "lucide-react";

const suggestions = [
  {
    icon: Brain,
    color: "neon-cyan",
    title: "Refocus needed",
    text: "Your focus dropped 18% this week. Try a 45-minute deep work session tomorrow.",
  },
  {
    icon: Zap,
    color: "neon-blue",
    title: "Knowledge surge",
    text: "You gained 12 Knowledge points yesterday. Continue coding practice today.",
  },
];

const AICoach = () => {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg gradient-neon-purple flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-foreground" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">AI Coach</h3>
          <p className="text-[10px] text-muted-foreground">Personalized recommendations</p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border bg-secondary/30 hover:bg-secondary/50 transition-all border-${s.color}/30`}
            style={{ boxShadow: `inset 0 0 20px hsl(var(--${s.color}) / 0.05)` }}
          >
            <div className="flex items-start gap-3">
              <s.icon className={`w-4 h-4 text-${s.color} mt-0.5 shrink-0`} />
              <div>
                <p className={`font-heading text-xs font-bold uppercase tracking-wider mb-1 text-${s.color}`}>{s.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AICoach;

import { Trophy } from "lucide-react";

const players = [
  { rank: 1, name: "Sung Jin-Woo", level: 99, xp: 99999, title: "Shadow Monarch" },
  { rank: 2, name: "Cha Hae-In", level: 85, xp: 82450, title: "S-Rank Hunter" },
  { rank: 3, name: "Baek Yoon-Ho", level: 78, xp: 71200, title: "S-Rank Hunter" },
  { rank: 4, name: "Go Gun-Hee", level: 72, xp: 65800, title: "A-Rank Hunter" },
  { rank: 5, name: "Thomas Andre", level: 68, xp: 59100, title: "A-Rank Hunter" },
  { rank: 6, name: "Liu Zhigang", level: 65, xp: 54200, title: "A-Rank Hunter" },
  { rank: 7, name: "You", level: 24, xp: 3450, title: "Silver Hunter", isCurrentUser: true },
  { rank: 8, name: "Yoo Jin-Ho", level: 22, xp: 2900, title: "Bronze Hunter" },
  { rank: 9, name: "Park Heejin", level: 18, xp: 2100, title: "Bronze Hunter" },
  { rank: 10, name: "Kim Sangshik", level: 15, xp: 1600, title: "Bronze Hunter" },
];

const rankColors: Record<number, string> = {
  1: "text-neon-gold",
  2: "text-foreground",
  3: "text-neon-orange",
};

const Leaderboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-gold/10 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-neon-gold" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Global Hunter Rankings</p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border/30">
              <th className="px-6 py-3 text-left text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">Hunter</th>
              <th className="px-6 py-3 text-left text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">XP</th>
              <th className="px-6 py-3 text-left text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">Title</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr
                key={p.rank}
                className={`border-b border-glass-border/10 transition-colors ${
                  (p as any).isCurrentUser ? "bg-primary/10 neon-border" : "hover:bg-secondary/30"
                }`}
              >
                <td className={`px-6 py-4 font-heading font-bold ${rankColors[p.rank] || "text-muted-foreground"}`}>
                  #{p.rank}
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">
                  {p.name} {(p as any).isCurrentUser && <span className="text-primary text-xs ml-1">(You)</span>}
                </td>
                <td className="px-6 py-4 font-heading font-bold text-primary">{p.level}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{p.xp.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground">{p.title}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;

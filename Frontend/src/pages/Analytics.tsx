import { BarChart3, TrendingUp, Target, Flame } from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const xpData = [
  { day: "Mon", xp: 120 }, { day: "Tue", xp: 180 }, { day: "Wed", xp: 95 },
  { day: "Thu", xp: 220 }, { day: "Fri", xp: 160 }, { day: "Sat", xp: 280 }, { day: "Sun", xp: 240 },
];

const statTrends = [
  { stat: "STR", value: 42 }, { stat: "FOC", value: 38 }, { stat: "KNW", value: 55 },
  { stat: "DIS", value: 31 }, { stat: "HP", value: 60 }, { stat: "CRE", value: 47 }, { stat: "COM", value: 35 },
];

const questData = [
  { week: "W1", completed: 18, total: 25 },
  { week: "W2", completed: 22, total: 25 },
  { week: "W3", completed: 20, total: 25 },
  { week: "W4", completed: 24, total: 25 },
];

const streakData = [
  { week: "W1", days: 3 }, { week: "W2", days: 5 }, { week: "W3", days: 6 },
  { week: "W4", days: 7 }, { week: "W5", days: 4 }, { week: "W6", days: 6 },
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--glass))",
  border: "1px solid hsl(var(--glass-border))",
  borderRadius: "8px",
  fontSize: "12px",
};

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-neon-cyan" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Your hunter performance insights</p>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total XP", value: "1,295", icon: TrendingUp, color: "neon-blue" },
          { label: "Quests Done", value: "84", icon: Target, color: "neon-cyan" },
          { label: "Best Streak", value: "12d", icon: Flame, color: "neon-orange" },
          { label: "Win Rate", value: "92%", icon: BarChart3, color: "neon-green" },
        ].map((s) => (
          <div key={s.label} className="glass-panel p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <s.icon className={`w-4 h-4 text-${s.color}`} />
            </div>
            <p className={`font-heading text-2xl font-bold text-${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly XP */}
        <div className="glass-panel p-5">
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Weekly XP Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={xpData}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--neon-blue))" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(var(--neon-blue))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border) / 0.3)" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="xp" stroke="hsl(var(--neon-blue))" fill="url(#xpGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stat Radar */}
        <div className="glass-panel p-5">
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Stat Improvement Trends</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={statTrends}>
              <PolarGrid stroke="hsl(var(--glass-border) / 0.4)" />
              <PolarAngleAxis dataKey="stat" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Radar dataKey="value" stroke="hsl(var(--neon-cyan))" fill="hsl(var(--neon-cyan))" fillOpacity={0.4} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Quest completion */}
        <div className="glass-panel p-5">
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Quest Completion Rate</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={questData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border) / 0.3)" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="completed" fill="hsl(var(--neon-green))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="total" fill="hsl(var(--glass-border))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Streak history */}
        <div className="glass-panel p-5">
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Streak Performance History</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={streakData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border) / 0.3)" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="days" stroke="hsl(var(--neon-orange))" strokeWidth={2} dot={{ fill: "hsl(var(--neon-orange))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

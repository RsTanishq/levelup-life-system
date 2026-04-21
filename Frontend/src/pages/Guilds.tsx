import { useState } from "react";
import {
  Users, Crown, Shield, Star, UserPlus, Copy, Send, Search, Lock, Check,
  Sparkles, TrendingUp, Smile, Megaphone, UserMinus, Flag, Zap, Gift, Coins,
  Shirt, Activity, ChevronRight,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { pushSystemNotification } from "@/components/SystemNotifications";
import { Trophy } from "lucide-react";

const guilds = [
  { name: "Coding Clan", members: 42, xp: 124500, rank: 1, color: "neon-cyan", icon: "💻", joined: true },
  { name: "Fitness Guild", members: 67, xp: 98700, rank: 2, color: "neon-red", icon: "⚔️" },
  { name: "Study Squad", members: 38, xp: 87200, rank: 3, color: "neon-blue", icon: "📚" },
  { name: "Creative Coven", members: 29, xp: 65400, rank: 4, color: "neon-orange", icon: "🎨" },
  { name: "Founders Forge", members: 24, xp: 54100, rank: 5, color: "neon-gold", icon: "🚀" },
];

const achievements = [
  { name: "Weekly Goal Crushers", desc: "Completed 500+ quests", icon: "🏆" },
  { name: "Streak Masters", desc: "100-day streak achieved", icon: "🔥" },
  { name: "Boss Slayers", desc: "Defeated 10 weekly bosses", icon: "⚡" },
];

const missions = [
  { title: "Complete 100 total study sessions", current: 78, total: 100, color: "neon-blue" },
  { title: "Earn 2,000 Knowledge XP together", current: 1450, total: 2000, color: "neon-cyan" },
  { title: "Finish 25 workouts collectively", current: 18, total: 25, color: "neon-red" },
];

const contributors = [
  { name: "Rahul", xp: 420, role: "Leader", roleIcon: Crown, roleColor: "neon-gold" },
  { name: "Tanishq", xp: 380, role: "Co-Leader", roleIcon: Shield, roleColor: "neon-purple" },
  { name: "Ananya", xp: 250, role: "Veteran", roleIcon: Star, roleColor: "neon-cyan" },
  { name: "Vihaan", xp: 195, role: "Member", roleIcon: Users, roleColor: "muted-foreground" },
  { name: "Priya", xp: 120, role: "New Recruit", roleIcon: Sparkles, roleColor: "neon-green" },
];

const guildRewards = [
  { level: 5, name: "XP Boost +5%", unlocked: true },
  { level: 10, name: "Guild Badge Unlock", unlocked: false },
  { level: 20, name: "Exclusive Hoodie Access", unlocked: false },
];

const chatMessages = [
  { user: "Rahul", text: "Finished 2 hours coding today 💻", time: "2m", online: true },
  { user: "Ananya", text: "Joining study sprint tonight!", time: "12m", online: true },
  { user: "Tanishq", text: "Let's defeat the weekly boss tomorrow ⚔️", time: "1h", online: false },
  { user: "Vihaan", text: "Just unlocked Fast Learner skill 🔥", time: "3h", online: true },
];

const memberLeaderboard = [
  { name: "Rahul", role: "Leader", level: 14, weekXp: 420, online: true, color: "neon-gold" },
  { name: "Tanishq", role: "Veteran", level: 12, weekXp: 380, online: false, color: "neon-cyan" },
  { name: "Ananya", role: "Member", level: 9, weekXp: 250, online: true, color: "neon-blue" },
  { name: "Vihaan", role: "Member", level: 8, weekXp: 195, online: true, color: "neon-blue" },
  { name: "Priya", role: "New Recruit", level: 4, weekXp: 120, online: false, color: "neon-green" },
];

const roleHierarchy = [
  { role: "Leader", icon: Crown, color: "neon-gold", count: 1, isLeader: true },
  { role: "Co-Leader", icon: Shield, color: "neon-purple", count: 2 },
  { role: "Veteran", icon: Star, color: "neon-cyan", count: 6 },
  { role: "Member", icon: Users, color: "neon-blue", count: 28 },
  { role: "New Recruit", icon: Sparkles, color: "neon-green", count: 5 },
];

const leaderPermissions = [
  { label: "Invite users", icon: UserPlus },
  { label: "Remove members", icon: UserMinus },
  { label: "Start guild missions", icon: Flag },
  { label: "Announce guild events", icon: Megaphone },
];

const levelMilestones = [
  { level: 5, name: "XP Boost Activated", icon: Zap, color: "neon-blue", unlocked: true },
  { level: 10, name: "Guild Badge Unlock", icon: Shield, color: "neon-cyan", unlocked: false },
  { level: 15, name: "Coin Bonus Event Access", icon: Coins, color: "neon-gold", unlocked: false },
  { level: 20, name: "Merch Reward Unlock", icon: Shirt, color: "neon-purple", unlocked: false },
];

const activityFeed = [
  { user: "Rahul", action: "completed Study Quest", reward: "+15 XP", time: "2m ago", color: "neon-blue", icon: Trophy },
  { user: "Ananya", action: "joined the guild", reward: "Welcome!", time: "1h ago", color: "neon-green", icon: UserPlus },
  { user: "Guild", action: "reached Level 5", reward: "+5% XP Boost", time: "3h ago", color: "neon-gold", icon: Zap },
  { user: "Tanishq", action: "completed Weekly Mission", reward: "+200 coins", time: "6h ago", color: "neon-cyan", icon: Flag },
  { user: "Vihaan", action: "defeated Boss: Procrastinator", reward: "+50 XP", time: "12h ago", color: "neon-red", icon: Sparkles },
];

const xpGrowth = [
  { day: "Mon", xp: 1200 }, { day: "Tue", xp: 1850 }, { day: "Wed", xp: 1400 },
  { day: "Thu", xp: 2100 }, { day: "Fri", xp: 2450 }, { day: "Sat", xp: 3100 }, { day: "Sun", xp: 2800 },
];

const statCategory = [
  { stat: "Knowledge", value: 4200 },
  { stat: "Focus", value: 3100 },
  { stat: "Discipline", value: 2400 },
  { stat: "Strength", value: 1800 },
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--glass))",
  border: "1px solid hsl(var(--glass-border))",
  borderRadius: "8px",
  fontSize: "12px",
};

const Guilds = () => {
  const [chat, setChat] = useState(chatMessages);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const inviteLink = "levelup.life/guild/coding-clan/join?ref=ABX42K";

  const sendMessage = () => {
    if (!draft.trim()) return;
    setChat([{ user: "You", text: draft, time: "now", online: true }, ...chat]);
    setDraft("");
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    pushSystemNotification({
      id: `invite-${Date.now()}`,
      type: "skill-unlock",
      title: "Invite Link Copied",
      subtitle: "Share with future guildmates",
      icon: Copy,
      color: "cyan",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-neon-purple" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Guilds</h1>
          <p className="text-sm text-muted-foreground">Team-based progression & shared achievements</p>
        </div>
      </div>

      {/* My guild card */}
      <div className="glass-panel-strong p-6 neon-border relative overflow-hidden">
        <div className="absolute inset-0 gradient-neon opacity-5" />
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-float">💻</div>
              <div>
                <p className="text-xs font-heading text-neon-cyan uppercase tracking-[0.3em]">Your Guild</p>
                <h2 className="font-heading text-2xl font-black text-foreground">Coding Clan</h2>
                <p className="text-xs text-muted-foreground">42 Members • Rank #1 • Guild Level 5</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Shared XP</p>
              <p className="font-heading text-3xl font-black text-gradient-neon">124,500</p>
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-heading uppercase tracking-wider mb-2">
            <span className="text-muted-foreground">Lv 5</span>
            <span className="text-neon-cyan">78% to Lv 6</span>
            <span className="text-muted-foreground">Lv 6</span>
          </div>
          <div className="h-3 bg-secondary/50 rounded-full overflow-hidden border border-glass-border/40">
            <div className="h-full gradient-neon transition-all" style={{ width: "78%", boxShadow: "0 0 15px hsl(var(--neon-blue) / 0.6)" }} />
          </div>
        </div>
      </div>

      {/* Weekly Missions */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Weekly Guild Missions</h3>
            <p className="text-[10px] text-muted-foreground">Shared team objectives — resets in 4d 12h</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase">Team Reward</p>
            <p className="text-xs font-heading font-bold text-neon-gold">+200 coins • Guild Badge</p>
          </div>
        </div>
        <div className="space-y-3">
          {missions.map((m) => {
            const pct = Math.round((m.current / m.total) * 100);
            return (
              <div key={m.title} className="p-3 rounded-lg bg-secondary/30 border border-glass-border/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-foreground">{m.title}</p>
                  <span className={`text-xs font-heading font-bold text-${m.color}`}>{m.current} / {m.total}</span>
                </div>
                <div className="h-2 bg-secondary/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${m.color} transition-all`}
                    style={{ width: `${pct}%`, boxShadow: `0 0 10px hsl(var(--${m.color}) / 0.6)` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Leaderboard */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Guild Member Leaderboard</h3>
            <p className="text-[10px] text-muted-foreground">Weekly contribution rankings</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-heading uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-neon-green" style={{ boxShadow: "0 0 6px hsl(var(--neon-green))" }} />
            <span className="text-neon-green">{memberLeaderboard.filter((m) => m.online).length} Online</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-glass-border/30">
                <th className="px-3 py-2 text-left text-[10px] font-heading font-bold text-muted-foreground uppercase">#</th>
                <th className="px-3 py-2 text-left text-[10px] font-heading font-bold text-muted-foreground uppercase">Hunter</th>
                <th className="px-3 py-2 text-left text-[10px] font-heading font-bold text-muted-foreground uppercase">Role</th>
                <th className="px-3 py-2 text-left text-[10px] font-heading font-bold text-muted-foreground uppercase">Level</th>
                <th className="px-3 py-2 text-right text-[10px] font-heading font-bold text-muted-foreground uppercase">Week XP</th>
              </tr>
            </thead>
            <tbody>
              {memberLeaderboard.map((mem, i) => (
                <tr key={mem.name} className="border-b border-glass-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-3 py-3 font-heading font-bold text-sm text-muted-foreground">#{i + 1}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-[10px] font-heading font-bold text-foreground">
                          {mem.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${mem.online ? "bg-neon-green" : "bg-muted-foreground/60"}`}
                          style={mem.online ? { boxShadow: "0 0 6px hsl(var(--neon-green) / 0.8)" } : undefined}
                        />
                      </div>
                      <p className="font-semibold text-sm text-foreground">{mem.name}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-heading font-bold uppercase tracking-wider bg-${mem.color}/10 text-${mem.color} border border-${mem.color}/30`}>
                      {mem.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-heading font-bold text-sm text-foreground">Lv {mem.level}</td>
                  <td className="px-3 py-3 text-right font-heading font-bold text-sm text-primary">+{mem.weekXp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guild Roles & Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5">
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Guild Role Hierarchy</h3>
          <div className="space-y-3">
            {roleHierarchy.map((r) => (
              <div
                key={r.role}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                  r.isLeader
                    ? `border-${r.color}/50 bg-${r.color}/5 neon-border`
                    : "border-glass-border/30 bg-secondary/20 hover:bg-secondary/40"
                }`}
                style={r.isLeader ? { boxShadow: `0 0 20px hsl(var(--${r.color}) / 0.25)` } : undefined}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${r.color}/10 border border-${r.color}/30`}>
                  <r.icon className={`w-5 h-5 text-${r.color}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-heading font-bold text-sm text-${r.color}`}>{r.role}</p>
                  <p className="text-[11px] text-muted-foreground">{r.count} {r.count === 1 ? "member" : "members"}</p>
                </div>
                {r.isLeader && (
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-neon-gold animate-pulse">★ Top Rank</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel p-5 neon-border" style={{ boxShadow: "0 0 25px hsl(var(--neon-gold) / 0.15)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-neon-gold" />
            <h3 className="font-heading text-sm font-bold text-neon-gold uppercase tracking-wider">Leader Permissions</h3>
          </div>
          <div className="space-y-2">
            {leaderPermissions.map((p) => (
              <div key={p.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30 border border-glass-border/30 hover:border-neon-gold/40 transition-all">
                <div className="w-8 h-8 rounded-md bg-neon-gold/10 border border-neon-gold/30 flex items-center justify-center">
                  <p.icon className="w-4 h-4 text-neon-gold" />
                </div>
                <p className="text-xs font-heading uppercase tracking-wider text-foreground">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contributors with roles */}
        <div className="glass-panel p-5">
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Top Contributors This Week</h3>
          <div className="space-y-2">
            {contributors.map((c, i) => {
              const isTop = i === 0;
              return (
                <div
                  key={c.name}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    isTop ? "border-neon-gold/40 bg-neon-gold/5 neon-border" : "border-glass-border/30 bg-secondary/20"
                  }`}
                  style={isTop ? { boxShadow: "0 0 20px hsl(var(--neon-gold) / 0.2)" } : undefined}
                >
                  <span className={`font-heading font-black text-sm w-6 text-center ${isTop ? "text-neon-gold" : "text-muted-foreground"}`}>
                    #{i + 1}
                  </span>
                  <div className={`w-9 h-9 rounded-full ${isTop ? "gradient-neon" : "bg-secondary"} flex items-center justify-center text-xs font-heading font-bold text-foreground`}>
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{c.name}</p>
                    <div className="flex items-center gap-1.5">
                      <c.roleIcon className={`w-3 h-3 text-${c.roleColor}`} />
                      <span className={`text-[10px] font-heading uppercase tracking-wider text-${c.roleColor}`}>{c.role}</span>
                    </div>
                  </div>
                  <span className={`font-heading font-bold text-sm ${isTop ? "text-neon-gold" : "text-primary"}`}>+{c.xp} XP</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guild Rewards */}
        <div className="glass-panel p-5">
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Guild Rewards</h3>
          <div className="space-y-3">
            {guildRewards.map((r) => (
              <div
                key={r.level}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  r.unlocked
                    ? "border-neon-blue/40 bg-neon-blue/5 neon-border"
                    : "border-glass-border/30 bg-secondary/20 opacity-60"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  r.unlocked ? "gradient-neon neon-glow" : "bg-secondary"
                }`}>
                  {r.unlocked ? (
                    <Check className="w-5 h-5 text-foreground" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Guild Level {r.level}</p>
                  <p className={`font-heading font-bold text-sm ${r.unlocked ? "text-neon-blue" : "text-foreground"}`}>{r.name}</p>
                </div>
                {r.unlocked && (
                  <span className="text-[10px] font-heading font-bold text-neon-green uppercase tracking-wider">Active</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat + Invite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guild Chat */}
        <div className="lg:col-span-2 glass-panel p-5 flex flex-col">
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Guild Chat</h3>
          <div className="flex-1 space-y-2 max-h-72 overflow-y-auto mb-3 pr-1">
            {chat.map((m, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors animate-fade-in">
                <div className="relative shrink-0">
                  <div className={`w-8 h-8 rounded-full ${m.user === "You" ? "gradient-neon-purple" : "bg-secondary"} flex items-center justify-center text-[10px] font-heading font-bold text-foreground`}>
                    {m.user.slice(0, 2).toUpperCase()}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${m.online ? "bg-neon-green" : "bg-muted-foreground/60"}`}
                    style={m.online ? { boxShadow: "0 0 8px hsl(var(--neon-green) / 0.8)" } : undefined}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-heading font-bold ${m.user === "You" ? "text-neon-purple" : "text-primary"}`}>{m.user}</p>
                    <span className={`text-[9px] font-heading uppercase tracking-wider ${m.online ? "text-neon-green" : "text-muted-foreground"}`}>
                      {m.online ? "Online" : "Offline"}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{m.time}</span>
                  </div>
                  <p className="text-sm text-foreground">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-3 border-t border-glass-border/30">
            <button
              type="button"
              onClick={() => setDraft((d) => d + " 🔥")}
              className="px-3 py-2 rounded-lg glass-panel hover:bg-primary/10 transition-colors"
              aria-label="Add emoji"
            >
              <Smile className="w-4 h-4 text-neon-cyan" />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Send a message to the guild..."
              className="flex-1 bg-secondary/50 border border-glass-border/40 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-blue/50 focus:neon-border"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 rounded-lg gradient-neon neon-glow hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>

        {/* Invite */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-neon-cyan" />
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Invite Members</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wider mb-2">Invite Link</p>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-glass-border/40 text-[11px] text-muted-foreground truncate">
                  {inviteLink}
                </div>
                <button
                  onClick={copyInvite}
                  className={`px-3 py-2 rounded-lg neon-border transition-all ${copied ? "bg-neon-green/20" : "glass-panel hover:bg-primary/10"}`}
                >
                  {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4 text-primary" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wider mb-2">Search Hunters</p>
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Search by username..."
                  className="w-full bg-secondary/50 border border-glass-border/40 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-blue/50"
                />
              </div>
            </div>
            <button className="w-full px-4 py-2.5 rounded-lg gradient-neon-purple text-xs font-heading font-bold text-foreground neon-glow hover:opacity-90 transition-opacity uppercase tracking-wider">
              Send Invitation
            </button>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-neon-blue" />
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Weekly Guild XP Growth</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={xpGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border) / 0.3)" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="xp" stroke="hsl(var(--neon-blue))" strokeWidth={2} dot={{ fill: "hsl(var(--neon-blue))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Most Active Stat Categories</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border) / 0.3)" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis dataKey="stat" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={80} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="hsl(var(--neon-cyan))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Guild Leaderboard */}
      <div>
        <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Global Guild Leaderboard</h3>
        <div className="glass-panel overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-glass-border/30">
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-muted-foreground uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-muted-foreground uppercase">Guild</th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-muted-foreground uppercase">Members</th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-muted-foreground uppercase">XP</th>
              </tr>
            </thead>
            <tbody>
              {guilds.map((g) => (
                <tr key={g.name} className={`border-b border-glass-border/10 ${g.joined ? "bg-primary/10 neon-border" : "hover:bg-secondary/30"} transition-colors`}>
                  <td className="px-6 py-4 font-heading font-bold text-foreground">#{g.rank}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{g.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{g.name}</p>
                        {g.joined && <p className="text-[10px] text-primary">Member</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{g.members}</td>
                  <td className={`px-6 py-4 font-heading font-bold text-${g.color}`}>{g.xp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Achievements */}
      <div>
        <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Team Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <div key={a.name} className="glass-panel p-4 hover:neon-border transition-all">
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="font-heading font-bold text-foreground text-sm">{a.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Level Progression Timeline + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Level Progression Timeline */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-5">
            <Gift className="w-4 h-4 text-neon-cyan" />
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Guild Level Progression</h3>
          </div>
          <div className="relative pl-6">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-neon-blue via-neon-cyan to-glass-border/30" />
            <div className="space-y-5">
              {levelMilestones.map((ml) => (
                <div key={ml.level} className="relative">
                  <div
                    className={`absolute -left-[22px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      ml.unlocked
                        ? `bg-${ml.color}/20 border-${ml.color}`
                        : "bg-secondary border-glass-border/40"
                    }`}
                    style={ml.unlocked ? { boxShadow: `0 0 12px hsl(var(--${ml.color}) / 0.6)` } : undefined}
                  >
                    {ml.unlocked ? (
                      <Check className={`w-3 h-3 text-${ml.color}`} />
                    ) : (
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg border transition-all ${
                      ml.unlocked
                        ? `bg-${ml.color}/5 border-${ml.color}/30`
                        : "bg-secondary/20 border-glass-border/30 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ml.icon className={`w-4 h-4 ${ml.unlocked ? `text-${ml.color}` : "text-muted-foreground"}`} />
                        <p className={`font-heading font-bold text-sm ${ml.unlocked ? `text-${ml.color}` : "text-foreground"}`}>
                          Level {ml.level}
                        </p>
                      </div>
                      <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
                        {ml.unlocked ? "Unlocked" : "Locked"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{ml.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-neon-blue" />
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Guild Activity Feed</h3>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {activityFeed.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-glass-border/30 hover:border-neon-blue/30 transition-all animate-fade-in"
              >
                <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center bg-${a.color}/10 border border-${a.color}/30`}>
                  <a.icon className={`w-4 h-4 text-${a.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className={`font-heading font-bold text-${a.color}`}>{a.user}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-heading font-bold uppercase tracking-wider text-${a.color}`}>{a.reward}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guilds;

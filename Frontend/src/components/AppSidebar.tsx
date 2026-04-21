import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Swords, GitBranch, Skull, Gift, Trophy, Users, BarChart3,
  User, Settings, Zap, MessageSquare, UserPlus, Award, CalendarClock,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/quests", icon: Swords, label: "Daily Quests" },
  { to: "/skill-tree", icon: GitBranch, label: "Skill Tree" },
  { to: "/boss-battles", icon: Skull, label: "Boss Battles" },
  { to: "/rewards", icon: Gift, label: "Rewards Store" },
  { to: "/achievements", icon: Award, label: "Achievements" },
  { to: "/events", icon: CalendarClock, label: "Events" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/guilds", icon: Users, label: "Guilds" },
  { to: "/friends", icon: UserPlus, label: "Friends" },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 glass-panel-strong border-r border-glass-border/30 z-50 flex-col">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-3 px-6 py-5 border-b border-glass-border/20">
        <div className="w-10 h-10 rounded-lg gradient-neon flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-heading text-sm font-bold tracking-wider text-foreground">LEVELUP</h1>
          <p className="text-[10px] font-heading tracking-[0.3em] text-muted-foreground">LIFE SYSTEM</p>
        </div>
      </NavLink>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary neon-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:shadow-[0_0_15px_hsl(var(--neon-blue)/0.15)]"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-all ${isActive ? "text-primary" : "group-hover:text-primary/70"}`} />
              <span className="font-body tracking-wide">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-neon" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Player Card */}
      <div className="px-4 pb-4">
        <div className="glass-panel p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gradient-neon-purple flex items-center justify-center text-xs font-heading font-bold text-foreground">
            SH
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-foreground">Shadow Hunter</p>
            <p className="text-[10px] text-muted-foreground">Lv. 24 • Silver</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;

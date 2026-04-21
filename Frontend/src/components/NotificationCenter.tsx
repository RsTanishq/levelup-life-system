import { useState } from "react";
import { Bell, Trophy, Gift, Sword, Award, Calendar } from "lucide-react";

const notifications = [
  { id: 1, icon: Trophy, color: "neon-blue", title: "Level Up!", text: "Reached Level 24 — Silver Hunter", time: "2m ago" },
  { id: 2, icon: Gift, color: "neon-gold", title: "Reward Unlocked", text: "Bronze Hunter Badge earned", time: "1h ago" },
  { id: 3, icon: Sword, color: "neon-cyan", title: "Quest Complete", text: "Study session +50 XP", time: "3h ago" },
  { id: 4, icon: Award, color: "neon-purple", title: "Achievement", text: "10-Day Streak unlocked", time: "1d ago" },
  { id: 5, icon: Calendar, color: "neon-green", title: "Daily Reminder", text: "3 quests waiting today", time: "1d ago" },
];

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-lg glass-panel flex items-center justify-center hover:neon-border transition-all"
      >
        <Bell className="w-4 h-4 text-foreground" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-red text-[10px] font-bold text-foreground flex items-center justify-center animate-pulse-neon">
          {notifications.length}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-80 glass-panel-strong neon-border z-50 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-glass-border/40">
              <p className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Notifications</p>
              <p className="text-[10px] text-muted-foreground">{notifications.length} unread alerts</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 border-b border-glass-border/20 hover:bg-secondary/40 transition-colors flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg bg-${n.color}/10 flex items-center justify-center shrink-0`}>
                    <n.icon className={`w-4 h-4 text-${n.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-heading text-xs font-bold uppercase tracking-wider text-${n.color}`}>{n.title}</p>
                    <p className="text-xs text-foreground truncate">{n.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;

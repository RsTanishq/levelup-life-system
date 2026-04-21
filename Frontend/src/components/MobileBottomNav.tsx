import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, UserPlus, Award, CalendarClock, User } from "lucide-react";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dash" },
  { to: "/friends", icon: UserPlus, label: "Friends" },
  { to: "/achievements", icon: Award, label: "Goals" },
  { to: "/events", icon: CalendarClock, label: "Events" },
  { to: "/profile", icon: User, label: "Profile" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel-strong border-t border-glass-border/40 px-2 py-2">
      <div className="flex justify-around">
        {items.map((item) => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg transition-all ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? "drop-shadow-[0_0_6px_hsl(var(--neon-blue))]" : ""}`} />
              <span className="text-[9px] font-heading uppercase tracking-wider">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

import { Link } from "react-router-dom";
import { User, Award, BarChart3, Edit, Crown, ChevronRight } from "lucide-react";
import { Sword, Brain, Sparkles, Shield, Heart, Flame, MessageCircle } from "lucide-react";

const stats = [
  { name: "STR", value: 42, icon: Sword, color: "text-neon-red" },
  { name: "FOC", value: 38, icon: Brain, color: "text-neon-blue" },
  { name: "KNW", value: 55, icon: Sparkles, color: "text-neon-cyan" },
  { name: "DIS", value: 31, icon: Shield, color: "text-neon-purple" },
  { name: "HP", value: 60, icon: Heart, color: "text-neon-green" },
  { name: "CRE", value: 47, icon: Flame, color: "text-neon-orange" },
  { name: "COM", value: 35, icon: MessageCircle, color: "text-neon-gold" },
];

const achievements = ["🏆 First Quest", "⚔️ 10-Day Streak", "🧠 Knowledge Seeker", "💪 Iron Will", "🔥 Early Bird"];

const Profile = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
          <User className="w-5 h-5 text-neon-purple" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Hunter Profile</h1>
          <p className="text-sm text-muted-foreground">Your character overview</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl gradient-neon-purple flex items-center justify-center neon-glow text-2xl font-heading font-black text-foreground">
            SH
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-xl font-bold text-foreground">Shadow Hunter</h2>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <p className="text-primary text-sm font-heading">Silver Hunter • Level 24</p>
            <p className="text-muted-foreground text-xs mt-1">3,450 / 5,000 XP to next level</p>
          </div>
        </div>
      </div>

      {/* Customization shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/avatar" className="glass-panel p-4 flex items-center gap-4 hover:neon-border transition-all group">
          <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center shrink-0 group-hover:bg-neon-purple/20 transition-colors">
            <Sparkles className="w-5 h-5 text-neon-purple" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-sm text-foreground">Customize Avatar</p>
            <p className="text-xs text-muted-foreground">Frames, badges & profile picture</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-neon-purple transition-colors" />
        </Link>
        <Link to="/titles" className="glass-panel p-4 flex items-center gap-4 hover:neon-border transition-all group">
          <div className="w-12 h-12 rounded-xl bg-neon-gold/10 border border-neon-gold/30 flex items-center justify-center shrink-0 group-hover:bg-neon-gold/20 transition-colors">
            <Crown className="w-5 h-5 text-neon-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-sm text-foreground">Manage Titles</p>
            <p className="text-xs text-muted-foreground">Equip identity titles you've unlocked</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-neon-gold transition-colors" />
        </Link>
      </div>

      {/* Achievements */}
      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-neon-gold" />
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Achievements</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {achievements.map((a, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-medium text-foreground">{a}</span>
          ))}
        </div>
      </div>

      {/* Stat Summary */}
      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-neon-blue" />
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Stat Summary</h3>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {stats.map((s) => (
            <div key={s.name} className="text-center">
              <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
              <p className="text-[10px] text-muted-foreground">{s.name}</p>
              <p className={`font-heading font-bold text-sm ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Progress placeholder */}
      <div className="glass-panel p-5">
        <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Weekly Progress</h3>
        <div className="flex items-end gap-2 h-32">
          {[40, 65, 55, 80, 45, 70, 90].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full gradient-neon rounded-t-sm transition-all" style={{ height: `${h}%` }} />
              <span className="text-[10px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;

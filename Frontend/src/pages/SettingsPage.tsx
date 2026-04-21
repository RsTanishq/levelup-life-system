import { Settings as SettingsIcon, Bell, Palette, Shield, Volume2 } from "lucide-react";

const SettingToggle = ({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) => (
  <div className="flex items-center justify-between py-3 border-b border-glass-border/20 last:border-0">
    <div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <div className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${defaultOn ? "bg-primary" : "bg-secondary"} relative`}>
      <div className={`w-4 h-4 rounded-full bg-foreground absolute top-1 transition-all ${defaultOn ? "left-5" : "left-1"}`} />
    </div>
  </div>
);

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your experience</p>
        </div>
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Notifications</h3>
        </div>
        <SettingToggle label="Quest Reminders" description="Get notified about daily quests" defaultOn />
        <SettingToggle label="Level Up Alerts" description="Show popup on level up" defaultOn />
        <SettingToggle label="Leaderboard Updates" description="Weekly ranking notifications" />
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-neon-purple" />
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Appearance</h3>
        </div>
        <SettingToggle label="Glow Effects" description="Enable neon glow animations" defaultOn />
        <SettingToggle label="Animations" description="Enable UI animations" defaultOn />
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-4 h-4 text-neon-cyan" />
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Sound</h3>
        </div>
        <SettingToggle label="Sound Effects" description="Play sounds on quest completion" />
        <SettingToggle label="Level Up Sound" description="Play sound on level up" defaultOn />
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-neon-green" />
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Privacy</h3>
        </div>
        <SettingToggle label="Public Profile" description="Allow others to see your profile" defaultOn />
        <SettingToggle label="Show on Leaderboard" description="Display your rank publicly" defaultOn />
      </div>
    </div>
  );
};

export default SettingsPage;

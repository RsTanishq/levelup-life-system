import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import SkillTree from "./pages/SkillTree";
import BossBattles from "./pages/BossBattles";
import Rewards from "./pages/Rewards";
import Leaderboard from "./pages/Leaderboard";
import Guilds from "./pages/Guilds";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Friends from "./pages/Friends";
import Achievements from "./pages/Achievements";
import Events from "./pages/Events";
import Titles from "./pages/Titles";
import Avatar from "./pages/Avatar";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import SystemNotifications from "@/components/SystemNotifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SystemNotifications />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/skill-tree" element={<SkillTree />} />
            <Route path="/boss-battles" element={<BossBattles />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/guilds" element={<Guilds />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/events" element={<Events />} />
            <Route path="/titles" element={<Titles />} />
            <Route path="/avatar" element={<Avatar />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

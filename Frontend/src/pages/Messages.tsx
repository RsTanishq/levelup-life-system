import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search, Send, Smile, Paperclip, Trophy, Zap, Sword, Users, Skull, MessageSquare, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { pushSystemNotification } from "@/components/SystemNotifications";

type Status = "online" | "offline" | "away";

interface Conversation {
  id: string;
  name: string;
  initials: string;
  status: Status;
  lastSeen?: string;
  preview: string;
  unread: number;
  rank: string;
  level: number;
}

interface BaseMessage {
  id: string;
  ts: string;
}
interface ChatMessage extends BaseMessage {
  kind: "chat";
  from: "me" | "them";
  text: string;
}
interface SystemMessage extends BaseMessage {
  kind: "system";
  text: string;
  icon: typeof Trophy;
  color: "blue" | "purple" | "green" | "gold" | "red" | "cyan";
}
type Message = ChatMessage | SystemMessage;

const conversations: Conversation[] = [
  { id: "rahul", name: "Rahul", initials: "RH", status: "online", preview: "Finished today's quests?", unread: 2, rank: "Gold Hunter", level: 18 },
  { id: "ananya", name: "Ananya", initials: "AN", status: "offline", lastSeen: "5m ago", preview: "Joining guild mission tonight?", unread: 0, rank: "Silver Hunter", level: 12 },
  { id: "tanishq", name: "Tanishq", initials: "TQ", status: "online", preview: "Yes, gained +20 Knowledge today", unread: 0, rank: "Shadow Hunter", level: 27 },
  { id: "meera", name: "Meera", initials: "ME", status: "away", lastSeen: "1h ago", preview: "Boss fight at 9pm?", unread: 1, rank: "Bronze Hunter", level: 6 },
  { id: "kabir", name: "Kabir", initials: "KB", status: "offline", lastSeen: "yesterday", preview: "GG on the streak 🔥", unread: 0, rank: "Silver Hunter", level: 14 },
  { id: "ishaan", name: "Ishaan", initials: "IS", status: "online", preview: "Sent you a guild invite", unread: 0, rank: "Gold Hunter", level: 21 },
];

const seedMessages: Record<string, Message[]> = {
  rahul: [
    { id: "m1", kind: "chat", from: "them", ts: "10:12", text: "Finished today's quests?" },
    { id: "m2", kind: "chat", from: "me", ts: "10:14", text: "Yes, gained +20 Knowledge today" },
    { id: "m3", kind: "system", ts: "10:15", text: "Tanishq reached Level 8", icon: Trophy, color: "gold" },
    { id: "m4", kind: "chat", from: "them", ts: "10:16", text: "Nice progress 🔥" },
    { id: "m5", kind: "system", ts: "10:20", text: "Rahul unlocked Deep Focus Skill", icon: Sparkles, color: "purple" },
  ],
  ananya: [
    { id: "m1", kind: "chat", from: "them", ts: "Yesterday", text: "Joining guild mission tonight?" },
    { id: "m2", kind: "chat", from: "me", ts: "Yesterday", text: "Count me in" },
    { id: "m3", kind: "system", ts: "Yesterday", text: "Guild Mission Completed", icon: Users, color: "green" },
  ],
  tanishq: [
    { id: "m1", kind: "chat", from: "me", ts: "09:02", text: "Boss strat for tonight?" },
    { id: "m2", kind: "chat", from: "them", ts: "09:04", text: "Yes, gained +20 Knowledge today" },
  ],
  meera: [{ id: "m1", kind: "chat", from: "them", ts: "08:45", text: "Boss fight at 9pm?" }],
  kabir: [{ id: "m1", kind: "chat", from: "them", ts: "Mon", text: "GG on the streak 🔥" }],
  ishaan: [{ id: "m1", kind: "chat", from: "them", ts: "07:30", text: "Sent you a guild invite" }],
};

const statusDot: Record<Status, string> = {
  online: "bg-neon-green shadow-[0_0_8px_hsl(var(--neon-green))]",
  away: "bg-neon-orange shadow-[0_0_8px_hsl(var(--neon-orange))]",
  offline: "bg-muted-foreground/40",
};

const sysColor: Record<SystemMessage["color"], string> = {
  blue: "border-neon-blue/40 text-neon-blue bg-neon-blue/5",
  purple: "border-neon-purple/40 text-neon-purple bg-neon-purple/5",
  green: "border-neon-green/40 text-neon-green bg-neon-green/5",
  gold: "border-neon-gold/40 text-neon-gold bg-neon-gold/5",
  red: "border-neon-red/40 text-neon-red bg-neon-red/5",
  cyan: "border-neon-cyan/40 text-neon-cyan bg-neon-cyan/5",
};

const Messages = () => {
  const [activeId, setActiveId] = useState<string>("rahul");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState<Record<string, Message[]>>(seedMessages);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => conversations.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const active = conversations.find((c) => c.id === activeId)!;
  const messages = threads[activeId] ?? [];

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [messages.length, activeId]);

  const sendMessage = (text: string, system?: Omit<SystemMessage, "id" | "ts" | "kind">) => {
    if (!text.trim() && !system) return;
    setThreads((prev) => {
      const list = [...(prev[activeId] ?? [])];
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (text.trim()) list.push({ id: crypto.randomUUID(), kind: "chat", from: "me", text: text.trim(), ts });
      if (system) list.push({ id: crypto.randomUUID(), kind: "system", ts, ...system });
      return { ...prev, [activeId]: list };
    });
    setDraft("");
  };

  const quickShare = (label: string, color: SystemMessage["color"], icon: SystemMessage["icon"], notify: string) => {
    sendMessage("", { text: label, color, icon });
    pushSystemNotification({
      id: crypto.randomUUID(),
      type: "quest-complete",
      title: notify,
      subtitle: `Sent to ${active.name}`,
      icon,
      color,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-wider text-foreground">MESSAGES</h1>
          <p className="text-xs md:text-sm text-muted-foreground font-heading tracking-widest uppercase">
            Hunter Communication Network
          </p>
        </div>
        <Badge variant="outline" className="hidden md:inline-flex border-neon-green/40 text-neon-green bg-neon-green/5">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green mr-1.5 animate-pulse-neon" />
          Network Online
        </Badge>
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-12rem)] min-h-[500px]">
        {/* LEFT: conversation list */}
        <div className={`glass-panel-strong overflow-hidden flex-col ${mobileShowChat ? "hidden md:flex" : "flex"}`}>
          <div className="p-3 border-b border-glass-border/30 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hunters or guilds..."
                className="pl-9 bg-background/50 border-glass-border/40 focus-visible:ring-primary/40"
              />
            </div>
            <Button variant="outline" size="sm" className="w-full border-primary/40 text-primary hover:bg-primary/10">
              <MessageSquare className="w-3.5 h-3.5" />
              New Conversation
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filtered.map((c) => {
                const isActive = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveId(c.id);
                      setMobileShowChat(true);
                    }}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all duration-200 group ${
                      isActive
                        ? "bg-primary/10 neon-border shadow-[0_0_15px_hsl(var(--neon-blue)/0.2)]"
                        : "hover:bg-secondary/50 hover:shadow-[0_0_12px_hsl(var(--neon-blue)/0.12)]"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-10 h-10 border border-glass-border/40">
                        <AvatarFallback className="bg-secondary text-foreground text-xs font-heading">
                          {c.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${statusDot[c.status]}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                          {c.name}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {c.status === "online" ? "now" : c.lastSeen ?? "offline"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
                    </div>
                    {c.unread > 0 && (
                      <Badge className="bg-neon-blue text-primary-foreground text-[10px] h-5 min-w-5 px-1.5 rounded-full">
                        {c.unread}
                      </Badge>
                    )}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-8">No hunters found</p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT: chat window */}
        <div className={`glass-panel-strong overflow-hidden flex-col ${mobileShowChat ? "flex" : "hidden md:flex"}`}>
          {/* Chat header */}
          <div className="p-3 border-b border-glass-border/30 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 shrink-0"
              onClick={() => setMobileShowChat(false)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="relative">
              <Avatar className="w-10 h-10 border border-primary/40 shadow-[0_0_12px_hsl(var(--neon-blue)/0.3)]">
                <AvatarFallback className="bg-secondary text-foreground text-xs font-heading">
                  {active.initials}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${statusDot[active.status]}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading font-bold tracking-wider text-foreground">{active.name}</p>
              <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-widest">
                Lv. {active.level} • {active.rank} •{" "}
                <span className={active.status === "online" ? "text-neon-green" : ""}>
                  {active.status === "online"
                    ? "Online"
                    : active.status === "away"
                    ? `Away · ${active.lastSeen}`
                    : `Last active ${active.lastSeen}`}
                </span>
              </p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1" ref={scrollRef as never}>
            <div className="p-4 space-y-4">
              {messages.map((m) => {
                if (m.kind === "system") {
                  const SIcon = m.icon;
                  return (
                    <div key={m.id} className="flex justify-center animate-fade-in">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md ${sysColor[m.color]}`}
                      >
                        <SIcon className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-heading uppercase tracking-widest">{m.text}</span>
                      </div>
                    </div>
                  );
                }
                const mine = m.from === "me";
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 animate-fade-in ${mine ? "justify-end" : "justify-start"}`}
                  >
                    {!mine && (
                      <Avatar className="w-7 h-7 border border-glass-border/40">
                        <AvatarFallback className="bg-secondary text-[10px] font-heading">
                          {active.initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[75%] flex flex-col ${mine ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl backdrop-blur-md border text-sm leading-relaxed ${
                          mine
                            ? "bg-primary/15 border-primary/40 text-foreground rounded-br-sm shadow-[0_0_15px_hsl(var(--neon-blue)/0.2)]"
                            : "bg-secondary/60 border-glass-border/40 text-foreground rounded-bl-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">{m.ts}</span>
                    </div>
                    {mine && (
                      <Avatar className="w-7 h-7 border border-primary/40">
                        <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-heading">
                          SH
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Quick share */}
          <div className="px-3 pt-2 border-t border-glass-border/30 flex flex-wrap gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] border-neon-blue/40 text-neon-blue hover:bg-neon-blue/10"
              onClick={() => quickShare("Shared: Reached Level 24", "blue", Zap, "Level Up Shared")}
            >
              <Zap className="w-3 h-3" />
              Share Level Up
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10"
              onClick={() => quickShare("Shared: +5 Strength gained", "cyan", Sword, "Stat Increase Shared")}
            >
              <Sword className="w-3 h-3" />
              Share Stat
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10"
              onClick={() => quickShare("Guild invite sent", "purple", Users, "Guild Invite Sent")}
            >
              <Users className="w-3 h-3" />
              Invite to Guild
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] border-neon-red/40 text-neon-red hover:bg-neon-red/10"
              onClick={() => quickShare("Boss Battle invite sent", "red", Skull, "Boss Battle Invite Sent")}
            >
              <Skull className="w-3 h-3" />
              Invite to Boss
            </Button>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(draft);
            }}
            className="p-3 border-t border-glass-border/30 flex items-center gap-2"
          >
            <Button type="button" size="icon" variant="ghost" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-primary">
              <Smile className="w-4 h-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-primary">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${active.name}...`}
              className="bg-background/50 border-glass-border/40 focus-visible:ring-primary/40"
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 shrink-0 bg-primary hover:bg-primary/90 shadow-[0_0_15px_hsl(var(--neon-blue)/0.4)]"
              disabled={!draft.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;

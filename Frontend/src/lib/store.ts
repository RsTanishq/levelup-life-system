import { create } from "zustand";
import { PathConfig, PATHS } from "./paths";

interface PlayerState {
  onboarded: boolean;
  hunterName: string;
  selectedPath: PathConfig | null;
  setOnboarded: (v: boolean) => void;
  setHunterName: (name: string) => void;
  setSelectedPath: (path: PathConfig) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  onboarded: false,
  hunterName: "",
  selectedPath: null,
  setOnboarded: (v) => set({ onboarded: v }),
  setHunterName: (name) => set({ hunterName: name }),
  setSelectedPath: (path) => set({ selectedPath: path }),
  reset: () => set({ onboarded: false, hunterName: "", selectedPath: null }),
}));

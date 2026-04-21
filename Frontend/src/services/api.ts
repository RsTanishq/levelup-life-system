const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "levelup_token";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new Error(body.message || "Request failed");
  }

  return body.data;
};

export const authStorage = {
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  hasToken: () => Boolean(localStorage.getItem(TOKEN_KEY)),
};

export const api = {
  register: (payload: { username: string; email: string; password: string }) =>
    request<{ token: string; user: unknown }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: unknown }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => request<unknown>("/auth/me"),

  getUserStats: () => request<any>("/users/stats"),
  getLevelProgress: () => request<any>("/xp/progress"),
  getStreak: () => request<any>("/streak"),
  getDailyQuests: () => request<any[]>("/quests/daily"),
  getRewards: () => request<any[]>("/rewards"),
  getAchievements: () => request<any[]>("/achievements"),
};

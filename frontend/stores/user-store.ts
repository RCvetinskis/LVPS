import { TUser } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { DEFAULT_LOCALE } from "@/lib/constants";
type TUsersStore = {
  users: TUser[];
  setUsers: (users: TUser[]) => void;
  getUserName: (id?: number) => string;
};

export const useUsersStore = create<TUsersStore>((set, get) => ({
  users: [],
  setUsers: (users) => set({ users }),
  getUserName: (id) => {
    const user = get().users.find((emp) => emp.id === id);
    return user?.name || "Not assigned";
  },
}));

type TCurrentUserStore = {
  currentUser: TUser | null;
  token: string | null;
  locale: string;
  setCurrentUser: (user: TUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  setLocale: (locale: string) => void;
};
export const useCurrentUserStore = create<TCurrentUserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      locale: DEFAULT_LOCALE,

      setCurrentUser: (user) => {
        set({ currentUser: user });
      },

      setToken: (token) => {
        set({ token });

        if (token) {
          Cookies.set("token", token, { expires: 1, sameSite: "lax" });
        } else {
          Cookies.remove("token");
        }
      },
      setLocale: (locale) => {
        set({ locale });
        Cookies.set("NEXT_LOCALE", locale, { expires: 30, sameSite: "lax" });
        Cookies.set("locale", locale, { expires: 30, sameSite: "lax" });
      },
      logout: () => {
        set({ currentUser: null, token: null });

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        Cookies.remove("token");
        Cookies.remove("NEXT_LOCALE");
        Cookies.remove("locale");
        localStorage.removeItem("current-user-storage");
      },

      isAuthenticated: () => {
        const { token } = get();
        const cookieToken = Cookies.get("token");
        return !!(token || cookieToken);
      },

      syncWithCookies: () => {
        const cookieToken = Cookies.get("token");
        if (cookieToken && !get().token) {
          set({ token: cookieToken });
        }
      },
    }),
    {
      name: "current-user-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        token: state.token,
        locale: state.locale,
      }),
    },
  ),
);

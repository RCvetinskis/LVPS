import { TUser } from "@/types";
import { create } from "zustand";

type EmployeeStore = {
  users: TUser[];
  setUsers: (users: TUser[]) => void;
  getUserName: (id?: number) => string;
};

export const useUserStore = create<EmployeeStore>((set, get) => ({
  users: [],
  setUsers: (users) => set({ users }),
  getUserName: (id) => {
    const user = get().users.find((emp) => emp.id === id);
    return user?.name || "Not assigned";
  },
}));

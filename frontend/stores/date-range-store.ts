import { endOfMonth, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type DateRangeStore = {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
};

const today = new Date();
const defaultFrom = startOfMonth(today);
const defaultTo = endOfMonth(today);

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useDateRangeStore = create<DateRangeStore>()(
  persist(
    (set) => ({
      dateRange: { from: defaultFrom, to: defaultTo },
      setDateRange: (dateRange) => set({ dateRange }),
    }),
    {
      name: "date-range-storage",
      storage: createJSONStorage(() => {
        return typeof window !== "undefined" ? localStorage : noopStorage;
      }),
    },
  ),
);

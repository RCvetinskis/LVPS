import { endOfMonth, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

type CompanyStore = {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  loadFromStorage: () => void;
};

const STORAGE_KEY = "date-range-storage";
const today = new Date();
const defaultFrom = startOfMonth(today);
const defaultTo = endOfMonth(today);

const loadStoredDateRange = (): DateRange | undefined => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      if (parsed?.from) parsed.from = new Date(parsed.from);
      if (parsed?.to) parsed.to = new Date(parsed.to);
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load date range from storage:", error);
  }
  return undefined;
};

const saveToStorage = (dateRange: DateRange | undefined) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dateRange));
  } catch (error) {
    console.error("Failed to save date range to storage:", error);
  }
};

export const useDateRangeStore = create<CompanyStore>((set, get) => ({
  dateRange: loadStoredDateRange() || { from: defaultFrom, to: defaultTo },

  setDateRange: (dateRange) => {
    saveToStorage(dateRange);
    set({ dateRange });
  },

  loadFromStorage: () => {
    const stored = loadStoredDateRange();
    if (stored) {
      set({ dateRange: stored });
    }
  },
}));

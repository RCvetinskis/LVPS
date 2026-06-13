import { endOfMonth, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

type CompanyStore = {
  dateRange: DateRange | undefined;

  setDateRange: (dateRange: DateRange | undefined) => void;
};
const today = new Date();
const defaultFrom = startOfMonth(today);
const defaultTo = endOfMonth(today);
export const useDateRangeStore = create<CompanyStore>((set, get) => ({
  dateRange: { from: defaultFrom, to: defaultTo },

  setDateRange: (dateRange) => set({ dateRange }),
}));

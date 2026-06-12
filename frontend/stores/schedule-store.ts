import {
  DEFAULT_SCHEDULE_END_TIME,
  DEFAULT_SCHEDULE_START_TIME,
} from "@/lib/constants";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

type CompanyStore = {
  dateRange: DateRange | undefined;
  isLoading: boolean;
  scheduleDate: Date | null;
  selectedUserId: number | null;
  startTime: string | null;
  endTime: string | null;
  setDateRange: (dateRange: DateRange | undefined) => void;
  setLoading: (loading: boolean) => void;
  setScheduleData: (scheduleDate: Date | null) => void;
  setSelectedUserId: (selelctedUserId: number | null) => void;
  setStartTime: (startTime: string | null) => void;
  setEndTime: (startTime: string | null) => void;
};

export const useScheduleStore = create<CompanyStore>((set, get) => ({
  isLoading: false,
  dateRange: {
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  },
  scheduleDate: null,
  selectedUserId: null,
  startTime: DEFAULT_SCHEDULE_START_TIME,
  endTime: DEFAULT_SCHEDULE_END_TIME,
  setDateRange: (dateRange) => set({ dateRange }),
  setLoading: (isLoading) => set({ isLoading }),
  setScheduleData: (scheduleDate) => set({ scheduleDate }),
  setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),
}));

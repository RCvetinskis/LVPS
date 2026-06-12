"use client";
import { DataTable } from "@/components/table/data-table";
import {
  scheduleColumns,
  TTableSchedule,
} from "@/components/table/schedule-columns";
import { useScheduleStore } from "@/stores/schedule-store";
import { useUserStore } from "@/stores/user-store";
import { TSchedule, TUser } from "@/types";
import { format, eachDayOfInterval } from "date-fns";
import { useEffect } from "react";

type Props = {
  users: TUser[];
  schedules?: TSchedule[];
};
// TODO: useQuery
const TableContainer = ({ users, schedules = [] }: Props) => {
  const { dateRange } = useScheduleStore();
  const { setUsers } = useUserStore();

  useEffect(() => {
    setUsers(users);
  }, []);

  const scheduleMap = new Map();
  schedules.forEach((schedule) => {
    scheduleMap.set(schedule.work_date, schedule);
  });

  const getDatesArray = (): TTableSchedule[] => {
    if (!dateRange?.from) return [];

    const dates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to || dateRange.from,
    });

    return dates.map((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const schedule = scheduleMap.get(dateKey);

      return {
        id: schedule?.id,
        day: format(date, "EEEE, MMMM dd, yyyy"),
        originalDate: date,
        userId: schedule?.user_data?.id || "Not assigned",
        startTime: schedule?.start_time
          ? format(new Date(schedule.start_time), "HH:mm")
          : undefined,
        endTime: schedule?.end_time
          ? format(new Date(schedule.end_time), "HH:mm")
          : undefined,
        status: schedule?.status || "unscheduled",
      };
    });
  };

  const tableData = getDatesArray();

  return (
    <div>
      <DataTable columns={scheduleColumns} data={tableData} />
    </div>
  );
};

export default TableContainer;

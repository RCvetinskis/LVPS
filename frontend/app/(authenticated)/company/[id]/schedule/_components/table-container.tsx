"use client";
import { DataTable } from "@/components/table/data-table";
import {
  baseColumns,
  getDayColumns,
} from "@/components/table/schedule-columns";
import { useSchedulePageData } from "@/hooks/use-schedule-data";
import { format, eachDayOfInterval } from "date-fns";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDateRangeStore } from "@/stores/date-range-store";

type Props = {
  companyId: string;
};

const TableContainer = ({ companyId }: Props) => {
  const { dateRange } = useDateRangeStore();
  const { schedules, users, isLoading, isError, error, refetch } =
    useSchedulePageData(companyId);

  const tableData = useMemo(() => {
    if (!users.length) return [];

    return users.map((user) => {
      const row: any = {
        user: {
          id: user.id,
          fullName: `${user.name} ${user.surname}`,
        },
      };

      schedules
        .filter((s) => s.user_data.id === user.id)
        .forEach((schedule) => {
          row[schedule.work_date] = {
            start: schedule.start_time,
            end: schedule.end_time,
            hoursWorked: schedule.hours_worked,
            scheduleId: schedule.id,
            notes: schedule.notes,
          };
        });

      return row;
    });
  }, [users, schedules]);

  const datesArray = useMemo(() => {
    if (!dateRange?.from) return [];

    const dates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to || dateRange.from,
    });

    return dates.map((date) => ({
      day: format(date, "EEEE, MMMM dd, yyyy"),
      originalDay: date,
    }));
  }, [dateRange]);

  const columns = useMemo(
    () => [
      ...baseColumns(datesArray),
      ...getDayColumns(datesArray, companyId, refetch),
    ],
    [datesArray, companyId, refetch],
  );
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading schedule data: {error?.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={tableData} />
    </div>
  );
};

export default TableContainer;

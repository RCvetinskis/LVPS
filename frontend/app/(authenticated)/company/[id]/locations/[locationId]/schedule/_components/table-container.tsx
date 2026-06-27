"use client";
import { DataTable } from "@/components/table/data-table";
import {
  baseColumns,
  getDayColumns,
} from "@/components/table/schedule-columns";
import { useSchedulePageData } from "@/hooks/use-schedule-data";
import { format, eachDayOfInterval } from "date-fns";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDateRangeStore } from "@/stores/date-range-store";
import { useCurrentUserStore } from "@/stores/user-store";
import { useTranslations } from "next-intl";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DISPLAY_MOBILE_TABLE_ROWS } from "@/lib/constants";

type Props = {
  companyId: string;
  locationId: string;
};

const TableContainer = ({ companyId, locationId }: Props) => {
  const { dateRange } = useDateRangeStore();
  const {
    schedules,
    users,
    scheduleTypes,
    isLoading,
    isError,
    error,
    refetch,
  } = useSchedulePageData(companyId, locationId, dateRange);
  const { locale } = useCurrentUserStore();
  const t = useTranslations("Schedule");
  const isMobile = useIsMobile();
  const [mobileDayIndex, setMobileDayIndex] = useState(0);

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
            schedule_type: schedule.schedule_type,
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

  const mobileDates = useMemo(() => {
    if (!isMobile || datesArray.length === 0) return datesArray;

    const start = mobileDayIndex;
    const end = Math.min(start + DISPLAY_MOBILE_TABLE_ROWS, datesArray.length);
    return datesArray.slice(start, end);
  }, [datesArray, mobileDayIndex, isMobile]);

  const canGoNext =
    isMobile && mobileDayIndex + DISPLAY_MOBILE_TABLE_ROWS < datesArray.length;
  const canGoPrev = isMobile && mobileDayIndex > 0;

  const handlePrevious = () => {
    setMobileDayIndex((prev) => Math.max(0, prev - DISPLAY_MOBILE_TABLE_ROWS));
  };

  const handleNext = () => {
    setMobileDayIndex((prev) =>
      Math.min(
        prev + DISPLAY_MOBILE_TABLE_ROWS,
        datesArray.length - DISPLAY_MOBILE_TABLE_ROWS,
      ),
    );
  };

  const columns = useMemo(
    () => [
      ...baseColumns(mobileDates, t, companyId, locationId, refetch),
      ...getDayColumns(
        mobileDates,
        companyId,
        locationId,
        refetch,
        locale,
        t,
        scheduleTypes,
      ),
    ],
    [mobileDates, companyId, locationId, refetch, locale, t],
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
        {t("errorLoading")}: {error?.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full overflow-hidden">
      {isMobile && datesArray.length > DISPLAY_MOBILE_TABLE_ROWS && (
        <div className="flex items-center justify-between gap-2 px-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoPrev}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("previous")}
          </Button>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {format(mobileDates[0]?.originalDay, "MMM d")} -{" "}
            {format(mobileDates[mobileDates.length - 1]?.originalDay, "MMM d")}
          </span>
          :
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
            className="flex-1"
          >
            {t("next")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <DataTable columns={columns} data={tableData} isMobile={isMobile} />
    </div>
  );
};

export default TableContainer;

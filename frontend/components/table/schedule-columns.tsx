"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { enUS, lt } from "date-fns/locale";

import ToolTipHover from "../tool-tip-hover";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

import { TLabelValue } from "@/types";
import CreateMonthlySchedule from "@/app/(authenticated)/company/[id]/locations/[locationId]/schedule/_components/create-monthly-schedule";
import DeleteSchedules from "@/app/(authenticated)/company/[id]/locations/[locationId]/schedule/_components/delete-schedules";
import { UpsertSchedule } from "@/app/(authenticated)/company/[id]/locations/[locationId]/schedule/_components/upsert-schedule";

export type TTableSchedule = {
  id: number;
};

type SelectedDays = {
  day: string;
  originalDay: Date;
};

type TTableRow = {
  userId: number;
  user: {
    id: number;
    fullName: string;
  };
  [key: string]: any;
};

type TShift = {
  start: string;
  end: string;
  scheduleId: number;
  hoursWorked?: number;
  schedule_type?: string;
  id?: number;
};

type TBaseColumns = ColumnDef<TTableRow>[];

type TDayColumns = ColumnDef<TTableRow>[];

const parseHoursWorkedToMinutes = (hoursWorked: unknown): number => {
  if (!hoursWorked) return 0;

  if (typeof hoursWorked === "string") {
    if (hoursWorked.includes(":")) {
      const [h, m] = hoursWorked.split(":").map(Number);
      return h * 60 + (m || 0);
    } else {
      return Math.round(parseFloat(hoursWorked) * 60);
    }
  }

  if (typeof hoursWorked === "number") {
    return Math.round(hoursWorked * 60);
  }

  return 0;
};

const getDateFnsLocale = (locale: string) => {
  switch (locale) {
    case "lt":
      return lt;
    default:
      return enUS;
  }
};

const formatDayName = (date: Date, locale: string) => {
  const dateFnsLocale = getDateFnsLocale(locale);
  return format(date, "EEE", { locale: dateFnsLocale });
};

export const baseColumns = (
  selectedDays: SelectedDays[],
  t: (key: string) => string,
  companyId: string,
  locationId: string,
  refetch: () => void,
): TBaseColumns => [
  {
    accessorKey: "user.fullName",
    header: t("employee"),
    cell: ({ row }) => {
      return <p className="whitespace-nowrap">{row.original.user.fullName}</p>;
    },
    size: 150,
    minSize: 120,
  },
  {
    id: "totalHours",
    header: t("totalHours"),
    cell: ({ row }) => {
      let totalMinutes = 0;

      selectedDays.forEach((date) => {
        const key = format(date.originalDay, "yyyy-MM-dd");
        const shift = row.original[key] as TShift | undefined;
        if (shift?.hoursWorked) {
          totalMinutes += parseHoursWorkedToMinutes(shift.hoursWorked);
        }
      });

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (totalMinutes === 0) {
        return <div className="text-center text-gray-400">-</div>;
      }

      return (
        <div className="text-center">
          <div className="font-semibold whitespace-nowrap">
            {hours}h {minutes > 0 ? `${minutes}m` : ""}
          </div>
          <div className="text-xs text-gray-500 whitespace-nowrap">
            ({(totalMinutes / 60).toFixed(1)}h)
          </div>
        </div>
      );
    },
    size: 100,
    minSize: 80,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center">{t("createMonthlySchedule")}</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {!selectedDays.length ? (
            "-"
          ) : (
            <div>
              <CreateMonthlySchedule
                companyId={companyId}
                locationId={locationId}
                userId={row.original.user.id}
                refetch={refetch}
              />
              <DeleteSchedules
                companyId={companyId}
                userId={row.original.user.id}
                refetch={refetch}
              />
            </div>
          )}
        </div>
      );
    },
    size: 60,
    minSize: 50,
  },
];

export const getDayColumns = (
  selectedDays: SelectedDays[],
  companyId: string,
  locationId: string,
  refetch: () => void,
  locale: string,
  t: (key: string) => string,
  scheduleTypes: TLabelValue[],
): TDayColumns => {
  return selectedDays.map((date) => {
    const key = format(date.originalDay, "yyyy-MM-dd");

    return {
      accessorKey: key,
      header: () => (
        <div className="text-center">
          <div className="whitespace-nowrap">
            {format(date.originalDay, "d")}
          </div>
          <div className="whitespace-nowrap">
            {formatDayName(date.originalDay, locale)}
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const shift = row.original[key] as TShift | undefined;

        if (!shift) {
          return (
            <ToolTipHover text={t("addShift")}>
              <div className="flex items-center justify-center">
                <UpsertSchedule
                  companyId={companyId}
                  locationId={locationId}
                  user={row.original.user}
                  selectedDate={date.originalDay}
                  onSuccess={refetch}
                >
                  <Button className="cursor-pointer" size={"icon-xs"}>
                    <Plus />
                  </Button>
                </UpsertSchedule>
              </div>
            </ToolTipHover>
          );
        }
        const currentScheduleType = scheduleTypes?.find(
          (item) => item.value === shift.schedule_type,
        );
        const scheduleTypeShortCut =
          currentScheduleType?.value === "work_day"
            ? ""
            : currentScheduleType?.label?.[0] || "";
        return (
          <ToolTipHover text={t("editShift")}>
            <div className="flex items-center justify-center">
              <UpsertSchedule
                companyId={companyId}
                locationId={locationId}
                user={row.original.user}
                selectedDate={date.originalDay}
                onSuccess={refetch}
                scheduleId={shift.scheduleId}
                initialStartTime={shift.start}
                initialEndTime={shift.end}
                initialScheduleType={shift.schedule_type}
              >
                <div className="text-center space-y-1 cursor-pointer">
                  <div className="whitespace-nowrap">{shift.start}</div>
                  <div className="whitespace-nowrap">{shift.end}</div>
                  {shift.hoursWorked && (
                    <div className="border-t pt-1 text-gray-600">
                      <span className="whitespace-nowrap capitalize">
                        {scheduleTypeShortCut}
                      </span>
                      <span className="whitespace-nowrap">
                        {shift.hoursWorked}
                      </span>
                    </div>
                  )}
                </div>
              </UpsertSchedule>
            </div>
          </ToolTipHover>
        );
      },
      size: 120,
      minSize: 100,
    };
  });
};

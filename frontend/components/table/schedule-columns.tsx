"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CreateSchedule } from "@/app/(authenticated)/company/[id]/schedule/_components/create-schedule";

export type TTableSchedule = {
  id: number;
};

type DateRange = {
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
  hoursWorked?: number;
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
export const baseColumns = (dateRange: DateRange[]): TBaseColumns => [
  {
    accessorKey: "user.fullName",
    header: "Employee",
    cell: ({ row }) => {
      return <p>{row.original.user.fullName}</p>;
    },
  },
  {
    id: "totalHours",
    header: "Total Hours",
    cell: ({ row }) => {
      let totalMinutes = 0;

      dateRange.forEach((date) => {
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
          <div className="font-semibold">
            {hours}h {minutes > 0 ? `${minutes}m` : ""}
          </div>
          <div className="text-xs text-gray-500">
            ({(totalMinutes / 60).toFixed(1)}h)
          </div>
        </div>
      );
    },
  },
];

export const getDayColumns = (
  dateRange: DateRange[],
  companyId: string,
  refetch: () => void,
): TDayColumns => {
  return dateRange.map((date) => {
    const key = format(date.originalDay, "yyyy-MM-dd");

    return {
      accessorKey: key,
      header: () => (
        <div className="text-center">
          <div>{format(date.originalDay, "d")}</div>
          <div>{format(date.originalDay, "EEE")}</div>
        </div>
      ),
      cell: ({ row }) => {
        const shift = row.original[key] as TShift | undefined;

        if (!shift) {
          return (
            <CreateSchedule
              companyId={companyId}
              user={row.original.user}
              selectedDate={date.originalDay}
              onSuccess={refetch}
            />
          );
        }

        return (
          <div className="text-center text-xs space-y-1">
            <div>{shift.start}</div>
            <div>{shift.end}</div>
            {shift.hoursWorked && (
              <div className="border-t pt-1 text-gray-600">
                {shift.hoursWorked}h
              </div>
            )}
          </div>
        );
      },
    };
  });
};

"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { TimePicker } from "../time-picker";
import { Button } from "../ui/button";
import { useScheduleStore } from "@/stores/schedule-store";
import { Edit2, Save } from "lucide-react";
import UserPicker from "../user-picker";
import { authenticatedApi } from "@/lib/api-handler";
import { toast } from "sonner";
import {
  DEFAULT_SCHEDULE_END_TIME,
  DEFAULT_SCHEDULE_START_TIME,
} from "@/lib/constants";
import { useUserStore } from "@/stores/user-store";
import { useParams } from "next/navigation";
// TODO:fix, find way to update rows, maybe, useQuery to update tableData?
// TODO: find solution for displaying multiple users in same day, there can be working multiple people at same time...
export type TTableSchedule = {
  day: string;
  originalDate: Date;

  id?: number;
  userId?: number;
  startTime?: string;
  endTime?: string;
  status?: string;
};

export const scheduleColumns: ColumnDef<TTableSchedule>[] = [
  {
    id: "actions",
    header: "Edit",
    cell: ({ row }) => {
      const {
        scheduleDate,
        setScheduleData,
        startTime,
        endTime,
        selectedUserId,
      } = useScheduleStore();
      const params = useParams<{ id: string }>();

      const currentDate = row.original.originalDate;
      const isEditing = scheduleDate?.getTime() === currentDate.getTime();

      const toggleEdit = () => {
        if (isEditing) {
          setScheduleData(null);
        } else {
          setScheduleData(currentDate);
        }
      };

      const handleSave = async () => {
        const formattedDate = scheduleDate
          ? format(scheduleDate, "yyyy-MM-dd")
          : format(currentDate, "yyyy-MM-dd");
        try {
          const response = await authenticatedApi.post("schedules", {
            schedule: {
              company_id: params.id,
              user_id: selectedUserId,
              work_date: formattedDate,
              start_time: startTime,
              end_time: endTime,
            },
          });
          setScheduleData(null);

          row.original.userId = selectedUserId || undefined;
          row.original.startTime = startTime || undefined;
          row.original.endTime = endTime || undefined;
          row.original.status = "scheduled";
        } catch (error: any) {
          toast.error(error.message || "something went wrong");
        } finally {
        }
      };
      return (
        <div className="space-x-2">
          <Button variant="outline" size="icon" onClick={toggleEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>

          {isEditing && (
            <Button onClick={handleSave} size="icon">
              <Save />
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "day",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.originalDate;
      return (
        <>
          <div className="font-medium">{format(date, "EEEE")}</div>
          <div className="text-sm text-muted-foreground">
            {format(date, "MMMM dd, yyyy")}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "userId",
    header: "Employee",
    cell: ({ row }) => {
      const { scheduleDate, selectedUserId, setSelectedUserId } =
        useScheduleStore();
      const { getUserName } = useUserStore();
      const isEditing =
        scheduleDate?.getTime() === row.original.originalDate.getTime();

      if (isEditing) {
        return (
          <UserPicker
            value={selectedUserId || row.original.userId}
            onChange={(userId) => setSelectedUserId(userId)}
          />
        );
      }

      return <p>{getUserName(row.original.userId) || "Not assigned"}</p>;
    },
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      const { scheduleDate, setStartTime } = useScheduleStore();
      const isEditing =
        scheduleDate?.getTime() === row.original.originalDate.getTime();

      const value = row.original.startTime;
      const onChange = (timeString: string) => {
        setStartTime(timeString);
      };
      return (
        <>
          {isEditing ? (
            <TimePicker
              value={value ? value : DEFAULT_SCHEDULE_START_TIME}
              onChange={onChange}
            />
          ) : (
            <div> {value}</div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => {
      const { scheduleDate, setEndTime } = useScheduleStore();
      const isEditing =
        scheduleDate?.getTime() === row.original.originalDate.getTime();

      const value = row.original.endTime;
      const onChange = (timeString: string) => {
        setEndTime(timeString);
      };
      return (
        <>
          {isEditing ? (
            <TimePicker
              value={value ? value : DEFAULT_SCHEDULE_END_TIME}
              onChange={onChange}
            />
          ) : (
            <div> {value}</div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "completed"
              ? "bg-green-100 text-green-800"
              : status === "scheduled"
                ? "bg-blue-100 text-blue-800"
                : status === "absent"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {status || "Not scheduled"}
        </span>
      );
    },
  },
];

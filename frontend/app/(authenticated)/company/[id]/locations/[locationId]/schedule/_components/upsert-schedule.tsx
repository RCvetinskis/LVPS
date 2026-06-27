"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/time-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCreateSchedule,
  useUpdateSchedule,
  useDestroySchedule,
} from "@/hooks/use-schedule-data";
import { format } from "date-fns";
import {
  DEFAULT_SCHEDULE_END_TIME,
  DEFAULT_SCHEDULE_START_TIME,
} from "@/lib/constants";
import AlertConfirmation from "@/components/alert-confirmation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import ScheduleTypeSelector from "./schedule-type-selector";
import Link from "next/link";
import ToastLinkMessage from "@/components/toast-link-message";

type CreateScheduleProps = {
  children: React.ReactNode;
  companyId: string;
  locationId: string;
  user: {
    id: number;
    fullName: string;
  };
  selectedDate: Date;
  scheduleId?: number;
  onSuccess?: () => void;
  initialStartTime?: string;
  initialEndTime?: string;
  initialScheduleType?: string;
};

export const UpsertSchedule = ({
  children,
  companyId,
  locationId,
  user,
  selectedDate,
  scheduleId,
  onSuccess,
  initialStartTime,
  initialEndTime,
  initialScheduleType,
}: CreateScheduleProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Schedule");

  const [startTime, setStartTime] = useState(
    initialStartTime || DEFAULT_SCHEDULE_START_TIME,
  );
  const [endTime, setEndTime] = useState(
    initialEndTime || DEFAULT_SCHEDULE_END_TIME,
  );

  const [scheduleType, setscheduleType] = useState(
    initialScheduleType || "work_day",
  );

  const createSchedule = useCreateSchedule();
  const updateSchedule = scheduleId ? useUpdateSchedule(scheduleId) : null;
  const destroySchedule = scheduleId ? useDestroySchedule(scheduleId) : null;

  const handleSubmit = async () => {
    const localWorkDate = format(selectedDate, "yyyy-MM-dd");

    const scheduleData = {
      user_id: user.id,
      work_date: localWorkDate,
      start_time: startTime,
      end_time: endTime,
      company_id: parseInt(companyId),
      location_id: parseInt(locationId),
      schedule_type: scheduleType,
    };

    try {
      if (scheduleId && updateSchedule) {
        await updateSchedule.mutateAsync(scheduleData);
      } else {
        await createSchedule.mutateAsync(scheduleData);
      }

      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        <ToastLinkMessage
          message={error.message || "something went wrong"}
          url={error.data.url || "#"}
        />,
        {
          duration: 10000,
          className: "min-w-[300px]",
        },
      );
    }
  };
  const handleDelete = async () => {
    if (scheduleId && destroySchedule) {
      await destroySchedule.mutateAsync(scheduleId);
      setOpen(false);
      onSuccess?.();
    } else {
      toast.error(t("scheduleNotFound"));
    }
  };

  const isPending =
    createSchedule.isPending ||
    (updateSchedule?.isPending ?? false) ||
    (destroySchedule?.isPending ?? false);

  const title = scheduleId ? t("editTitle") : t("createTitle");
  const buttonText = scheduleId ? t("updateButton") : t("createButton");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("employee")}</label>
            <div className="p-2 border rounded bg-gray-50">{user.fullName}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("date")}</label>
            <div className="p-2 border rounded bg-gray-50">
              {format(selectedDate, "EEEE, MMMM dd, yyyy")}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">{t("scheduleType")}</label>
            <ScheduleTypeSelector
              value={scheduleType}
              handleChange={setscheduleType}
            />
          </div>

          <div className="flex justify-between items-center gap-3">
            <div className="grid">
              <label className="text-sm font-medium">{t("startTime")}</label>
              <TimePicker value={startTime} onChange={setStartTime} />
            </div>

            <div className="grid">
              <label className="text-sm font-medium">{t("endTime")}</label>
              <TimePicker value={endTime} onChange={setEndTime} />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? t("loading") : buttonText}
          </Button>

          {scheduleId && (
            <AlertConfirmation
              title={t("deleteConfirmationTitle")}
              description={t("deleteConfirmationDescription")}
              handleConfirmation={handleDelete}
            >
              <Button
                disabled={isPending}
                className="w-full"
                variant={"destructive"}
              >
                {t("deleteSchedule")}
              </Button>
            </AlertConfirmation>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

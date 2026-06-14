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
import { Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

type CreateScheduleProps = {
  children: React.ReactNode;
  companyId: string;
  user: {
    id: number;
    fullName: string;
  };
  selectedDate: Date;
  scheduleId?: number;
  onSuccess?: () => void;
  initialStartTime?: string;
  initialEndTime?: string;
  initialNotes?: string;
};

export const UpsertSchedule = ({
  children,
  companyId,
  user,
  selectedDate,
  scheduleId,
  onSuccess,
  initialStartTime,
  initialEndTime,
  initialNotes,
}: CreateScheduleProps) => {
  const [open, setOpen] = useState(false);

  const [startTime, setStartTime] = useState(
    initialStartTime || DEFAULT_SCHEDULE_START_TIME,
  );
  const [endTime, setEndTime] = useState(
    initialEndTime || DEFAULT_SCHEDULE_END_TIME,
  );

  const [notes, setNotes] = useState(initialNotes || "");

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
      notes: notes,
    };

    if (scheduleId && updateSchedule) {
      await updateSchedule.mutateAsync(scheduleData);
    } else {
      await createSchedule.mutateAsync(scheduleData);
    }

    setOpen(false);
    onSuccess?.();
  };

  const handleDelete = async () => {
    if (scheduleId && destroySchedule) {
      await destroySchedule.mutateAsync(scheduleId);
      setOpen(false);
      onSuccess?.();
    } else {
      toast.error("Schedule not found");
    }
  };
  const isPending =
    createSchedule.isPending ||
    (updateSchedule?.isPending ?? false) ||
    (destroySchedule?.isPending ?? false);

  const title = scheduleId ? "Edit Schedule" : "Create Schedule";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Employee</label>
            <div className="p-2 border rounded bg-gray-50">{user.fullName}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <div className="p-2 border rounded bg-gray-50">
              {format(selectedDate, "EEEE, MMMM dd, yyyy")}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Note</label>

            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Leave a note"
              className="resize-none"
            />
          </div>
          <div className="flex justify-between items-center gap-3 ">
            <div className="grid">
              <label className="text-sm font-medium">Start Time</label>
              <TimePicker value={startTime} onChange={setStartTime} />
            </div>

            <div className="grid">
              <label className="text-sm font-medium">End Time</label>
              <TimePicker value={endTime} onChange={setEndTime} />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Loading..." : title}
          </Button>
          {scheduleId && (
            <AlertConfirmation
              title="Are you absolutely sure?"
              description="This action cannot be undone."
              handleConfirmation={handleDelete}
            >
              <Button
                disabled={isPending}
                className="w-full"
                variant={"destructive"}
              >
                Delete Schedule
              </Button>
            </AlertConfirmation>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

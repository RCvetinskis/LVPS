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
import { useCreateSchedule } from "@/hooks/use-schedule-data";
import { format } from "date-fns";
import {
  DEFAULT_SCHEDULE_END_TIME,
  DEFAULT_SCHEDULE_START_TIME,
} from "@/lib/constants";
import { convertToUTC } from "@/lib/time-helper";

type CreateScheduleProps = {
  companyId: string;
  user: {
    id: number;
    fullName: string;
  };
  selectedDate: Date;
  onSuccess?: () => void;
};

export const CreateSchedule = ({
  companyId,
  user,
  selectedDate,
  onSuccess,
}: CreateScheduleProps) => {
  const [open, setOpen] = useState(false);

  const [startTime, setStartTime] = useState(DEFAULT_SCHEDULE_START_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_SCHEDULE_END_TIME);

  const createSchedule = useCreateSchedule();

  // In CreateSchedule component
  const handleSubmit = async () => {
    // DON'T convert to UTC - send local times as strings
    const localWorkDate = format(selectedDate, "yyyy-MM-dd");

    console.log("Sending to backend:", {
      user_id: user.id,
      work_date: localWorkDate,
      start_time: startTime, // "00:00" - send as is
      end_time: endTime, // "17:00" - send as is
      company_id: parseInt(companyId),
    });

    await createSchedule.mutateAsync({
      user_id: user.id,
      work_date: localWorkDate,
      start_time: startTime, // No conversion!
      end_time: endTime, // No conversion!
      company_id: parseInt(companyId),
    });

    setOpen(false);
    onSuccess?.();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="xs">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
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
            disabled={createSchedule.isPending}
          >
            {createSchedule.isPending ? "Creating..." : "Create Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { useCreateMonthlySchedule } from "@/hooks/use-schedule-data";
import { useDateRangeStore } from "@/stores/date-range-store";
import { format } from "date-fns";
import { PlusCircleIcon } from "lucide-react";

type Props = {
  companyId: string;
  locationId: string;
  userId: number;
  refetch: () => void;
};

const CreateMonthlySchedule = ({
  companyId,
  locationId,
  userId,
  refetch,
}: Props) => {
  const { dateRange } = useDateRangeStore();
  const createMonthlySchedule = useCreateMonthlySchedule();

  const handleClick = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    const body = {
      company_id: companyId,
      location_id: locationId,
      user_id: userId,
      date_range: {
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd"),
      },
    };

    await createMonthlySchedule.mutateAsync(body);
    refetch();
  };

  return (
    <Button
      disabled={createMonthlySchedule.isPending}
      size={"icon-xs"}
      onClick={handleClick}
    >
      <PlusCircleIcon />
    </Button>
  );
};

export default CreateMonthlySchedule;

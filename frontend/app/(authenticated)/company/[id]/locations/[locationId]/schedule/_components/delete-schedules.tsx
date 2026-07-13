"use client";

import AlertConfirmation from "@/components/alert-confirmation";
import { Button } from "@/components/ui/button";
import { useDestroySchedulesByPeriod } from "@/hooks/use-schedule-data";
import { useDateRangeStore } from "@/stores/date-range-store";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  companyId: string;
  userId: number;
  refetch: () => void;
};

const DeleteSchedules = ({ companyId, userId, refetch }: Props) => {
  const t = useTranslations("Schedule");
  const { dateRange } = useDateRangeStore();
  const { mutateAsync, isPending } = useDestroySchedulesByPeriod();

  const handleClick = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    const body = {
      company_id: Number(companyId),
      user_id: userId,
      date_range: {
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd"),
      },
    };

    await mutateAsync(body);
    refetch();
  };
  return (
    <AlertConfirmation
      title={t("deleteConfirmationTitle")}
      description={t("deleteConfirmationDescription")}
      handleConfirmation={handleClick}
    >
      <Button variant={"destructive"} disabled={isPending} size={"icon-xs"}>
        <Trash />
      </Button>
    </AlertConfirmation>
  );
};

export default DeleteSchedules;

"use client";

import { Button } from "@/components/ui/button";
import { exportScheduleXlsx } from "@/front-requests/schedule-requests";
import { useSchedulePageData } from "@/hooks/use-schedule-data";
import { useDateRangeStore } from "@/stores/date-range-store";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

type Props = {
  companyId: string;
  companyName?: string;
};

const ExportSchedule = ({ companyId }: Props) => {
  const [isExporting, setIsExporting] = useState(false);
  const { dateRange } = useDateRangeStore();
  const { schedules, isLoading, isError, error } = useSchedulePageData(
    companyId,
    dateRange,
  );
  const t = useTranslations("Export");

  const handleScheduleExport = async () => {
    if (!schedules || schedules.length === 0) {
      toast.error(t("noSchedules"));
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      toast.error(t("noDateRange"));
      return;
    }

    const schedule_ids = schedules.map((schedule) => schedule.id);

    setIsExporting(true);
    try {
      const data = await exportScheduleXlsx({
        companyId,
        schedule_ids,
        dateRange: {
          from: dateRange.from,
          to: dateRange.to,
        },
      });

      toast.success(t("exportSuccess"));

      if (data) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `schedules_${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast.error(t("exportFailed"));
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <Button disabled>{t("loadingSchedules")}</Button>;
  }

  if (isError) {
    return (
      <Button onClick={handleScheduleExport} variant="destructive">
        {t("errorLoading")}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleScheduleExport}
      disabled={isExporting || !schedules || schedules.length === 0}
    >
      {isExporting
        ? t("exporting")
        : `${t("export")} (${schedules?.length || 0})`}
    </Button>
  );
};

export default ExportSchedule;

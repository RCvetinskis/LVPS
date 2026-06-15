"use client";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDateRangeStore } from "@/stores/date-range-store";
import { enUS, lt } from "date-fns/locale";
import { useCurrentUserStore } from "@/stores/user-store";

const CalendarSelector = () => {
  const [mounted, setMounted] = useState(false);
  const { locale } = useCurrentUserStore();
  const { dateRange, setDateRange } = useDateRangeStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDateFnsLocale = () => {
    switch (locale) {
      case "lt":
        return lt;
      default:
        return enUS;
    }
  };

  if (!mounted) {
    return (
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <div className="h-75 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="range"
          locale={getDateFnsLocale()}
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={isMobile ? 1 : 3}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarSelector;

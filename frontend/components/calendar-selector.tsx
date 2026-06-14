"use client";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDateRangeStore } from "@/stores/date-range-store";
import { addMonths, isAfter, isBefore, startOfDay } from "date-fns";

const CalendarSelector = () => {
  const [mounted, setMounted] = useState(false);
  const { dateRange, setDateRange } = useDateRangeStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

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

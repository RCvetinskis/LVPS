"use client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDateRangeStore } from "@/stores/date-range-store";

type Props = {};

const CalendarSelector = (props: Props) => {
  const { dateRange, setDateRange } = useDateRangeStore();
  const isMobile = useIsMobile();
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

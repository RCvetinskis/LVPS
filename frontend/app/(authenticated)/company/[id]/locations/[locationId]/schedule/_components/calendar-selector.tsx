"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDateRangeStore } from "@/stores/date-range-store";
import { enUS, lt } from "date-fns/locale";
import { useCurrentUserStore } from "@/stores/user-store";
import { getHolidays } from "@/front-requests/holiday-requests";
import { format } from "date-fns";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DateRange } from "react-day-picker";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TLocation } from "@/types";
type Props = {
  location: TLocation;
};
const CalendarSelector = ({ location }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { locale } = useCurrentUserStore();
  const t = useTranslations("Calendar");
  const { dateRange, setDateRange } = useDateRangeStore();
  const isMobile = useIsMobile();
  const [holidays, setHolidays] = useState<Record<string, string>>({});
  const [currentMonth, setCurrentMonth] = useState<Date>(
    dateRange?.from || new Date(),
  );
  const [showHolidayList, setShowHolidayList] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const assignHolidays = async () => {
      if (!dateRange?.from || !dateRange?.to) {
        setHolidays({});
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const holidayData = await getHolidays({
          from: dateRange.from,
          to: dateRange.to,
        });

        const newHolidayMap: Record<string, string> = {};
        holidayData.forEach((holiday: { date: string; name: string }) => {
          newHolidayMap[holiday.date] = holiday.name;
        });

        setHolidays(newHolidayMap);
      } catch (error) {
        setHolidays({});
      } finally {
        setLoading(false);
      }
    };
    assignHolidays();
  }, [dateRange, mounted]);

  const getDateFnsLocale = () => {
    switch (locale) {
      case "lt":
        return lt;
      default:
        return enUS;
    }
  };

  const getHolidayName = useCallback(
    (date: Date) => {
      return holidays[format(date, "yyyy-MM-dd")];
    },
    [holidays],
  );

  const isHoliday = useCallback(
    (date: Date) => !!getHolidayName(date),
    [getHolidayName, dateRange],
  );

  const isDayBeforeHoliday = useCallback(
    (date: Date) => {
      if (isHoliday(date)) return false;

      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      const nextDayString = format(nextDay, "yyyy-MM-dd");
      return !!holidays[nextDayString];
    },
    [holidays, isHoliday],
  );

  if (!mounted || loading) {
    return (
      <Skeleton className="mx-auto w-full max-w-[95vw] md:max-w-3xl h-80" />
    );
  }

  const handleSelect = (range?: DateRange) => {
    setDateRange(range);
  };

  const holidayCount = Object.entries(holidays).length;

  return (
    <Card className="mx-auto w-full max-w-[95vw] md:max-w-3xl p-0 shadow-sm">
      <CardContent
        className={`${isMobile ? "pt-2 px-1" : "pt-4 px-4"} mx-auto`}
      >
        <div className="flex items-center justify-center text-center gap-3 rounded-lg bg-muted/50 p-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t("address")}</p>
            <p className="text-sm text-muted-foreground">
              {location.address}
              {location.city && `, ${location.city}`}
              {location.country && `, ${location.country}`}
              {location.postal_code && ` (${location.postal_code})`}
            </p>
          </div>
        </div>

        <style jsx global>{`
          .holiday button {
            background-color: #fee2e2 !important;
            color: #dc2626 !important;
            font-weight: 600 !important;
          }

          .holiday button:hover {
            background-color: #fecaca !important;
          }
          .holiday:hover {
            background-color: #fecaca !important;
          }

          .day-before-holiday button {
            background-color: #dbeafe !important;
            color: #2563eb !important;
            font-weight: 500 !important;
          }

          .day-before-holiday button:hover {
            background-color: #bfdbfe !important;
          }
          .day-before-holiday:hover {
            background-color: #bfdbfe !important;
          }

          @media (max-width: 768px) {
            .rdp {
              --rdp-cell-size: 36px !important;
              margin: 0 !important;
            }

            .rdp-months {
              justify-content: center !important;
            }

            .rdp-month {
              width: 100% !important;
            }

            .rdp-table {
              width: 100% !important;
              max-width: 100% !important;
            }

            .rdp-caption {
              padding: 0 0.25rem !important;
            }

            .rdp-head_cell {
              font-size: 0.7rem !important;
              padding: 0.25rem 0 !important;
            }

            .rdp-cell button {
              font-size: 0.75rem !important;
              width: 32px !important;
              height: 32px !important;
            }
          }
        `}</style>

        <Calendar
          mode="range"
          locale={getDateFnsLocale()}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={(range) => handleSelect(range)}
          numberOfMonths={isMobile ? 1 : 3}
          modifiers={{
            holiday: isHoliday,
            dayBeforeHoliday: isDayBeforeHoliday,
          }}
          modifiersClassNames={{
            holiday: "holiday",
            dayBeforeHoliday: "day-before-holiday",
          }}
          components={{
            Day: ({ day, ...props }) => {
              const dateString = format(day.date, "yyyy-MM-dd");
              const holidayName = holidays[dateString];
              const isBeforeHoliday = isDayBeforeHoliday(day.date);

              let tooltipText = "";
              if (holidayName) {
                tooltipText = holidayName;
              } else if (isBeforeHoliday) {
                tooltipText = t("shortenedDay");
              }

              return (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <th {...props} />
                    </TooltipTrigger>
                    {tooltipText && (
                      <TooltipContent side={isMobile ? "top" : "right"}>
                        {tooltipText}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            },
          }}
        />
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center pb-3 md:pb-4 gap-2 px-2 md:px-4">
        {dateRange?.from && dateRange.to && (
          <div className="text-center bg-muted/50 rounded-lg p-2 px-3 md:px-4 w-full max-w-xs md:max-w-md">
            <span className="font-medium text-sm md:text-base">
              {t("selectedRange")}:
            </span>
            <div className="flex items-center justify-center gap-1 md:gap-2 mt-1">
              <span className="font-mono text-xs md:text-sm">
                {format(dateRange.from, "yyyy-MM-dd")}
              </span>
              <span className="mx-1">→</span>
              <span className="font-mono text-xs md:text-sm">
                {format(dateRange.to, "yyyy-MM-dd")}
              </span>
            </div>
          </div>
        )}

        {holidayCount > 0 && (
          <div className="w-full mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-between text-sm font-medium text-muted-foreground"
              onClick={() => setShowHolidayList(!showHolidayList)}
            >
              <span>
                {t("holidaysInRange")} ({holidayCount})
              </span>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  showHolidayList ? "rotate-90" : ""
                }`}
              />
            </Button>

            {showHolidayList && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2 max-h-40 md:max-h-48 overflow-y-auto p-2 rounded-lg bg-muted/30 mt-1">
                {Object.entries(holidays).map(([date, name]) => (
                  <div
                    key={date}
                    className="flex items-center justify-between gap-2 text-xs md:text-sm p-1.5 md:p-2 px-2 md:px-3 rounded-md bg-background border hover:bg-accent/50 transition-colors"
                  >
                    <span className="font-medium truncate">{name}</span>
                    <span className="font-mono text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">
                      {date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CalendarSelector;

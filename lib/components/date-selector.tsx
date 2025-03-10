import { addDays, format, startOfToday } from "date-fns";
import { Button } from "lib/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  // Create an array of dates for the next 7 days
  const [visibleDates, setVisibleDates] = useState(() => {
    const today = startOfToday();
    return Array.from({ length: 14 }, (_, i) => addDays(today, i));
  });

  // Move the date window backward
  const moveDatesBackward = () => {
    setVisibleDates((currentDates) => {
      const firstDate = currentDates[0];
      const newDates = Array.from({ length: 14 }, (_, i) =>
        addDays(firstDate, i - 14)
      );
      return newDates;
    });
  };

  // Move the date window forward
  const moveDatesForward = () => {
    setVisibleDates((currentDates) => {
      const lastDate = currentDates[currentDates.length - 1];
      const newDates = Array.from({ length: 14 }, (_, i) =>
        addDays(lastDate, i + 1)
      );
      return newDates;
    });
  };

  // Reset to today
  const resetToToday = () => {
    const today = startOfToday();
    setVisibleDates(Array.from({ length: 14 }, (_, i) => addDays(today, i)));
    onDateChange(today);
  };

  return (
    <div className="flex flex-col w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Game Schedule</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToToday}
            className="flex items-center"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Today
          </Button>
          <div className="flex">
            <Button
              variant="outline"
              size="icon"
              onClick={moveDatesBackward}
              className="rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={moveDatesForward}
              className="rounded-l-none border-l-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-2 min-w-full">
          {visibleDates.map((date) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected =
              date.toDateString() === selectedDate.toDateString();

            return (
              <button
                key={date.toISOString()}
                onClick={() => onDateChange(date)}
                className={`
                  flex flex-col items-center justify-center px-3 py-2 rounded-md min-w-[64px] transition-colors
                  ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : isToday
                        ? "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                        : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                  ${isToday ? "border-2 border-blue-500" : "border border-gray-200 dark:border-gray-700"}
                `}
              >
                <span className="text-xs font-semibold uppercase">
                  {format(date, "EEE")}
                </span>
                <span
                  className={`text-lg font-bold ${isSelected ? "text-white" : ""}`}
                >
                  {format(date, "d")}
                </span>
                <span className="text-xs">{format(date, "MMM")}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

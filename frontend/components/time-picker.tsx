"use client";

import { useState } from "react";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TimePicker({
  value = "17:00",
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [hours, setHours] = useState(value.split(":")[0]);
  const [minutes, setMinutes] = useState(value.split(":")[1]);

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const timeString = `${newHours}:${newMinutes}`;
    onChange?.(timeString);
  };

  return (
    <div className="inline-flex items-center gap-1">
      <Select
        value={hours}
        onValueChange={(h) => {
          setHours(h);
          handleTimeChange(h, minutes);
        }}
      >
        <SelectTrigger className="h-7 w-14 px-1 text-xs">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i.toString().padStart(2, "0");
            return (
              <SelectItem key={hour} value={hour} className="text-xs">
                {hour}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <span className="text-sm font-bold">:</span>
      <Select
        value={minutes}
        onValueChange={(m) => {
          setMinutes(m);
          handleTimeChange(hours, m);
        }}
      >
        <SelectTrigger className="h-7 w-14 px-1 text-xs">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent>
          {["00", "15", "30", "45"].map((minute) => (
            <SelectItem key={minute} value={minute} className="text-xs">
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

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
    <FieldGroup>
      <Field>
        <div className=" flex flex-col md:flex-row gap-2 items-center">
          <Select
            value={hours}
            onValueChange={(h) => {
              setHours(h);
              handleTimeChange(h, minutes);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, "0");
                return (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span className="text-xl font-bold">:</span>
          <Select
            value={minutes}
            onValueChange={(m) => {
              setMinutes(m);
              handleTimeChange(hours, m);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {["00", "15", "30", "45"].map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Field>
    </FieldGroup>
  );
}

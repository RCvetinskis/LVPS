"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScheduleTypes } from "@/hooks/use-schedule-data";

type Props = {
  value: string;
  handleChange: (value: string) => void;
};

const ScheduleTypeSelector = ({ value, handleChange }: Props) => {
  const { data, isPending } = useScheduleTypes();

  return (
    <Select disabled={isPending} value={value} onValueChange={handleChange}>
      <SelectTrigger disabled={isPending}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {data?.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <div className="flex items-center gap-2">{item.label}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ScheduleTypeSelector;

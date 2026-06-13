"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { useScheduleStore } from "@/stores/date-range-store";
import { useUserStore } from "@/stores/user-store";

type Props = {
  value?: number;
  onChange?: (userId: number) => void;
};

const UserPicker = ({ value, onChange }: Props) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { users, getUserName } = useUserStore();

  useEffect(() => {
    if (value) {
      const userName = getUserName(value);
      if (userName && userName !== "Not assigned") {
        setSearch(userName);
      }
    }
  }, [value, getUserName]);

  const handleSelect = (selectedValue: string, id: number) => {
    if (onChange) {
      onChange(id);
    }
    setSearch(selectedValue);
    setOpen(false);
  };

  return (
    <div>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Search users..."
      />
      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(false);
          }
        }}
      >
        <Command>
          <CommandInput
            placeholder="Search users..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Users">
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => handleSelect(user.name, user.id)}
                >
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default UserPicker;

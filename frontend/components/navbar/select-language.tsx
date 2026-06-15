"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeUserLocale } from "@/front-requests/user-requests";
import { useCurrentUserStore } from "@/stores/user-store";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SelectLanguage = () => {
  const { locale, setLocale } = useCurrentUserStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLanguageChange = async (newLocale: string) => {
    try {
      setLoading(true);
      await changeUserLocale(newLocale);

      setLocale(newLocale);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <Select
        disabled={loading}
        value={locale}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-30 border-0 shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">
            <div className="flex items-center gap-2">
              <span>🇬🇧</span>
              <span>English</span>
            </div>
          </SelectItem>
          <SelectItem value="lt">
            <div className="flex items-center gap-2">
              <span>🇱🇹</span>
              <span>Lietuvių</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectLanguage;

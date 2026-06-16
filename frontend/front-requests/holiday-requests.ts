import { authenticatedApi } from "@/lib/api-handler";
import { format } from "date-fns";

export const getHolidays = async (dateRange: {
  from: Date;
  to: Date;
}): Promise<any[] | []> => {
  try {
    const { data } = await authenticatedApi.get(`holidays`, {
      params: {
        date_range: {
          from: format(dateRange.from, "yyyy-MM-dd"),
          to: format(dateRange.to, "yyyy-MM-dd"),
        },
      },
    });
    return data.data;
  } catch (error) {
    console.error("Failed to fetch holidays:", error);
    return [];
  }
};

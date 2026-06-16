import { authenticatedApi } from "@/lib/api-handler";
import { toast } from "sonner";

type TInsertBody = {
  company_id: string | number;
  user_id: string | number;
  name: string;
  hours: number;
  work_days: number;
  off_days: number;
};
export const upsertUserShiftPattern = async (
  body: TInsertBody,
): Promise<string | null> => {
  try {
    const { data } = await authenticatedApi.post(
      `user_work_shift_patterns/upsert`,
      {
        user_work_shift_pattern: {
          ...body,
        },
      },
    );
    toast.success(data.message);
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return null;
  }
};

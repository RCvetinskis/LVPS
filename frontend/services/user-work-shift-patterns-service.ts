import { getServerApiClient } from "@/lib/server-side-api-handler";
import { TUser, TUserWorkShiftPattern } from "@/types";

export const getUserWorkShiftPattern = async (
  userId: string,
): Promise<TUserWorkShiftPattern | null> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get(
      `user_work_shift_patterns/show?user_id=${userId}`,
    );
    return data.data;
  } catch (error) {
    return null;
  }
};

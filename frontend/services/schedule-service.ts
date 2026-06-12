import { getServerApiClient } from "@/lib/server-side-api-handler";
import { TSchedule } from "@/types";

export const getCompanySchedules = async (id: string): Promise<TSchedule[]> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get(
      `schedules/company_schedules?company_id=${id}`,
    );
    return data.data;
  } catch (error) {
    return [];
  }
};

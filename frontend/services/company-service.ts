import { getServerApiClient } from "@/lib/server-side-api-handler";
import { TCompany } from "@/types";

export const getCompanyById = async (id: string): Promise<TCompany | null> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get(`companies/${id}`);
    return data.data;
  } catch (error) {
    return null;
  }
};

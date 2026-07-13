import { LIMIT } from "@/lib/constants";
import { getServerApiClient } from "@/lib/server-side-api-handler";
import { TLocation, TMeta } from "@/types";
type TCompanyLocationResponse = {
  data: TLocation[];
  meta: TMeta;
};

export const companyLocations = async (
  companyId: number | string,
  currentPage: number,
): Promise<TCompanyLocationResponse> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get("locations", {
      params: { page: currentPage, per_page: LIMIT, company_id: companyId },
    });
    return {
      data: data.data,
      meta: data.meta,
    };
  } catch (error) {
    return {
      data: [],
      meta: {
        current_page: 1,
        per_page: 10,
        total_count: 0,
        total_pages: 0,
      },
    };
  }
};
export const getLocationById = async (
  id: string,
  company_id: string,
): Promise<TLocation | null> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get(`locations/${id}`, {
      params: {
        company_id,
      },
    });
    return data.data;
  } catch (error) {
    return null;
  }
};

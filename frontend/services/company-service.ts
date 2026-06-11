import { LIMIT } from "@/lib/constants";
import { getServerApiClient } from "@/lib/server-side-api-handler";
import { TCompany, TUser, TMeta, TCompanyPermissions } from "@/types";
type CurrentUserCompaniesResponse = {
  data: TCompany[];
  meta: TMeta;
};
export const getCompanyById = async (id: string): Promise<TCompany | null> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get(`companies/${id}`);
    return data.data;
  } catch (error) {
    return null;
  }
};

export const getCompanyPermissions = async (
  id: string,
): Promise<TCompanyPermissions | null> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get(`permissions/company/${id}`);
    return data.data;
  } catch (error) {
    return null;
  }
};

export const currentUserCompanies = async (
  currentPage: number,
): Promise<CurrentUserCompaniesResponse> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get(`companies/current_user_companies`, {
      params: { page: currentPage, per_page: LIMIT },
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

export const getCompanyEmployees = async (
  id: string,
): Promise<TUser[] | []> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get(`companies/${id}/company_employees`);
    return data.data;
  } catch (error) {
    return [];
  }
};

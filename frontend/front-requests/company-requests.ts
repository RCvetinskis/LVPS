import { authenticatedApi } from "@/lib/api-handler";
import { TUser } from "@/types";

export const getCompanyEmployees = async (
  id: string,
): Promise<TUser[] | []> => {
  try {
    const { data } = await authenticatedApi.get(
      `companies/${id}/company_employees`,
    );
    return data.data;
  } catch (error) {
    return [];
  }
};

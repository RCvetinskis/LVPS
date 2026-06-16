import { getServerApiClient } from "@/lib/server-side-api-handler";
import { TUser } from "@/types";

export const getUserByInvitationTOken = async (
  id: string,
): Promise<TUser | null> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get(`/users/invitations/${id}`);
    return data.data;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string): Promise<TUser | null> => {
  try {
    const apiClient = await getServerApiClient();
    const { data } = await apiClient.get(`/users/data/${id}`);
    return data.data;
  } catch (error) {
    return null;
  }
};

import { authenticatedApi } from "@/lib/api-handler";
import { TUser } from "@/types";
import { toast } from "sonner";

export const changeUserLocale = async (
  locale: string,
): Promise<string | null> => {
  try {
    const { data } = await authenticatedApi.patch("users/locales", {
      locale,
    });
    toast.success(data.message);
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return null;
  }
};

export const updateUserData = async (
  id: number,
  companyId: number | string,
  body: {
    name: string;
    surname: string;
  },
): Promise<TUser | null> => {
  try {
    const { data } = await authenticatedApi.patch(`/users/data/${id}`, {
      user: {
        ...body,
        company_id: companyId,
      },
    });
    toast.success(data.message);
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return null;
  }
};

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

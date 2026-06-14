import { authenticatedApi } from "@/lib/api-handler";
import { TSchedule } from "@/types";
import { toast } from "sonner";

export const getCompanySchedules = async (id: string): Promise<TSchedule[]> => {
  try {
    const { data } = await authenticatedApi.get(
      `schedules/company_schedules?company_id=${id}`,
    );
    return data.data;
  } catch (error) {
    return [];
  }
};

export const createSchedule = async (body: any): Promise<TSchedule | null> => {
  try {
    const { data } = await authenticatedApi.post("schedules", {
      schedule: {
        company_id: body.company_id,
        user_id: body.user_id,
        work_date: body.work_date,
        start_time: body.start_time,
        end_time: body.end_time,
        notes: body.notes,
      },
    });

    toast.success(
      `Created schedule for ${data.data.user_data.name} at ${data.data.work_date}`,
    );
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return null;
  }
};
export const updateSchedule = async ({
  id,
  body,
}: {
  id: number;
  body: any;
}): Promise<TSchedule | null> => {
  try {
    const { data } = await authenticatedApi.patch(`schedules/${id}`, {
      schedule: {
        company_id: body.company_id,
        user_id: body.user_id,
        work_date: body.work_date,
        start_time: body.start_time,
        end_time: body.end_time,
        notes: body.notes,
      },
    });

    toast.success(
      `Update schedule for ${data.data.user_data.name} at ${data.data.work_date}`,
    );
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return null;
  }
};

export const destroySchedule = async (
  id: number,
): Promise<TSchedule | null> => {
  try {
    const { data } = await authenticatedApi.delete(`schedules/${id}`);

    toast.success("Schedule deleted succesfully");
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return null;
  }
};

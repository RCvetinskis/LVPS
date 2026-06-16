import { authenticatedApi } from "@/lib/api-handler";
import { TSchedule } from "@/types";
import { format } from "date-fns";

import { toast } from "sonner";

export const getCompanySchedules = async (
  id: string,
  dateRange?: { from?: Date; to?: Date },
): Promise<TSchedule[]> => {
  try {
    const { data } = await authenticatedApi.get("schedules/company_schedules", {
      params: {
        company_id: id,
        from: dateRange?.from,
        to: dateRange?.to,
      },
      paramsSerializer: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined),
        );
        return new URLSearchParams(filteredParams).toString();
      },
    });
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
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

    toast.success(data.message);
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return null;
  }
};

export const createMonthlySchedule = async (
  body: any,
): Promise<TSchedule[] | []> => {
  try {
    const { data } = await authenticatedApi.post(
      "schedules/create_monthly_schedule",
      {
        monthly_schedule: {
          company_id: body.company_id,
          user_id: body.user_id,
          date_range: body.date_range,
        },
      },
    );

    toast.success(data.message);
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return [];
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

    toast.success(data.message);
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

    toast.success(data.message);
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return null;
  }
};

export const exportScheduleXlsx = async ({
  schedule_ids,
  companyId,
  dateRange,
}: {
  schedule_ids: number[];
  companyId: string;
  dateRange: { from: Date; to: Date };
}) => {
  try {
    const response = await authenticatedApi.post(
      "schedules/export_to_xlsx",
      {
        company_id: companyId,
        schedule_ids,
        date_range: {
          from: format(dateRange.from, "yyyy-MM-dd"),
          to: format(dateRange.to, "yyyy-MM-dd"),
        },
      },
      {
        responseType: "blob",
      },
    );

    return response.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return null;
  }
};

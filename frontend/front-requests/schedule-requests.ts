import { authenticatedApi } from "@/lib/api-handler";
import { TLabelValue, TSchedule } from "@/types";
import { format } from "date-fns";

import { toast } from "sonner";
export type TDestroySchedulesParams = {
  company_id: number;
  user_id: number;
  date_range: {
    from: string;
    to: string;
  };
};
export const getCompanySchedules = async (
  company_id: string,
  location_id: string,
  dateRange?: { from?: Date; to?: Date },
): Promise<TSchedule[]> => {
  try {
    const params: Record<string, string> = {
      company_id,
      location_id,
    };

    if (dateRange?.from) {
      params.from = format(dateRange.from, "yyyy-MM-dd");
    }
    if (dateRange?.to) {
      params.to = format(dateRange.to, "yyyy-MM-dd");
    }

    const { data } = await authenticatedApi.get("schedules/company_schedules", {
      params,
    });

    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return [];
  }
};

export const getScheduleTypes = async (): Promise<TLabelValue[]> => {
  try {
    const { data } = await authenticatedApi.get("schedules/schedule_types");
    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
    return [];
  }
};

export const createSchedule = async (body: any): Promise<TSchedule> => {
  try {
    const { data } = await authenticatedApi.post("schedules", {
      schedule: {
        company_id: body.company_id,
        user_id: body.user_id,
        work_date: body.work_date,
        start_time: body.start_time,
        end_time: body.end_time,
        schedule_type: body.schedule_type,
        location_id: body.location_id,
      },
    });

    toast.success(data.message);
    return data.data;
  } catch (error: any) {
    throw error;
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
          location_id: body.location_id,
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
        schedule_type: body.schedule_type,
        location_id: body.location_id,
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
  locationId,
  dateRange,
}: {
  schedule_ids: number[];
  companyId: string;
  locationId: string;
  dateRange: { from: Date; to: Date };
}) => {
  try {
    const response = await authenticatedApi.post(
      "schedules/export_to_xlsx",
      {
        company_id: companyId,
        location_id: locationId,
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

export const destroySchedulesByPeriod = async (
  params: TDestroySchedulesParams,
): Promise<boolean> => {
  try {
    const { data } = await authenticatedApi.delete(
      "schedules/destroy_schedules",
      {
        data: {
          monthly_schedule: params,
        },
      },
    );

    toast.success(data.message);
    return true;
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || error.message || "Something went wrong",
    );
    return false;
  }
};

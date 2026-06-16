import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  createMonthlySchedule,
  createSchedule,
  destroySchedule,
  getCompanySchedules,
  updateSchedule,
} from "@/front-requests/schedule-requests";
import { getCompanyEmployees } from "@/front-requests/company-requests";

export const useCompanySchedules = (
  companyId: string,
  dateRange?: { from?: Date; to?: Date },
) => {
  return useQuery({
    queryKey: ["company-schedules", companyId, dateRange],
    queryFn: () => getCompanySchedules(companyId, dateRange),
  });
};
export const useCompanyEmployees = (companyId: string) => {
  return useQuery({
    queryKey: ["employees", companyId],
    queryFn: () => getCompanyEmployees(companyId),
    enabled: !!companyId,
  });
};

export const useSchedulePageData = (
  companyId: string,
  dateRange?: { from?: Date; to?: Date },
) => {
  const schedulesQuery = useCompanySchedules(companyId, dateRange);
  const employeesQuery = useCompanyEmployees(companyId);

  const isLoading = schedulesQuery.isLoading || employeesQuery.isLoading;
  const isError = schedulesQuery.isError || employeesQuery.isError;
  const error = schedulesQuery.error || employeesQuery.error;

  return {
    schedules: schedulesQuery.data || [],
    users: employeesQuery.data || [],
    isLoading,
    isError,
    error,
    refetch: () => {
      schedulesQuery.refetch();
      employeesQuery.refetch();
    },
  };
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => createSchedule(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-data"] });
    },
  });
};
export const useCreateMonthlySchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => createMonthlySchedule(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-data"] });
    },
  });
};

export const useUpdateSchedule = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => updateSchedule({ id, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-data"] });
      queryClient.invalidateQueries({ queryKey: ["schedule", id] });
    },
  });
};

export const useDestroySchedule = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => destroySchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-data"] });
      queryClient.invalidateQueries({ queryKey: ["schedule", id] });
    },
  });
};

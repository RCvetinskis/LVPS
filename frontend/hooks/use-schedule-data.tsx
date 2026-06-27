import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  createMonthlySchedule,
  createSchedule,
  destroySchedule,
  destroySchedulesByPeriod,
  getCompanySchedules,
  getScheduleTypes,
  updateSchedule,
} from "@/front-requests/schedule-requests";
import { getCompanyEmployees } from "@/front-requests/company-requests";
import { toast } from "sonner";

export const useCompanySchedules = (
  companyId: string,
  locationId: string,
  dateRange?: { from?: Date; to?: Date },
) => {
  return useQuery({
    queryKey: ["company-schedules", companyId, locationId, dateRange],
    queryFn: () => getCompanySchedules(companyId, locationId, dateRange),
  });
};

export const useScheduleTypes = () => {
  return useQuery({
    queryKey: [""],
    queryFn: () => getScheduleTypes(),
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
  locationId: string,
  dateRange?: { from?: Date; to?: Date },
) => {
  const schedulesQuery = useCompanySchedules(companyId, locationId, dateRange);
  const employeesQuery = useCompanyEmployees(companyId);
  const scheduleTypesQuery = useScheduleTypes();
  const isLoading =
    schedulesQuery.isLoading ||
    employeesQuery.isLoading ||
    scheduleTypesQuery.isLoading;
  const isError =
    schedulesQuery.isError ||
    employeesQuery.isError ||
    scheduleTypesQuery.isError;
  const error =
    schedulesQuery.error || employeesQuery.error || scheduleTypesQuery.error;

  return {
    schedules: schedulesQuery.data || [],
    users: employeesQuery.data || [],
    scheduleTypes: scheduleTypesQuery.data || [],
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
export const useDestroySchedulesByPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: destroySchedulesByPeriod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-data"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};

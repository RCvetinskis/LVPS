import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  createSchedule,
  getCompanySchedules,
} from "@/front-requests/schedule-requests";
import { getCompanyEmployees } from "@/front-requests/company-requests";

export const useCompanySchedules = (companyId: string) => {
  return useQuery({
    queryKey: ["schedules", companyId],
    queryFn: () => getCompanySchedules(companyId),
    enabled: !!companyId,
  });
};

export const useCompanyEmployees = (companyId: string) => {
  return useQuery({
    queryKey: ["employees", companyId],
    queryFn: () => getCompanyEmployees(companyId),
    enabled: !!companyId,
  });
};

export const useSchedulePageData = (companyId: string) => {
  const schedulesQuery = useCompanySchedules(companyId);
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
    mutationFn: (data: any) => createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-data"] });
    },
  });
};

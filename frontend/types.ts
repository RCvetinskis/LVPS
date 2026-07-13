export type TCrudDate = {
  created_at: string;
  updated_at: string;
};
export type TCompany = {
  id: number;
  name: string;
  location: string;

  description?: string;
} & TCrudDate;

export type TMeta = {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

export type TUser = {
  id: number;
  email: string;
  name: string;
  surname: string;
  role: string;
  status: string;
  locale: string;
  invitation_token?: string;
} & TCrudDate;

export type TCompanyPermissions = {
  view: boolean;
  update: boolean;
  create: boolean;
  delete: boolean;
  manage_company_users: boolean;
};

export type TSchedule = {
  id: number;
  company_id: number;
  location_id: number | null;
  start_time: string;
  end_time: string;
  work_date: string;
  hours_worked?: number;
  schedule_type?: string;
  user_data: {
    name: string;
    surname: string;
    id: number;
  };
} & TCrudDate;

export type TUserWorkShiftPattern = {
  id: number;
  company_id: number;
  user_id: number;
  hours: string;
  name: string;
  off_days: number;
  work_days: number;
} & TCrudDate;

export type TLabelValue = {
  label: string;
  value: string;
};

export type TLocation = {
  id: number;
  company_id: number;
  name: string;
  address: string;

  active: boolean;
  primary_location: boolean;

  postal_code?: string;
  phone?: string;
  country?: string;
  email?: string;

  city?: string;
  notes?: string;
} & TCrudDate;
export class ApiError extends Error {
  data: any;
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, data?: any, status?: number) {
    super(message);
    this.name = "ApiError";
    this.data = data;
    this.status = status || 500;
    this.errors = data?.errors;
  }
}

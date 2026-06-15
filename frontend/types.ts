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
  start_time: string;
  end_time: string;
  work_date: string;
  hours_worked?: number;
  notes?: string;
  user_data: {
    name: string;
    surname: string;
    id: number;
  };
} & TCrudDate;

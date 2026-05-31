export type TCrudDate = {
  created_at: string;
  updated_at: string;
};
export type TCompany = {
  name: string;
  location: string;

  description?: string;
} & TCrudDate;

import { TCompany, TCompanyPermissions } from "@/types";
import { create } from "zustand";

type CompanyStore = {
  company: TCompany | undefined;
  permissions: TCompanyPermissions | undefined;
  error: string | null;
  isLoading: boolean;
  setCompany: (company: TCompany) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPermissions: (company: TCompanyPermissions) => void;
};

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  company: undefined,
  permissions: undefined,
  error: null,
  isLoading: false,
  setCompany: (company) => set({ company, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPermissions: (permissions) => set({ permissions }),
}));

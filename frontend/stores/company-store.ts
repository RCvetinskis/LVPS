import { TCompany } from "@/types";
import { create } from "zustand";

type CompanyStore = {
  company: TCompany | undefined;
  error: string | null;
  isLoading: boolean;
  setCompany: (company: TCompany) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  company: undefined,
  error: null,
  isLoading: false,
  setCompany: (company) => set({ company, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

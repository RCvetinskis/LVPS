"use client";

import { useCompanyStore } from "@/stores/company-store";
import { TCompany } from "@/types";
import { useEffect, useRef } from "react";

type Props = {
  company: TCompany;
};

const CompanyStoreInitializer = ({ company }: Props) => {
  const initialized = useRef(false);
  const setCompany = useCompanyStore((state) => state.setCompany);

  useEffect(() => {
    if (!initialized.current) {
      setCompany(company);
      initialized.current = true;
    }
  }, [company, setCompany]);

  return null;
};

export default CompanyStoreInitializer;

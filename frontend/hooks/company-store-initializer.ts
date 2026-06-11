"use client";

import { useCompanyStore } from "@/stores/company-store";
import { TCompany, TCompanyPermissions } from "@/types";
import { useEffect, useRef } from "react";

type Props = {
  company: TCompany;
  permissions: TCompanyPermissions;
};

const CompanyStoreInitializer = ({ company, permissions }: Props) => {
  const initialized = useRef(false);
  const { setCompany, setPermissions, setLoading } = useCompanyStore();

  useEffect(() => {
    if (!initialized.current) {
      setLoading(true);
      setCompany(company);
      setPermissions(permissions);
      initialized.current = true;
      setLoading(false);
    }
  }, [company, permissions, setCompany, setPermissions, setLoading]);

  return null;
};

export default CompanyStoreInitializer;

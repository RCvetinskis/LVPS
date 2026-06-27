import Paginator from "@/components/Paginator";
import { companyLocations } from "@/services/locations-service";

import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    page: string;
  }>;
};

const CompanyHomePage = async (props: Props) => {
  return <div className="space-y-4">COMPANY HOME PAGE</div>;
};

export default CompanyHomePage;

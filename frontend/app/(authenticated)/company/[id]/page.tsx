import { getCompanyById } from "@/services/company-service";
import CompanyCard from "../_components/CompanyCard";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const CompanyPage = async (props: Props) => {
  const params = await props.params;

  const company = await getCompanyById(params.id);

  if (!company) {
    return <div>No Company Found</div>;
  }
  return (
    <div>
      <CompanyCard company={company} />
    </div>
  );
};

export default CompanyPage;

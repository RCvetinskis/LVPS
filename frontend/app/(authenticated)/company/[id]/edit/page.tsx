import { getCompanyById } from "@/services/company-service";
import CompanyForm from "../../_components/CompanyForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const CompanyEditPage = async (props: Props) => {
  const params = await props.params;

  const company = await getCompanyById(params.id);

  if (!company) {
    return <div>No Company Found</div>;
  }
  return (
    <div>
      <CompanyForm />
    </div>
  );
};

export default CompanyEditPage;

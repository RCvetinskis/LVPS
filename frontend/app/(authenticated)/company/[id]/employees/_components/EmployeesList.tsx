import { getCompanyEmployees } from "@/services/company-service";
import EmployeeCard from "./EmployeeCard";

type Props = {
  companyId: string;
};

const EmployeesList = async ({ companyId }: Props) => {
  const data = await getCompanyEmployees(companyId);
  // TODO: Add pagination and search

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {data.map((item) => (
        <EmployeeCard key={item.id} employee={item} />
      ))}
    </div>
  );
};

export default EmployeesList;

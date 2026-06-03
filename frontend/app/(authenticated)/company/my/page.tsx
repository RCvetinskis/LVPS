import { currentUserCompanies } from "@/services/company-service";
import CompanyCard from "../_components/CompanyCard";
import Paginator from "@/components/Paginator";

type Props = {
  searchParams: Promise<{
    page: string;
  }>;
};

const CurrentUserCompanies = async ({ searchParams }: Props) => {
  const currentPage = Number((await searchParams).page) || 1;

  const { data, meta } = await currentUserCompanies(currentPage);

  if (!data.length) return <div>No companies found</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl"> My Companies</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 ">
        {data.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
      <Paginator totalCount={meta.total_count} limit={meta.per_page} />
    </div>
  );
};

export default CurrentUserCompanies;

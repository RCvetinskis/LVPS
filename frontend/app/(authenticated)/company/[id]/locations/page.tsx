import Paginator from "@/components/Paginator";
import { companyLocations } from "@/services/locations-service";

import Link from "next/link";
import LocationCard from "./_components/LocationCard";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    page: string;
  }>;
};

const LocationsPage = async (props: Props) => {
  const currentPage = Number((await props.searchParams).page) || 1;
  const params = await props.params;
  const companyId = params.id;
  const { data, meta } = await companyLocations(companyId, currentPage);

  return (
    <div className="space-y-4">
      <header>
        <Link href=""></Link>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 ">
        {data.map((item) => (
          <LocationCard key={item.id} location={item} />
        ))}
      </div>
      <Paginator totalCount={meta.total_count} limit={meta.per_page} />
    </div>
  );
};

export default LocationsPage;

import TableContainer from "./_components/table-container";
import { QueryProvider } from "@/providers/query-provider";
import ExportSchedule from "./_components/export-schedule";
import CalendarSelector from "./_components/calendar-selector";
import { getLocationById } from "@/services/locations-service";

type Props = {
  params: Promise<{
    id: string;
    locationId: string;
  }>;
};

const SchedulePage = async (props: Props) => {
  const params = await props.params;
  const location = await getLocationById(params.locationId, params.id);
  if (!location) return <div>Location not found</div>;
  return (
    <QueryProvider>
      <div className="space-y-4">
        <header>
          <CalendarSelector location={location} />
        </header>

        <section>
          <ExportSchedule
            companyId={params.id}
            locationId={params.locationId}
          />
        </section>
        <TableContainer companyId={params.id} locationId={params.locationId} />
      </div>
    </QueryProvider>
  );
};

export default SchedulePage;

import CalendarSelector from "@/components/calendar-selector";
import TableContainer from "./_components/table-container";
import { QueryProvider } from "@/providers/query-provider";
import ExportSchedule from "./_components/export-schedule";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const SchedulePage = async (props: Props) => {
  const params = await props.params;

  return (
    <QueryProvider>
      <div className="space-y-4">
        <header>
          <CalendarSelector />
        </header>

        <section>
          <ExportSchedule companyId={params.id} companyName="test" />
        </section>
        <TableContainer companyId={params.id} />
      </div>
    </QueryProvider>
  );
};

export default SchedulePage;

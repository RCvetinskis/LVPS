import CalendarSelector from "@/components/calendar-selector";
import TableContainer from "./_components/table-container";
import { QueryProvider } from "@/app/providers/query-provider";

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

        <TableContainer companyId={params.id} />
      </div>
    </QueryProvider>
  );
};

export default SchedulePage;

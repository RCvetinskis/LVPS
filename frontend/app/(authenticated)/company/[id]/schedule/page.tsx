import CalendarSelector from "@/components/calendar-selector";

import TableContainer from "./_components/table-container";
import { getCompanySchedules } from "@/services/schedule-service";
import { getCompanyEmployees } from "@/services/company-service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const SchedulePage = async (props: Props) => {
  const params = await props.params;
  const data = await getCompanySchedules(params.id);
  const users = await getCompanyEmployees(params.id);
  return (
    <div className="space-y-4">
      <header>
        <CalendarSelector />
      </header>

      <TableContainer schedules={data} users={users} />
    </div>
  );
};

export default SchedulePage;

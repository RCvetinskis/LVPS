import { getUserById } from "@/services/user-services";
import EditEmployee from "./_components/edit-employee";
import EditEmployeeWorkShift from "./_components/edit-employee-work-shift";
import { getUserWorkShiftPattern } from "@/services/user-work-shift-patterns-service";

type Props = {
  params: Promise<{
    userId: string;
    id: string;
  }>;
};

const EmployeeEditPage = async (props: Props) => {
  const params = await props.params;
  const user = await getUserById(params.userId);
  const userWorkShiftPattern = await getUserWorkShiftPattern(params.userId);

  if (!user) return <div>User not found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <EditEmployee employee={user} companyId={params.id} />
      <EditEmployeeWorkShift
        employee={user}
        companyId={params.id}
        defaultPattern={userWorkShiftPattern ? userWorkShiftPattern : undefined}
      />
    </div>
  );
};

export default EmployeeEditPage;

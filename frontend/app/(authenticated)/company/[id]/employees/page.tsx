import EmployeesList from "./_components/EmployeesList";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
const EmployeesPage = async (props: Props) => {
  const params = await props.params;

  return (
    <div>
      <EmployeesList companyId={params.id} />
    </div>
  );
};

export default EmployeesPage;

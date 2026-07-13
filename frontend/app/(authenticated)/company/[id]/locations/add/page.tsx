import LocationForm from "../_components/LocationForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const AddLocationPage = async (props: Props) => {
  const params = await props.params;
  const companyId = params.id;
  return (
    <div>
      <LocationForm companyId={companyId} />
    </div>
  );
};

export default AddLocationPage;

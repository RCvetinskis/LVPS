import { getLocationById } from "@/services/locations-service";
import LocationForm from "../../_components/LocationForm";

type Props = {
  params: Promise<{
    id: string;
    locationId: string;
  }>;
};

const LocationEditPage = async (props: Props) => {
  const params = await props.params;

  const { id, locationId } = params;
  const location = await getLocationById(locationId, id);

  if (!location) return <div>Location not found</div>;

  return <LocationForm companyId={id} location={location} />;
};

export default LocationEditPage;

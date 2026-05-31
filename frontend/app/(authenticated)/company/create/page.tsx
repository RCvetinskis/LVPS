import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompanyForm from "../_components/CompanyForm";

type Props = {};

const CreateCompanyPage = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create company</CardTitle>
        <CardDescription>Your own company to manage</CardDescription>
      </CardHeader>
      <CardContent>
        <CompanyForm />
      </CardContent>
    </Card>
  );
};

export default CreateCompanyPage;

import { SidebarProvider } from "@/components/ui/sidebar";
import CompanySidebar from "./_components/CompanySidebar";
import CompanyStoreInitializer from "@/hooks/company-store-initializer";
import {
  getCompanyById,
  getCompanyPermissions,
} from "@/services/company-service";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
};

const CompanyLayout = async (props: Props) => {
  const params = await props.params;
  const company = await getCompanyById(params.id);
  const permissions = await getCompanyPermissions(params.id);

  if (!company || !permissions) return <div>Company Not Found</div>;

  return (
    <SidebarProvider>
      <CompanyStoreInitializer company={company} permissions={permissions} />
      <CompanySidebar />
      <main className="w-full">{props.children}</main>
    </SidebarProvider>
  );
};

export default CompanyLayout;

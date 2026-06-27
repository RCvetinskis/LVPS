import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
      <main className="min-w-0 flex-1 w-full overflow-hidden">
        <SidebarTrigger className="fixed top-0 left-4 z-50" />
        <div className="w-full max-w-full  px-4">{props.children}</div>
      </main>
    </SidebarProvider>
  );
};

export default CompanyLayout;

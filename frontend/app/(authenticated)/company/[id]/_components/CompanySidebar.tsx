"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useCompanyStore } from "@/stores/company-store";
import {
  CalendarRange,
  GalleryVerticalEnd,
  PersonStanding,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CompanySidebar = () => {
  const { company, permissions } = useCompanyStore();
  const t = useTranslations("CompanySideBar");
  const pathname = usePathname();
  if (!company) return null;

  const companyBaseUrl = `/company/${company.id}`;

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const data = {
    navMain: [
      {
        title: t("manageStaff"),
        url: "#",
        icon: <PersonStanding />,
        items: [
          {
            title: t("employees"),
            url: `${companyBaseUrl}/employees`,
            permission: permissions?.view,
          },
          {
            title: t("addEmployee"),
            url: `${companyBaseUrl}/employees/add`,
            permission: permissions?.manage_company_users,
          },
        ],
      },
      {
        title: t("schedule"),
        url: `${companyBaseUrl}/schedule`,
        icon: <CalendarRange />,
        permission: permissions?.view,
      },
    ],
  };

  return (
    <Sidebar className="pt-8 fixed">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="top-4">
            <SidebarMenuButton size="lg" asChild>
              <Link href={companyBaseUrl}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{company.name}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.permission && (
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="font-medium">
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                )}
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map(
                      (item) =>
                        item.permission && (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.url)}
                            >
                              <Link href={item.url}>{item.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ),
                    )}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default CompanySidebar;

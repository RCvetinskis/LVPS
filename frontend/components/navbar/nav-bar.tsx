"use client";
import { useTranslations } from "next-intl";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Flag, PersonStanding, type LucideIcon, Briefcase } from "lucide-react";
import SelectLanguage from "./select-language";
import React, { ComponentType } from "react";
import { useRouter } from "next/navigation";
import SignOut from "@/app/(authenticated)/profile/_components/sign_out";

type Props = {};

type ComponentOption = {
  id: number;
  type: "component";
  component: ComponentType;
};

type ActionOption = {
  id: number;
  type: "action";
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  isSeparator?: boolean;
};

type MenuOption = ComponentOption | ActionOption;

const isComponentOption = (option: MenuOption): option is ComponentOption => {
  return option.type === "component";
};

const isActionOption = (option: MenuOption): option is ActionOption => {
  return option.type === "action";
};

const NavBar = (props: Props) => {
  const router = useRouter();
  const t = useTranslations("Navigation");
  const items = [
    {
      id: 1,
      title: t("language"),
      icon: Flag,
      options: [
        {
          id: 1,
          type: "component" as const,
          component: SelectLanguage,
        },
      ] as MenuOption[],
    },
    {
      id: 2,
      title: t("companies"),
      icon: Briefcase,
      options: [
        {
          id: 1,
          type: "action" as const,
          label: t("myCompanies"),
          onClick: () => router.push("/company/my"),
          isSeparator: true,
        },
      ] as MenuOption[],
    },
    {
      id: 3,
      title: t("profile"),
      icon: PersonStanding,
      options: [
        {
          id: 1,
          type: "component" as const,
          component: SignOut,
        },
      ] as ComponentOption[],
    },
  ];

  return (
    <Menubar className="fixed w-full p-4 z-50 flex justify-end bg-secondary">
      {items.map((item) => (
        <MenubarMenu key={item.id}>
          <MenubarTrigger className="cursor-pointer gap-2">
            <item.icon className="h-4 w-4" />
            {item.title}
          </MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              {item.options.map((option, index) => (
                <React.Fragment key={option.id}>
                  {isActionOption(option) &&
                    option.isSeparator &&
                    index > 0 && <MenubarSeparator />}
                  <MenubarItem
                    onClick={
                      isActionOption(option) ? option.onClick : undefined
                    }
                  >
                    {isActionOption(option) && option.icon && (
                      <option.icon className="mr-2 h-4 w-4" />
                    )}
                    {isComponentOption(option) ? (
                      <option.component />
                    ) : (
                      option.label
                    )}
                  </MenubarItem>
                </React.Fragment>
              ))}
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
};

export default NavBar;

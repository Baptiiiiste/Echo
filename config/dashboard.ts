import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "",
    authorizeOnly: UserRole.ADMIN,
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
  {
    title: "",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { href: "/editor", icon: "gitFork", title: "Editor" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { href: "/billing", icon: "billing", title: "Billing" },
      { href: "/settings", icon: "settings", title: "Settings" },
    ],
  },
];

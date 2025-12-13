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
    ]
  },
  {
    title: "",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { href: "/widgets", icon: "shapes", title: "Widgets" },
    ],
  },  {
    title: "FEEDBACKS",
    items: [
      { href: "/surveys", icon: "messages", title: "Survey" },
      { href: "/feature-requests", icon: "lightbulb", title: "Feature Requests" },
      { href: "/bug-reports", icon: "bug", title: "Bug Reports" },
      { href: "/feedbacks", icon: "messageSquare", title: "Feedbacks" },
      { href: "/reviews", icon: "star", title: "Reviews" },
      { href: "/changelogs", icon: "userPen", title: "Changelogs" },
      { href: "/roadmap", icon: "map", title: "Roadmap" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { href: "/members", icon: "user", title: "Members" },
      { href: "/project", icon: "folderCog", title: "Project" },
    ],
  },
];

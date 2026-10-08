import {
  CodeIcon,
  DesignIcon,
  DocIcon,
  FolderIcon,
  HomeIcon,
  SettingsIcon,
  TestingIcon,
} from "@/components/ui/icons";

// Every dashboard page, in sidebar order. Add a new page here and both the
// Sidebar link and the Topbar title pick it up.
export const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", subtitle: "Overview of your workspace and projects", icon: HomeIcon, group: "top" },
  { href: "/dashboard/requirements", label: "Requirements", subtitle: "Product requirements, user stories, and sprint planning", icon: DocIcon, group: "top" },
  { href: "/dashboard/design", label: "Design", subtitle: "System architecture and design decisions", icon: DesignIcon, group: "top" },
  { href: "/dashboard/implementation", label: "Implementation", subtitle: "User stories, commits, and pull requests", icon: CodeIcon, group: "top" },
  { href: "/dashboard/testing", label: "Testing", subtitle: "Test runs, coverage, and quality trends", icon: TestingIcon, group: "top" },
  { href: "/dashboard/projects", label: "Projects", subtitle: "All projects connected to your workspace", icon: FolderIcon, group: "bottom" },
  { href: "/dashboard/settings", label: "Settings", subtitle: "Account and integration preferences", icon: SettingsIcon, group: "bottom" },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

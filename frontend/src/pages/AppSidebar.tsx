import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bell,
  User,
  Settings,
  LogOut,
  Building2,
  ChevronsUpDown,
  Plus,
  Check,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { useWorkspace } from "@/context/WorkspaceContext";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "My Tasks", url: "/tasks", icon: CheckSquare },
];

const accountItems = [
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { clearAuth } = useAuth();
  const { unreadCount } = useNotificationsContext();
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspace();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      <SidebarContent className="bg-white">

        {/* Workspace switcher */}
        <SidebarGroup>
          <SidebarGroupContent>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left outline-none">
                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-gray-900 shrink-0">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1 text-sm font-semibold text-gray-900 truncate">
                  {currentWorkspace?.name ?? "No workspace"}
                </span>
                <ChevronsUpDown className="w-4 h-4 text-gray-400 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {workspaces.map((ws) => (
                  <DropdownMenuItem
                    key={ws.id}
                    onClick={() => switchWorkspace(ws)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded bg-gray-900 shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="flex-1 truncate">{ws.name}</span>
                    {ws.id === currentWorkspace?.id && (
                      <Check className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/create-workspace")}
                  className="flex items-center gap-2 cursor-pointer text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                  Create workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url} end={item.url === "/"}>
                    {({ isActive }) => (
                      <SidebarMenuButton isActive={isActive} tooltip={item.title} className="w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account nav */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton isActive={isActive} tooltip={item.title} className="w-full">
                        <div className="relative flex-none">
                          <item.icon className="h-4 w-4" />
                          {item.title === "Notifications" && unreadCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                        </div>
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  tooltip="Log out"
                  className="text-red-600 hover:text-red-600 hover:bg-red-50 cursor-pointer w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}

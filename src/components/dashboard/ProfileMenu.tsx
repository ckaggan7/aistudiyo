import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Palette, User as UserIcon, Building2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import ThemeSwitcherDialog from "./ThemeSwitcherDialog";

export default function ProfileMenu() {
  const { user, signOut } = useAuth();
  const { current } = useWorkspace();
  const navigate = useNavigate();
  const [themeOpen, setThemeOpen] = useState(false);

  const email = user?.email ?? "creator@aistudiyo";
  const name = (user?.user_metadata?.full_name as string) || email.split("@")[0];
  const initials = name.split(/[\s._-]+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "AI";
  const avatar = (user?.user_metadata?.avatar_url as string) || undefined;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-9 w-9 rounded-full overflow-hidden ring-1 ring-border/60 hover:ring-primary/50 transition-all shadow-card">
            <Avatar className="h-9 w-9">
              {avatar && <AvatarImage src={avatar} alt={name} />}
              <AvatarFallback className="bg-gradient-hero text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-3 py-2">
            <Avatar className="h-9 w-9">
              {avatar && <AvatarImage src={avatar} alt={name} />}
              <AvatarFallback className="bg-gradient-hero text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {current && (
            <DropdownMenuItem disabled className="opacity-100">
              <Building2 className="w-4 h-4" />
              <span className="flex-1 truncate">{current.name}</span>
              <span className="text-[10px] uppercase text-muted-foreground">{current.plan}</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
            <UserIcon className="w-4 h-4" /> Profile settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setThemeOpen(true)}>
            <Palette className="w-4 h-4" /> Change theme
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
            <Settings className="w-4 h-4" /> Workspace settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => { await signOut(); navigate("/login"); }}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="w-4 h-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ThemeSwitcherDialog open={themeOpen} onOpenChange={setThemeOpen} />
    </>
  );
}

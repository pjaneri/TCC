"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Recycle,
  Shield,
  ShieldCheck,
  Trophy,
  UserCircle,
} from "lucide-react";
import { ReactNode, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doc } from "firebase/firestore";
import { ThemeToggle } from "@/components/theme-toggle";

const baseNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Visão Geral" },
  { href: "/dashboard/log", icon: PlusCircle, label: "Registrar Reciclagem" },
  { href: "/dashboard/rewards", icon: Trophy, label: "Resgatar Prêmios" },
  { href: "/dashboard/rankings", icon: Shield, label: "Rankings" },
  { href: "/dashboard/profile", icon: UserCircle, label: "Perfil" },
];

const adminNavItem = { href: "/dashboard/admin", icon: ShieldCheck, label: "Admin" };

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const auth = getAuth();

  const adminRoleRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminRoleRef);
  const isAdmin = adminRole?.exists;

  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login");
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível fazer logout. Tente novamente.",
      });
    }
  };

  if (isUserLoading || !user || isAdminLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Recycle className="h-5 w-5" />
            </div>
            <span className="font-headline text-lg font-semibold text-primary">
              Recycle+
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton tooltip="Sair" onClick={handleSignOut}>
            <LogOut />
            <span>Sair</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex w-full flex-1 items-center justify-end gap-4">
            <h1 className="font-headline text-xl font-semibold flex-1">
                {navItems.find(item => item.href === pathname)?.label}
            </h1>
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'}/>
                <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:block">{user?.displayName}</span>
            </div>
          </div>
        </header>
        <main className="flex flex-1 justify-center p-4 md:p-6">
          <div className="w-full max-w-4xl animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

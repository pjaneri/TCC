
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Trophy,
  UserCircle,
  Recycle,
  BarChart,
  AreaChart,
  Home,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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
import { useUser, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Visão Geral" },
  { href: "/dashboard/log", icon: PlusCircle, label: "Registrar Reciclagem" },
  { href: "/dashboard/rankings", icon: BarChart, label: "Rankings" },
  { href: "/dashboard/rewards", icon: Trophy, label: "Resgatar Prêmios" },
  { href: "/dashboard/profile", icon: UserCircle, label: "Perfil" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const auth = getAuth();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login");
      return;
    }

    const checkAndCreateUserProfile = async () => {
      if (user && firestore) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          try {
            await setDoc(userDocRef, {
              id: user.uid,
              username: user.displayName || 'Usuário Anônimo',
              email: user.email,
              registrationDate: serverTimestamp(),
              totalPoints: 300,
              lifetimePoints: 300,
            });
             toast({
              title: "Bem-vindo(a) ao Recycle+!",
              description: "Você ganhou 300 pontos de incentivo!",
            });
          } catch (error) {
             console.error("Failed to create user profile:", error);
          }
        }
      }
    };
    
    if (user) {
      checkAndCreateUserProfile();
    }
  }, [user, isUserLoading, router, firestore, toast]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível fazer logout. Tente novamente.",
      });
    }
  };

  const currentNavItem = navItems.find(item => item.href === pathname);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
            <Recycle className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Recycle className="h-5 w-5" />
            </div>
            <span className="font-headline text-lg font-semibold text-primary">
              Recycle+
            </span>
          </Link>
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
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" passHref>
                <SidebarMenuButton tooltip="Página Inicial">
                  <Home />
                  <span>Página Inicial</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sair" onClick={handleSignOut}>
                <LogOut />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="md:rounded-none">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex w-full flex-1 items-center justify-end gap-4">
            <h1 className="font-headline text-xl font-semibold flex-1">
                {currentNavItem?.label}
            </h1>
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'}/>
                <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm md:block">{user?.displayName}</span>
            </div>
          </div>
        </header>
        <main className="flex flex-1 justify-center p-4 sm:p-6">
          <div className="w-full max-w-4xl animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

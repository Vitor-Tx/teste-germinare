"use client"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
//import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return (
    <>
      {isHydrated ? (<SidebarProvider>

        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger />
          {children}
        </SidebarInset>


      </SidebarProvider>) : (
        <div className="flex h-screen">
          <main className="flex-1 p-8 bg-background overflow-y-auto">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
              </div>

              <Skeleton className="h-8 w-40 mb-4" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </main>
        </div>
      )}
    </>
  );

}
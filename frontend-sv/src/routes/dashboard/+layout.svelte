<script lang="ts">
   import { page } from "$app/stores";
   import { USER_ROLES } from "$lib/db/schema/auth-schema";
   import { Button } from "$lib/components/ui/button";
   import {
      Avatar,
      AvatarFallback,
      AvatarImage,
   } from "$lib/components/ui/avatar";
   import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
   } from "$lib/components/ui/dropdown-menu";
   import {
      Home,
      User,
      Settings,
      LogOut,
      Building2,
      TrendingUp,
      Users,
      Briefcase,
   } from "@lucide/svelte";
   import { authClient } from "$lib/auth-client";
   import { goto } from "$app/navigation";

   export let data: { user: any };

   const { user } = data;

   // Navigation items based on user role
   $: navigationItems = getNavigationItems(user.role);

   function getNavigationItems(role: string) {
      const baseItems = [{ href: "/dashboard", label: "Overview", icon: Home }];

      switch (role) {
         case USER_ROLES.FOUNDER:
            return [
               ...baseItems,
               {
                  href: "/dashboard/founder/startup",
                  label: "My Startup",
                  icon: Building2,
               },
               {
                  href: "/dashboard/founder/fundraising",
                  label: "Fundraising",
                  icon: TrendingUp,
               },
               {
                  href: "/dashboard/founder/connections",
                  label: "Connections",
                  icon: Users,
               },
            ];
         case USER_ROLES.INVESTOR:
            return [
               ...baseItems,
               {
                  href: "/dashboard/investor/portfolio",
                  label: "Portfolio",
                  icon: Briefcase,
               },
               {
                  href: "/dashboard/investor/deals",
                  label: "Deals",
                  icon: TrendingUp,
               },
               {
                  href: "/dashboard/investor/startups",
                  label: "Startups",
                  icon: Building2,
               },
            ];
         case USER_ROLES.SUPPORT:
            return [
               ...baseItems,
               {
                  href: "/dashboard/support/services",
                  label: "Services",
                  icon: Briefcase,
               },
               {
                  href: "/dashboard/support/clients",
                  label: "Clients",
                  icon: Users,
               },
               {
                  href: "/dashboard/support/projects",
                  label: "Projects",
                  icon: Building2,
               },
            ];
         default:
            return baseItems;
      }
   }

   async function handleLogout() {
      await authClient.signOut();
      goto("/login");
   }

   function getRoleDisplayName(role: string) {
      return role.charAt(0).toUpperCase() + role.slice(1);
   }

   function getInitials(name: string) {
      return name
         .split(" ")
         .map((n) => n[0])
         .join("")
         .toUpperCase()
         .slice(0, 2);
   }
</script>

<svelte:head>
   <title>Dashboard - StartupConnect</title>
</svelte:head>

<div class="min-h-screen bg-background">
   <!-- Top Navigation Bar -->
   <header class="border-b bg-card">
      <div class="container mx-auto px-4">
         <div class="flex h-16 items-center justify-between">
            <!-- Logo and Navigation -->
            <div class="flex items-center space-x-8">
               <a href="/" class="flex items-center space-x-2">
                  <span class="text-xl font-bold text-primary"
                     >StartupConnect</span
                  >
               </a>

               <!-- Navigation Links -->
               <nav class="hidden md:flex items-center space-x-6">
                  {#each navigationItems as item}
                     <a
                        href={item.href}
                        class="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        class:text-foreground={$page.url.pathname === item.href}
                     >
                        <svelte:component this={item.icon} class="h-4 w-4" />
                        <span>{item.label}</span>
                     </a>
                  {/each}
               </nav>
            </div>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
               <!-- Role Badge -->
               <span
                  class="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
               >
                  {getRoleDisplayName(user.role)}
               </span>

               <!-- User Dropdown -->
               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Button
                        variant="ghost"
                        class="relative h-8 w-8 rounded-full"
                     >
                        <Avatar class="h-8 w-8">
                           <AvatarImage src="" alt={user.name} />
                           <AvatarFallback
                              >{getInitials(user.name)}</AvatarFallback
                           >
                        </Avatar>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent class="w-56" align="end" forceMount>
                     <DropdownMenuLabel class="font-normal">
                        <div class="flex flex-col space-y-1">
                           <p class="text-sm font-medium leading-none">
                              {user.name}
                           </p>
                           <p
                              class="text-xs leading-none text-muted-foreground"
                           >
                              {user.email}
                           </p>
                        </div>
                     </DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>
                        <a href="/dashboard/profile" class="flex items-center">
                           <User class="mr-2 h-4 w-4" />
                           Profile
                        </a>
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <a href="/dashboard/settings" class="flex items-center">
                           <Settings class="mr-2 h-4 w-4" />
                           Settings
                        </a>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onclick={() => handleLogout()}
                        class="text-red-600"
                     >
                        <LogOut class="mr-2 h-4 w-4" />
                        Log out
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      </div>
   </header>

   <!-- Main Content -->
   <main class="flex-1">
      <slot />
   </main>
</div>

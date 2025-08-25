<script lang="ts">
   import { page } from "$app/stores";
   import { USER_ROLES } from "$lib/db/schema/auth-schema";
   import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
   } from "$lib/components/ui/card";
   import { Button } from "$lib/components/ui/button";
   import {
      Building2,
      TrendingUp,
      Users,
      Briefcase,
      Target,
      BarChart3,
      ArrowRight,
   } from "@lucide/svelte";

   export let data: { user: any };

   const { user } = data;

   // Quick action cards based on user role
   $: quickActions = getQuickActions(user.role);

   function getQuickActions(role: string) {
      switch (role) {
         case USER_ROLES.FOUNDER:
            return [
               {
                  title: "My Startup",
                  description: "Manage your startup profile and details",
                  icon: Building2,
                  href: "/dashboard/founder/startup",
                  color: "bg-blue-500",
               },
               {
                  title: "Fundraising",
                  description: "Track your fundraising progress and goals",
                  icon: TrendingUp,
                  href: "/dashboard/founder/fundraising",
                  color: "bg-green-500",
               },
               {
                  title: "Connections",
                  description: "Connect with investors and mentors",
                  icon: Users,
                  href: "/dashboard/founder/connections",
                  color: "bg-purple-500",
               },
            ];
         case USER_ROLES.INVESTOR:
            return [
               {
                  title: "Portfolio",
                  description: "View and manage your investments",
                  icon: Briefcase,
                  href: "/dashboard/investor/portfolio",
                  color: "bg-blue-500",
               },
               {
                  title: "Deals",
                  description: "Track active and potential deals",
                  icon: TrendingUp,
                  href: "/dashboard/investor/deals",
                  color: "bg-green-500",
               },
               {
                  title: "Startups",
                  description: "Discover new investment opportunities",
                  icon: Building2,
                  href: "/dashboard/investor/startups",
                  color: "bg-orange-500",
               },
            ];
         case USER_ROLES.SUPPORT:
            return [
               {
                  title: "Services",
                  description: "Manage your service offerings",
                  icon: Briefcase,
                  href: "/dashboard/support/services",
                  color: "bg-blue-500",
               },
               {
                  title: "Clients",
                  description: "View and manage your client relationships",
                  icon: Users,
                  href: "/dashboard/support/clients",
                  color: "bg-green-500",
               },
               {
                  title: "Projects",
                  description: "Track ongoing and completed projects",
                  icon: Building2,
                  href: "/dashboard/support/projects",
                  color: "bg-purple-500",
               },
            ];
         default:
            return [
               {
                  title: "Complete Profile",
                  description: "Finish setting up your profile to get started",
                  icon: Target,
                  href: "/onboarding",
                  color: "bg-blue-500",
               },
            ];
      }
   }

   function getWelcomeMessage(role: string) {
      switch (role) {
         case USER_ROLES.FOUNDER:
            return "Manage your startup and connect with investors";
         case USER_ROLES.INVESTOR:
            return "Discover startups and manage your investments";
         case USER_ROLES.SUPPORT:
            return "Offer your services and connect with clients";
         default:
            return "Complete your profile to get started";
      }
   }
</script>

<svelte:head>
   <title>Dashboard Overview - StartupConnect</title>
   <meta
      name="description"
      content="Your personalized StartupConnect dashboard overview"
   />
</svelte:head>

<div class="container py-8">
   <div class="max-w-7xl mx-auto">
      <!-- Welcome Header -->
      <div class="mb-8">
         <h1 class="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
         <p class="text-muted-foreground text-lg">
            {getWelcomeMessage(user.role)}
         </p>
      </div>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
         {#each quickActions as action}
            <Card
               class="hover:shadow-lg transition-shadow cursor-pointer group"
            >
               <CardHeader>
                  <div class="flex items-center space-x-3">
                     <div class="p-2 rounded-lg {action.color} text-white">
                        <svelte:component this={action.icon} class="h-5 w-5" />
                     </div>
                     <div>
                        <CardTitle class="text-lg">{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent>
                  <a
                     href={action.href}
                     class="flex items-center justify-center"
                  >
                     <Button
                        variant="outline"
                        class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                     >
                        Get Started
                        <ArrowRight class="ml-2 h-4 w-4" />
                     </Button>
                  </a>
               </CardContent>
            </Card>
         {/each}
      </div>

      <!-- Recent Activity Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <!-- Recent Activity -->
         <Card>
            <CardHeader>
               <CardTitle class="flex items-center space-x-2">
                  <BarChart3 class="h-5 w-5" />
                  <span>Recent Activity</span>
               </CardTitle>
               <CardDescription
                  >Your latest activities and updates</CardDescription
               >
            </CardHeader>
            <CardContent>
               <div class="space-y-4">
                  <div
                     class="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"
                  >
                     <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                     <span class="text-sm text-muted-foreground">
                        Profile updated successfully
                     </span>
                  </div>
                  <div
                     class="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"
                  >
                     <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                     <span class="text-sm text-muted-foreground">
                        New connection request received
                     </span>
                  </div>
                  <div
                     class="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"
                  >
                     <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                     <span class="text-sm text-muted-foreground">
                        Dashboard accessed
                     </span>
                  </div>
               </div>
            </CardContent>
         </Card>

         <!-- Quick Stats -->
         <Card>
            <CardHeader>
               <CardTitle>Quick Stats</CardTitle>
               <CardDescription>Your current status and metrics</CardDescription
               >
            </CardHeader>
            <CardContent>
               <div class="space-y-4">
                  <div class="flex justify-between items-center">
                     <span class="text-sm text-muted-foreground"
                        >Profile Completion</span
                     >
                     <span class="text-sm font-medium">85%</span>
                  </div>
                  <div class="w-full bg-muted rounded-full h-2">
                     <div
                        class="bg-primary h-2 rounded-full"
                        style="width: 85%"
                     ></div>
                  </div>

                  <div class="flex justify-between items-center">
                     <span class="text-sm text-muted-foreground"
                        >Connections</span
                     >
                     <span class="text-sm font-medium">12</span>
                  </div>

                  <div class="flex justify-between items-center">
                     <span class="text-sm text-muted-foreground"
                        >Last Login</span
                     >
                     <span class="text-sm font-medium">Today</span>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   </div>
</div>

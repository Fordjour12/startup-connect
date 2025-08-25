<script lang="ts">
  import { page } from "$app/stores";
  import { authClient } from "$lib/auth-client";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { USER_ROLES } from "$lib/db/schema/auth-schema";

  // Role-based dashboard components
  import FounderDashboard from "./components/FounderDashboard.svelte";
  import InvestorDashboard from "./components/InvestorDashboard.svelte";
  import SupportDashboard from "./components/SupportDashboard.svelte";
  import DefaultDashboard from "./components/DefaultDashboard.svelte";

  let user: any = null;
  let loading = true;

  onMount(async () => {
    try {
      const session = await authClient.getSession();
      if (!session) {
        goto("/login");
        return;
      }

      user = session.data?.user;
      loading = false;
    } catch (error) {
      console.error("Error fetching user session:", error);
      goto("/login");
    }
  });

  // Helper function to get role-specific dashboard component
  function getDashboardComponent() {
    if (!user) return null;

    switch (user.role) {
      case USER_ROLES.FOUNDER:
        return FounderDashboard;
      case USER_ROLES.INVESTOR:
        return InvestorDashboard;
      case USER_ROLES.SUPPORT:
        return SupportDashboard;
      default:
        return DefaultDashboard;
    }
  }
</script>

<svelte:head>
  <title>Dashboard - StartupConnect</title>
  <meta
    name="description"
    content="Your personalized StartupConnect dashboard"
  />
</svelte:head>

{#if loading}
  <div class="container py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
        ></div>
        <span class="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    </div>
  </div>
{:else if user}
  <div class="container py-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p class="text-muted-foreground">
              {user.role === USER_ROLES.FOUNDER &&
                "Manage your startup and connect with investors"}
              {user.role === USER_ROLES.INVESTOR &&
                "Discover startups and manage your investments"}
              {user.role === USER_ROLES.SUPPORT &&
                "Offer your services and connect with clients"}
              {user.role === USER_ROLES.USER &&
                "Complete your profile to get started"}
              {user.role === USER_ROLES.MODERATOR &&
                "Moderate the platform and manage users"}
              {user.role === USER_ROLES.ADMIN &&
                "Administer the platform and manage all users"}
            </p>
          </div>

          <!-- Role Badge -->
          <div class="flex items-center space-x-2">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <!-- Role-specific Dashboard Content -->
      {#if getDashboardComponent()}
        <svelte:component this={getDashboardComponent()} {user} />
      {:else}
        <DefaultDashboard {user} />
      {/if}
    </div>
  </div>
{:else}
  <div class="container py-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2">Access Denied</h1>
        <p class="text-muted-foreground mb-4">
          Please log in to access your dashboard
        </p>
        <a
          href="/login"
          class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Go to Login
        </a>
      </div>
    </div>
  </div>
{/if}

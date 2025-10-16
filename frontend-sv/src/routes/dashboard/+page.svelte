<script lang="ts">
   import { goto } from "$app/navigation";
   import { onMount } from "svelte";
   import { USER_ROLES } from "$lib/db/schema/auth-schema";

   let { data } = $props<{ data: { user: any } }>();

   const { user } = data;

   // Welcome screen state
   let welcomeOpacity = $state(0);
   let welcomeScale = $state(0.8);
   let countdown = $state(5);

   onMount(() => {
      // Animate welcome screen in
      setTimeout(() => {
         welcomeOpacity = 1;
         welcomeScale = 1;
      }, 100);

      // Start countdown and redirect
      const timer = setInterval(() => {
         countdown--;
         if (countdown <= 0) {
            clearInterval(timer);
            // Animate out
            welcomeOpacity = 0;
            welcomeScale = 0.8;
            setTimeout(() => {
               redirectToRoleDashboard();
            }, 300);
         }
      }, 1000);
   });

   function redirectToRoleDashboard() {
      switch (user.role) {
         case USER_ROLES.FOUNDER:
            goto("/dashboard/founder");
            break;
         case USER_ROLES.INVESTOR:
            goto("/dashboard/investor");
            break;
         case USER_ROLES.SUPPORT:
            goto("/dashboard/support");
            break;
         default:
            goto("/onboarding");
      }
   }
</script>

<svelte:head>
   <title>Welcome - StartupConnect</title>
</svelte:head>

<!-- Animated Welcome Screen -->
<div
   class="fixed inset-0 bg-gradient-to-br from-primary/50 via-background to-secondary/50 flex items-center justify-center z-50"
   style="opacity: {welcomeOpacity}; transform: scale({welcomeScale}); transition: all 0.3s ease-out;"
>
   <div class="text-center space-y-6">
      <!-- Logo -->
      <div class="mb-8 animate-bounce">
         <img src="/logo.svg" alt="StartupConnect" class="size-24 mx-auto" />
      </div>

      <!-- Welcome Text -->
      <div class="space-y-4">
         <h1
            class="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse"
         >
            Welcome!
         </h1>
         <p class="text-2xl text-muted-foreground">
            Hello, <span class="font-semibold text-foreground">{user.name}</span
            >
         </p>
         <p class="text-lg text-muted-foreground">
            Redirecting to your {user.role?.toLowerCase()} dashboard in...
         </p>
      </div>

      <!-- Countdown -->
      <div class="text-4xl font-bold text-primary">
         {countdown}
      </div>

      <!-- Skip Button -->
      <button
         onclick={() => {
            welcomeOpacity = 0;
            welcomeScale = 0.8;
            setTimeout(() => {
               redirectToRoleDashboard();
            }, 300);
         }}
         class="px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
         Skip
      </button>
   </div>
</div>

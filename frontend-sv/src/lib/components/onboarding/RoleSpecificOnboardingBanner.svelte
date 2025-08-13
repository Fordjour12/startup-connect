<script lang="ts">
    import { Button } from "@/components/ui/button";
    import { USER_ROLES } from "@/db/schema/auth-schema";
    import { browser } from "$app/environment";

    interface User {
        id: string;
        name: string;
        email: string;
        role: string;
    }

    let user = $state<User | null>(null);
    let isLoggedIn = $state<boolean>(false);

    let showBanner = $state(false);

    $effect(() => {
        if (isLoggedIn && user && browser) {
            // Check if user has already completed role-specific onboarding
            const onboardingStatus = localStorage.getItem(
                `role_onboarding_${user.role}_${user.id}`,
            );

            // Show banner for investors and supporters who haven't completed role-specific onboarding
            if (
                (user.role === USER_ROLES.INVESTOR ||
                    user.role === USER_ROLES.SUPPORT) &&
                onboardingStatus !== "completed"
            ) {
                // Additional check: In a real implementation, you might want to verify with the server
                // whether the user has completed their role-specific onboarding
                showBanner = true;
            }
        }
    });

    function dismissBanner() {
        showBanner = false;
        // Store in localStorage so the user doesn't see it again
        if (user && browser) {
            localStorage.setItem(
                `role_onboarding_${user.role}_${user.id}`,
                "dismissed",
            );
        }
    }
</script>

{#if showBanner}
    <div
        class="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
    >
        <div
            class="container mx-auto px-4 py-3 flex items-center justify-between"
        >
            <div class="flex items-center space-x-3">
                <div class="bg-white/20 p-2 rounded-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold">
                        Complete your role-specific onboarding
                    </h3>
                    <p class="text-sm text-white/90">
                        {#if user?.role === USER_ROLES.INVESTOR}
                            Finish setting up your investor profile to unlock
                            investment opportunities
                        {:else if user?.role === USER_ROLES.SUPPORT}
                            Complete your supporter profile to start offering
                            your services
                        {/if}
                    </p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onclick={() => {
                        // Navigate to role-specific onboarding
                        if (user?.role === USER_ROLES.INVESTOR) {
                            window.location.href = "/onboarding/investor";
                        } else if (user?.role === USER_ROLES.SUPPORT) {
                            window.location.href = "/onboarding/support";
                        }
                    }}
                >
                    Complete Onboarding
                </Button>
                <button
                    type="button"
                    class="text-white/80 hover:text-white focus:outline-none"
                    onclick={dismissBanner}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Add some top margin to the page content when banner is shown */
    :global(.banner-offset) {
        margin-top: 4rem;
    }
</style>

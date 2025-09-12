<script lang="ts">
    import { Button } from "@/components/ui/button";
    import { IconUserCheck, IconLogout } from "@tabler/icons-svelte";
    import { goto } from "$app/navigation";

    let { user } = $props<{
        user: {
            name: string;
            email: string;
            role: string;
            impersonatedBy?: string;
        };
    }>();

    async function stopImpersonation() {
        try {
            const response = await fetch('/api/admin/impersonate', {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                // Redirect back to admin dashboard
                goto('/dashboard/admin');
            } else {
                console.error('Stop impersonation failed:', result.error);
                alert('Failed to stop impersonation: ' + result.error);
            }
        } catch (error) {
            console.error('Stop impersonation error:', error);
            alert('Failed to stop impersonation');
        }
    }

    function getDashboardUrl(role: string): string {
        switch (role) {
            case 'founder':
                return '/dashboard/founder';
            case 'investor':
                return '/dashboard/investor';
            case 'support':
                return '/dashboard/supporter';
            default:
                return '/dashboard';
        }
    }
</script>

{#if user?.impersonatedBy}
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <IconUserCheck class="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                    <p class="text-sm font-medium text-yellow-800">
                        Currently impersonating: <strong>{user.name}</strong> ({user.email})
                    </p>
                    <p class="text-sm text-yellow-700">
                        Role: <strong>{user.role}</strong> | You can navigate as this user
                    </p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <Button 
                    variant="outline" 
                    size="sm"
                    onclick={() => goto(getDashboardUrl(user.role))}
                >
                    Go to {user.role} Dashboard
                </Button>
                <Button variant="outline" size="sm" onclick={stopImpersonation}>
                    <IconLogout class="h-4 w-4 mr-2" />
                    Stop Impersonating
                </Button>
            </div>
        </div>
    </div>
{/if}

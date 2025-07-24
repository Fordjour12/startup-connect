<script lang="ts">
    import "../app.css";
    import { Toaster } from "@/components/ui/sonner";
    import { ModeWatcher } from "mode-watcher";
    let { children } = $props();

    import { authClient } from "@/auth-client";
    const session = authClient.useSession();
</script>

<Toaster />
<ModeWatcher />

<div>
    {#if $session.data}
        <div>
            <p>
                {$session?.data?.user.name}
            </p>
            <button
                onclick={async () => {
                    await authClient.signOut();
                }}
            >
                Sign Out
            </button>
        </div>
    {:else}
        <button
            onclick={async () => {
                await authClient.signIn.social({
                    provider: "github",
                });
            }}
        >
            Continue with GitHub
        </button>
    {/if}
</div>

{@render children?.()}

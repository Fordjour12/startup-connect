<script lang="ts">
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
        DropdownMenuSeparator,
    } from "$lib/components/ui/dropdown-menu";
    import {
        founderNotifications,
        formatTimeAgo,
        getNotificationTypeInfo,
        type FounderNotification,
    } from "$lib/data/founder-notifications";
    import Bell from "@lucide/svelte/icons/bell";

    // Keep only last 5 unread notifications for the dropdown
    let notifications = $derived(
        founderNotifications
            .filter((n) => !n.read)
            .sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime(),
            )
            .slice(0, 5),
    );

    let unreadCount = $derived(notifications.length);

    function getPriorityClass(priority: string): string {
        switch (priority) {
            case "high":
                return "bg-destructive text-destructive-foreground";
            case "medium":
                return "bg-amber-500 text-white";
            case "low":
                return "bg-muted text-muted-foreground";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    }

    function markAsRead(notification: FounderNotification) {
        // In a real app, this would call an API
        notification.read = true;
        // Force reactivity update
        notifications = notifications.filter((n) => !n.read);
    }

    function getShortDescription(description: string): string {
        return description.length > 70
            ? description.substring(0, 70) + "..."
            : description;
    }
</script>

<DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" class="relative">
            <Bell class="h-5 w-5" />
            {#if unreadCount > 0}
                <span
                    class="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center translate-x-1/4 -translate-y-1/4"
                >
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            {/if}
            <span class="sr-only">Notifications</span>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[380px]">
        <div class="flex items-center justify-between p-4">
            <h4 class="font-medium">Notifications</h4>
            {#if unreadCount > 0}
                <Badge variant="secondary">{unreadCount} unread</Badge>
            {/if}
        </div>
        <DropdownMenuSeparator />

        {#if notifications.length === 0}
            <div class="py-6 text-center text-muted-foreground">
                <p>No unread notifications</p>
            </div>
        {:else}
            <div class="max-h-[300px] overflow-y-auto">
                {#each notifications as notification}
                    <DropdownMenuItem
                        class="p-0 focus:bg-transparent cursor-default"
                    >
                        <div class="p-4 w-full hover:bg-muted/50 rounded-md">
                            <div class="flex gap-3">
                                <div
                                    class={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationTypeInfo(notification.type).class}`}
                                >
                                    <span class="text-base"
                                        >{getNotificationTypeInfo(
                                            notification.type,
                                        ).icon}</span
                                    >
                                </div>
                                <div class="flex-1 space-y-1">
                                    <div
                                        class="flex items-center justify-between gap-2"
                                    >
                                        <h5 class="font-medium text-sm">
                                            {notification.title}
                                        </h5>
                                        <span
                                            class="text-xs text-muted-foreground"
                                            >{formatTimeAgo(
                                                notification.timestamp,
                                            )}</span
                                        >
                                    </div>
                                    <p class="text-xs text-muted-foreground">
                                        {getShortDescription(
                                            notification.description,
                                        )}
                                    </p>
                                    <div
                                        class="flex items-center justify-between mt-2"
                                    >
                                        {#if notification.actionRequired}
                                            <a
                                                href={notification.actionUrl}
                                                class="text-xs text-primary hover:underline"
                                            >
                                                {notification.actionText}
                                            </a>
                                        {:else}
                                            <span></span>
                                        {/if}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            class="h-7 text-xs"
                                            onclick={() =>
                                                markAsRead(notification)}
                                        >
                                            Mark as read
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DropdownMenuItem>
                {/each}
            </div>
        {/if}

        <div>
            <a
                href="/dashboard/founder/notifications"
                class="block w-full text-center py-2 text-sm text-primary hover:underline"
            >
                View all notifications
            </a>
        </div>
    </DropdownMenuContent>
</DropdownMenu>

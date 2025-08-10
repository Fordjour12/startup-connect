<script lang="ts">
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
    } from "$lib/components/ui/select";
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
    } from "$lib/components/ui/dropdown-menu";
    import {
        Tabs,
        TabsContent,
        TabsList,
        TabsTrigger,
    } from "$lib/components/ui/tabs";
    import {
        formatTimeAgo,
        getNotificationTypeInfo,
        groupNotificationsByDate,
        type FounderNotification,
    } from "$lib/data/founder-notifications";
    import type { PageData } from "./$types";

    // Icons
    import Search from "@lucide/svelte/icons/search";
    import FilterIcon from "@lucide/svelte/icons/filter";
    import MoreHorizontal from "@lucide/svelte/icons/more-horizontal";
    import ArrowLeft from "@lucide/svelte/icons/arrow-left";

    // Get server-loaded data with props
    let { data }: { data: PageData } = $props();

    // Initialize reactive state from server data
    let notifications = $state(data.notifications);
    let stats = $state(data.stats);

    // State for search and filters
    let searchQuery = $state("");
    let selectedPriority = $state("all");
    let selectedType = $state("all");
    let selectedReadStatus = $state("all");

    // Computed filtered notifications
    let filteredNotifications = $derived(
        notifications
            .filter((notification) => {
                // Search filter
                if (
                    searchQuery &&
                    !notification.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) &&
                    !notification.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                ) {
                    return false;
                }

                // Priority filter
                if (
                    selectedPriority !== "all" &&
                    notification.priority !== selectedPriority
                ) {
                    return false;
                }

                // Type filter
                if (
                    selectedType !== "all" &&
                    notification.type !== selectedType
                ) {
                    return false;
                }

                // Read status filter
                if (
                    (selectedReadStatus === "read" && !notification.read) ||
                    (selectedReadStatus === "unread" && notification.read)
                ) {
                    return false;
                }

                return true;
            })
            .sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime(),
            ),
    );

    // Group notifications by date for display
    let groupedNotifications = $derived(
        groupNotificationsByDate(filteredNotifications),
    );

    // Function to mark a notification as read
    function markAsRead(notification: FounderNotification) {
        const index = notifications.findIndex((n) => n.id === notification.id);
        if (index !== -1 && !notifications[index].read) {
            notifications[index].read = true;
            // Update stats
            stats.unread -= 1;
        }
    }

    // Function to mark all notifications as read
    function markAllAsRead() {
        notifications = notifications.map((notification) => {
            if (!notification.read) {
                return { ...notification, read: true };
            }
            return notification;
        });

        // Update stats
        stats.unread = 0;
    }

    // Function to delete a notification
    function deleteNotification(id: number) {
        const notification = notifications.find((n) => n.id === id);
        const wasUnread = notification && !notification.read;

        notifications = notifications.filter((n) => n.id !== id);

        // Update stats
        stats.total = notifications.length;
        if (wasUnread) {
            stats.unread = stats.unread - 1;
        }
        stats.highPriority = notifications.filter(
            (n) => n.priority === "high",
        ).length;
        stats.actionRequired = notifications.filter(
            (n) => n.actionRequired,
        ).length;
    }

    // Function to get priority class
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
</script>

<div class="container mx-auto px-4 py-8">
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
    >
        <div>
            <div class="flex items-center gap-3">
                <a
                    href="/dashboard/founder"
                    class="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Button variant="ghost" size="sm" class="gap-1">
                        <ArrowLeft class="h-4 w-4" />
                        <span>Back to Dashboard</span>
                    </Button>
                </a>
            </div>
            <h1 class="text-3xl font-bold mt-2">Notifications</h1>
            <p class="text-muted-foreground mt-1">
                Stay updated with your startup activities and important events
            </p>
        </div>
        <Button
            variant="outline"
            onclick={() => markAllAsRead()}
            class="mt-4 md:mt-0"
            disabled={stats.unread === 0}
        >
            Mark all as read
        </Button>
    </div>

    <!-- Notification Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
            <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium"
                    >Total Notifications</CardTitle
                >
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{stats.total}</div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium">Unread</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{stats.unread}</div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{stats.highPriority}</div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium"
                    >Action Required</CardTitle
                >
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{stats.actionRequired}</div>
            </CardContent>
        </Card>
    </div>

    <!-- Filter and Search Bar -->
    <div
        class="mb-6 gap-4 flex flex-col md:flex-row items-start md:items-center"
    >
        <div class="relative w-full md:w-72">
            <Search
                class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
                type="text"
                placeholder="Search notifications..."
                class="pl-9"
                bind:value={searchQuery}
            />
        </div>

        <div class="flex flex-1 gap-2 flex-col sm:flex-row w-full">
            <div class="flex-1">
                <!-- bind:value={selectedPriority} -->
                <Select type="multiple" >
                    <SelectTrigger class="w-full">
                        Filter by priority />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class="flex-1">
                <Select type="single" bind:value={selectedType}>
                    <SelectTrigger class="w-full">
                        Filter by type />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="investor_update"
                            >Investor Updates</SelectItem
                        >
                        <SelectItem value="funding_opportunity"
                            >Funding Opportunities</SelectItem
                        >
                        <SelectItem value="customer_feedback"
                            >Customer Feedback</SelectItem
                        >
                        <SelectItem value="team_update">Team Updates</SelectItem
                        >
                        <SelectItem value="milestone_achieved"
                            >Milestones</SelectItem
                        >
                        <SelectItem value="metric_alert"
                            >Metric Alerts</SelectItem
                        >
                        <SelectItem value="document_shared"
                            >Documents</SelectItem
                        >
                        <SelectItem value="meeting_scheduled"
                            >Meetings</SelectItem
                        >
                        <SelectItem value="task_assigned"
                            >Tasks Assigned</SelectItem
                        >
                        <SelectItem value="task_completed"
                            >Tasks Completed</SelectItem
                        >
                        <SelectItem value="feature_request"
                            >Feature Requests</SelectItem
                        >
                    </SelectContent>
                </Select>
            </div>

            <div class="flex-1">
                <Select type="single" bind:value={selectedReadStatus}>
                    <SelectTrigger class="w-full">
                        Filter by status />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <Button variant="outline" size="icon" class="hidden md:flex">
            <FilterIcon class="h-4 w-4" />
            <span class="sr-only">Filter</span>
        </Button>
    </div>

    <!-- Notification Tabs and List -->
    <Tabs value="all" class="mb-6">
        <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="action">Action Required</TabsTrigger>
        </TabsList>

        <TabsContent value="all" class="mt-4">
            {#if filteredNotifications.length > 0}
                <div class="space-y-8">
                    {#each Object.keys(groupedNotifications) as group}
                        <div>
                            <h3
                                class="mb-4 text-lg font-semibold text-muted-foreground"
                            >
                                {group}
                            </h3>
                            <div class="space-y-3">
                                {#each groupedNotifications[group] as notification}
                                    <Card
                                        class={notification.read
                                            ? "opacity-80"
                                            : "shadow-md"}
                                    >
                                        <div class="p-4 flex items-start">
                                            <!-- Left: Type icon -->
                                            <div class="mr-4 flex-shrink-0">
                                                <div
                                                    class={`h-10 w-10 rounded-full flex items-center justify-center ${getNotificationTypeInfo(notification.type).class}`}
                                                >
                                                    <span class="text-lg"
                                                        >{getNotificationTypeInfo(
                                                            notification.type,
                                                        ).icon}</span
                                                    >
                                                </div>
                                            </div>

                                            <!-- Middle: Content -->
                                            <div class="flex-1">
                                                <div
                                                    class="flex items-center mb-1"
                                                >
                                                    <h4 class="font-semibold">
                                                        {notification.title}
                                                        {#if !notification.read}
                                                            <span
                                                                class="ml-2 inline-block h-2 w-2 rounded-full bg-blue-600"
                                                            ></span>
                                                        {/if}
                                                    </h4>
                                                </div>

                                                {#if notification.relatedEntity}
                                                    <div
                                                        class="text-sm font-medium mb-1"
                                                    >
                                                        {notification
                                                            .relatedEntity.name}
                                                    </div>
                                                {/if}

                                                <p
                                                    class="text-sm text-muted-foreground mb-2"
                                                >
                                                    {notification.description}
                                                </p>

                                                <div
                                                    class="flex items-center gap-2 flex-wrap mt-2"
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        class={getPriorityClass(
                                                            notification.priority,
                                                        )}
                                                    >
                                                        {notification.priority
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            notification.priority.slice(
                                                                1,
                                                            )}
                                                    </Badge>

                                                    <Badge
                                                        variant="outline"
                                                        class={getNotificationTypeInfo(
                                                            notification.type,
                                                        ).class}
                                                    >
                                                        {notification.type
                                                            .split("_")
                                                            .map(
                                                                (word) =>
                                                                    word
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase() +
                                                                    word.slice(
                                                                        1,
                                                                    ),
                                                            )
                                                            .join(" ")}
                                                    </Badge>

                                                    <span
                                                        class="text-xs text-muted-foreground ml-auto"
                                                    >
                                                        {formatTimeAgo(
                                                            notification.timestamp,
                                                        )}
                                                    </span>
                                                </div>

                                                {#if notification.actionRequired}
                                                    <div class="mt-3">
                                                        <a
                                                            href={notification.actionUrl}
                                                        >
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                            >
                                                                {notification.actionText}
                                                            </Button>
                                                        </a>
                                                    </div>
                                                {/if}
                                            </div>

                                            <!-- Right: Actions -->
                                            <div class="ml-2 flex-shrink-0">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            class="h-8 w-8"
                                                        >
                                                            <span
                                                                class="sr-only"
                                                                >Open menu</span
                                                            >
                                                            <MoreHorizontal
                                                                class="h-4 w-4"
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                    >
                                                        {#if !notification.read}
                                                            <DropdownMenuItem
                                                                onclick={() =>
                                                                    markAsRead(
                                                                        notification,
                                                                    )}
                                                            >
                                                                Mark as read
                                                            </DropdownMenuItem>
                                                        {/if}
                                                        <DropdownMenuItem
                                                            onclick={() =>
                                                                deleteNotification(
                                                                    notification.id,
                                                                )}
                                                            class="text-destructive focus:text-destructive"
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </Card>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-12 text-center">
                    <h3 class="text-lg font-medium">No notifications found</h3>
                    <p class="text-muted-foreground mt-1">
                        Try adjusting your filters or search criteria
                    </p>
                </div>
            {/if}
        </TabsContent>

        <TabsContent value="unread" class="mt-4">
            <div class="space-y-3">
                {#each notifications.filter((n) => !n.read) as notification}
                    <Card class="shadow-md">
                        <div class="p-4 flex items-start">
                            <!-- Left: Type icon -->
                            <div class="mr-4 flex-shrink-0">
                                <div
                                    class={`h-10 w-10 rounded-full flex items-center justify-center ${getNotificationTypeInfo(notification.type).class}`}
                                >
                                    <span class="text-lg"
                                        >{getNotificationTypeInfo(
                                            notification.type,
                                        ).icon}</span
                                    >
                                </div>
                            </div>

                            <!-- Middle: Content -->
                            <div class="flex-1">
                                <div class="flex items-center mb-1">
                                    <h4 class="font-semibold">
                                        {notification.title}
                                        <span
                                            class="ml-2 inline-block h-2 w-2 rounded-full bg-blue-600"
                                        ></span>
                                    </h4>
                                </div>

                                {#if notification.relatedEntity}
                                    <div class="text-sm font-medium mb-1">
                                        {notification.relatedEntity.name}
                                    </div>
                                {/if}

                                <p class="text-sm text-muted-foreground mb-2">
                                    {notification.description}
                                </p>

                                <div
                                    class="flex items-center gap-2 flex-wrap mt-2"
                                >
                                    <Badge
                                        variant="outline"
                                        class={getPriorityClass(
                                            notification.priority,
                                        )}
                                    >
                                        {notification.priority
                                            .charAt(0)
                                            .toUpperCase() +
                                            notification.priority.slice(1)}
                                    </Badge>

                                    <Badge
                                        variant="outline"
                                        class={getNotificationTypeInfo(
                                            notification.type,
                                        ).class}
                                    >
                                        {notification.type
                                            .split("_")
                                            .map(
                                                (word) =>
                                                    word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    word.slice(1),
                                            )
                                            .join(" ")}
                                    </Badge>

                                    <span
                                        class="text-xs text-muted-foreground ml-auto"
                                    >
                                        {formatTimeAgo(notification.timestamp)}
                                    </span>
                                </div>

                                {#if notification.actionRequired}
                                    <div class="mt-3">
                                        <a href={notification.actionUrl}>
                                            <Button variant="default" size="sm">
                                                {notification.actionText}
                                            </Button>
                                        </a>
                                    </div>
                                {/if}
                            </div>

                            <!-- Right: Actions -->
                            <div class="ml-2 flex-shrink-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            class="h-8 w-8"
                                        >
                                            <span class="sr-only"
                                                >Open menu</span
                                            >
                                            <MoreHorizontal class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onclick={() =>
                                                markAsRead(notification)}
                                        >
                                            Mark as read
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onclick={() =>
                                                deleteNotification(
                                                    notification.id,
                                                )}
                                            class="text-destructive focus:text-destructive"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </Card>
                {/each}

                {#if notifications.filter((n) => !n.read).length === 0}
                    <div class="py-12 text-center">
                        <h3 class="text-lg font-medium">
                            No unread notifications
                        </h3>
                        <p class="text-muted-foreground mt-1">
                            You're all caught up!
                        </p>
                    </div>
                {/if}
            </div>
        </TabsContent>

        <TabsContent value="action" class="mt-4">
            <div class="space-y-3">
                {#each notifications.filter((n) => n.actionRequired) as notification}
                    <Card
                        class={notification.read ? "opacity-80" : "shadow-md"}
                    >
                        <div class="p-4 flex items-start">
                            <!-- Left: Type icon -->
                            <div class="mr-4 flex-shrink-0">
                                <div
                                    class={`h-10 w-10 rounded-full flex items-center justify-center ${getNotificationTypeInfo(notification.type).class}`}
                                >
                                    <span class="text-lg"
                                        >{getNotificationTypeInfo(
                                            notification.type,
                                        ).icon}</span
                                    >
                                </div>
                            </div>

                            <!-- Middle: Content -->
                            <div class="flex-1">
                                <div class="flex items-center mb-1">
                                    <h4 class="font-semibold">
                                        {notification.title}
                                        {#if !notification.read}
                                            <span
                                                class="ml-2 inline-block h-2 w-2 rounded-full bg-blue-600"
                                            ></span>
                                        {/if}
                                    </h4>
                                </div>

                                {#if notification.relatedEntity}
                                    <div class="text-sm font-medium mb-1">
                                        {notification.relatedEntity.name}
                                    </div>
                                {/if}

                                <p class="text-sm text-muted-foreground mb-2">
                                    {notification.description}
                                </p>

                                <div
                                    class="flex items-center gap-2 flex-wrap mt-2"
                                >
                                    <Badge
                                        variant="outline"
                                        class={getPriorityClass(
                                            notification.priority,
                                        )}
                                    >
                                        {notification.priority
                                            .charAt(0)
                                            .toUpperCase() +
                                            notification.priority.slice(1)}
                                    </Badge>

                                    <Badge
                                        variant="outline"
                                        class={getNotificationTypeInfo(
                                            notification.type,
                                        ).class}
                                    >
                                        {notification.type
                                            .split("_")
                                            .map(
                                                (word) =>
                                                    word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    word.slice(1),
                                            )
                                            .join(" ")}
                                    </Badge>

                                    <span
                                        class="text-xs text-muted-foreground ml-auto"
                                    >
                                        {formatTimeAgo(notification.timestamp)}
                                    </span>
                                </div>

                                <div class="mt-3">
                                    <a href={notification.actionUrl}>
                                        <Button variant="default" size="sm">
                                            {notification.actionText}
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            <!-- Right: Actions -->
                            <div class="ml-2 flex-shrink-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            class="h-8 w-8"
                                        >
                                            <span class="sr-only"
                                                >Open menu</span
                                            >
                                            <MoreHorizontal class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {#if !notification.read}
                                            <DropdownMenuItem
                                                onclick={() =>
                                                    markAsRead(notification)}
                                            >
                                                Mark as read
                                            </DropdownMenuItem>
                                        {/if}
                                        <DropdownMenuItem
                                            onclick={() =>
                                                deleteNotification(
                                                    notification.id,
                                                )}
                                            class="text-destructive focus:text-destructive"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </Card>
                {/each}

                {#if notifications.filter((n) => n.actionRequired).length === 0}
                    <div class="py-12 text-center">
                        <h3 class="text-lg font-medium">No actions required</h3>
                        <p class="text-muted-foreground mt-1">
                            You have no pending tasks to complete
                        </p>
                    </div>
                {/if}
            </div>
        </TabsContent>
    </Tabs>
</div>

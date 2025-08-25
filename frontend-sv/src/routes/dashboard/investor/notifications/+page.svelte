<script lang="ts">
   import { Badge } from "$lib/components/ui/badge";
   import { Button } from "$lib/components/ui/button";
   import {
      Card,
      CardContent,
      CardHeader,
      CardTitle,
   } from "$lib/components/ui/card";
   import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
   } from "$lib/components/ui/dropdown-menu";
   import { Input } from "$lib/components/ui/input";
   import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
   } from "$lib/components/ui/select";
   import {
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
   } from "$lib/components/ui/tabs";
   import { formatDate } from "$lib/utils";
   import type { PageData } from "./$types";

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
   let filteredNotifications = $derived(() => {
      return notifications.filter((notification) => {
         // Apply search filter
         const matchesSearch =
            searchQuery === "" ||
            notification.title
               .toLowerCase()
               .includes(searchQuery.toLowerCase()) ||
            notification.description
               ?.toLowerCase()
               .includes(searchQuery.toLowerCase()) ||
            notification.company
               ?.toLowerCase()
               .includes(searchQuery.toLowerCase());

         // Apply priority filter
         const matchesPriority =
            selectedPriority === "all" ||
            notification.priority === selectedPriority;

         // Apply type filter
         const matchesType =
            selectedType === "all" || notification.type === selectedType;

         // Apply read status filter
         const matchesReadStatus =
            selectedReadStatus === "all" ||
            (selectedReadStatus === "read" && notification.read) ||
            (selectedReadStatus === "unread" && !notification.read);

         return (
            matchesSearch && matchesPriority && matchesType && matchesReadStatus
         );
      });
   });

   // Derive notification counts for different types
   let typeCounts = $derived(() => {
      const counts = {} as Record<string, number>;
      notifications.forEach((notification) => {
         counts[notification.type] = (counts[notification.type] || 0) + 1;
      });
      return counts;
   });

   // Function to mark a notification as read
   function markAsRead(id: number) {
      notifications = notifications.map((n) =>
         n.id === id ? { ...n, read: true } : n,
      );

      // Update stats
      stats.unread = notifications.filter((n) => !n.read).length;
   }

   // Function to mark all as read
   function markAllAsRead() {
      notifications = notifications.map((n) => ({ ...n, read: true }));
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

   // Function to get type icon and class
   function getTypeInfo(type: string): { icon: string; class: string } {
      switch (type) {
         case "startup_update":
            return {
               icon: "📊",
               class: "bg-emerald-100 text-emerald-800 border-emerald-300",
            };
         case "funding_opportunity":
            return {
               icon: "💰",
               class: "bg-blue-100 text-blue-800 border-blue-300",
            };
         case "market_insight":
            return {
               icon: "📈",
               class: "bg-purple-100 text-purple-800 border-purple-300",
            };
         case "meeting_reminder":
            return {
               icon: "📅",
               class: "bg-amber-100 text-amber-800 border-amber-300",
            };
         case "portfolio_update":
            return {
               icon: "📂",
               class: "bg-indigo-100 text-indigo-800 border-indigo-300",
            };
         case "document_share":
            return {
               icon: "📄",
               class: "bg-cyan-100 text-cyan-800 border-cyan-300",
            };
         case "industry_news":
            return {
               icon: "📰",
               class: "bg-rose-100 text-rose-800 border-rose-300",
            };
         case "system_notification":
            return {
               icon: "⚙️",
               class: "bg-gray-100 text-gray-800 border-gray-300",
            };
         default:
            return {
               icon: "🔔",
               class: "bg-secondary text-secondary-foreground",
            };
      }
   }

   // Function to format timestamp
   function formatTimeAgo(timestamp: string): string {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 7) {
         return formatDate(timestamp);
      } else if (diffDays > 0) {
         return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      } else if (diffHours > 0) {
         return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else if (diffMins > 0) {
         return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      } else {
         return "Just now";
      }
   }

   // Group notifications by date
   let groupedNotifications = $derived(() => {
      const groups: Record<string, typeof filteredNotifications> = {};

      filteredNotifications.forEach((notification) => {
         const date = new Date(notification.timestamp);
         const today = new Date();
         const yesterday = new Date(today);
         yesterday.setDate(yesterday.getDate() - 1);

         let groupName: string;

         if (date.toDateString() === today.toDateString()) {
            groupName = "Today";
         } else if (date.toDateString() === yesterday.toDateString()) {
            groupName = "Yesterday";
         } else {
            // Group by week if within last 7 days, otherwise by date
            const diffDays = Math.floor(
               (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
            );

            if (diffDays < 7) {
               groupName = "Earlier this week";
            } else {
               groupName = "Older";
            }
         }

         if (!groups[groupName]) {
            groups[groupName] = [];
         }

         groups[groupName].push(notification);
      });

      // Sort notifications within each group by timestamp (newest first)
      Object.keys(groups).forEach((key) => {
         groups[key] = groups[key].sort(
            (a, b) =>
               new Date(b.timestamp).getTime() -
               new Date(a.timestamp).getTime(),
         );
      });

      return groups;
   });
</script>

<div class="px-4 py-8">
   <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
   >
      <div>
         <h1 class="text-3xl font-bold mb-2">Notifications</h1>
         <p class="text-muted-foreground">
            Stay updated with your portfolio companies and investment
            opportunities
         </p>
      </div>
      <Button
         variant="outline"
         onclick={markAllAsRead}
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
            <CardTitle class="text-sm font-medium">Action Required</CardTitle>
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
      <Input
         placeholder="Search notifications..."
         class="flex-1 max-w-lg"
         bind:value={searchQuery}
      />

      <div
         class="flex flex-col sm:flex-row gap-4 w-full md:w-auto sm:items-center"
      >
         <Select bind:value={selectedPriority}>
            <SelectTrigger class="w-full sm:w-[150px]">Priority</SelectTrigger>
            <SelectContent>
               <SelectItem value="all">All Priorities</SelectItem>
               <SelectItem value="high">High</SelectItem>
               <SelectItem value="medium">Medium</SelectItem>
               <SelectItem value="low">Low</SelectItem>
            </SelectContent>
         </Select>

         <Select bind:value={selectedType}>
            <SelectTrigger class="w-full sm:w-[150px]">Type</SelectTrigger>
            <SelectContent>
               <SelectItem value="all">All Types</SelectItem>
               <SelectItem value="startup_update">Startup Updates</SelectItem>
               <SelectItem value="funding_opportunity"
                  >Funding Opportunities</SelectItem
               >
               <SelectItem value="market_insight">Market Insights</SelectItem>
               <SelectItem value="meeting_reminder"
                  >Meeting Reminders</SelectItem
               >
               <SelectItem value="portfolio_update"
                  >Portfolio Updates</SelectItem
               >
               <SelectItem value="document_share">Documents</SelectItem>
               <SelectItem value="industry_news">Industry News</SelectItem>
               <SelectItem value="system_notification">System</SelectItem>
            </SelectContent>
         </Select>

         <Select bind:value={selectedReadStatus}>
            <SelectTrigger class="w-full sm:w-[150px]">Status</SelectTrigger>
            <SelectContent>
               <SelectItem value="all">All Status</SelectItem>
               <SelectItem value="read">Read</SelectItem>
               <SelectItem value="unread">Unread</SelectItem>
            </SelectContent>
         </Select>
      </div>
   </div>

   <!-- Tabs for different views -->
   <Tabs defaultValue="all" class="mb-6">
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
                                       class={`h-10 w-10 rounded-full flex items-center justify-center ${getTypeInfo(notification.type).class}`}
                                    >
                                       <span class="text-lg"
                                          >{getTypeInfo(notification.type)
                                             .icon}</span
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

                                    {#if notification.company}
                                       <div class="text-sm font-medium mb-1">
                                          {notification.company}
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
                                             notification.priority.slice(1)}
                                       </Badge>

                                       <Badge
                                          variant="outline"
                                          class={getTypeInfo(notification.type)
                                             .class}
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
                                          {formatTimeAgo(
                                             notification.timestamp,
                                          )}
                                       </span>
                                    </div>

                                    {#if notification.actionRequired}
                                       <div class="mt-3">
                                          <a href={notification.actionUrl}>
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
                                             <span class="sr-only"
                                                >Open menu</span
                                             >
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="h-4 w-4"
                                             >
                                                <circle cx="12" cy="12" r="1" />
                                                <circle cx="12" cy="5" r="1" />
                                                <circle cx="12" cy="19" r="1" />
                                             </svg>
                                          </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent align="end">
                                          {#if !notification.read}
                                             <DropdownMenuItem
                                                onclick={() =>
                                                   markAsRead(notification.id)}
                                             >
                                                Mark as read
                                             </DropdownMenuItem>
                                          {/if}
                                          <DropdownMenuItem
                                             onclick={() =>
                                                deleteNotification(
                                                   notification.id,
                                                )}
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
            <div class="text-center py-12">
               <div
                  class="bg-muted rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     class="h-10 w-10 text-muted-foreground"
                  >
                     <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                     <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
               </div>
               <h3 class="text-lg font-medium">No notifications found</h3>
               <p class="text-muted-foreground mt-2">
                  Try adjusting your filters or search criteria.
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
                           class={`h-10 w-10 rounded-full flex items-center justify-center ${getTypeInfo(notification.type).class}`}
                        >
                           <span class="text-lg"
                              >{getTypeInfo(notification.type).icon}</span
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

                        {#if notification.company}
                           <div class="text-sm font-medium mb-1">
                              {notification.company}
                           </div>
                        {/if}

                        <p class="text-sm text-muted-foreground mb-2">
                           {notification.description}
                        </p>

                        <div class="flex items-center gap-2 flex-wrap mt-2">
                           <Badge
                              variant="outline"
                              class={getPriorityClass(notification.priority)}
                           >
                              {notification.priority.charAt(0).toUpperCase() +
                                 notification.priority.slice(1)}
                           </Badge>

                           <Badge
                              variant="outline"
                              class={getTypeInfo(notification.type).class}
                           >
                              {notification.type
                                 .split("_")
                                 .map(
                                    (word) =>
                                       word.charAt(0).toUpperCase() +
                                       word.slice(1),
                                 )
                                 .join(" ")}
                           </Badge>

                           <span class="text-xs text-muted-foreground ml-auto">
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
                                 <span class="sr-only">Open menu</span>
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="h-4 w-4"
                                 >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                 </svg>
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                 onclick={() => markAsRead(notification.id)}
                              >
                                 Mark as read
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 onclick={() =>
                                    deleteNotification(notification.id)}
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
               <div class="text-center py-12">
                  <div
                     class="bg-muted rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-10 w-10 text-muted-foreground"
                     >
                        <path d="M18 6 7 17l-5-5" />
                        <path d="m22 10-7.5 7.5L13 16" />
                     </svg>
                  </div>
                  <h3 class="text-lg font-medium">All caught up!</h3>
                  <p class="text-muted-foreground mt-2">
                     You have no unread notifications.
                  </p>
               </div>
            {/if}
         </div>
      </TabsContent>

      <TabsContent value="action" class="mt-4">
         <div class="space-y-3">
            {#each notifications.filter((n) => n.actionRequired) as notification}
               <Card class={notification.read ? "opacity-80" : "shadow-md"}>
                  <div class="p-4 flex items-start">
                     <!-- Left: Type icon -->
                     <div class="mr-4 flex-shrink-0">
                        <div
                           class={`h-10 w-10 rounded-full flex items-center justify-center ${getTypeInfo(notification.type).class}`}
                        >
                           <span class="text-lg"
                              >{getTypeInfo(notification.type).icon}</span
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

                        {#if notification.company}
                           <div class="text-sm font-medium mb-1">
                              {notification.company}
                           </div>
                        {/if}

                        <p class="text-sm text-muted-foreground mb-2">
                           {notification.description}
                        </p>

                        <div class="flex items-center gap-2 flex-wrap mt-2">
                           <Badge
                              variant="outline"
                              class={getPriorityClass(notification.priority)}
                           >
                              {notification.priority.charAt(0).toUpperCase() +
                                 notification.priority.slice(1)}
                           </Badge>

                           <Badge
                              variant="outline"
                              class={getTypeInfo(notification.type).class}
                           >
                              {notification.type
                                 .split("_")
                                 .map(
                                    (word) =>
                                       word.charAt(0).toUpperCase() +
                                       word.slice(1),
                                 )
                                 .join(" ")}
                           </Badge>

                           <span class="text-xs text-muted-foreground ml-auto">
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
                                 <span class="sr-only">Open menu</span>
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="h-4 w-4"
                                 >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                 </svg>
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              {#if !notification.read}
                                 <DropdownMenuItem
                                    onclick={() => markAsRead(notification.id)}
                                 >
                                    Mark as read
                                 </DropdownMenuItem>
                              {/if}
                              <DropdownMenuItem
                                 onclick={() =>
                                    deleteNotification(notification.id)}
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
               <div class="text-center py-12">
                  <div
                     class="bg-muted rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-10 w-10 text-muted-foreground"
                     >
                        <path d="M18 6 7 17l-5-5" />
                        <path d="m22 10-7.5 7.5L13 16" />
                     </svg>
                  </div>
                  <h3 class="text-lg font-medium">No actions required</h3>
                  <p class="text-muted-foreground mt-2">
                     You have no notifications requiring action.
                  </p>
               </div>
            {/if}
         </div>
      </TabsContent>
   </Tabs>
</div>

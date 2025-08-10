<!-- Collaboration & Communication Dashboard -->
<script lang="ts">
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { Tabs, TabsList, TabsTrigger, TabsContent } from "$lib/components/ui/tabs";
    import { Badge } from "$lib/components/ui/badge";
    import * as Avatar from "$lib/components/ui/avatar";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { Progress } from "$lib/components/ui/progress";
    import type { PageData } from './$types';
    
    // Icons
    import ArrowLeft from "@lucide/svelte/icons/arrow-left";
    import Clock from "@lucide/svelte/icons/clock";
    import Users from "@lucide/svelte/icons/users";
    import Mail from "@lucide/svelte/icons/mail";
    import MessageSquare from "@lucide/svelte/icons/message-square";
    import FileText from "@lucide/svelte/icons/file-text";
    import CheckCircle2 from "@lucide/svelte/icons/check-circle-2";
    import Calendar from "@lucide/svelte/icons/calendar";
    import TrendingUp from "@lucide/svelte/icons/trending-up";
    import AlertCircle from "@lucide/svelte/icons/alert-circle";
    import Plus from "@lucide/svelte/icons/plus";
    import Edit3 from "@lucide/svelte/icons/edit-3";
    import Send from "@lucide/svelte/icons/send";
    import UserPlus from "@lucide/svelte/icons/user-plus";
    import Briefcase from "@lucide/svelte/icons/briefcase";

    // Page data
    let { data } = $props<{ data: PageData }>();
    
    // Active tab state
    let activeTab = $state("updates");
    
    // Loading state
    let isLoading = $state(true);
    
    onMount(() => {
        setTimeout(() => {
            isLoading = false;
        }, 500);
    });

    // Format date to readable string
    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Format time from HH:MM to 12-hour format
    function formatTime(time: string): string {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

    // Get status badge class
    function getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'draft':
                return 'bg-amber-500/10 text-amber-500';
            case 'scheduled':
                return 'bg-blue-500/10 text-blue-500';
            case 'sent':
                return 'bg-green-500/10 text-green-500';
            case 'in-progress':
                return 'bg-purple-500/10 text-purple-500';
            case 'implemented':
                return 'bg-green-500/10 text-green-500';
            case 'pending':
                return 'bg-amber-500/10 text-amber-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    }

    // Get priority badge class
    function getPriorityClass(priority: string): string {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-500/10 text-red-500';
            case 'medium':
                return 'bg-amber-500/10 text-amber-500';
            case 'low':
                return 'bg-green-500/10 text-green-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    }
</script>

<div class="container max-w-7xl py-6 space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-5 duration-500">
        <div>
            <div class="flex items-center gap-3">
                <a href="/dashboard/founder" class="text-muted-foreground hover:text-foreground transition-colors">
                    <Button variant="ghost" size="sm" class="gap-1">
                        <ArrowLeft class="h-4 w-4" />
                        <span>Back to Dashboard</span>
                    </Button>
                </a>
            </div>
            <h1 class="text-3xl font-bold tracking-tight mt-2">
                Collaboration & Communication
            </h1>
            <p class="text-muted-foreground mt-1">
                Manage investor updates, team collaboration, and board communications
            </p>
        </div>

        <div class="flex items-center gap-3">
            <Button variant="outline" size="sm" class="gap-2">
                <Clock class="h-4 w-4" />
                <span>Last updated: Today at 9:30 AM</span>
            </Button>
            
            <Button variant="default" size="sm" class="gap-2">
                <Plus class="h-4 w-4" />
                <span>New Update</span>
            </Button>
        </div>
    </div>

    <!-- Main Content -->
    <Tabs value={activeTab} onValueChange={(val) => (activeTab = val)} class="space-y-6">
        <TabsList>
            <TabsTrigger value="updates" class="flex items-center gap-2">
                <Mail class="h-4 w-4" />
                <span>Investor Updates</span>
            </TabsTrigger>
            <TabsTrigger value="team" class="flex items-center gap-2">
                <Users class="h-4 w-4" />
                <span>Team Collaboration</span>
            </TabsTrigger>
            <TabsTrigger value="board" class="flex items-center gap-2">
                <Briefcase class="h-4 w-4" />
                <span>Board Management</span>
            </TabsTrigger>
        </TabsList>

        <!-- Investor Updates Tab -->
        <TabsContent value="updates" class="space-y-6">
            <!-- Metrics Overview -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card.Root>
                    <Card.Header class="pb-2">
                        <Card.Title class="text-sm font-medium text-muted-foreground">
                            Average Open Rate
                        </Card.Title>
                        <div class="text-2xl font-bold">
                            {data.collaboration.investorUpdates.metrics.averageOpenRate}%
                        </div>
                    </Card.Header>
                </Card.Root>

                <Card.Root>
                    <Card.Header class="pb-2">
                        <Card.Title class="text-sm font-medium text-muted-foreground">
                            Engagement Rate
                        </Card.Title>
                        <div class="text-2xl font-bold">
                            {data.collaboration.investorUpdates.metrics.averageEngagement}%
                        </div>
                    </Card.Header>
                </Card.Root>

                <Card.Root>
                    <Card.Header class="pb-2">
                        <Card.Title class="text-sm font-medium text-muted-foreground">
                            Total Updates
                        </Card.Title>
                        <div class="text-2xl font-bold">
                            {data.collaboration.investorUpdates.metrics.totalUpdates}
                        </div>
                    </Card.Header>
                </Card.Root>

                <Card.Root>
                    <Card.Header class="pb-2">
                        <Card.Title class="text-sm font-medium text-muted-foreground">
                            Top Performing
                        </Card.Title>
                        <div class="text-lg font-medium truncate">
                            {data.collaboration.investorUpdates.metrics.topPerforming}
                        </div>
                    </Card.Header>
                </Card.Root>
            </div>

            <!-- Upcoming & Recent Updates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Upcoming Updates -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Upcoming Updates</Card.Title>
                        <Card.Description>Scheduled and draft updates</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            {#each data.collaboration.investorUpdates.upcoming as update}
                                <div class="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div>
                                        <div class="font-medium">{update.title}</div>
                                        <div class="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" class={getStatusClass(update.status)}>
                                                {update.status}
                                            </Badge>
                                            <span class="text-sm text-muted-foreground">
                                                {formatDate(update.scheduledFor)}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm font-medium">{update.recipients} recipients</div>
                                        <Button variant="ghost" size="sm" class="mt-1">
                                            <Edit3 class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </Card.Content>
                </Card.Root>

                <!-- Recent Updates -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Recent Updates</Card.Title>
                        <Card.Description>Performance of sent updates</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            {#each data.collaboration.investorUpdates.recent as update}
                                <div class="p-3 bg-muted/50 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div class="font-medium">{update.title}</div>
                                        <span class="text-sm text-muted-foreground">
                                            {formatDate(update.sentDate)}
                                        </span>
                                    </div>
                                    <div class="grid grid-cols-3 gap-4 mt-2">
                                        <div>
                                            <div class="text-sm text-muted-foreground">Open Rate</div>
                                            <div class="font-medium">{update.openRate}%</div>
                                        </div>
                                        <div>
                                            <div class="text-sm text-muted-foreground">Engagement</div>
                                            <div class="font-medium">{update.engagement}%</div>
                                        </div>
                                        <div>
                                            <div class="text-sm text-muted-foreground">Feedback</div>
                                            <div class="font-medium">{update.feedback} responses</div>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        </TabsContent>

        <!-- Team Collaboration Tab -->
        <TabsContent value="team" class="space-y-6">
            <!-- Recent Comments & Activity -->
            <Card.Root>
                <Card.Header>
                    <Card.Title>Recent Comments & Activity</Card.Title>
                    <Card.Description>Team discussions and feedback</Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="space-y-4">
                        {#each data.collaboration.teamCollaboration.recentComments as comment}
                            <div class="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <Avatar.Root class="h-8 w-8">
                                    <Avatar.Image src={comment.user.avatar} alt={comment.user.name} />
                                    <Avatar.Fallback>{comment.user.name.split(' ').map((n: string) => n[0]).join('')}</Avatar.Fallback>
                                </Avatar.Root>
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium">{comment.user.name}</span>
                                        <Badge variant="outline" class="text-xs">{comment.user.role}</Badge>
                                    </div>
                                    <p class="text-sm mt-1">{comment.content}</p>
                                    <div class="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                        <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{comment.target}</span>
                                        <span>•</span>
                                        <span>{comment.reactions} reactions</span>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Tasks & Decisions -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tasks -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Active Tasks</Card.Title>
                        <Card.Description>Team assignments and progress</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            {#each data.collaboration.teamCollaboration.tasks as task}
                                <div class="p-3 bg-muted/50 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div class="font-medium">{task.title}</div>
                                        <Badge variant="outline" class={getPriorityClass(task.priority)}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                    <div class="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                        <span>{task.assignee}</span>
                                        <span>•</span>
                                        <span>Due: {formatDate(task.dueDate)}</span>
                                    </div>
                                    <div class="mt-2">
                                        <Badge variant="outline" class={getStatusClass(task.status)}>
                                            {task.status}
                                        </Badge>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </Card.Content>
                </Card.Root>

                <!-- Decisions -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Recent Decisions</Card.Title>
                        <Card.Description>Key decisions and outcomes</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            {#each data.collaboration.teamCollaboration.decisions as decision}
                                <div class="p-3 bg-muted/50 rounded-lg">
                                    <div class="font-medium">{decision.title}</div>
                                    <div class="text-sm text-muted-foreground mt-1">{decision.context}</div>
                                    <div class="mt-2 p-2 bg-background rounded">
                                        <div class="text-sm font-medium">Outcome:</div>
                                        <div class="text-sm">{decision.outcome}</div>
                                    </div>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        {#each decision.stakeholders as stakeholder}
                                            <Badge variant="outline" class="text-xs">{stakeholder}</Badge>
                                        {/each}
                                    </div>
                                    <div class="text-xs text-muted-foreground mt-2">
                                        {formatDate(decision.date)}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        </TabsContent>

        <!-- Board Management Tab -->
        <TabsContent value="board" class="space-y-6">
            <!-- Upcoming Meeting -->
            <Card.Root>
                <Card.Header>
                    <Card.Title>Upcoming Board Meeting</Card.Title>
                    <Card.Description>Next scheduled meeting and preparation</Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="p-4 bg-muted/50 rounded-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-medium text-lg">
                                    {data.collaboration.boardManagement.upcomingMeeting.type}
                                </div>
                                <div class="flex items-center gap-2 mt-1 text-muted-foreground">
                                    <Calendar class="h-4 w-4" />
                                    <span>{formatDate(data.collaboration.boardManagement.upcomingMeeting.date)}</span>
                                    <span>•</span>
                                    <span>{formatTime(data.collaboration.boardManagement.upcomingMeeting.time)}</span>
                                </div>
                            </div>
                            <Badge variant="outline">
                                {data.collaboration.boardManagement.upcomingMeeting.attendees} Attendees
                            </Badge>
                        </div>
                        <Separator class="my-4" />
                        <div>
                            <div class="font-medium mb-2">Agenda</div>
                            <ul class="space-y-1">
                                {#each data.collaboration.boardManagement.upcomingMeeting.agenda as item}
                                    <li class="flex items-center gap-2 text-sm">
                                        <div class="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                        {item}
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Board Materials & Resolutions -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Board Materials -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Board Materials</Card.Title>
                        <Card.Description>Documents and presentations</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            {#each data.collaboration.boardManagement.materials as material}
                                <div class="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div>
                                        <div class="font-medium">{material.title}</div>
                                        <div class="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                            <span>Modified: {formatDate(material.lastModified)}</span>
                                            <span>•</span>
                                            <span>{material.contributors} contributors</span>
                                        </div>
                                    </div>
                                    <Badge variant="outline" class={getStatusClass(material.status)}>
                                        {material.status}
                                    </Badge>
                                </div>
                            {/each}
                        </div>
                    </Card.Content>
                </Card.Root>

                <!-- Board Resolutions -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Board Resolutions</Card.Title>
                        <Card.Description>Tracking implementation progress</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            {#each data.collaboration.boardManagement.resolutions as resolution}
                                <div class="p-3 bg-muted/50 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div class="font-medium">{resolution.title}</div>
                                        <Badge variant="outline" class={getStatusClass(resolution.status)}>
                                            {resolution.status}
                                        </Badge>
                                    </div>
                                    <div class="mt-2 text-sm">
                                        <span class="text-muted-foreground">Next Steps:</span>
                                        <span class="ml-1">{resolution.nextSteps}</span>
                                    </div>
                                    <div class="text-xs text-muted-foreground mt-2">
                                        {formatDate(resolution.date)}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>

            <!-- Board Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card.Root>
                    <Card.Header class="pb-2">
                        <Card.Title class="text-sm font-medium text-muted-foreground">
                            Meetings This Year
                        </Card.Title>
                        <div class="text-2xl font-bold">
                            {data.collaboration.boardManagement.metrics.meetingsThisYear}
                        </div>
                    </Card.Header>
                </Card.Root>

                <Card.Root>
                    <Card.Header class="pb-2">
                        <Card.Title class="text-sm font-medium text-muted-foreground">
                            Average Attendance
                        </Card.Title>
                        <div class="text-2xl font-bold">
                            {data.collaboration.boardManagement.metrics.averageAttendance}%
                        </div>
                    </Card.Header>
                </Card.Root>

                <Card.Root>
                    <Card.Header class="pb-2">
                        <Card.Title class="text-sm font-medium text-muted-foreground">
                            Resolutions Implemented
                        </Card.Title>
                        <div class="text-2xl font-bold">
                            {data.collaboration.boardManagement.metrics.resolutionsImplemented}
                        </div>
                    </Card.Header>
                </Card.Root>

                <Card.Root>
                    <Card.Header class="pb-2">
                        <Card.Title class="text-sm font-medium text-muted-foreground">
                            Documents Shared
                        </Card.Title>
                        <div class="text-2xl font-bold">
                            {data.collaboration.boardManagement.metrics.documentsShared}
                        </div>
                    </Card.Header>
                </Card.Root>
            </div>
        </TabsContent>
    </Tabs>
</div> 
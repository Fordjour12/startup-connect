<script setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowUpIcon, DollarSignIcon, FileTextIcon, TrendingUpIcon } from 'lucide-vue-next'

// definePageMeta({
//     middleware: 'auth'
// })

// TODO: Add data fetching for profile completeness, recent activity, etc.
</script>
<template>
    <div class="min-h-screen bg-background">
        <!-- Header Section -->
        <header class="border-b">
            <div class="container mx-auto py-6">
                <h1 class="text-3xl font-bold text-foreground">Founder Dashboard</h1>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto py-6">
            <!-- Funding Progress Card -->
            <Card class="mb-6">
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <div>
                            <CardTitle>Fundraising Progress</CardTitle>
                            <CardDescription>Track your fundraising journey</CardDescription>
                        </div>
                        <div class="text-right">
                            <div class="text-3xl font-bold text-primary">$2.5M</div>
                            <div class="text-sm text-muted-foreground">of $5M goal</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress :model-value="50" class="h-2 mb-2" />
                    <div class="flex justify-between text-sm text-muted-foreground">
                        <span>12 Investors</span>
                        <span>50% Complete</span>
                    </div>
                </CardContent>
            </Card>

            <!-- Key Metrics Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <!-- Monthly Revenue -->
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle class="text-sm font-medium">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-baseline space-x-2">
                            <div class="text-2xl font-bold">$45.2K</div>
                            <div class="text-sm text-emerald-500 flex items-center">
                                <ArrowUpIcon class="w-4 h-4 mr-1" />
                                12%
                            </div>
                        </div>
                        <p class="text-xs text-muted-foreground mt-1">+$5.2K from last month</p>
                    </CardContent>
                </Card>

                <!-- Active Users -->
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle class="text-sm font-medium">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-baseline space-x-2">
                            <div class="text-2xl font-bold">2,350</div>
                            <div class="text-sm text-emerald-500 flex items-center">
                                <ArrowUpIcon class="w-4 h-4 mr-1" />
                                18%
                            </div>
                        </div>
                        <p class="text-xs text-muted-foreground mt-1">+350 new users this month</p>
                    </CardContent>
                </Card>

                <!-- Investor Interest -->
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle class="text-sm font-medium">Investor Interest</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-baseline space-x-2">
                            <div class="text-2xl font-bold">24</div>
                            <div class="text-sm text-emerald-500 flex items-center">
                                <ArrowUpIcon class="w-4 h-4 mr-1" />
                                8%
                            </div>
                        </div>
                        <p class="text-xs text-muted-foreground mt-1">Profile views this week</p>
                    </CardContent>
                </Card>

                <!-- Runway -->
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle class="text-sm font-medium">Runway</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-baseline space-x-2">
                            <div class="text-2xl font-bold">14</div>
                            <div class="text-sm text-muted-foreground">months</div>
                        </div>
                        <p class="text-xs text-muted-foreground mt-1">At current burn rate</p>
                    </CardContent>
                </Card>
            </div>

            <!-- Quick Actions Grid -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                <!-- Create/Edit Profile Card -->
                <Card>
                    <CardHeader>
                        <CardTitle>Startup Profile</CardTitle>
                        <CardDescription>Create or update your startup profile to attract investors</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <NuxtLink to="/dashboard/founder/startup">
                                Manage Profile
                            </NuxtLink>
                        </Button>
                    </CardContent>
                </Card>

                <!-- Investor Communications -->
                <Card>
                    <CardHeader>
                        <CardTitle>Investor Relations</CardTitle>
                        <CardDescription>Manage communications and track investor engagement</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span>Active Conversations</span>
                                <span class="font-medium">8</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span>Pending Responses</span>
                                <span class="font-medium">3</span>
                            </div>
                            <Button asChild class="w-full mt-4">
                                <NuxtLink to="/dashboard/founder/messages">
                                    View Messages
                                </NuxtLink>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <!-- Due Diligence -->
                <Card>
                    <CardHeader>
                        <CardTitle>Due Diligence</CardTitle>
                        <CardDescription>Track and manage investor due diligence requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span>Documents Uploaded</span>
                                <span class="font-medium">15/20</span>
                            </div>
                            <Progress :model-value="75" class="h-2" />
                            <Button asChild class="w-full mt-4">
                                <NuxtLink to="/dashboard/founder/documents">
                                    Manage Documents
                                </NuxtLink>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Recent Activity Section -->
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="flow-root">
                        <ul role="list" class="-mb-8">
                            <li>
                                <div class="relative pb-8">
                                    <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                                        aria-hidden="true"></span>
                                    <div class="relative flex space-x-3">
                                        <div>
                                            <span
                                                class="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center ring-8 ring-background">
                                                <DollarSignIcon class="h-4 w-4 text-white" />
                                            </span>
                                        </div>
                                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p class="text-sm text-muted-foreground">New investment interest from <span
                                                        class="font-medium text-foreground">Tech Ventures Capital</span>
                                                </p>
                                            </div>
                                            <div class="text-right text-sm whitespace-nowrap text-muted-foreground">
                                                <time datetime="2024-01-20">10 minutes ago</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="relative pb-8">
                                    <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                                        aria-hidden="true"></span>
                                    <div class="relative flex space-x-3">
                                        <div>
                                            <span
                                                class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-background">
                                                <FileTextIcon class="h-4 w-4 text-white" />
                                            </span>
                                        </div>
                                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p class="text-sm text-muted-foreground">Due diligence documents requested by <span
                                                        class="font-medium text-foreground">Growth Fund LLC</span></p>
                                            </div>
                                            <div class="text-right text-sm whitespace-nowrap text-muted-foreground">
                                                <time datetime="2024-01-20">1 hour ago</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="relative pb-8">
                                    <div class="relative flex space-x-3">
                                        <div>
                                            <span
                                                class="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center ring-8 ring-background">
                                                <TrendingUpIcon class="h-4 w-4 text-white" />
                                            </span>
                                        </div>
                                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p class="text-sm text-muted-foreground">Monthly revenue milestone reached: <span
                                                        class="font-medium text-foreground">$45K</span></p>
                                            </div>
                                            <div class="text-right text-sm whitespace-nowrap text-muted-foreground">
                                                <time datetime="2024-01-20">2 hours ago</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
</template>

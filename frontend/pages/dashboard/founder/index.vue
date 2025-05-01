<script setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

definePageMeta({
    middleware: 'auth'
})

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
            <!-- Profile Completeness Card -->
            <Card class="mb-6">
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <div>
                            <CardTitle>Profile Completeness</CardTitle>
                            <CardDescription>Complete your profile to increase visibility to investors</CardDescription>
                        </div>
                        <div class="text-right">
                            <div class="text-3xl font-bold text-primary">75%</div>
                            <div class="text-sm text-muted-foreground">Complete</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress :model-value="75" class="h-2" />
                </CardContent>
            </Card>

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
                            <NuxtLink to="/dashboard/founder/startup/create">
                                Manage Profile
                            </NuxtLink>
                        </Button>
                    </CardContent>
                </Card>

                <!-- Messages Card -->
                <Card>
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>View and respond to investor messages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <NuxtLink to="/dashboard/founder/messages">
                                View Messages
                            </NuxtLink>
                        </Button>
                    </CardContent>
                </Card>

                <!-- Settings Card -->
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>Manage your account settings and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <NuxtLink to="/dashboard/founder/settings">
                                View Settings
                            </NuxtLink>
                        </Button>
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
                                                class="h-8 w-8 rounded-full bg-primary flex items-center justify-center ring-8 ring-background">
                                                <svg class="h-5 w-5 text-primary-foreground"
                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                    fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p class="text-sm text-muted-foreground">Profile updated <span
                                                        class="font-medium text-foreground">Company Information</span>
                                                </p>
                                            </div>
                                            <div class="text-right text-sm whitespace-nowrap text-muted-foreground">
                                                <time datetime="2024-01-20">20 minutes ago</time>
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
                                                class="h-8 w-8 rounded-full bg-primary flex items-center justify-center ring-8 ring-background">
                                                <svg class="h-5 w-5 text-primary-foreground"
                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                    fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p class="text-sm text-muted-foreground">New message from <span
                                                        class="font-medium text-foreground">Investor XYZ</span></p>
                                            </div>
                                            <div class="text-right text-sm whitespace-nowrap text-muted-foreground">
                                                <time datetime="2024-01-20">1 hour ago</time>
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

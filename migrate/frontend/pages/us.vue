<script setup lang="ts">
import StartupAnalytics from '@/components/StartupAnalytics.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Startup } from '@/data/startups'
import { startups } from '@/data/startups'
import { Building2, DollarSign, MoreVertical, Search, TrendingUp, Users } from 'lucide-vue-next'


// Statistics
const stats = ref([
    {
        title: 'Total Startups',
        value: '124',
        change: '+12%',
        icon: Building2
    },
    {
        title: 'Active Investors',
        value: '45',
        change: '+8%',
        icon: Users
    },
    {
        title: 'Total Funding',
        value: '$12.5M',
        change: '+23%',
        icon: DollarSign
    },
    {
        title: 'Growth Rate',
        value: '32%',
        change: '+5%',
        icon: TrendingUp
    }
])

// Startup management
const searchQuery = ref('')
const selectedStartup = ref<Startup | null>(null)

const filteredStartups = computed(() => {
    if (!searchQuery.value) return startups
    const query = searchQuery.value.toLowerCase()
    return startups.filter(startup =>
        startup.name.toLowerCase().includes(query) ||
        startup.industry.toLowerCase().includes(query) ||
        startup.location.toLowerCase().includes(query)
    )
})

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active':
            return 'bg-green-500/10 text-green-500'
        case 'Pending':
            return 'bg-yellow-500/10 text-yellow-500'
        case 'Suspended':
            return 'bg-red-500/10 text-red-500'
        default:
            return 'bg-gray-500/10 text-gray-500'
    }
}

// User management
const users = ref([
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'Active',
        lastActive: '2 hours ago'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Moderator',
        status: 'Active',
        lastActive: '5 hours ago'
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'User',
        status: 'Pending',
        lastActive: '1 day ago'
    }
])

const searchUserQuery = ref('')

const filteredUsers = computed(() => {
    if (!searchUserQuery.value) return users.value
    const query = searchUserQuery.value.toLowerCase()
    return users.value.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    )
})
</script>

<template>
    <div class="container mx-auto py-8">
        <div class="flex flex-col gap-8">
            <div>
                <h1 class="text-3xl font-bold mb-2">Dashboard</h1>
                <p class="text-muted-foreground">Manage startups, users, and platform statistics</p>
            </div>

            <!-- Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card v-for="stat in stats" :key="stat.title">
                    <CardContent class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">{{ stat.title }}</p>
                                <h2 class="text-2xl font-bold mt-1">{{ stat.value }}</h2>
                                <p class="text-sm text-green-500 mt-1">{{ stat.change }}</p>
                            </div>
                            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <component :is="stat.icon" class="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Tabs -->
            <Tabs default-value="startups" class="space-y-4">
                <TabsList>
                    <TabsTrigger value="startups">Startups</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <!-- Startups Tab -->
                <TabsContent value="startups" class="space-y-4">
                    <Card>
                        <CardHeader>
                            <div class="flex items-center justify-between">
                                <div>
                                    <CardTitle>Startup Listings</CardTitle>
                                    <CardDescription>Manage and review startup profiles</CardDescription>
                                </div>
                                <div class="relative w-64">
                                    <Search
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input v-model="searchQuery" placeholder="Search startups..." class="pl-9" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Industry</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Funding Stage</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead class="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="startup in filteredStartups" :key="startup.id">
                                        <TableCell class="font-medium">{{ startup.name }}</TableCell>
                                        <TableCell>{{ startup.industry }}</TableCell>
                                        <TableCell>{{ startup.location }}</TableCell>
                                        <TableCell>{{ startup.fundingStage }}</TableCell>
                                        <TableCell>
                                            <Badge :class="getStatusColor('Active')">Active</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger as-child>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical class="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                                                    <DropdownMenuItem class="text-red-500">Suspend</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <!-- Users Tab -->
                <TabsContent value="users" class="space-y-4">
                    <Card>
                        <CardHeader>
                            <div class="flex items-center justify-between">
                                <div>
                                    <CardTitle>User Management</CardTitle>
                                    <CardDescription>Manage platform users and permissions</CardDescription>
                                </div>
                                <div class="relative w-64">
                                    <Search
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input v-model="searchUserQuery" placeholder="Search users..." class="pl-9" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Last Active</TableHead>
                                        <TableHead class="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="user in filteredUsers" :key="user.id">
                                        <TableCell class="font-medium">{{ user.name }}</TableCell>
                                        <TableCell>{{ user.email }}</TableCell>
                                        <TableCell>{{ user.role }}</TableCell>
                                        <TableCell>
                                            <Badge :class="getStatusColor(user.status)">{{ user.status }}</Badge>
                                        </TableCell>
                                        <TableCell>{{ user.lastActive }}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger as-child>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical class="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                                    <DropdownMenuItem class="text-red-500">Suspend</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <!-- Analytics Tab -->
                <TabsContent value="analytics" class="space-y-4">
                    <StartupAnalytics :startup-id="selectedStartup?.id || 1" />
                </TabsContent>
            </Tabs>
        </div>
    </div>
</template>

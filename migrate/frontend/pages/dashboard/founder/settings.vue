<script setup>
import { ref } from 'vue'
import { Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'vue-sonner'

// definePageMeta({
//     middleware: 'auth'
// })

const isSubmitting = ref(false)

// Account form schema
const accountSchema = toTypedSchema(z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address')
}))

// Notification preferences
const notifications = ref({
    email: true,
    messages: true,
    profileViews: true
})

// Profile visibility settings
const visibility = ref({
    public: true,
    contactInfo: true,
    fundingDetails: true
})

// Form submission handlers
const handleAccountSubmit = async (values) => {
    isSubmitting.value = true
    try {
        // TODO: Implement API call to update account settings
        console.log('Updating account settings:', values)
        toast.success('Account settings updated successfully')
    } catch (error) {
        console.error('Error updating account settings:', error)
        toast.error('Failed to update account settings')
    } finally {
        isSubmitting.value = false
    }
}

const handleNotificationSubmit = async () => {
    isSubmitting.value = true
    try {
        // TODO: Implement API call to update notification preferences
        console.log('Updating notification preferences:', notifications.value)
        toast.success('Notification preferences updated successfully')
    } catch (error) {
        console.error('Error updating notification preferences:', error)
        toast.error('Failed to update notification preferences')
    } finally {
        isSubmitting.value = false
    }
}

const handleVisibilitySubmit = async () => {
    isSubmitting.value = true
    try {
        // TODO: Implement API call to update visibility settings
        console.log('Updating visibility settings:', visibility.value)
        toast.success('Visibility settings updated successfully')
    } catch (error) {
        console.error('Error updating visibility settings:', error)
        toast.error('Failed to update visibility settings')
    } finally {
        isSubmitting.value = false
    }
}
</script>


<template>
    <div class="min-h-screen bg-background">
        <!-- Header Section -->
        <header class="border-b">
            <div class="container mx-auto py-6">
                <h1 class="text-3xl font-bold text-foreground">Settings</h1>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto py-6">
            <Card>
                <CardContent class="p-6">
                    <Tabs default-value="account" >
                        <TabsList>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            <TabsTrigger value="visibility">Visibility</TabsTrigger>
                        </TabsList>

                        <!-- Account Settings Tab -->
                        <TabsContent value="account" class="mt-6">
                            <Form @submit="handleAccountSubmit" :validation-schema="accountSchema" v-slot="{ errors }">
                                <div class="grid gap-4 sm:grid-cols-2">
                                    <FormField v-slot="{ field }" name="firstName">
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input v-bind="field" placeholder="Enter your first name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>

                                    <FormField v-slot="{ field }" name="lastName">
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input v-bind="field" placeholder="Enter your last name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>
                                </div>

                                <FormField v-slot="{ field }" name="email">
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input v-bind="field" type="email" placeholder="Enter your email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>

                                <div class="flex justify-end mt-6">
                                    <Button type="submit" :disabled="isSubmitting">
                                        <span v-if="isSubmitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                                    </Button>
                                </div>
                            </Form>
                        </TabsContent>

                        <!-- Notifications Tab -->
                        <TabsContent value="notifications" class="mt-6">
                            <form @submit.prevent="handleNotificationSubmit" class="space-y-6">
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between">
                                        <div class="space-y-0.5">
                                            <FormLabel>Email Notifications</FormLabel>
                                            <p class="text-sm text-muted-foreground">Receive updates about your startup and investor interactions</p>
                                        </div>
                                        <Switch v-model="notifications.email" />
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <div class="space-y-0.5">
                                            <FormLabel>Investor Messages</FormLabel>
                                            <p class="text-sm text-muted-foreground">Get notified when investors send you messages</p>
                                        </div>
                                        <Switch v-model="notifications.messages" />
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <div class="space-y-0.5">
                                            <FormLabel>Profile Views</FormLabel>
                                            <p class="text-sm text-muted-foreground">Receive notifications when investors view your profile</p>
                                        </div>
                                        <Switch v-model="notifications.profileViews" />
                                    </div>
                                </div>

                                <div class="flex justify-end">
                                    <Button type="submit" :disabled="isSubmitting">
                                        <span v-if="isSubmitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        {{ isSubmitting ? 'Saving...' : 'Save Preferences' }}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>

                        <!-- Visibility Tab -->
                        <TabsContent value="visibility" class="mt-6">
                            <form @submit.prevent="handleVisibilitySubmit" class="space-y-6">
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between">
                                        <div class="space-y-0.5">
                                            <FormLabel>Public Profile</FormLabel>
                                            <p class="text-sm text-muted-foreground">Make your startup profile visible to all investors</p>
                                        </div>
                                        <Switch v-model="visibility.public" />
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <div class="space-y-0.5">
                                            <FormLabel>Show Contact Information</FormLabel>
                                            <p class="text-sm text-muted-foreground">Display your contact details on your profile</p>
                                        </div>
                                        <Switch v-model="visibility.contactInfo" />
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <div class="space-y-0.5">
                                            <FormLabel>Show Funding Details</FormLabel>
                                            <p class="text-sm text-muted-foreground">Display your funding information on your profile</p>
                                        </div>
                                        <Switch v-model="visibility.fundingDetails" />
                                    </div>
                                </div>

                                <div class="flex justify-end">
                                    <Button type="submit" :disabled="isSubmitting">
                                        <span v-if="isSubmitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        {{ isSubmitting ? 'Saving...' : 'Save Visibility Settings' }}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
    </div>
</template>

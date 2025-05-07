<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()


const formSchema = toTypedSchema(z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
}))

const form = useForm({
    validationSchema: formSchema,
})

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const onSubmit = form.handleSubmit(async (values) => {
    try {
        await authStore.login(values)

        // Check if there's a redirect parameter in the URL
        const redirect = route.query.redirect as string
        if (redirect) {
            router.push(redirect)
        } else {
            router.push('/dashboard')
        }
    } catch (error) {
        console.error('Login error:', error)
    }
})
</script>

<template>
    <form :class="cn('flex flex-col gap-6', props.class)" @submit="onSubmit">

        <div class="flex flex-col items-center gap-2 text-center">
            <h1 class="text-2xl font-bold">
                Login to your account
            </h1>
            <p class="text-muted-foreground text-sm text-balance">
                Enter your details to login to your account
            </p>
        </div>
        <div class="grid gap-6">
            <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="email">
                    <FormItem v-auto-animate>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" type="email" placeholder="m@example.com" required />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>
            <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="password">
                    <FormItem v-auto-animate>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" type="password" required />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <a href="#" class="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                </a>
            </div>
            <Button type="submit" class-name="w-full" :disabled="authStore.loading">
                <span v-if="authStore.loading"
                    class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {{ authStore.loading ? 'Logging in...' : 'Login' }}
            </Button>
            <div
                class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span class="bg-background text-muted-foreground relative z-10 px-2">
                    Or continue with
                </span>
            </div>
            <Button variant="outline" class-name="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        fill="currentColor" />
                </svg>
                Login with GitHub
            </Button>
        </div>
        <div class="text-center text-sm">
            Don't have an account?
            <Button variant="link" as-child>
                <NuxtLink to="/register" class="underline underline-offset-4">
                    Sign up
                </NuxtLink>
            </Button>
        </div>
    </form>
</template>

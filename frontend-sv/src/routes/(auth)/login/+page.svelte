<!-- +page.svelte -->
<script lang="ts">
    import LoginForm from "$lib/components/LoginForm.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
</script>

<div
    class="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
    <div
        class="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r"
    >
        <div class="absolute inset-0 bg-primary"></div>
        <div class="relative z-20 flex items-center text-lg font-medium">
            <img src="/logo.svg" alt="Logo" class="h-8 w-8 mr-2" />
            Acme Inc.
        </div>
        <div class="relative z-20 mt-auto">
            <blockquote class="space-y-2">
                <p class="text-lg">
                    "This platform has transformed how we connect with startups.
                    The seamless integration and powerful features have made our
                    investment process more efficient than ever."
                </p>
                <footer class="text-sm">
                    Sofia Davis, Investment Director
                </footer>
            </blockquote>
        </div>
    </div>
    <div class="lg:p-8">
        <div
            class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
        >
            <div class="flex flex-col space-y-2 text-center">
                <h1 class="text-2xl font-semibold tracking-tight">
                    Login to your account
                </h1>
                <p class="text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <LoginForm {data} />

            <p class="px-8 text-center text-sm text-muted-foreground">
                Don't have an account?
                <a
                    href="/register"
                    class="hover:text-brand underline underline-offset-4"
                >
                    Sign up
                </a>
            </p>
        </div>
    </div>
</div>

<script lang="ts">
    import RegisterForm from "@/components/auth/RegisterForm.svelte";
    import type { PageProps } from "./$types";
    import { IconBrandGithub } from "@tabler/icons-svelte";

    let { data }: PageProps = $props();
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
            StartupConnect
        </div>
        <div class="relative z-20 mt-auto">
            <blockquote class="space-y-2">
                <p class="text-lg">
                    "StartupConnect has been instrumental in helping us find the
                    right investors and grow our startup. The platform's
                    intuitive interface and powerful networking features make it
                    the perfect launchpad for ambitious founders."
                </p>
                <footer class="text-sm">Alex Chen, CEO of TechVision</footer>
            </blockquote>
        </div>
    </div>
    <div class="lg:p-8">
        <div
            class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
        >
            <div class="flex flex-col space-y-2 text-center">
                <h1 class="text-2xl font-semibold tracking-tight">
                    Create your account
                </h1>
                <p class="text-sm text-muted-foreground">
                    Join StartupConnect to connect with investors and grow your
                    startup
                </p>
            </div>
            <RegisterForm {data} />
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <span class="w-full border-t"></span>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <button
                type="button"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
                <IconBrandGithub class="mr-2 h-4 w-4" />
                Sign up with GitHub
            </button>
            <p class="px-8 text-center text-sm text-muted-foreground">
                Already have an account?
                <a
                    href="/admin/login"
                    class="hover:text-brand underline underline-offset-4"
                >
                    Log in
                </a>
            </p>
        </div>
    </div>
</div>

<script setup>
import { ref, computed } from 'vue'
import { Button } from "@/components/ui/button"
import { MenuIcon, XIcon } from "lucide-vue-next"
import ModeToggle from "@/components/ModeToggle"
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const mobileMenuOpen = ref(false)
</script>

<template>
    <header class="sticky top-0 z-50 border-border border-b backdrop-blur-lg bg-background/80">
        <nav>
            <div class="container mx-auto px-6 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <div class="text-2xl font-bold">
                            <span class="text-primary">Startup</span><span class="text-foreground">Connect</span>
                        </div>
                    </div>
                    <!-- Desktop Nav -->
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="#features"
                            class="text-muted-foreground hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" class="text-muted-foreground hover:text-primary transition-colors">How
                            it Works</a>
                        <a href="/startups"
                            class="text-muted-foreground hover:text-primary transition-colors">Startups</a>
                        <a href="#testimonials"
                            class="text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
                    </div>
                    <div class="flex items-center space-x-2 gap-4">
                        <div v-if="!isAuthenticated" class="flex items-center space-x-4 gap-2">
                            <Button as-child>
                                <a href="/login">Log in</a>
                            </Button>
                            <Button variant="outline" as-child>
                                <a href="/register">Get Started</a>
                            </Button>
                        </div>
                        <div v-else>
                            <ClientOnly>
                                <UserDropDown v-if="user" :user="user" />
                            </ClientOnly>
                        </div>
                        <!-- Mobile menu button -->
                        <Button class="md:hidden text-muted-foreground" @click="mobileMenuOpen = !mobileMenuOpen"
                            variant="ghost">
                            <MenuIcon v-if="!mobileMenuOpen" class="h-6 w-6" />
                            <XIcon v-else class="h-6 w-6" />
                        </Button>
                        <ClientOnly>
                            <ModeToggle />
                        </ClientOnly>
                    </div>
                </div>
            </div>
            <!-- Mobile Nav -->
            <transition name="fade">
                <div v-if="mobileMenuOpen" class="md:hidden bg-background/95 border-b border-border px-6 pb-4">
                    <div class="flex flex-col space-y-2">
                        <a href="#features"
                            class="text-muted-foreground hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" class="text-muted-foreground hover:text-primary transition-colors">How
                            it Works</a>
                        <a href="/startups"
                            class="text-muted-foreground hover:text-primary transition-colors">Startups</a>
                        <a href="#testimonials"
                            class="text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
                        <div v-if="!isAuthenticated" class="flex items-center space-x-4 pt-2">
                            <Button as-child>
                                <NuxtLink to="/login">Log in</NuxtLink>
                            </Button>
                            <Button variant="outline" as-child>
                                <NuxtLink to="/register">Get Started</NuxtLink>
                            </Button>
                        </div>
                        <div v-else class="pt-2">
                            <ClientOnly>
                                <UserDropDown v-if="user" :user="user" />
                            </ClientOnly>
                        </div>
                    </div>
                </div>
            </transition>
        </nav>
    </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

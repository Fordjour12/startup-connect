<script setup>
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-vue-next"
import  ModeToggle from "@/components/ModeToggle"
</script>


<template>
    <header class="sticky top-0 z-50 border-border border-b backdrop-blur-lg">
        <!-- <div class="container mx-auto px-4"> -->
            <!-- <nav class="fixed w-full bg-card/95 backdrop-blur-sm z-50 border-b border-border shadow-sm"> -->
                <nav>
                <div class="container mx-auto px-6 py-4">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="text-2xl font-bold">
                                <span class="text-primary">Startup</span><span class="text-foreground">Connect</span>
                            </div>
                        </div>
                        <div class="hidden md:flex items-center space-x-8">
                            <a href="#features"
                                class="text-muted-foreground hover:text-primary transition-colors">Features</a>
                            <a href="#how-it-works"
                                class="text-muted-foreground hover:text-primary transition-colors">How
                                it Works</a>
                            <a href="startups"
                                class="text-muted-foreground hover:text-primary transition-colors">Startups</a>
                            <a href="#testimonials"
                                class="text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
                        </div>
                        <div class="flex items-center space-x-4">
                            <Button as-child>
                                <a href="/login">
                                    Log in
                                </a>
                            </Button>
                            <Button variant="outline" as-child>
                                <a href="/register">
                                    Get Started
                                </a>
                            </Button>
                            <Button class="md:hidden text-muted-foreground">
                                <MenuIcon class="h-6 w-6" />
                            </Button>
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </nav>
        <!-- </div> -->
    </header>

</template>
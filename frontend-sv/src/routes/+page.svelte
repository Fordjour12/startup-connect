<script lang="ts">
    // import ModeToggle from "@/components/ModeToggle.vue"
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import Header from "@/components/Header.svelte";
    import {
        ActivityIcon,
        ArrowRightIcon,
        BanknoteIcon,
        BarChartIcon,
        CheckCircleIcon,
        FacebookIcon,
        FileTextIcon,
        InstagramIcon,
        LeafIcon,
        LineChartIcon,
        LinkedinIcon,
        MenuIcon,
        MessageSquareIcon,
        QuoteIcon,
        RocketIcon,
        SearchIcon,
        ShieldCheckIcon,
        StarIcon,
        TwitterIcon,
        UserPlusIcon,
        UsersIcon,
    } from "@lucide/svelte";
</script>

<div class="bg-background text-foreground">
    <Header />
    <!-- Hero Section -->
    <section class="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div class="container mx-auto px-6 relative">
            <!-- Background Elements -->
            <div
                class="absolute -top-20 -right-20 w-64 h-64 bg-accent/70 rounded-full opacity-70 blur-3xl"
            ></div>
            <div
                class="absolute top-40 -left-20 w-64 h-64 bg-secondary/70 rounded-full opacity-70 blur-3xl"
            ></div>

            <div class="flex flex-col md:flex-row items-center relative z-10">
                <div class="md:w-1/2 md:pr-12 mb-12 md:mb-0">
                    <Badge class="bg-primary">Launching Soon</Badge>
                    <h1
                        class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                    >
                        Connect <span class="text-primary">Startups</span> with
                        <span class="text-primary">Investors</span>
                    </h1>
                    <p class="text-xl text-muted-foreground mb-8 max-w-lg">
                        StartupConnect bridges the gap between innovative
                        startups and investors looking for the next big
                        opportunity.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <Button>Join as Startup</Button>
                        <Button variant="outline">Become an Investor</Button>
                    </div>
                    <div class="mt-8 flex items-center">
                        <div class="flex -space-x-3">
                            <div
                                class="w-10 h-10 rounded-full bg-muted border-2 border-background"
                            />
                            <div
                                class="w-10 h-10 rounded-full bg-muted border-2 border-background"
                            />
                            <div
                                class="w-10 h-10 rounded-full bg-muted border-2 border-background"
                            />
                            <div
                                class="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-foreground font-medium"
                            >
                                +42
                            </div>
                        </div>
                        <p class="ml-4 text-sm text-muted-foreground">
                            <span class="font-semibold">500+</span> startups already
                            joined
                        </p>
                    </div>
                </div>
                <div class="md:w-1/2 relative">
                    <div
                        class="absolute -top-10 -left-10 w-40 h-40 bg-accent/50 rounded-full opacity-50 blur-3xl"
                    />
                    <div
                        class="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/50 rounded-full opacity-50 blur-3xl"
                    />
                    <div
                        class="relative z-10 bg-card p-2 rounded-2xl shadow-xl"
                    >
                        <img
                            src="/image.jpeg"
                            alt="Startup Collaboration"
                            class="w-full rounded-xl"
                        />
                        <div
                            class="absolute -bottom-5 -right-5 bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg"
                        >
                            <RocketIcon class="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Trusted By Section -->
    <section class="py-12 border-y border-border">
        <div class="container mx-auto px-6">
            <p
                class="text-center text-muted-foreground text-sm font-medium uppercase mb-8"
            >
                Trusted by leading companies
            </p>
            <div
                class="flex flex-wrap justify-center items-center gap-x-12 gap-y-8"
            >
                <div
                    class="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                >
                    <img src="/image.jpeg" alt="Company 1" class="h-full" />
                </div>
                <div
                    class="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                >
                    <img src="/image.jpeg" alt="Company 2" class="h-full" />
                </div>
                <div
                    class="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                >
                    <img src="/image.jpeg" alt="Company 3" class="h-full" />
                </div>
                <div
                    class="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                >
                    <img src="/image.jpeg" alt="Company 4" class="h-full" />
                </div>
                <div
                    class="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                >
                    <img src="/image.jpeg" alt="Company 5" class="h-full" />
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-muted">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div
                    class="text-center transform hover:scale-105 transition-transform duration-300"
                >
                    <p class="text-4xl font-bold text-primary mb-2">500+</p>
                    <p class="text-muted-foreground">Startups</p>
                </div>
                <div
                    class="text-center transform hover:scale-105 transition-transform duration-300"
                >
                    <p class="text-4xl font-bold text-primary mb-2">200+</p>
                    <p class="text-muted-foreground">Investors</p>
                </div>
                <div
                    class="text-center transform hover:scale-105 transition-transform duration-300"
                >
                    <p class="text-4xl font-bold text-primary mb-2">$15M+</p>
                    <p class="text-muted-foreground">Funding Raised</p>
                </div>
                <div
                    class="text-center transform hover:scale-105 transition-transform duration-300"
                >
                    <p class="text-4xl font-bold text-primary mb-2">30+</p>
                    <p class="text-muted-foreground">Industries</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="py-20">
        <div class="container mx-auto px-6">
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 md:pr-12 mb-12 md:mb-0 order-2 md:order-1">
                    <h2 class="text-3xl md:text-4xl font-bold mb-6">
                        What is <span class="text-primary">StartupConnect</span
                        >?
                    </h2>
                    <p class="text-lg text-muted-foreground mb-6">
                        StartupConnect is a platform dedicated to empowering the
                        startup ecosystem. We provide a space where startups can
                        showcase their ideas, individuals can offer support, and
                        investors can discover and fund promising ventures.
                    </p>
                    <p class="text-lg text-muted-foreground mb-8">
                        Our mission is to foster innovation and economic growth
                        by bridging the gap between entrepreneurs and those who
                        believe in their vision.
                    </p>
                    <div class="space-y-4">
                        <div class="flex items-center p-3 bg-accent rounded-lg">
                            <CheckCircleIcon
                                class="h-5 w-5 text-primary mr-3 flex-shrink-0"
                            />
                            <span class="text-foreground"
                                >Verified startup profiles with detailed
                                analytics</span
                            >
                        </div>
                        <div class="flex items-center p-3 bg-accent rounded-lg">
                            <CheckCircleIcon
                                class="h-5 w-5 text-primary mr-3 flex-shrink-0"
                            />
                            <span class="text-foreground"
                                >Secure messaging and document sharing system</span
                            >
                        </div>
                        <div class="flex items-center p-3 bg-accent rounded-lg">
                            <CheckCircleIcon
                                class="h-5 w-5 text-primary mr-3 flex-shrink-0"
                            />
                            <span class="text-foreground"
                                >Transparent funding process with milestone
                                tracking</span
                            >
                        </div>
                    </div>
                </div>
                <div class="md:w-1/2 order-1 md:order-2">
                    <div class="relative">
                        <div
                            class="absolute -top-4 -left-4 w-24 h-24 bg-emerald-100 rounded-lg z-0"
                        />
                        <div
                            class="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-100 rounded-lg z-0"
                        />
                        <img
                            src="/image.jpeg"
                            alt="About StartupConnect"
                            class="w-full rounded-2xl shadow-lg relative z-10"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-muted">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    Why Choose <span class="text-primary">StartupConnect</span>?
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our platform offers unique features designed to help
                    startups grow and investors find opportunities.
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Feature 1 -->
                <div
                    class="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div
                        class="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6"
                    >
                        <SearchIcon class="h-7 w-7 text-primary" />
                    </div>
                    <h3 class="text-xl font-semibold mb-3">Smart Matching</h3>
                    <p class="text-muted-foreground">
                        Our AI-powered algorithm connects startups with the most
                        relevant investors based on industry, stage, and funding
                        needs.
                    </p>
                </div>

                <!-- Feature 2 -->
                <div
                    class="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div
                        class="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6"
                    >
                        <ShieldCheckIcon class="h-7 w-7 text-primary" />
                    </div>
                    <h3 class="text-xl font-semibold mb-3">
                        Verified Profiles
                    </h3>
                    <p class="text-muted-foreground">
                        All startups and investors go through a verification
                        process to ensure credibility and build trust within our
                        community.
                    </p>
                </div>

                <!-- Feature 3 -->
                <div
                    class="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div
                        class="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6"
                    >
                        <MessageSquareIcon class="h-7 w-7 text-primary" />
                    </div>
                    <h3 class="text-xl font-semibold mb-3">Secure Messaging</h3>
                    <p class="text-muted-foreground">
                        Our encrypted messaging system allows for safe and
                        direct communication between startups and potential
                        investors.
                    </p>
                </div>

                <!-- Feature 4 -->
                <div
                    class="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div
                        class="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6"
                    >
                        <BarChartIcon class="h-7 w-7 text-primary" />
                    </div>
                    <h3 class="text-xl font-semibold mb-3">
                        Analytics Dashboard
                    </h3>
                    <p class="text-muted-foreground">
                        Track your startup's performance, investor interest, and
                        engagement metrics through our comprehensive analytics
                        dashboard.
                    </p>
                </div>

                <!-- Feature 5 -->
                <div
                    class="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div
                        class="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6"
                    >
                        <FileTextIcon class="h-7 w-7 text-primary" />
                    </div>
                    <h3 class="text-xl font-semibold mb-3">Document Sharing</h3>
                    <p class="text-muted-foreground">
                        Securely share pitch decks, financial projections, and
                        other important documents with potential investors.
                    </p>
                </div>

                <!-- Feature 6 -->
                <div
                    class="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div
                        class="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6"
                    >
                        <UsersIcon class="h-7 w-7 text-primary" />
                    </div>
                    <h3 class="text-xl font-semibold mb-3">
                        Community Support
                    </h3>
                    <p class="text-muted-foreground">
                        Connect with mentors, advisors, and other entrepreneurs
                        who can provide guidance and support for your startup
                        journey.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-20">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    How <span class="text-primary">StartupConnect</span>
                    Works
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our simple process helps startups and investors connect
                    efficiently.
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-12">
                <!-- Step 1 -->
                <div class="text-center relative">
                    <div class="relative">
                        <div
                            class="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6 z-10 relative shadow-lg transform transition-transform duration-300 hover:scale-110"
                        >
                            1
                        </div>
                        <div
                            class="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-accent -z-10"
                        />
                    </div>
                    <h3 class="text-xl font-semibold mb-3">
                        Create Your Profile
                    </h3>
                    <p class="text-muted-foreground mb-6">
                        Sign up and create a detailed profile as a startup or
                        investor. Startups can showcase their vision, team, and
                        funding needs.
                    </p>
                    <div class="bg-accent p-4 rounded-xl inline-block">
                        <UserPlusIcon class="h-10 w-10 text-primary mx-auto" />
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="text-center relative">
                    <div class="relative">
                        <div
                            class="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6 z-10 relative shadow-lg transform transition-transform duration-300 hover:scale-110"
                        >
                            2
                        </div>
                        <div
                            class="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-accent -z-10"
                        />
                    </div>
                    <h3 class="text-xl font-semibold mb-3">Connect & Engage</h3>
                    <p class="text-muted-foreground mb-6">
                        Browse through verified profiles, use our matching
                        system to find the right connections, and start
                        meaningful conversations.
                    </p>
                    <div class="bg-accent p-4 rounded-xl inline-block">
                        <UsersIcon class="h-10 w-10 text-primary mx-auto" />
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="text-center relative">
                    <div class="relative">
                        <div
                            class="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6 z-10 relative shadow-lg transform transition-transform duration-300 hover:scale-110"
                        >
                            3
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold mb-3">Secure Funding</h3>
                    <p class="text-muted-foreground mb-6">
                        Move forward with investment discussions, share
                        necessary documents, and finalize funding arrangements
                        through our secure platform.
                    </p>
                    <div class="bg-accent p-4 rounded-xl inline-block">
                        <BanknoteIcon class="h-10 w-10 text-primary mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Startups Section -->
    <section id="startups" class="py-20 bg-muted overflow-hidden">
        <div class="container mx-auto px-6">
            <div class="flex justify-between items-end mb-12">
                <div>
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">
                        Featured <span class="text-primary">Startups</span>
                    </h2>
                    <p class="text-lg text-muted-foreground max-w-2xl">
                        Discover some of the most promising startups on our
                        platform.
                    </p>
                </div>
                <button
                    class="hidden md:flex items-center text-primary hover:text-primary/80 font-medium group"
                >
                    View All Startups
                    <ArrowRightIcon
                        class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    />
                </button>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Startup 1 -->
                <div
                    class="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div class="h-48 bg-muted relative">
                        <img
                            src="/image.jpeg"
                            alt="GreenTech"
                            class="w-full h-full object-cover"
                        />
                        <div
                            class="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full"
                        >
                            CleanTech
                        </div>
                        <div
                            class="absolute top-4 right-4 bg-card text-primary text-xs font-medium px-2 py-1 rounded-full"
                        >
                            Seed Stage
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div
                                class="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4"
                            >
                                <LeafIcon class="h-6 w-6 text-primary" />
                            </div>
                            <h3 class="font-semibold text-xl">EcoSolutions</h3>
                        </div>
                        <p class="text-muted-foreground mb-6">
                            Creating biodegradable packaging solutions to reduce
                            plastic waste in the food delivery industry.
                        </p>
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-primary"
                                >Seeking: $500K</span
                            >
                            <button
                                class="text-sm text-muted-foreground hover:text-primary font-medium flex items-center group"
                            >
                                Learn More
                                <ArrowRightIcon
                                    class="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Startup 2 -->
                <div
                    class="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div class="h-48 bg-muted relative">
                        <img
                            src="/image.jpeg"
                            alt="HealthTech"
                            class="w-full h-full object-cover"
                        />
                        <div
                            class="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full"
                        >
                            HealthTech
                        </div>
                        <div
                            class="absolute top-4 right-4 bg-card text-primary text-xs font-medium px-2 py-1 rounded-full"
                        >
                            Series A
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div
                                class="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4"
                            >
                                <ActivityIcon class="h-6 w-6 text-primary" />
                            </div>
                            <h3 class="font-semibold text-xl">MediConnect</h3>
                        </div>
                        <p class="text-muted-foreground mb-6">
                            AI-powered telemedicine platform connecting patients
                            with specialists for affordable remote
                            consultations.
                        </p>
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-primary"
                                >Seeking: $2M</span
                            >
                            <button
                                class="text-sm text-muted-foreground hover:text-primary font-medium flex items-center group"
                            >
                                Learn More
                                <ArrowRightIcon
                                    class="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Startup 3 -->
                <div
                    class="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div class="h-48 bg-muted relative">
                        <img
                            src="/image.jpeg"
                            alt="FinTech"
                            class="w-full h-full object-cover"
                        />
                        <div
                            class="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full"
                        >
                            FinTech
                        </div>
                        <div
                            class="absolute top-4 right-4 bg-card text-primary text-xs font-medium px-2 py-1 rounded-full"
                        >
                            Pre-Seed
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div
                                class="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4"
                            >
                                <LineChartIcon class="h-6 w-6 text-primary" />
                            </div>
                            <h3 class="font-semibold text-xl">PaySmart</h3>
                        </div>
                        <p class="text-muted-foreground mb-6">
                            Blockchain-based payment solution for small
                            businesses with lower transaction fees and faster
                            processing.
                        </p>
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-primary"
                                >Seeking: $300K</span
                            >
                            <button
                                class="text-sm text-muted-foreground hover:text-primary font-medium flex items-center group"
                            >
                                Learn More
                                <ArrowRightIcon
                                    class="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-10 text-center md:hidden">
                <button
                    class="text-primary hover:text-primary/80 font-medium flex items-center justify-center mx-auto"
                >
                    View All Startups
                    <ArrowRightIcon class="h-4 w-4 ml-1" />
                </button>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-20 relative overflow-hidden">
        <div
            class="absolute -top-40 -right-40 w-80 h-80 bg-accent/70 rounded-full opacity-70 blur-3xl"
        />
        <div
            class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/70 rounded-full opacity-70 blur-3xl"
        />

        <div class="container mx-auto px-6 relative z-10">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    What Our <span class="text-primary">Users Say</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Hear from startups and investors who have found success on
                    our platform.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <!-- Testimonial 1 -->
                <div
                    class="bg-card p-8 rounded-2xl shadow-md border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div class="flex items-center mb-6">
                        <div class="w-14 h-14 bg-muted rounded-full mr-4" />
                        <div>
                            <h4 class="font-semibold">Sarah Johnson</h4>
                            <p class="text-sm text-muted-foreground">
                                Founder, EcoSolutions
                            </p>
                        </div>
                    </div>
                    <div class="mb-6">
                        <div class="flex text-yellow-400 mb-2">
                            <StarIcon class="h-5 w-5" />
                            <StarIcon class="h-5 w-5" />
                            <StarIcon class="h-5 w-5" />
                            <StarIcon class="h-5 w-5" />
                            <StarIcon class="h-5 w-5" />
                        </div>
                    </div>
                    <p class="text-muted-foreground italic mb-4">
                        "StartupConnect helped us secure our seed funding in
                        just 6 weeks. The platform made it easy to connect with
                        investors who were genuinely interested in our mission
                        and vision. The verification process gave us
                        credibility, and the analytics dashboard helped us track
                        our progress."
                    </p>
                    <div class="flex items-center justify-end">
                        <QuoteIcon class="h-5 w-5 text-primary/30 mr-2" />
                        <span class="text-primary font-medium text-sm"
                            >Verified Testimonial</span
                        >
                    </div>
                </div>

                <!-- Testimonial 2 -->
                <div
                    class="bg-card p-8 rounded-2xl shadow-md border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div class="flex items-center mb-6">
                        <div class="w-14 h-14 bg-muted rounded-full mr-4" />
                        <div>
                            <h4 class="font-semibold">Michael Chen</h4>
                            <p class="text-sm text-muted-foreground">
                                Angel Investor
                            </p>
                        </div>
                    </div>
                    <div class="mb-6">
                        <div class="flex text-yellow-400 mb-2">
                            <StarIcon class="h-5 w-5" />
                            <StarIcon class="h-5 w-5" />
                            <StarIcon class="h-5 w-5" />
                            <StarIcon class="h-5 w-5" />
                            <StarIcon class="h-5 w-5" />
                        </div>
                    </div>
                    <p class="text-muted-foreground italic mb-4">
                        "As an investor, I've found StartupConnect to be an
                        invaluable resource. The verification process ensures
                        I'm only looking at legitimate opportunities, and the
                        matching algorithm has helped me discover startups I
                        wouldn't have found otherwise."
                    </p>
                    <div class="flex items-center justify-end">
                        <QuoteIcon class="h-5 w-5 text-primary/30 mr-2" />
                        <span class="text-primary font-medium text-sm"
                            >Verified Testimonial</span
                        >
                    </div>
                </div>
            </div>

            <div class="mt-12 text-center">
                <button
                    class="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                >
                    Read More Success Stories
                    <ArrowRightIcon class="h-4 w-4 ml-1" />
                </button>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section
        class="py-20 bg-primary text-primary-foreground relative overflow-hidden"
    >
        <div
            class="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full opacity-30 blur-3xl"
        />
        <div
            class="absolute bottom-0 left-0 w-64 h-64 bg-primary/50 rounded-full opacity-30 blur-3xl"
        />

        <div class="container mx-auto px-6 text-center relative z-10">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">
                Ready to Join the Startup Revolution?
            </h2>
            <p class="text-xl mb-10 max-w-2xl mx-auto opacity-90">
                Whether you're a startup looking for funding or an investor
                seeking opportunities, StartupConnect is the platform for you.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <button
                    class="px-8 py-4 bg-background text-primary font-medium rounded-lg hover:bg-background/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                    Join as Startup
                </button>
                <button
                    class="px-8 py-4 bg-primary-foreground hover:bg-primary-foreground/90 text-primary font-medium rounded-lg border border-primary/20 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                    Become an Investor
                </button>
            </div>
            <p class="mt-8 text-sm opacity-80">
                No credit card required. Free to join.
            </p>
        </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 bg-muted">
        <div class="container mx-auto px-6">
            <div
                class="max-w-3xl mx-auto bg-card p-8 md:p-10 rounded-2xl shadow-md"
            >
                <div class="text-center mb-8">
                    <h3 class="text-2xl font-bold mb-2">Stay Updated</h3>
                    <p class="text-muted-foreground">
                        Subscribe to our newsletter for the latest startup news,
                        funding opportunities, and platform updates.
                    </p>
                </div>
                <form class="flex flex-col sm:flex-row gap-3">
                    <Input type="email" placeholder="Enter your email" />
                    <Button>Subscribe</Button>
                </form>
                <p class="text-xs text-muted-foreground mt-4 text-center">
                    By subscribing, you agree to our Privacy Policy and consent
                    to receive updates from StartupConnect.
                </p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-card text-card-foreground py-16">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div class="col-span-2 md:col-span-1">
                    <div class="text-2xl font-bold mb-6">
                        <span class="text-primary">Startup</span><span
                            class="text-foreground">Connect</span
                        >
                    </div>
                    <p class="text-muted-foreground mb-6">
                        Connecting innovative startups with investors to fuel
                        the next generation of business success.
                    </p>
                    <div class="flex space-x-4">
                        <a
                            href="#"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <TwitterIcon class="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <LinkedinIcon class="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <FacebookIcon class="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <InstagramIcon class="h-5 w-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 class="text-lg font-semibold mb-4">Company</h4>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >About</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >Team</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >Careers</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >Press</a
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-lg font-semibold mb-4">Resources</h4>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >Blog</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >Guides</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >Events</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >FAQ</a
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-lg font-semibold mb-4">Legal</h4>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >Privacy</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >Terms</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >Security</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                                >Cookies</a
                            >
                        </li>
                    </ul>
                </div>
            </div>

            <div
                class="pt-8 border-t border-border text-center md:flex md:justify-between md:text-left"
            >
                <p class="text-muted-foreground mb-4 md:mb-0">
                    © 2025 StartupConnect. All rights reserved.
                </p>
                <div class="flex justify-center md:justify-end space-x-6">
                    <a
                        href="#"
                        class="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="#"
                        class="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                        Terms of Service
                    </a>
                    <a
                        href="#"
                        class="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                        Cookie Policy
                    </a>
                </div>
            </div>
        </div>
    </footer>
</div>

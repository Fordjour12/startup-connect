<script lang="ts">
    // import ModeToggle from "@/components/ModeToggle.vue"
    import Header from "@/components/Header.svelte";
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import * as Card from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import {
        ActivityIcon,
        ArrowRightIcon,
        BanknoteIcon,
        BarChartIcon,
        BriefcaseIcon,
        FacebookIcon,
        FileTextIcon,
        HandshakeIcon,
        InstagramIcon,
        LeafIcon,
        LightbulbIcon,
        LinkedinIcon,
        MessageSquareIcon,
        QuoteIcon,
        RocketIcon,
        SearchIcon,
        ShieldCheckIcon,
        StarIcon,
        TwitterIcon,
        UserPlusIcon,
        UsersIcon,
        ZapIcon,
    } from "@lucide/svelte";

    // Placeholder data for dynamic sections (replace with actual data fetching if needed)
    const featuredStartups = [
        {
            name: "EcoGrow Solutions",
            industry: "AgriTech",
            stage: "Seed",
            description:
                "Revolutionizing urban farming with AI-powered vertical farms.",
            seeking: "$750K",
            logoIcon: LeafIcon,
            image: "/placeholder-startup-1.jpg", // Replace with actual image path
        },
        {
            name: "HealthAI Diagnostics",
            industry: "HealthTech",
            stage: "Series A",
            description:
                "AI platform for early disease detection from medical imaging.",
            seeking: "$3M",
            logoIcon: ActivityIcon,
            image: "/placeholder-startup-2.jpg", // Replace with actual image path
        },
        {
            name: "FinBlock Secure",
            industry: "FinTech",
            stage: "Pre-Seed",
            description:
                "Decentralized identity verification for secure financial transactions.",
            seeking: "$400K",
            logoIcon: ShieldCheckIcon,
            image: "/placeholder-startup-3.jpg", // Replace with actual image path
        },
    ];

    const testimonials = [
        {
            name: "Dr. Lena Vogel",
            role: "Founder, HealthAI Diagnostics",
            stars: 5,
            quote: "StartupConnect was pivotal in our Series A round. The quality of investor connections is unparalleled.",
            avatar: "/avatar-1.jpg", // Replace
        },
        {
            name: "Mark Robinson",
            role: "Partner, Future Ventures",
            stars: 5,
            quote: "The most efficient platform for discovering vetted, high-potential startups. A game-changer for VCs.",
            avatar: "/avatar-2.jpg", // Replace
        },
    ];

    const trustedLogos = [
        // Simple array of image paths for trusted logos
        { src: "/logo-placeholder-1.svg", alt: "Trusted Company 1" },
        { src: "/logo-placeholder-2.svg", alt: "Trusted Company 2" },
        { src: "/logo-placeholder-3.svg", alt: "Trusted Company 3" },
        { src: "/logo-placeholder-4.svg", alt: "Trusted Company 4" },
        { src: "/logo-placeholder-5.svg", alt: "Trusted Company 5" },
    ];
</script>

<!-- 
    Redesigned Homepage for StartupConnect 
    Focus: Storytelling, Visual Hierarchy, Engagement, Modern Aesthetics
-->

<div class="bg-background text-foreground antialiased">
    <Header />

    <!-- Hero Section -->
    <section class="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div
            class="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-background via-accent/30 to-background"
        >
            <div
                class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-50"
            ></div>
        </div>

        <div class="container mx-auto px-6 relative z-10">
            <div class="flex flex-col md:flex-row items-center">
                <div
                    class="md:w-1/2 md:pr-16 mb-12 md:mb-0 text-center md:text-left"
                >
                    <Badge
                        variant="outline"
                        class="border-primary text-primary mb-4 text-sm py-1 px-3 animate-fadeInUp"
                    >
                        <RocketIcon class="h-4 w-4 mr-2" /> Igniting Connections
                    </Badge>
                    <h1
                        class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fadeInUp animation-delay-200"
                    >
                        Where <span class="text-primary">Vision</span> Meets
                        <span class="text-primary">Venture</span>
                    </h1>
                    <p
                        class="text-xl text-muted-foreground mb-10 max-w-xl mx-auto md:mx-0 animate-fadeInUp animation-delay-400"
                    >
                        StartupConnect is the premier platform bridging
                        innovative startups with discerning investors to forge
                        the future of business.
                    </p>
                    <div
                        class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fadeInUp animation-delay-600"
                    >
                        <Button size="lg" href="/register/startup">
                            <UserPlusIcon class="mr-2 h-5 w-5" /> Join as Startup
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            href="/register/investor"
                        >
                            <BanknoteIcon class="mr-2 h-5 w-5" /> Become an Investor
                        </Button>
                    </div>
                    <div
                        class="mt-10 flex items-center justify-center md:justify-start animate-fadeInUp animation-delay-800"
                    >
                        <div class="flex -space-x-3">
                            <!-- Placeholder Avatars -->
                            <img
                                class="w-10 h-10 rounded-full border-2 border-background object-cover"
                                src="/avatar-placeholder-1.jpg"
                                alt="User 1"
                            />
                            <img
                                class="w-10 h-10 rounded-full border-2 border-background object-cover"
                                src="/avatar-placeholder-2.jpg"
                                alt="User 2"
                            />
                            <img
                                class="w-10 h-10 rounded-full border-2 border-background object-cover"
                                src="/avatar-placeholder-3.jpg"
                                alt="User 3"
                            />
                            <div
                                class="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-foreground font-medium"
                            >
                                700+
                            </div>
                        </div>
                        <p class="ml-4 text-sm text-muted-foreground">
                            Join a growing community of <span
                                class="font-semibold text-foreground"
                                >innovators & backers.</span
                            >
                        </p>
                    </div>
                </div>
                <div class="md:w-1/2 relative animate-fadeInRight">
                    <!-- Enhanced Visual Element for Hero -->
                    <div class="relative aspect-square max-w-lg mx-auto">
                        <div
                            class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/20 to-accent/20 blur-xl opacity-70 animate-pulse animation-duration-3000"
                        ></div>
                        <img
                            src="/hero-illustration.svg"
                            alt="Startup and Investor Collaboration"
                            class="relative z-10 w-full h-full object-contain p-4"
                        />
                        <div
                            class="absolute -bottom-8 -right-8 z-20 p-3 bg-card shadow-xl rounded-full"
                        >
                            <div
                                class="p-3 bg-primary text-primary-foreground rounded-full"
                            >
                                <RocketIcon class="h-8 w-8" />
                            </div>
                        </div>
                        <div
                            class="absolute -top-8 -left-8 z-20 p-4 bg-card shadow-xl rounded-2xl"
                        >
                            <BanknoteIcon class="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Trusted By / Solution Intro Section -->
    <section class="py-16 border-y border-border bg-background">
        <div class="container mx-auto px-6">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    The Ecosystem <span class="text-primary">Reimagined</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Navigating the startup and investment landscape can be
                    complex. StartupConnect simplifies this journey, creating
                    direct pathways to success.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-10 items-center mb-16">
                <div class="space-y-6">
                    <div
                        class="flex items-start gap-4 p-6 bg-card border rounded-xl shadow-sm"
                    >
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center"
                        >
                            <LightbulbIcon class="w-6 h-6" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold mb-1">
                                For Startups: Amplify Your Vision
                            </h3>
                            <p class="text-muted-foreground">
                                Stop navigating endless mazes. Get discovered by
                                verified investors actively seeking innovation
                                in your sector. Showcase your potential,
                                streamline your pitch, and secure the funding
                                you deserve.
                            </p>
                        </div>
                    </div>
                    <div
                        class="flex items-start gap-4 p-6 bg-card border rounded-xl shadow-sm"
                    >
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center"
                        >
                            <BriefcaseIcon class="w-6 h-6" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold mb-1">
                                For Investors: Discover Quality Deals
                            </h3>
                            <p class="text-muted-foreground">
                                Cut through the noise. Access a curated pipeline
                                of vetted startups with detailed profiles,
                                traction data, and clear investment asks. Make
                                informed decisions, faster.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="relative h-80 md:h-96">
                    <!-- Placeholder for a more engaging visual than just logos -->
                    <img
                        src="/ecosystem-connection.svg"
                        alt="Connecting Startups and Investors"
                        class="w-full h-full object-contain"
                    />
                </div>
            </div>

            <div class="mt-16">
                <p
                    class="text-center text-sm text-muted-foreground uppercase tracking-wider font-medium mb-6"
                >
                    Trusted by Innovators and Industry Leaders
                </p>
                <div
                    class="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 md:gap-x-16"
                >
                    {#each trustedLogos as logo}
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            class="h-7 md:h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                        />
                    {/each}
                </div>
            </div>
        </div>
    </section>

    <!-- Key Benefits & Impact Section -->
    <section class="py-20 bg-muted">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    Unlock <span class="text-primary">Exponential Growth</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Leverage StartupConnect to achieve your strategic goals,
                    whether you're scaling a startup or diversifying an
                    investment portfolio.
                </p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Benefit Card 1 -->
                <Card.Root
                    class="text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                >
                    <Card.Header class="pb-4">
                        <div
                            class="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4"
                        >
                            <ZapIcon class="w-8 h-8" />
                        </div>
                        <Card.Title class="text-2xl font-semibold"
                            >Accelerated Connections</Card.Title
                        >
                    </Card.Header>
                    <Card.Content>
                        <p class="text-muted-foreground">
                            Find your ideal match faster with our AI-powered
                            discovery and curated introductions.
                        </p>
                    </Card.Content>
                </Card.Root>
                <!-- Benefit Card 2 -->
                <Card.Root
                    class="text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                >
                    <Card.Header class="pb-4">
                        <div
                            class="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4"
                        >
                            <ShieldCheckIcon class="w-8 h-8" />
                        </div>
                        <Card.Title class="text-2xl font-semibold"
                            >Vetted Opportunities</Card.Title
                        >
                    </Card.Header>
                    <Card.Content>
                        <p class="text-muted-foreground">
                            Engage with confidence through our rigorous
                            verification process for all members.
                        </p>
                    </Card.Content>
                </Card.Root>
                <!-- Benefit Card 3 -->
                <Card.Root
                    class="text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                >
                    <Card.Header class="pb-4">
                        <div
                            class="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4"
                        >
                            <BarChartIcon class="w-8 h-8" />
                        </div>
                        <Card.Title class="text-2xl font-semibold"
                            >Data-Driven Insights</Card.Title
                        >
                    </Card.Header>
                    <Card.Content>
                        <p class="text-muted-foreground">
                            Make informed decisions with comprehensive profiles,
                            analytics, and trend reports.
                        </p>
                    </Card.Content>
                </Card.Root>
                <!-- Benefit Card 4 -->
                <Card.Root
                    class="text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                >
                    <Card.Header class="pb-4">
                        <div
                            class="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4"
                        >
                            <UsersIcon class="w-8 h-8" />
                        </div>
                        <Card.Title class="text-2xl font-semibold"
                            >Thriving Community</Card.Title
                        >
                    </Card.Header>
                    <Card.Content>
                        <p class="text-muted-foreground">
                            Join a network of peers, mentors, and leaders
                            dedicated to mutual success.
                        </p>
                    </Card.Content>
                </Card.Root>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-20">
        <div class="container mx-auto px-6">
            <div class="text-center mb-20">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    Simple Steps to <span class="text-primary">Success</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our streamlined process makes connecting and growing easier
                    than ever.
                </p>
            </div>

            <div class="relative">
                <!-- Connecting line for desktop -->
                <div
                    class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 -z-10"
                ></div>
                <div
                    class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary -translate-y-1/2 -z-10 w-1/3 animate-lineGrow"
                ></div>

                <div class="grid md:grid-cols-3 gap-x-12 gap-y-16">
                    <!-- Step 1 -->
                    <div
                        class="text-center relative flex flex-col items-center"
                    >
                        <div
                            class="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold mx-auto mb-6 z-10 shadow-lg transform transition-transform duration-300 hover:scale-110"
                        >
                            1
                        </div>
                        <div
                            class="p-6 bg-card border rounded-xl flex-grow w-full"
                        >
                            <UserPlusIcon
                                class="h-12 w-12 text-primary mx-auto mb-4"
                            />
                            <h3 class="text-xl font-semibold mb-3">
                                Sign Up & Profile
                            </h3>
                            <p class="text-muted-foreground">
                                Create your detailed, verified profile in
                                minutes—whether you're a startup or an investor.
                            </p>
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div
                        class="text-center relative flex flex-col items-center"
                    >
                        <div
                            class="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold mx-auto mb-6 z-10 shadow-lg transform transition-transform duration-300 hover:scale-110"
                        >
                            2
                        </div>
                        <div
                            class="p-6 bg-card border rounded-xl flex-grow w-full"
                        >
                            <SearchIcon
                                class="h-12 w-12 text-primary mx-auto mb-4"
                            />
                            <h3 class="text-xl font-semibold mb-3">
                                Discover & Connect
                            </h3>
                            <p class="text-muted-foreground">
                                Utilize smart filters and AI matching to find
                                relevant opportunities. Initiate secure
                                conversations.
                            </p>
                        </div>
                    </div>

                    <!-- Step 3 -->
                    <div
                        class="text-center relative flex flex-col items-center"
                    >
                        <div
                            class="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold mx-auto mb-6 z-10 shadow-lg transform transition-transform duration-300 hover:scale-110"
                        >
                            3
                        </div>
                        <div
                            class="p-6 bg-card border rounded-xl flex-grow w-full"
                        >
                            <HandshakeIcon
                                class="h-12 w-12 text-primary mx-auto mb-4"
                            />
                            <h3 class="text-xl font-semibold mb-3">
                                Engage & Grow
                            </h3>
                            <p class="text-muted-foreground">
                                Share documents, track milestones, and finalize
                                deals. Achieve your funding or investment goals.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Core Features Section -->
    <section id="features" class="py-20 bg-muted">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    Platform <span class="text-primary">Highlights</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explore the tools and features designed for your success.
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Feature Card Template -->
                {#each [{ title: "AI Smart Matching", description: "Our algorithm connects startups with the most relevant investors based on deep data analysis.", icon: SearchIcon }, { title: "Verified Profiles", description: "Rigorous verification for all members builds trust and ensures quality connections.", icon: ShieldCheckIcon }, { title: "Secure Communication", description: "End-to-end encrypted messaging and document sharing for confidential discussions.", icon: MessageSquareIcon }, { title: "Advanced Analytics", description: "Track engagement, view interest trends, and optimize your strategy with our dashboard.", icon: BarChartIcon }, { title: "Resource Hub", description: "Access guides, templates, and expert advice to navigate the startup journey.", icon: FileTextIcon }, { title: "Community Forum", description: "Connect with peers, ask questions, and share insights within our exclusive member community.", icon: UsersIcon }] as feature}
                    <Card.Root
                        class="flex flex-col hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    >
                        <Card.Header class="flex-row items-center gap-4 pb-4">
                            <div
                                class="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0"
                            >
                                <svelte:component
                                    this={feature.icon}
                                    class="h-6 w-6"
                                />
                            </div>
                            <Card.Title class="text-xl font-semibold"
                                >{feature.title}</Card.Title
                            >
                        </Card.Header>
                        <Card.Content class="flex-grow">
                            <p class="text-muted-foreground">
                                {feature.description}
                            </p>
                        </Card.Content>
                        <Card.Footer class="pt-4">
                            <Button
                                variant="link"
                                class="p-0 h-auto text-primary"
                                >Learn More <ArrowRightIcon
                                    class="ml-2 h-4 w-4"
                                /></Button
                            >
                        </Card.Footer>
                    </Card.Root>
                {/each}
            </div>
        </div>
    </section>

    <!-- Featured Startups Section -->
    <section id="startups" class="py-20">
        <div class="container mx-auto px-6">
            <div
                class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
            >
                <div>
                    <h2 class="text-3xl md:text-4xl font-bold">
                        Spotlight: <span class="text-primary"
                            >Emerging Innovators</span
                        >
                    </h2>
                    <p class="text-lg text-muted-foreground mt-2 max-w-2xl">
                        Get a glimpse of promising ventures currently seeking
                        investment on StartupConnect.
                    </p>
                </div>
                <Button
                    variant="outline"
                    href="/startups"
                    class="flex-shrink-0"
                >
                    View All Startups <ArrowRightIcon class="h-4 w-4 ml-2" />
                </Button>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each featuredStartups as startup}
                    <Card.Root
                        class="overflow-hidden group hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    >
                        <div class="h-52 overflow-hidden relative">
                            <img
                                src={startup.image}
                                alt={startup.name}
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div class="absolute top-4 left-4">
                                <Badge variant="secondary"
                                    >{startup.industry}</Badge
                                >
                            </div>
                            <div
                                class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent"
                            ></div>
                            <div
                                class="absolute bottom-4 left-4 text-primary-foreground"
                            >
                                <h3 class="font-semibold text-xl">
                                    {startup.name}
                                </h3>
                            </div>
                        </div>
                        <Card.Content class="p-6">
                            <p
                                class="text-muted-foreground mb-4 text-sm h-20 overflow-hidden"
                            >
                                {startup.description}
                            </p>
                            <div class="flex justify-between items-center mb-4">
                                <Badge
                                    variant="outline"
                                    class="border-primary text-primary"
                                    >{startup.stage}</Badge
                                >
                                <span class="text-lg font-semibold text-primary"
                                    >{startup.seeking}</span
                                >
                            </div>
                            <Button
                                class="w-full"
                                variant="default"
                                href={`/startup/${startup.name.toLowerCase().replace(/ /g, "-")}`}
                            >
                                View Profile <ArrowRightIcon
                                    class="h-4 w-4 ml-2"
                                />
                            </Button>
                        </Card.Content>
                    </Card.Root>
                {/each}
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-20 bg-muted relative overflow-hidden">
        <div
            class="absolute -top-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"
        ></div>
        <div
            class="absolute -bottom-20 -left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10"
        ></div>
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    Success <span class="text-primary">Stories</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Hear from founders and investors who've achieved their goals
                    with StartupConnect.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {#each testimonials as testimonial}
                    <Card.Root
                        class="flex flex-col p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    >
                        <Card.Header class="flex items-start gap-4 p-0 mb-4">
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                class="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                            />
                            <div>
                                <Card.Title class="text-xl"
                                    >{testimonial.name}</Card.Title
                                >
                                <p class="text-sm text-muted-foreground">
                                    {testimonial.role}
                                </p>
                            </div>
                        </Card.Header>
                        <Card.Content class="p-0 flex-grow">
                            <div class="flex text-yellow-400 mb-3">
                                {#each Array(testimonial.stars) as _}
                                    <StarIcon class="h-5 w-5 fill-current" />
                                {/each}
                                {#each Array(5 - testimonial.stars) as _}
                                    <StarIcon
                                        class="h-5 w-5 text-muted-foreground/50"
                                    />
                                {/each}
                            </div>
                            <blockquote
                                class="text-muted-foreground italic leading-relaxed"
                            >
                                "{testimonial.quote}"
                            </blockquote>
                        </Card.Content>
                        <Card.Footer class="p-0 pt-6 mt-auto flex justify-end">
                            <QuoteIcon class="h-8 w-8 text-primary/10" />
                        </Card.Footer>
                    </Card.Root>
                {/each}
            </div>
            <div class="mt-12 text-center">
                <Button
                    variant="ghost"
                    href="/success-stories"
                    class="text-primary hover:text-primary"
                >
                    Read More Success Stories
                    <ArrowRightIcon class="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    </section>

    <!-- Final CTA Section -->
    <section
        class="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
    >
        <div class="container mx-auto px-6 text-center">
            <RocketIcon class="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 class="text-4xl md:text-5xl font-bold mb-6">
                Ready to Launch Your Next Venture?
            </h2>
            <p class="text-xl mb-10 max-w-2xl mx-auto opacity-90">
                Join StartupConnect today. Whether you're building the future or
                funding it, your journey starts here.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                    size="lg"
                    variant="secondary"
                    href="/register/startup"
                    class="bg-background text-primary hover:bg-background/90"
                >
                    Create Startup Profile
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    href="/register/investor"
                    class="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                    Explore Investment Opportunities
                </Button>
            </div>
            <p class="mt-8 text-sm opacity-70">
                It's free to get started. Unlock a world of possibilities.
            </p>
        </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 bg-background border-t border-border">
        <div class="container mx-auto px-6">
            <Card.Root class="max-w-2xl mx-auto shadow-lg border-primary/20">
                <Card.Header class="text-center pb-4">
                    <Card.Title class="text-2xl font-semibold"
                        >Stay Ahead of the Curve</Card.Title
                    >
                    <Card.Description class="text-muted-foreground mt-1">
                        Subscribe for insider news, funding alerts, and platform
                        updates.
                    </Card.Description>
                </Card.Header>
                <Card.Content>
                    <form class="flex flex-col sm:flex-row gap-3 items-center">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            class="flex-grow"
                            aria-label="Email for newsletter"
                        />
                        <Button type="submit" class="w-full sm:w-auto">
                            Subscribe Now
                        </Button>
                    </form>
                </Card.Content>
                <Card.Footer class="pt-4">
                    <p class="text-xs text-muted-foreground text-center w-full">
                        By subscribing, you agree to our Privacy Policy. No
                        spam, ever.
                    </p>
                </Card.Footer>
            </Card.Root>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-card text-card-foreground py-16 border-t border-border">
        <div class="container mx-auto px-6">
            <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12"
            >
                <div class="col-span-full md:col-span-1">
                    <a href="/" class="text-2xl font-bold mb-4 inline-block">
                        <span class="text-primary">Startup</span>Connect
                    </a>
                    <p class="text-muted-foreground text-sm mb-6">
                        Fueling innovation by connecting visionary startups with
                        strategic investors.
                    </p>
                    <div class="flex space-x-4">
                        {#each [{ href: "#", icon: TwitterIcon, label: "Twitter" }, { href: "#", icon: LinkedinIcon, label: "LinkedIn" }, { href: "#", icon: FacebookIcon, label: "Facebook" }, { href: "#", icon: InstagramIcon, label: "Instagram" }] as social}
                            <a
                                href={social.href}
                                aria-label={social.label}
                                class="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <svelte:component
                                    this={social.icon}
                                    class="h-5 w-5"
                                />
                            </a>
                        {/each}
                    </div>
                </div>

                <div>
                    <h4
                        class="text-sm font-semibold uppercase tracking-wider text-foreground mb-4"
                    >
                        Company
                    </h4>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="/about"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >About Us</a
                            >
                        </li>
                        <li>
                            <a
                                href="/careers"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Careers</a
                            >
                        </li>
                        <li>
                            <a
                                href="/press"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Press</a
                            >
                        </li>
                        <li>
                            <a
                                href="/contact"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Contact</a
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <h4
                        class="text-sm font-semibold uppercase tracking-wider text-foreground mb-4"
                    >
                        For Startups
                    </h4>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="/how-it-works#startups"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >How It Works</a
                            >
                        </li>
                        <li>
                            <a
                                href="/submit-startup"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Submit Profile</a
                            >
                        </li>
                        <li>
                            <a
                                href="/resources/startup-guides"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Founder Guides</a
                            >
                        </li>
                        <li>
                            <a
                                href="/pricing"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Pricing</a
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <h4
                        class="text-sm font-semibold uppercase tracking-wider text-foreground mb-4"
                    >
                        For Investors
                    </h4>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="/how-it-works#investors"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >How It Works</a
                            >
                        </li>
                        <li>
                            <a
                                href="/browse-startups"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Browse Startups</a
                            >
                        </li>
                        <li>
                            <a
                                href="/resources/investor-insights"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Investor Insights</a
                            >
                        </li>
                        <li>
                            <a
                                href="/register/investor"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Join as Investor</a
                            >
                        </li>
                    </ul>
                </div>
            </div>

            <div
                class="pt-8 border-t border-border/50 text-sm text-muted-foreground"
            >
                <div
                    class="flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <p>
                        &copy; {new Date().getFullYear()} StartupConnect. All rights
                        reserved.
                    </p>
                    <div class="flex space-x-6">
                        <a
                            href="/privacy-policy"
                            class="hover:text-primary transition-colors"
                            >Privacy Policy</a
                        >
                        <a
                            href="/terms-of-service"
                            class="hover:text-primary transition-colors"
                            >Terms of Service</a
                        >
                    </div>
                </div>
            </div>
        </div>
    </footer>
</div>

<style>
    /* Simple Animation Utilities */
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
    .animate-fadeInRight {
        animation: fadeInRight 0.6s ease-out forwards;
        opacity: 0;
    }
    .animation-delay-200 {
        animation-delay: 0.2s;
    }
    .animation-delay-400 {
        animation-delay: 0.4s;
    }
    .animation-delay-600 {
        animation-delay: 0.6s;
    }
    .animation-delay-800 {
        animation-delay: 0.8s;
    }
    .animation-duration-3000 {
        animation-duration: 3s;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    .animate-lineGrow {
        animation: lineGrow 1.5s ease-out forwards;
        transform-origin: left;
    }
    @keyframes lineGrow {
        from {
            transform: scaleX(0) translateY(-50%);
        }
        to {
            transform: scaleX(0.33) translateY(-50%); /* Adjust scaleX based on desired initial fill */
        }
    }

    /* Styling for the ::-webkit-scrollbar (optional, for a more polished look) */
    /* ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    ::-webkit-scrollbar-track {
        background: hsl(var(--muted));
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: hsl(var(--primary) / 0.6);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--primary));
    } */
</style>

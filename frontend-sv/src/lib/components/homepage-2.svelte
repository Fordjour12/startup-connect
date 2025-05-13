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
        ChevronRightIcon,
        FacebookIcon,
        FileTextIcon,
        HandshakeIcon,
        HelpCircleIcon,
        InstagramIcon,
        LeafIcon,
        LinkedinIcon,
        MessageSquareIcon,
        QuoteIcon,
        RocketIcon,
        SearchIcon,
        ShieldCheckIcon,
        StarIcon,
        TargetIcon,
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
                "Revolutionizing urban farming with AI-powered vertical farms ensuring sustainable food production for growing urban populations.",
            seeking: "$750K",
            logoIcon: LeafIcon,
            image: "/placeholder-startup-1.jpg", // Replace with actual image path
        },
        {
            name: "HealthAI Diagnostics",
            industry: "HealthTech",
            stage: "Series A",
            description:
                "AI platform for early disease detection from medical imaging, improving patient outcomes through timely intervention.",
            seeking: "$3M",
            logoIcon: ActivityIcon,
            image: "/placeholder-startup-2.jpg", // Replace with actual image path
        },
        {
            name: "FinBlock Secure",
            industry: "FinTech",
            stage: "Pre-Seed",
            description:
                "Decentralized identity verification for secure financial transactions, combating fraud and enhancing user trust.",
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
            quote: "StartupConnect was pivotal in our Series A round. The quality of investor connections and the platform's ease of use are unparalleled.",
            avatar: "/avatar-1.jpg", // Replace
        },
        {
            name: "Mark Robinson",
            role: "Partner, Future Ventures",
            stars: 5,
            quote: "The most efficient platform for discovering vetted, high-potential startups. StartupConnect has become an indispensable tool for our investment strategy.",
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

    let activeSection = $state(""); // For scroll-based animations or active states if needed later

    /*
    $effect(() => {
        // Basic scroll spy for section title animations (can be expanded)
        const sections = document.querySelectorAll("section[id]");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-sectionIn");
                        // Optional: update activeSection rune
                        // activeSection = entry.target.id;
                    }
                });
            },
            { threshold: 0.1 } // Adjust threshold as needed
        );
        sections.forEach((section) => observer.observe(section));
        return () => sections.forEach((section) => observer.unobserve(section));
    });
    */
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
                        class="border-primary text-primary mb-4 text-sm py-1.5 px-4 animate-fadeInUp shadow-sm"
                    >
                        <RocketIcon class="h-4 w-4 mr-2" /> Igniting Connections,
                        Fueling Futures
                    </Badge>
                    <h1
                        class="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fadeInUp animation-delay-200"
                    >
                        Where <span class="text-primary">Vision</span> Meets
                        <span class="text-primary">Venture Capital</span>
                    </h1>
                    <p
                        class="text-xl text-muted-foreground mb-10 max-w-xl mx-auto md:mx-0 animate-fadeInUp animation-delay-400"
                    >
                        StartupConnect is the premier ecosystem bridging
                        groundbreaking startups with strategic investors to
                        build tomorrow's industry leaders.
                    </p>
                    <div
                        class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fadeInUp animation-delay-600"
                    >
                        <Button
                            size="lg"
                            href="/register/startup"
                            class="shadow-md hover:shadow-lg transition-shadow"
                        >
                            <UserPlusIcon class="mr-2 h-5 w-5" /> Join as Startup
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            href="/register/investor"
                            class="shadow-sm hover:shadow-md transition-shadow"
                        >
                            <BanknoteIcon class="mr-2 h-5 w-5" /> Become an Investor
                        </Button>
                    </div>
                    <div
                        class="mt-12 flex items-center justify-center md:justify-start space-x-6 animate-fadeInUp animation-delay-800"
                    >
                        <div class="flex -space-x-3 items-center">
                            <img
                                class="w-10 h-10 rounded-full border-2 border-background object-cover shadow"
                                src="/avatar-placeholder-1.jpg"
                                alt="User 1"
                            />
                            <img
                                class="w-10 h-10 rounded-full border-2 border-background object-cover shadow"
                                src="/avatar-placeholder-2.jpg"
                                alt="User 2"
                            />
                            <img
                                class="w-10 h-10 rounded-full border-2 border-background object-cover shadow"
                                src="/avatar-placeholder-3.jpg"
                                alt="User 3"
                            />
                            <div
                                class="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs text-primary font-semibold shadow"
                            >
                                700+
                            </div>
                        </div>
                        <p class="text-sm text-muted-foreground">
                            Trusted by a growing community of <strong
                                class="text-foreground"
                                >innovators & backers.</strong
                            >
                        </p>
                    </div>
                </div>
                <div class="md:w-1/2 relative animate-fadeInRight">
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
                            class="absolute -bottom-8 -right-8 z-20 p-3 bg-card shadow-xl rounded-full animate-float"
                        >
                            <div
                                class="p-3 bg-primary text-primary-foreground rounded-full"
                            >
                                <RocketIcon class="h-8 w-8" />
                            </div>
                        </div>
                        <div
                            class="absolute -top-8 -left-8 z-20 p-4 bg-card shadow-xl rounded-2xl animate-float animation-delay-500"
                        >
                            <BanknoteIcon class="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- The Challenge & Solution Section -->
    <section
        id="challenge-solution"
        class="py-20 lg:py-28 border-y border-border bg-background"
    >
        <div class="container mx-auto px-6">
            <div class="text-center mb-16 lg:mb-20">
                <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight"
                >
                    Bridging the <span class="text-primary">Innovation Gap</span
                    >
                </h2>
                <p class="text-lg text-muted-foreground max-w-3xl mx-auto">
                    The path from a brilliant idea to a market-leading company
                    is fraught with challenges for both founders and funders.
                    StartupConnect offers a streamlined solution.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
                <!-- Problem Column -->
                <div class="space-y-8">
                    <div class="flex items-start gap-4">
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center mt-1"
                        >
                            <HelpCircleIcon class="w-6 h-6" />
                        </div>
                        <div>
                            <h3 class="text-2xl font-semibold mb-2">
                                The Startup's Hurdle
                            </h3>
                            <p class="text-muted-foreground text-lg mb-3">
                                Founders often struggle with visibility,
                                accessing the right investors, and navigating
                                the complex fundraising landscape efficiently.
                            </p>
                            <ul class="space-y-2 text-muted-foreground">
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-5 w-5 mr-2 text-primary/70"
                                    />Limited investor network
                                </li>
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-5 w-5 mr-2 text-primary/70"
                                    />Difficulty standing out
                                </li>
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-5 w-5 mr-2 text-primary/70"
                                    />Time-consuming outreach
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center mt-1"
                        >
                            <HelpCircleIcon class="w-6 h-6" />
                        </div>
                        <div>
                            <h3 class="text-2xl font-semibold mb-2">
                                The Investor's Dilemma
                            </h3>
                            <p class="text-muted-foreground text-lg mb-3">
                                Investors face an overwhelming influx of
                                pitches, making it hard to find quality, vetted
                                deals that align with their investment thesis.
                            </p>
                            <ul class="space-y-2 text-muted-foreground">
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-5 w-5 mr-2 text-primary/70"
                                    />Information overload
                                </li>
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-5 w-5 mr-2 text-primary/70"
                                    />Sourcing high-quality deal flow
                                </li>
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-5 w-5 mr-2 text-primary/70"
                                    />Time-intensive due diligence
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Solution Column / Image -->
                <div class="space-y-8">
                    <div
                        class="flex items-start gap-4 p-6 bg-card border border-primary/20 rounded-xl shadow-lg"
                    >
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mt-1"
                        >
                            <TargetIcon class="w-7 h-7" />
                        </div>
                        <div>
                            <h3
                                class="text-2xl font-semibold mb-2 text-primary"
                            >
                                Our Solution: StartupConnect
                            </h3>
                            <p class="text-muted-foreground text-lg mb-3">
                                We provide a curated, efficient, and transparent
                                platform that directly connects verified
                                startups with relevant investors, fostering
                                meaningful partnerships.
                            </p>
                            <ul class="space-y-2 text-muted-foreground">
                                <li class="flex items-center">
                                    <RocketIcon
                                        class="h-5 w-5 mr-2 text-primary/70"
                                    />AI-powered matching
                                </li>
                                <li class="flex items-center">
                                    <ShieldCheckIcon
                                        class="h-5 w-5 mr-2 text-primary/70"
                                    />Verified profiles & data rooms
                                </li>
                                <li class="flex items-center">
                                    <HandshakeIcon
                                        class="h-5 w-5 mr-2 text-primary/70"
                                    />Streamlined communication
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div
                        class="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-md"
                    >
                        <img
                            src="/ecosystem-connection-alt.svg"
                            alt="StartupConnect Solution Illustration"
                            class="w-full h-full object-cover"
                        />
                        <!-- Consider adding an overlay text or icon here if the image itself isn't self-explanatory enough -->
                    </div>
                </div>
            </div>

            <div class="mt-20">
                <p
                    class="text-center text-sm text-muted-foreground uppercase tracking-wider font-medium mb-8"
                >
                    Trusted by Innovators and Industry Leaders
                </p>
                <div
                    class="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-20"
                >
                    {#each trustedLogos as logo}
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            class="h-8 md:h-9 w-auto opacity-75 hover:opacity-100 transition-opacity"
                        />
                    {/each}
                </div>
            </div>
        </div>
    </section>

    <!-- Key Benefits & Impact Section -->
    <section id="benefits" class="py-20 lg:py-28 bg-muted">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16 lg:mb-20">
                <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
                >
                    Unlock <span class="text-primary">Exponential Growth</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Leverage StartupConnect to achieve your strategic goals,
                    whether you're scaling a startup or diversifying an
                    investment portfolio.
                </p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card.Root
                    class="text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1.5 bg-card"
                >
                    <Card.Header class="pb-4">
                        <div
                            class="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 shadow-sm"
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
                        <p class="text-xs text-primary mt-2 font-medium">
                            Reduce outreach time by up to 70%
                        </p>
                    </Card.Content>
                </Card.Root>
                <Card.Root
                    class="text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1.5 bg-card"
                >
                    <Card.Header class="pb-4">
                        <div
                            class="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 shadow-sm"
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
                        <p class="text-xs text-primary mt-2 font-medium">
                            Access pre-qualified startups & investors
                        </p>
                    </Card.Content>
                </Card.Root>
                <Card.Root
                    class="text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1.5 bg-card"
                >
                    <Card.Header class="pb-4">
                        <div
                            class="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 shadow-sm"
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
                        <p class="text-xs text-primary mt-2 font-medium">
                            Utilize rich data for strategic moves
                        </p>
                    </Card.Content>
                </Card.Root>
                <Card.Root
                    class="text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1.5 bg-card"
                >
                    <Card.Header class="pb-4">
                        <div
                            class="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 shadow-sm"
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
                        <p class="text-xs text-primary mt-2 font-medium">
                            Collaborate and learn from the best
                        </p>
                    </Card.Content>
                </Card.Root>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-20 lg:py-28">
        <div class="container mx-auto px-6">
            <div class="text-center mb-20 lg:mb-24">
                <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
                >
                    Simple Steps to <span class="text-primary">Success</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our streamlined process makes connecting and growing easier
                    than ever.
                </p>
            </div>

            <div class="relative">
                <div
                    class="hidden md:block absolute top-12 left-0 right-0 h-1 bg-border/70 -translate-y-1/2 -z-10"
                ></div>
                <!-- Optional: Add animated line segment here if desired -->

                <div class="grid md:grid-cols-3 gap-x-12 gap-y-16">
                    <div
                        class="text-center relative flex flex-col items-center"
                    >
                        <div
                            class="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-4xl font-bold mx-auto mb-8 z-10 shadow-lg transform transition-transform duration-300 hover:scale-110 border-4 border-background"
                        >
                            1
                        </div>
                        <div
                            class="p-8 bg-card border rounded-xl flex-grow w-full shadow-md"
                        >
                            <UserPlusIcon
                                class="h-12 w-12 text-primary mx-auto mb-5"
                            />
                            <h3 class="text-xl lg:text-2xl font-semibold mb-3">
                                Sign Up & Profile
                            </h3>
                            <p class="text-muted-foreground">
                                Create your detailed, verified profile in
                                minutes—whether you're a startup or an investor.
                            </p>
                        </div>
                    </div>

                    <div
                        class="text-center relative flex flex-col items-center"
                    >
                        <div
                            class="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-4xl font-bold mx-auto mb-8 z-10 shadow-lg transform transition-transform duration-300 hover:scale-110 border-4 border-background"
                        >
                            2
                        </div>
                        <div
                            class="p-8 bg-card border rounded-xl flex-grow w-full shadow-md"
                        >
                            <SearchIcon
                                class="h-12 w-12 text-primary mx-auto mb-5"
                            />
                            <h3 class="text-xl lg:text-2xl font-semibold mb-3">
                                Discover & Connect
                            </h3>
                            <p class="text-muted-foreground">
                                Utilize smart filters and AI matching to find
                                relevant opportunities. Initiate secure
                                conversations.
                            </p>
                        </div>
                    </div>

                    <div
                        class="text-center relative flex flex-col items-center"
                    >
                        <div
                            class="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-4xl font-bold mx-auto mb-8 z-10 shadow-lg transform transition-transform duration-300 hover:scale-110 border-4 border-background"
                        >
                            3
                        </div>
                        <div
                            class="p-8 bg-card border rounded-xl flex-grow w-full shadow-md"
                        >
                            <HandshakeIcon
                                class="h-12 w-12 text-primary mx-auto mb-5"
                            />
                            <h3 class="text-xl lg:text-2xl font-semibold mb-3">
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
    <section id="features" class="py-20 lg:py-28 bg-muted">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16 lg:mb-20">
                <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
                >
                    Platform <span class="text-primary">Highlights</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explore the tools and features designed for your success,
                    providing a seamless experience for all users.
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each [{ title: "AI Smart Matching", description: "Our algorithm connects startups with the most relevant investors based on deep data analysis.", icon: SearchIcon }, { title: "Verified Profiles", description: "Rigorous verification for all members builds trust and ensures quality connections.", icon: ShieldCheckIcon }, { title: "Secure Communication", description: "End-to-end encrypted messaging and document sharing for confidential discussions.", icon: MessageSquareIcon }, { title: "Advanced Analytics", description: "Track engagement, view interest trends, and optimize your strategy with our dashboard.", icon: BarChartIcon }, { title: "Resource Hub", description: "Access guides, templates, and expert advice to navigate the startup journey.", icon: FileTextIcon }, { title: "Community Forum", description: "Connect with peers, ask questions, and share insights within our exclusive member community.", icon: UsersIcon }] as feature}
                    <Card.Root
                        class="flex flex-col hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1.5 bg-card"
                    >
                        <Card.Header class="flex-row items-center gap-4 pb-4">
                            <div
                                class="w-14 h-14 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                            >
                                <svelte:component
                                    this={feature.icon}
                                    class="h-7 w-7"
                                />
                            </div>
                            <Card.Title
                                class="text-xl lg:text-2xl font-semibold"
                                >{feature.title}</Card.Title
                            >
                        </Card.Header>
                        <Card.Content class="flex-grow">
                            <p class="text-muted-foreground">
                                {feature.description}
                            </p>
                        </Card.Content>
                        <!-- Removed Learn More button as per plan, can be re-added if links are available -->
                        <Card.Footer class="pt-4 mt-auto">
                            <p class="text-xs text-primary/70">
                                Empowering your connections.
                            </p>
                        </Card.Footer>
                    </Card.Root>
                {/each}
            </div>
        </div>
    </section>

    <!-- Featured Startups Section -->
    <section id="startups" class="py-20 lg:py-28">
        <div class="container mx-auto px-6">
            <div
                class="flex flex-col md:flex-row justify-between items-center mb-12 lg:mb-16 gap-4"
            >
                <div class="text-center md:text-left">
                    <h2
                        class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
                    >
                        Spotlight: <span class="text-primary"
                            >Emerging Innovators</span
                        >
                    </h2>
                    <p class="text-lg text-muted-foreground mt-3 max-w-2xl">
                        Get a glimpse of promising ventures currently seeking
                        investment and connections on StartupConnect.
                    </p>
                </div>
                <Button
                    variant="outline"
                    href="/startups"
                    class="flex-shrink-0 shadow-sm hover:shadow-md transition-shadow"
                >
                    View All Startups <ArrowRightIcon class="h-4 w-4 ml-2" />
                </Button>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each featuredStartups as startup}
                    <Card.Root
                        class="overflow-hidden group hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1.5 bg-card flex flex-col"
                    >
                        <div class="h-56 overflow-hidden relative">
                            <img
                                src={startup.image}
                                alt={startup.name}
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div class="absolute top-4 left-4">
                                <Badge variant="secondary" class="shadow"
                                    >{startup.industry}</Badge
                                >
                            </div>
                            <div
                                class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/75 to-transparent"
                            ></div>
                            <div
                                class="absolute bottom-4 left-4 text-primary-foreground"
                            >
                                <h3
                                    class="font-semibold text-xl drop-shadow-sm"
                                >
                                    {startup.name}
                                </h3>
                            </div>
                        </div>
                        <Card.Content class="p-6 flex-grow flex flex-col">
                            <!-- 
                                For better text truncation, consider a line-clamp utility.
                                Example: class="line-clamp-3" (requires Tailwind plugin or custom CSS) 
                            -->
                            <p
                                class="text-muted-foreground mb-4 text-sm min-h-[60px]"
                            >
                                {startup.description}
                            </p>
                            <div
                                class="flex justify-between items-center text-sm mb-5"
                            >
                                <Badge
                                    variant="outline"
                                    class="border-primary text-primary font-medium"
                                    >{startup.stage}</Badge
                                >
                                <span class="text-lg font-semibold text-primary"
                                    >{startup.seeking}</span
                                >
                            </div>
                            <Button
                                class="w-full mt-auto"
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
    <section
        id="testimonials"
        class="py-20 lg:py-28 bg-muted relative overflow-hidden"
    >
        <div
            class="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 opacity-70"
        ></div>
        <div
            class="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10 opacity-70"
        ></div>
        <div class="container mx-auto px-6">
            <div class="text-center mb-16 lg:mb-20">
                <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
                >
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
                        class="flex flex-col p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1.5 bg-card"
                    >
                        <Card.Header class="flex items-center gap-4 p-0 mb-5">
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                class="w-16 h-16 rounded-full object-cover border-2 border-primary/10 shadow-sm"
                            />
                            <div>
                                <Card.Title class="text-xl font-semibold"
                                    >{testimonial.name}</Card.Title
                                >
                                <p class="text-sm text-muted-foreground">
                                    {testimonial.role}
                                </p>
                            </div>
                        </Card.Header>
                        <Card.Content class="p-0 flex-grow">
                            <div class="flex text-yellow-400 mb-4">
                                {#each Array(testimonial.stars) as _}
                                    <StarIcon class="h-5 w-5 fill-current" />
                                {/each}
                                {#each Array(5 - testimonial.stars) as _}
                                    <StarIcon
                                        class="h-5 w-5 text-muted-foreground/30"
                                    />
                                {/each}
                            </div>
                            <blockquote
                                class="text-muted-foreground italic leading-relaxed text-base relative pl-5"
                            >
                                {testimonial.quote}
                            </blockquote>
                        </Card.Content>
                        <Card.Footer class="p-0 pt-6 mt-auto flex justify-end">
                            <QuoteIcon class="h-10 w-10 text-primary/10" />
                        </Card.Footer>
                    </Card.Root>
                {/each}
            </div>
            <div class="mt-16 text-center">
                <Button
                    variant="ghost"
                    href="/success-stories"
                    class="text-primary hover:text-primary text-lg py-2 px-4"
                >
                    Read More Success Stories
                    <ArrowRightIcon class="h-5 w-5 ml-2" />
                </Button>
            </div>
        </div>
    </section>

    <!-- Final CTA Section -->
    <section
        class="py-20 lg:py-28 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground"
    >
        <div class="container mx-auto px-6 text-center">
            <RocketIcon
                class="h-20 w-20 mx-auto mb-8 opacity-80 animate-float"
            />
            <h2
                class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            >
                Ready to Launch Your Next Venture?
            </h2>
            <p class="text-xl lg:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
                Join StartupConnect today. Whether you're building the future or
                funding it, your journey to success accelerates here.
            </p>
            <div
                class="flex flex-col sm:flex-row justify-center gap-x-6 gap-y-4"
            >
                <Button
                    size="lg"
                    href="/register/startup"
                    class="bg-background text-primary hover:bg-background/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-150 py-3 px-8 text-lg"
                >
                    Create Startup Profile
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    href="/register/investor"
                    class="border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground hover:border-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-150 py-3 px-8 text-lg"
                >
                    Explore Investment Opportunities
                </Button>
            </div>
            <p class="mt-10 text-sm opacity-70">
                It's free to get started. Unlock a world of possibilities.
            </p>
        </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 lg:py-24 bg-background border-t border-border">
        <div class="container mx-auto px-6">
            <Card.Root
                class="max-w-2xl mx-auto shadow-xl border-primary/10 rounded-xl"
            >
                <Card.Header class="text-center pb-6 pt-8">
                    <Card.Title class="text-2xl lg:text-3xl font-semibold"
                        >Stay Ahead of the Curve</Card.Title
                    >
                    <Card.Description
                        class="text-muted-foreground mt-2 text-base"
                    >
                        Subscribe for insider news, funding alerts, and platform
                        updates.
                    </Card.Description>
                </Card.Header>
                <Card.Content class="px-6 pb-8">
                    <form class="flex flex-col sm:flex-row gap-3 items-center">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            class="flex-grow h-12 text-base shadow-sm"
                            aria-label="Email for newsletter"
                        />
                        <Button
                            type="submit"
                            class="w-full sm:w-auto h-12 text-base shadow-md hover:shadow-lg transition-shadow"
                        >
                            Subscribe Now
                        </Button>
                    </form>
                </Card.Content>
                <Card.Footer class="px-6 pt-0 pb-6">
                    <p class="text-xs text-muted-foreground text-center w-full">
                        By subscribing, you agree to our <a
                            href="/privacy-policy"
                            class="hover:text-primary underline"
                            >Privacy Policy</a
                        >. No spam, ever.
                    </p>
                </Card.Footer>
            </Card.Root>
        </div>
    </section>

    <!-- Footer -->
    <footer
        class="bg-card text-card-foreground py-16 lg:py-20 border-t border-border/70"
    >
        <div class="container mx-auto px-6">
            <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12 lg:mb-16"
            >
                <div class="col-span-full lg:col-span-2">
                    <a
                        href="/"
                        class="text-2xl font-bold mb-4 inline-flex items-center"
                    >
                        <RocketIcon class="h-7 w-7 mr-2 text-primary" />
                        <span class="text-primary">Startup</span>Connect
                    </a>
                    <p class="text-muted-foreground text-sm mb-6 max-w-md">
                        Fueling innovation by connecting visionary startups with
                        strategic investors. Our platform streamlines discovery,
                        diligence, and deal-making.
                    </p>
                    <div class="flex space-x-4">
                        {#each [{ href: "#", icon: TwitterIcon, label: "Twitter" }, { href: "#", icon: LinkedinIcon, label: "LinkedIn" }, { href: "#", icon: FacebookIcon, label: "Facebook" }, { href: "#", icon: InstagramIcon, label: "Instagram" }] as social}
                            <a
                                href={social.href}
                                aria-label={social.label}
                                class="text-muted-foreground hover:text-primary transition-colors p-2 bg-muted/50 hover:bg-muted rounded-md"
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
                        class="text-base font-semibold uppercase tracking-wider text-foreground mb-5"
                    >
                        Company
                    </h4>
                    <ul class="space-y-3">
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
                                >Press Kit</a
                            >
                        </li>
                        <li>
                            <a
                                href="/contact"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Contact Us</a
                            >
                        </li>
                        <li>
                            <a
                                href="/blog"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Blog</a
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <h4
                        class="text-base font-semibold uppercase tracking-wider text-foreground mb-5"
                    >
                        For Startups
                    </h4>
                    <ul class="space-y-3">
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
                                >Pricing Plans</a
                            >
                        </li>
                        <li>
                            <a
                                href="/faq#startups"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Startup FAQ</a
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <h4
                        class="text-base font-semibold uppercase tracking-wider text-foreground mb-5"
                    >
                        For Investors
                    </h4>
                    <ul class="space-y-3">
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
                        <li>
                            <a
                                href="/faq#investors"
                                class="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >Investor FAQ</a
                            >
                        </li>
                    </ul>
                </div>
            </div>

            <div
                class="pt-10 border-t border-border/50 text-sm text-muted-foreground"
            >
                <div
                    class="flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <p>
                        &copy; {new Date().getFullYear()} StartupConnect. All rights
                        reserved. Built with Svelte & Love.
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
                        <a
                            href="/sitemap"
                            class="hover:text-primary transition-colors"
                            >Sitemap</a
                        >
                    </div>
                </div>
            </div>
        </div>
    </footer>
</div>

<style>
    /* Enhanced Animation Utilities & Styles */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(25px);
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
    @keyframes float {
        /* Subtle floating animation for hero icons */
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-8px);
        }
    }
    @keyframes sectionIn {
        /* For section title entrances */
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fadeInUp {
        animation: fadeInUp 0.7s ease-out forwards;
        opacity: 0;
    }
    .animate-fadeInRight {
        animation: fadeInRight 0.7s ease-out forwards;
        opacity: 0;
    }
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
    /* Apply this class to section titles or wrappers for animation on scroll */
    .animate-sectionIn {
        animation: sectionIn 0.8s ease-out forwards;
        opacity: 0; /* Initial state before animation */
    }

    .animation-delay-200 {
        animation-delay: 0.2s;
    }
    .animation-delay-400 {
        animation-delay: 0.4s;
    }
    .animation-delay-500 {
        animation-delay: 0.5s;
    } /* Added for hero icons */
    .animation-delay-600 {
        animation-delay: 0.6s;
    }
    .animation-delay-800 {
        animation-delay: 0.8s;
    }
    .animation-duration-3000 {
        animation-duration: 3s;
    }

    /* Ensure section titles that should animate have the `animate-sectionIn` class applied via script or manually if preferred */
    /* Example: <h2 class="... animate-sectionIn"> */
    section[id] h2,
    section[id] > div > div > h2 {
        /* Target common heading structures within sections */
        /* This is a fallback if JS observer isn't perfectly setup or for no-JS */
        /* It's better to add class via $effect for controlled animation */
    }

    /* Optional: Custom scrollbar (already present, kept for reference) */
    /* ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: hsl(var(--muted)); border-radius: 10px; }
    ::-webkit-scrollbar-thumb { background: hsl(var(--primary) / 0.6); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: hsl(var(--primary)); } */

    /* Improve readability of lists with icons */
    ul li svg {
        flex-shrink: 0; /* Prevents icons from shrinking if text wraps */
    }
</style>

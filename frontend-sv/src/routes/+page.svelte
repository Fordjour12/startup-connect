<script lang="ts">
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
        FacebookIcon,
        GlobeIcon,
        HandshakeIcon,
        InstagramIcon,
        LeafIcon,
        LinkedinIcon,
        LockIcon,
        MessageSquareIcon,
        PlayIcon,
        RocketIcon,
        SparklesIcon,
        TrendingUpIcon,
        UserPlusIcon,
        UsersIcon,
        ZapIcon,
        TargetIcon,
        ShieldCheckIcon,
        FileTextIcon,
        TwitterIcon,
        ChevronRightIcon,
    } from "@lucide/svelte";

    import type { LayoutProps } from "./$types";
    let { data }: LayoutProps = $props();

    const featuredStartups = [
        {
            name: "EcoGrow Solutions",
            industry: "CleanTech",
            stage: "Seed",
            description:
                "Revolutionary AI-powered vertical farming technology for sustainable urban agriculture.",
            seeking: "$750K",
            logoIcon: LeafIcon,
            image: "/startups/ecogrow.jpg",
            metrics: {
                growth: "127%",
                users: "50K+",
                revenue: "$2.1M",
            },
        },
        {
            name: "HealthAI Diagnostics",
            industry: "HealthTech",
            stage: "Series A",
            description:
                "Early disease detection platform using advanced AI and medical imaging analysis.",
            seeking: "$3M",
            logoIcon: ActivityIcon,
            image: "/startups/healthai.jpg",
            metrics: {
                growth: "94%",
                users: "200K+",
                revenue: "$4.8M",
            },
        },
        {
            name: "FinBlock Secure",
            industry: "FinTech",
            stage: "Pre-Seed",
            description:
                "Next-gen blockchain security platform for decentralized financial transactions.",
            seeking: "$500K",
            logoIcon: LockIcon,
            image: "/startups/finblock.jpg",
            metrics: {
                growth: "156%",
                users: "10K+",
                revenue: "$800K",
            },
        },
        {
            name: "CloudBurst AI",
            industry: "AI/ML",
            stage: "Seed",
            description:
                "Platform providing on-demand access to specialized AI models for complex data analysis.",
            seeking: "$1.2M",
            logoIcon: ZapIcon,
            image: "/startups/cloudburst.jpg",
            metrics: {
                growth: "210%",
                users: "5K+",
                revenue: "$1.5M",
            },
        },
        {
            name: "EduPath Global",
            industry: "EdTech",
            stage: "Series A",
            description:
                "Personalized learning platform using adaptive AI to customize educational content.",
            seeking: "$4M",
            logoIcon: GlobeIcon,
            image: "/startups/edupath.jpg",
            metrics: {
                growth: "115%",
                users: "1M+",
                revenue: "$6.2M",
            },
        },
        {
            name: "Nexus Connect",
            industry: "SaaS",
            stage: "Pre-Seed",
            description:
                "Collaborative workspace solution enhancing team productivity through integrated tools.",
            seeking: "$600K",
            logoIcon: HandshakeIcon,
            image: "/startups/nexus.jpg",
            metrics: {
                growth: "180%",
                users: "20K+",
                revenue: "$950K",
            },
        },
    ];

    const testimonials = [
        {
            name: "Dr. Sarah Chen",
            role: "Founder & CEO, HealthAI",
            stars: 5,
            quote: "StartupConnect's AI matching algorithm connected us with investors who truly understand the healthcare space. We closed our Series A in record time.",
            avatar: "/team/sarah.jpg",
            metrics: {
                raised: "$3M",
                timeline: "45 days",
            },
        },
        {
            name: "Mark Thompson",
            role: "Partner, Vertex Ventures",
            stars: 5,
            quote: "The quality of startups and the detailed analytics have transformed our deal flow. We've doubled our portfolio's performance since joining.",
            avatar: "/team/mark.jpg",
            metrics: {
                deals: "12+",
                roi: "3.2x",
            },
        },
        {
            name: "Alex Rivera",
            role: "Founder, TechFin Solutions",
            stars: 5,
            quote: "The platform's end-to-end fundraising tools and investor matching capabilities exceeded our expectations. Game-changing for founders.",
            avatar: "/team/alex.jpg",
            metrics: {
                raised: "$5M",
                timeline: "60 days",
            },
        },
    ];

    const stats = [
        { value: "$180M+", label: "Total Funding Raised", icon: BanknoteIcon },
        { value: "94%", label: "Success Rate", icon: TargetIcon },
        { value: "2,500+", label: "Active Investors", icon: UsersIcon },
        { value: "350+", label: "Startups Funded", icon: RocketIcon },
    ];

    const features = [
        {
            title: "AI-Powered Matching",
            description:
                "Our proprietary algorithm analyzes 50+ data points to connect startups with the perfect investors.",
            icon: SparklesIcon,
            color: "bg-blue-500/10 text-blue-500",
        },
        {
            title: "Smart Analytics",
            description:
                "Real-time insights and metrics to optimize your fundraising strategy and investor engagement.",
            icon: BarChartIcon,
            color: "bg-purple-500/10 text-purple-500",
        },
        {
            title: "Secure Data Rooms",
            description:
                "Enterprise-grade security for sharing confidential documents and due diligence materials.",
            icon: ShieldCheckIcon,
            color: "bg-green-500/10 text-green-500",
        },
        {
            title: "Expert Network",
            description:
                "Access our curated network of advisors, mentors, and industry experts for guidance.",
            icon: UsersIcon,
            color: "bg-orange-500/10 text-orange-500",
        },
        {
            title: "Deal Flow Management",
            description:
                "Streamlined tools for managing investor relationships and tracking engagement.",
            icon: MessageSquareIcon,
            color: "bg-pink-500/10 text-pink-500",
        },
        {
            title: "Resource Hub",
            description:
                "Comprehensive library of templates, guides, and best practices for fundraising success.",
            icon: FileTextIcon,
            color: "bg-indigo-500/10 text-indigo-500",
        },
    ];

    let activeSection = $state("home");
    let isScrolled = $state(false);
    let activeFeatureIndex = $state(0);
    let activeTestimonialIndex = $state(0);
    let Icons = $derived(features[activeFeatureIndex].icon);

    // Auto-rotate features and testimonials
    $effect(() => {
        if (typeof window !== "undefined") {
            const featureInterval = setInterval(() => {
                activeFeatureIndex = (activeFeatureIndex + 1) % features.length;
            }, 5000);

            const testimonialInterval = setInterval(() => {
                activeTestimonialIndex =
                    (activeTestimonialIndex + 1) % testimonials.length;
            }, 8000);

            return () => {
                clearInterval(featureInterval);
                clearInterval(testimonialInterval);
            };
        }
    });

    // Scroll spy for section tracking
    $effect(() => {
        const handleScroll = () => {
            isScrolled = window.scrollY > 50;

            const sections = document.querySelectorAll("section[id]");
            const scrollPosition = window.scrollY + 100;

            sections.forEach((section) => {
                if (section instanceof HTMLElement) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;

                    if (
                        scrollPosition >= sectionTop &&
                        scrollPosition < sectionTop + sectionHeight
                    ) {
                        activeSection = section.id || "home";
                        section.classList.add("animate-sectionIn");
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    // Intersection Observer for animations
    $effect(() => {
        if (typeof window !== "undefined" && typeof document !== "undefined") {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("animate-in");
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: "0px",
                },
            );

            document.querySelectorAll(".animate-on-scroll").forEach((el) => {
                observer.observe(el);
            });

            return () => observer.disconnect();
        }
    });
</script>

<!-- class=" container mx-auto min-h-screen flex flex-col bg-background text-foreground antialiased overflow-x-hidden" -->
<div>
    <Header {data} />

    <!-- Hero Section -->
    <section
        id="hero"
        class="relative pt-24 lg:pt-32 pb-20 lg:pb-32 overflow-hidden"
    >
        <!-- Background Elements -->
        <div class="absolute inset-0 -z-10">
            <!-- Gradient background -->
            <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--primary),0.08),transparent_50%)]"
            ></div>

            <!-- Grid pattern -->
            <div
                class="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            ></div>

            <!-- Floating orbs -->
            <div
                class="absolute -top-24 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
            ></div>
            <div
                class="absolute top-1/2 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float animation-delay-2000"
            ></div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 relative">
            <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <!-- Left Column -->
                <div class="text-center lg:text-left">
                    <div class="space-y-8 max-w-2xl mx-auto lg:mx-0">
                        <!-- Hero Badge -->
                        <Badge
                            variant="outline"
                            class="inline-flex border-primary/30 text-primary py-1.5 px-4 animate-fadeInUp"
                        >
                            <SparklesIcon class="h-4 w-4 mr-2" />
                            The Future of Startup Funding
                        </Badge>

                        <!-- Main Heading -->
                        <h1
                            class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight animate-fadeInUp animation-delay-200"
                        >
                            Where <span class="text-primary bg-primary/5 px-2"
                                >Innovation</span
                            >
                            Meets
                            <span class="text-primary bg-primary/5 px-2"
                                >Investment</span
                            >
                        </h1>

                        <!-- Description -->
                        <p
                            class="text-lg sm:text-xl text-muted-foreground animate-fadeInUp animation-delay-400 max-w-xl mx-auto lg:mx-0"
                        >
                            Connect with the right investors, streamline your
                            fundraising, and accelerate your startup's growth
                            with our AI-powered platform.
                        </p>

                        <!-- CTA Buttons -->
                        {#if !data.user.role}
                            <div
                                class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeInUp animation-delay-600"
                            >
                                <Button
                                    size="lg"
                                    class="rounded-full h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:scale-105"
                                >
                                    <RocketIcon class="mr-2 h-5 w-5" />
                                    Get Started Free
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    class="rounded-full h-12 px-8 hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    <PlayIcon class="mr-2 h-5 w-5" />
                                    Watch Demo
                                </Button>
                            </div>
                        {:else}
                            <Button
                                href={data.user.role === 'founder' ? '/dashboard/founder' : 
                                      data.user.role === 'investor' ? '/dashboard/investor' : 
                                      '/dashboard/supporter'}
                                class="rounded-full h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:scale-105"
                            >
                              Go to Dashboard
                            </Button>
                        {/if}

                        <!-- Stats Grid -->
                        <div
                            class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 animate-fadeInUp animation-delay-800"
                        >
                            {#each stats as stat}
                                <div
                                    class="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors"
                                >
                                    <stat.icon
                                        class="h-6 w-6 text-primary mb-2"
                                    />
                                    <div
                                        class="text-2xl font-bold text-primary"
                                    >
                                        {stat.value}
                                    </div>
                                    <div class="text-xs text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>

                <!-- Right Column - Interactive Feature Display -->
                <div class="relative animate-fadeInRight">
                    <!-- Main Display Card -->
                    <div class="relative aspect-square max-w-lg mx-auto">
                        <!-- Background Effects -->
                        <div
                            class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 blur-xl opacity-80 animate-pulse animation-duration-3000"
                        ></div>

                        <!-- Feature Cards -->
                        <div
                            class="relative bg-card border border-border/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm"
                        >
                            <!-- Active Feature -->
                            <div class="mb-8">
                                <div
                                    class={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${features[activeFeatureIndex].color}`}
                                >
                                    <!-- <svelte:component
                                              this={features[activeFeatureIndex].icon}
                                              class="size-6"
                                          /> -->

                                    <Icons class="size-6" />
                                </div>

                                <h3 class="text-xl font-semibold mb-2">
                                    {features[activeFeatureIndex].title}
                                </h3>
                                <p class="text-muted-foreground">
                                    {features[activeFeatureIndex].description}
                                </p>
                            </div>

                            <!-- Feature Indicators -->
                            <div class="flex gap-2">
                                {#each features as feature, i}
                                    <button
                                        class={`h-1.5 rounded-full transition-all duration-300 ${i === activeFeatureIndex ? "bg-primary w-8" : "bg-primary/20 w-4"}`}
                                        onclick={() => (activeFeatureIndex = i)}
                                        aria-label={`Select ${feature.title} feature`}
                                    ></button>
                                {/each}
                            </div>

                            <!-- Floating Elements -->
                            <div
                                class="absolute -top-6 -right-6 p-4 bg-card rounded-xl shadow-lg border border-border/50 animate-float"
                            >
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center"
                                    >
                                        <TrendingUpIcon
                                            class="h-5 w-5 text-green-500"
                                        />
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium">
                                            Success Rate
                                        </div>
                                        <div
                                            class="text-2xl font-bold text-primary"
                                        >
                                            94%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="absolute -bottom-6 -left-6 p-4 bg-card rounded-xl shadow-lg border border-border/50 animate-float animation-delay-500"
                            >
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center"
                                    >
                                        <UsersIcon
                                            class="h-5 w-5 text-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium">
                                            Active Users
                                        </div>
                                        <div
                                            class="text-2xl font-bold text-primary"
                                        >
                                            2.5K+
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--  Scroll Indicator -->
            <!--
            <div
                class="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center animate-bounce"
            >
                <span class="text-sm text-muted-foreground mb-2"
                    >Scroll to explore</span
                >
                <ChevronDownIcon class="h-5 w-5 text-muted-foreground" />
            </div> -->
        </div>
    </section>

    <!-- What We Solve Section -->
    <section id="solution" class="py-20 lg:py-28 bg-muted/50">
        <div class="container mx-auto px-4 sm:px-6">
            <div class="text-center mb-16">
                <Badge variant="outline" class="mb-4">Our Mission</Badge>
                <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight"
                >
                    Solving the <span class="text-primary">Connection Gap</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-3xl mx-auto">
                    The journey from innovation to successful business requires
                    the right partnerships. We've built the bridge between
                    visionary founders and strategic investors.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div class="space-y-8 order-2 md:order-1">
                    <div
                        class="flex items-start gap-4 p-6 bg-background rounded-xl shadow-sm transform transition-transform hover:scale-105 border border-border/50"
                    >
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mt-1"
                        >
                            <UserPlusIcon class="w-6 h-6" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold mb-2">
                                For Startups
                            </h3>
                            <p class="text-muted-foreground mb-3">
                                Get connected with investors who understand your
                                vision and can provide more than just capital.
                            </p>
                            <ul class="space-y-2 text-muted-foreground">
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-4 w-4 text-primary mr-2"
                                    />
                                    Targeted investor matching
                                </li>
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-4 w-4 text-primary mr-2"
                                    />
                                    Streamlined due diligence
                                </li>
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-4 w-4 text-primary mr-2"
                                    />
                                    Enhanced visibility to funders
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div
                        class="flex items-start gap-4 p-6 bg-background rounded-xl shadow-sm transform transition-transform hover:scale-105 border border-border/50"
                    >
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mt-1"
                        >
                            <BanknoteIcon class="w-6 h-6" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold mb-2">
                                For Investors
                            </h3>
                            <p class="text-muted-foreground mb-3">
                                Access pre-vetted opportunities aligned with
                                your investment thesis and strategic goals.
                            </p>
                            <ul class="space-y-2 text-muted-foreground">
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-4 w-4 text-primary mr-2"
                                    />
                                    Dealflow customized to your criteria
                                </li>
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-4 w-4 text-primary mr-2"
                                    />
                                    Comprehensive startup profiles
                                </li>
                                <li class="flex items-center">
                                    <ChevronRightIcon
                                        class="h-4 w-4 text-primary mr-2"
                                    />
                                    Efficient communication channels
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="relative order-1 md:order-2">
                    <div
                        class="p-1 bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent rounded-2xl"
                    >
                        <div class="bg-card p-8 rounded-xl">
                            <h3
                                class="text-2xl font-bold mb-6 flex items-center"
                            >
                                <TargetIcon class="w-7 h-7 text-primary mr-3" />
                                Our Impact
                            </h3>

                            <div class="space-y-6">
                                <div class="relative pl-8">
                                    <div
                                        class="absolute left-0 top-0 w-1 h-full bg-primary/20 rounded-full"
                                    ></div>
                                    <div
                                        class="absolute left-0 top-0 w-1 h-[85%] bg-primary rounded-full"
                                    ></div>
                                    <div class="mb-1 flex justify-between">
                                        <span class="font-medium"
                                            >Matching Accuracy</span
                                        >
                                        <span class="text-primary font-bold"
                                            >85%</span
                                        >
                                    </div>
                                    <p class="text-sm text-muted-foreground">
                                        Higher than industry average by 35%
                                    </p>
                                </div>

                                <div class="relative pl-8">
                                    <div
                                        class="absolute left-0 top-0 w-1 h-full bg-primary/20 rounded-full"
                                    ></div>
                                    <div
                                        class="absolute left-0 top-0 w-1 h-[70%] bg-primary rounded-full"
                                    ></div>
                                    <div class="mb-1 flex justify-between">
                                        <span class="font-medium"
                                            >Funding Success Rate</span
                                        >
                                        <span class="text-primary font-bold"
                                            >70%</span
                                        >
                                    </div>
                                    <p class="text-sm text-muted-foreground">
                                        3x higher than traditional methods
                                    </p>
                                </div>

                                <div class="relative pl-8">
                                    <div
                                        class="absolute left-0 top-0 w-1 h-full bg-primary/20 rounded-full"
                                    ></div>
                                    <div
                                        class="absolute left-0 top-0 w-1 h-[94%] bg-primary rounded-full"
                                    ></div>
                                    <div class="mb-1 flex justify-between">
                                        <span class="font-medium"
                                            >Investor Satisfaction</span
                                        >
                                        <span class="text-primary font-bold"
                                            >94%</span
                                        >
                                    </div>
                                    <p class="text-sm text-muted-foreground">
                                        Based on post-investment surveys
                                    </p>
                                </div>
                            </div>

                            <div class="mt-8 pt-6 border-t border-border">
                                <div class="flex items-center gap-3">
                                    <RocketIcon class="h-5 w-5 text-primary" />
                                    <span class="text-lg font-bold"
                                        >{stats[1].value} Startups Funded</span
                                    >
                                </div>
                                <p class="mt-2 text-sm text-muted-foreground">
                                    Across 32 countries and 18 industries
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Startups Section -->
    <section id="startups" class="py-20 lg:py-28 bg-muted/50">
        <div class="container mx-auto px-4 sm:px-6">
            <!-- Section Header -->
            <div class="text-center mb-16">
                <Badge variant="outline" class="mb-4">Featured Startups</Badge>
                <h2 class="text-3xl lg:text-5xl font-bold mb-4">
                    Discover <span class="text-primary">Promising Ventures</span
                    >
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Connect with innovative startups actively seeking investment
                    and strategic partnerships.
                </p>
            </div>

            <!-- Startup Cards Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each featuredStartups as startup}
                    <Card.Root
                        class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card overflow-hidden border border-border/50"
                    >
                        <!-- Card Header with Image -->
                        <div class="relative h-48 overflow-hidden">
                            <img
                                src={startup.image}
                                alt={startup.name}
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                            ></div>

                            <!-- Overlay Content -->
                            <div class="absolute bottom-0 left-0 right-0 p-4">
                                <Badge
                                    variant="secondary"
                                    class="mb-2 shadow-sm"
                                >
                                    {startup.industry}
                                </Badge>
                                <h3
                                    class="text-lg font-semibold text-white mb-1"
                                >
                                    {startup.name}
                                </h3>
                                <p class="text-white/80 text-sm line-clamp-2">
                                    {startup.description}
                                </p>
                            </div>
                        </div>

                        <!-- Card Content -->
                        <Card.Content class="p-4">
                            <!-- Metrics Grid -->
                            <div class="grid grid-cols-3 gap-2 mb-4">
                                <div
                                    class="text-center p-2 rounded-lg bg-primary/5"
                                >
                                    <div
                                        class="text-sm font-medium text-primary"
                                    >
                                        {startup.metrics.growth}
                                    </div>
                                    <div class="text-xs text-muted-foreground">
                                        Growth
                                    </div>
                                </div>
                                <div
                                    class="text-center p-2 rounded-lg bg-primary/5"
                                >
                                    <div
                                        class="text-sm font-medium text-primary"
                                    >
                                        {startup.metrics.users}
                                    </div>
                                    <div class="text-xs text-muted-foreground">
                                        Users
                                    </div>
                                </div>
                                <div
                                    class="text-center p-2 rounded-lg bg-primary/5"
                                >
                                    <div
                                        class="text-sm font-medium text-primary"
                                    >
                                        {startup.metrics.revenue}
                                    </div>
                                    <div class="text-xs text-muted-foreground">
                                        Revenue
                                    </div>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="flex items-center justify-between">
                                <Badge variant="outline" class="text-primary">
                                    {startup.stage}
                                </Badge>
                                <span class="text-lg font-semibold text-primary"
                                    >{startup.seeking}</span
                                >
                            </div>
                        </Card.Content>

                        <!-- Card Actions -->
                        <Card.Footer class="p-4 pt-0">
                            <Button
                                variant="secondary"
                                class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            >
                                View Profile
                                <ArrowRightIcon class="h-4 w-4 ml-2" />
                            </Button>
                        </Card.Footer>
                    </Card.Root>
                {/each}
            </div>

            <!-- View All Button -->
            <div class="text-center mt-12">
                <Button variant="outline" size="lg" class="rounded-full">
                    Explore All Startups
                    <ArrowRightIcon class="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 lg:py-28">
        <div class="container mx-auto px-4 sm:px-6">
            <!-- Section Header -->
            <div class="text-center mb-16">
                <Badge variant="outline" class="mb-4">Platform Features</Badge>
                <h2 class="text-3xl lg:text-5xl font-bold mb-4">
                    Powerful <span class="text-primary">Tools</span> for Success
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Everything you need to streamline your fundraising journey
                    and connect with the right partners.
                </p>
            </div>

            <!-- Features Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each features as feature}
                    <div class="group">
                        <Card.Root
                            class="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border border-border/50"
                        >
                            <Card.Header class="flex items-start gap-4 p-6">
                                <div
                                    class={`size-14 rounded-lg flex items-center justify-center ${feature.color} transition-transform group-hover:scale-110`}
                                >
                                    {#if feature.icon === SparklesIcon}
                                        <SparklesIcon class="h-6 w-6" />
                                    {:else if feature.icon === BarChartIcon}
                                        <BarChartIcon class="h-6 w-6" />
                                    {:else if feature.icon === ShieldCheckIcon}
                                        <ShieldCheckIcon class="h-6 w-6" />
                                    {:else if feature.icon === UsersIcon}
                                        <UsersIcon class="h-6 w-6" />
                                    {:else if feature.icon === MessageSquareIcon}
                                        <MessageSquareIcon class="h-6 w-6" />
                                    {:else if feature.icon === FileTextIcon}
                                        <FileTextIcon class="h-6 w-6" />
                                    {/if}
                                </div>
                                <div>
                                    <Card.Title
                                        class="text-xl font-semibold mb-2"
                                        >{feature.title}</Card.Title
                                    >
                                    <Card.Description
                                        >{feature.description}</Card.Description
                                    >
                                </div>
                            </Card.Header>
                        </Card.Root>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 lg:py-28 bg-muted relative overflow-hidden">
        <!-- Background Effects -->
        <div class="absolute inset-0">
            <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.15),transparent_80%)]"
            ></div>
            <div
                class="absolute -right-24 top-0 w-96 h-96 rounded-full bg-primary-foreground/10 blur-2xl"
            ></div>
            <div
                class="absolute -left-24 bottom-0 w-96 h-96 rounded-full bg-primary-foreground/10 blur-2xl"
            ></div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 relative">
            <div class="max-w-3xl mx-auto text-center">
                <RocketIcon class="h-16 w-16 mx-auto mb-8 animate-float" />

                <h2 class="text-4xl lg:text-6xl font-bold mb-6">
                    Ready to Scale Your Success?
                </h2>

                <p class="text-xl lg:text-2xl mb-10 opacity-90">
                    Join thousands of successful startups and investors on our
                    platform.
                </p>

                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="lg"
                        class="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full h-12 px-8"
                    >
                        Get Started Free
                        <ArrowRightIcon class="ml-2 h-5 w-5" />
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        class="border-primary-foreground/40 rounded-full h-12 px-8 hover:bg-primary-foreground/10"
                    >
                        Schedule a Demo
                        <PlayIcon class="ml-2 h-5 w-5" />
                    </Button>
                </div>

                <p class="mt-8 text-sm opacity-80">
                    No credit card required · Free 30-day trial · Cancel anytime
                </p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-muted/30 border-t border-border py-16">
        <div class="container mx-auto px-4 sm:px-6">
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12"
            >
                <!-- Brand Column -->
                <div class="lg:col-span-1">
                    <a
                        href="/"
                        class="flex items-center text-xl font-bold mb-4"
                    >
                        <RocketIcon class="h-6 w-6 mr-2 text-primary" />
                        <span class="text-primary">Startup</span>Connect
                    </a>
                    <p class="text-sm text-muted-foreground mb-6">
                        Connecting visionary startups with strategic investors.
                        Building the future of innovation together.
                    </p>
                    <div class="flex space-x-4">
                        {#each [TwitterIcon, LinkedinIcon, FacebookIcon, InstagramIcon] as Icon}
                            <a
                                href="/"
                                class="w-10 h-10 flex items-center justify-center rounded-full bg-background hover:bg-primary/5 border border-border hover:border-primary/30 transition-colors"
                            >
                                <Icon class="h-5 w-5 text-muted-foreground" />
                            </a>
                        {/each}
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="font-semibold mb-4">Product</h4>
                    <ul class="space-y-2">
                        {#each ["Features", "Pricing", "For Startups", "For Investors", "Success Stories"] as item}
                            <li>
                                <a
                                    href="/"
                                    class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div>
                    <h4 class="font-semibold mb-4">Company</h4>
                    <ul class="space-y-2">
                        {#each ["About Us", "Careers", "Blog", "Press", "Contact"] as item}
                            <li>
                                <a
                                    href="/"
                                    class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div>
                    <h4 class="font-semibold mb-4">Resources</h4>
                    <ul class="space-y-2">
                        {#each ["Help Center", "Documentation", "Guides", "API", "Community"] as item}
                            <li>
                                <a
                                    href="/"
                                    class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>

            <!-- Newsletter Form -->
            <div class="border-t border-border pt-8 pb-4">
                <div class="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h4 class="font-semibold mb-2">Stay in the loop</h4>
                        <p class="text-sm text-muted-foreground mb-0">
                            Get the latest news, updates and tips delivered
                            directly to your inbox.
                        </p>
                    </div>
                    <div>
                        <form class="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                class="h-10 flex-grow"
                            />
                            <Button class="h-10">Subscribe</Button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Copyright -->
            <div
                class="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground"
            >
                <p>
                    © {new Date().getFullYear()} StartupConnect. All rights reserved.
                </p>
                <div class="flex gap-6 mt-4 md:mt-0">
                    <a href="/" class="hover:text-foreground transition-colors"
                        >Terms</a
                    >
                    <a href="/" class="hover:text-foreground transition-colors"
                        >Privacy</a
                    >
                    <a href="/" class="hover:text-foreground transition-colors"
                        >Cookies</a
                    >
                </div>
            </div>
        </div>
    </footer>
</div>

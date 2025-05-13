<script lang="ts">
    import Header from "@/components/Header.svelte";
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import * as Card from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import {
        Tabs,
        TabsContent,
        TabsList,
        TabsTrigger,
    } from "@/components/ui/tabs";
    // Note: Make sure to add carousel components to your project
    // import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
        ChevronDownIcon,
        GlobeIcon,
        SparklesIcon,
        TrendingUpIcon,
    } from "@lucide/svelte";

    // Placeholder data for dynamic sections
    const featuredStartups = [
        {
            name: "EcoGrow Solutions",
            industry: "AgriTech",
            stage: "Seed",
            description:
                "Revolutionizing urban farming with AI-powered vertical farms ensuring sustainable food production for growing urban populations.",
            seeking: "$750K",
            logoIcon: LeafIcon,
            image: "/placeholder-startup-1.jpg",
        },
        {
            name: "HealthAI Diagnostics",
            industry: "HealthTech",
            stage: "Series A",
            description:
                "AI platform for early disease detection from medical imaging, improving patient outcomes through timely intervention.",
            seeking: "$3M",
            logoIcon: ActivityIcon,
            image: "/placeholder-startup-2.jpg",
        },
        {
            name: "FinBlock Secure",
            industry: "FinTech",
            stage: "Pre-Seed",
            description:
                "Decentralized identity verification for secure financial transactions, combating fraud and enhancing user trust.",
            seeking: "$400K",
            logoIcon: ShieldCheckIcon,
            image: "/placeholder-startup-3.jpg",
        },
        {
            name: "DataSphere Analytics",
            industry: "Data Science",
            stage: "Series B",
            description:
                "Enterprise data analytics platform using machine learning to extract actionable insights from complex datasets.",
            seeking: "$8M",
            logoIcon: BarChartIcon,
            image: "/placeholder-startup-4.jpg",
        },
    ];

    const testimonials = [
        {
            name: "Dr. Lena Vogel",
            role: "Founder, HealthAI Diagnostics",
            stars: 5,
            quote: "StartupConnect was pivotal in our Series A round. The quality of investor connections and the platform's ease of use are unparalleled.",
            avatar: "/avatar-1.jpg",
        },
        {
            name: "Mark Robinson",
            role: "Partner, Future Ventures",
            stars: 5,
            quote: "The most efficient platform for discovering vetted, high-potential startups. StartupConnect has become an indispensable tool for our investment strategy.",
            avatar: "/avatar-2.jpg",
        },
        {
            name: "Sarah Chen",
            role: "CEO, FinBlock Secure",
            stars: 5,
            quote: "StartupConnect helped us find the perfect investors who truly understand our vision. The platform's matching algorithm is impressively accurate.",
            avatar: "/avatar-3.jpg",
        },
        {
            name: "James Wilson",
            role: "Angel Investor",
            stars: 4,
            quote: "I've doubled my investment portfolio's performance since joining StartupConnect. The quality of startups and due diligence tools are exceptional.",
            avatar: "/avatar-4.jpg",
        },
    ];

    const trustedLogos = [
        { src: "/logo-placeholder-1.svg", alt: "Trusted Company 1" },
        { src: "/logo-placeholder-2.svg", alt: "Trusted Company 2" },
        { src: "/logo-placeholder-3.svg", alt: "Trusted Company 3" },
        { src: "/logo-placeholder-4.svg", alt: "Trusted Company 4" },
        { src: "/logo-placeholder-5.svg", alt: "Trusted Company 5" },
        { src: "/logo-placeholder-6.svg", alt: "Trusted Company 6" },
    ];

    const stats = [
        { value: "$120M+", label: "Funding secured" },
        { value: "250+", label: "Startups funded" },
        { value: "1,500+", label: "Active investors" },
        { value: "94%", label: "Success rate" },
    ];

    const faqItems = [
        {
            question: "How does the matching process work?",
            answer: "Our proprietary algorithm analyzes over 50 data points from both startup profiles and investor preferences to create highly relevant matches. We consider industry focus, funding stage, market potential, team expertise, and investment thesis alignment.",
        },
        {
            question: "What types of startups can join the platform?",
            answer: "We welcome startups from pre-seed to Series B across all industries. Each application is reviewed for innovation potential, market opportunity, team capabilities, and fundraising readiness.",
        },
        {
            question: "How are investors verified?",
            answer: "Investors undergo a thorough verification process including investment history documentation, accreditation verification, and reference checks to ensure a high-quality investor network.",
        },
        {
            question: "What does the subscription include?",
            answer: "Subscriptions include unlimited matching, investor outreach, secure data room, pitch deck hosting, analytics dashboard, and priority support. Enterprise tiers include additional services like pitch preparation and investor introductions.",
        },
    ];

    let activeSection = $state("home");
    let isScrolled = $state(false);
    let activeFaqIndex = $state(-1);

    $effect(() => {
        // Basic scroll spy for section title animations and active section tracking
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

    function toggleFaq(index: number) {
        activeFaqIndex = activeFaqIndex === index ? -1 : index;
    }
</script>

<div
    class="bg-background text-foreground antialiased min-h-screen flex flex-col"
>
    <Header />

    <!-- Hero Section -->
    <section
        id="home"
        class="relative pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-36 lg:pb-28 overflow-hidden"
    >
        <!-- Background decoration -->
        <div
            class="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(var(--primary),0.04),transparent)]"
        >
            <div
                class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f18_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f18_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]"
            ></div>
        </div>

        <div
            class="absolute top-1/2 left-0 -translate-y-1/2 blur-3xl opacity-20 -z-10"
        >
            <div class="w-96 h-96 rounded-full bg-primary/30"></div>
        </div>

        <div class="absolute top-1/4 right-0 blur-3xl opacity-20 -z-10">
            <div class="w-96 h-96 rounded-full bg-primary/30"></div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 relative z-10">
            <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div class="w-full lg:w-1/2 text-center lg:text-left">
                    <Badge
                        variant="outline"
                        class="inline-flex border-primary/30 text-primary mb-4 py-1.5 px-4 animate-fadeInUp shadow-sm"
                    >
                        <SparklesIcon class="h-4 w-4 mr-2" /> Connecting Innovators
                        & Investors
                    </Badge>
                    <h1
                        class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] animate-fadeInUp animation-delay-200"
                    >
                        Where <span class="text-primary bg-primary/5 px-2"
                            >Visionaries</span
                        ><br class="hidden sm:block" /> Meet
                        <span class="text-primary bg-primary/5 px-2"
                            >Venture</span
                        >
                    </h1>
                    <p
                        class="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-fadeInUp animation-delay-400"
                    >
                        The premier ecosystem connecting groundbreaking startups
                        with strategic investors to build tomorrow's industry
                        leaders.
                    </p>

                    <!-- Stats banner -->
                    <div
                        class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-accent/50 rounded-xl backdrop-blur-sm animate-fadeInUp animation-delay-500"
                    >
                        {#each stats as stat}
                            <div class="text-center">
                                <div
                                    class="text-2xl md:text-3xl font-bold text-primary"
                                >
                                    {stat.value}
                                </div>
                                <div
                                    class="text-xs md:text-sm text-muted-foreground"
                                >
                                    {stat.label}
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div
                        class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeInUp animation-delay-600"
                    >
                        <Button
                            size="lg"
                            class="rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all transform hover:scale-105 bg-primary"
                        >
                            <UserPlusIcon class="mr-2 h-5 w-5" /> Join as Startup
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            class="rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105"
                        >
                            <BanknoteIcon class="mr-2 h-5 w-5" /> Become an Investor
                        </Button>
                    </div>
                    <div
                        class="mt-8 flex items-center justify-center lg:justify-start space-x-4 animate-fadeInUp animation-delay-800"
                    >
                        <div class="flex -space-x-3 items-center">
                            <img
                                class="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-background object-cover shadow-md"
                                src="/avatar-1.jpg"
                                alt="User 1"
                            />
                            <img
                                class="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-background object-cover shadow-md"
                                src="/avatar-2.jpg"
                                alt="User 2"
                            />
                            <img
                                class="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-background object-cover shadow-md"
                                src="/avatar-3.jpg"
                                alt="User 3"
                            />
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs text-primary font-semibold shadow-md"
                            >
                                1K+
                            </div>
                        </div>
                        <p class="text-xs md:text-sm text-muted-foreground">
                            Joined by <strong class="text-foreground"
                                >innovators & investors</strong
                            > worldwide
                        </p>
                    </div>
                </div>
                <div class="w-full lg:w-1/2 relative animate-fadeInRight">
                    <div class="relative max-w-lg mx-auto">
                        <!-- Decorative backgrounds -->
                        <div
                            class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 blur-xl opacity-80 animate-pulse animation-duration-3000"
                        ></div>

                        <!-- Floating cards -->
                        <div
                            class="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 z-20 animate-float"
                        >
                            <div
                                class="bg-card shadow-lg rounded-lg p-4 backdrop-blur-md border border-border/40 w-48"
                            >
                                <div class="flex items-center gap-2 mb-2">
                                    <RocketIcon class="h-4 w-4 text-primary" />
                                    <span class="text-sm font-medium"
                                        >Startup Growth</span
                                    >
                                </div>
                                <div
                                    class="h-2 bg-primary/10 rounded-full overflow-hidden"
                                >
                                    <div class="bg-primary h-full w-3/4"></div>
                                </div>
                            </div>
                        </div>

                        <div
                            class="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 z-20 animate-float animation-delay-400"
                        >
                            <div
                                class="bg-card shadow-lg rounded-lg p-4 backdrop-blur-md border border-border/40 w-48"
                            >
                                <div class="flex items-center gap-2 mb-2">
                                    <TrendingUpIcon
                                        class="h-4 w-4 text-green-500"
                                    />
                                    <span class="text-sm font-medium"
                                        >Funding Round</span
                                    >
                                </div>
                                <div class="text-xl font-bold">$3.2M</div>
                            </div>
                        </div>

                        <!-- Main image -->
                        <img
                            src="/hero-illustration.svg"
                            alt="Startup and Investor Collaboration"
                            class="relative z-10 w-full h-auto object-contain p-4 drop-shadow-xl"
                        />

                        <!-- Floating elements -->
                        <div
                            class="absolute -bottom-8 right-16 z-20 p-3 bg-card shadow-2xl rounded-full animate-float"
                        >
                            <div
                                class="p-3 bg-primary text-primary-foreground rounded-full"
                            >
                                <RocketIcon class="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                        </div>
                        <div
                            class="absolute -top-8 left-16 z-20 p-3 bg-card shadow-2xl rounded-full animate-float animation-delay-500"
                        >
                            <div
                                class="p-3 bg-primary/10 text-primary rounded-full"
                            >
                                <BanknoteIcon class="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Trusted by logos section -->
        <div class="container mx-auto px-4 sm:px-6 mt-16 md:mt-24">
            <p class="text-center text-sm text-muted-foreground mb-6">
                Trusted by industry leaders
            </p>
            <div
                class="flex flex-wrap items-center justify-center gap-8 md:gap-12"
            >
                {#each trustedLogos as logo}
                    <img
                        src={logo.src}
                        alt={logo.alt}
                        class="h-6 md:h-8 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                    />
                {/each}
            </div>
        </div>

        <!-- Scroll indicator -->
        <button
            class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center text-sm text-muted-foreground"
        >
            <span class="mb-2">Scroll to explore</span>
            <ChevronDownIcon class="h-5 w-5" />
        </button>
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

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-20 lg:py-28">
        <div class="container mx-auto px-4 sm:px-6">
            <div class="text-center mb-16">
                <Badge variant="outline" class="mb-4">Simple Process</Badge>
                <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight"
                >
                    How <span class="text-primary">It Works</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our streamlined process connects startups with investors
                    through a sophisticated matching system.
                </p>
            </div>

            <div class="relative">
                <div
                    class="hidden lg:block absolute left-1/2 top-24 h-[calc(100%-6rem)] w-1 -translate-x-1/2 bg-border"
                ></div>

                <div class="grid md:grid-cols-3 gap-12 relative">
                    <div
                        class="flex flex-col items-center text-center relative"
                    >
                        <div
                            class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-8 z-10 shadow-md"
                        >
                            <div
                                class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                            >
                                <span class="font-bold">1</span>
                            </div>
                        </div>
                        <div class="group">
                            <div
                                class="h-14 w-14 rounded-full bg-background shadow-md border border-border flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-4"
                            >
                                <UserPlusIcon class="h-6 w-6 text-primary" />
                            </div>
                            <h3 class="text-xl lg:text-2xl font-semibold mb-3">
                                Create Your Profile
                            </h3>
                            <p class="text-muted-foreground">
                                Complete your detailed startup or investor
                                profile with your specific needs, goals, and
                                preferences.
                            </p>
                        </div>
                    </div>

                    <div
                        class="flex flex-col items-center text-center relative"
                    >
                        <div
                            class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-8 z-10 shadow-md"
                        >
                            <div
                                class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                            >
                                <span class="font-bold">2</span>
                            </div>
                        </div>
                        <div class="group">
                            <div
                                class="h-14 w-14 rounded-full bg-background shadow-md border border-border flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-4"
                            >
                                <SearchIcon class="h-6 w-6 text-primary" />
                            </div>
                            <h3 class="text-xl lg:text-2xl font-semibold mb-3">
                                Get Matched
                            </h3>
                            <p class="text-muted-foreground">
                                Our AI algorithm connects you with the most
                                relevant startups or investors based on your
                                criteria.
                            </p>
                        </div>
                    </div>

                    <div
                        class="flex flex-col items-center text-center relative"
                    >
                        <div
                            class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-8 z-10 shadow-md"
                        >
                            <div
                                class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                            >
                                <span class="font-bold">3</span>
                            </div>
                        </div>
                        <div class="group">
                            <div
                                class="h-14 w-14 rounded-full bg-background shadow-md border border-border flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-4"
                            >
                                <HandshakeIcon class="h-6 w-6 text-primary" />
                            </div>
                            <h3 class="text-xl lg:text-2xl font-semibold mb-3">
                                Connect & Collaborate
                            </h3>
                            <p class="text-muted-foreground">
                                Engage through our secure platform, share
                                documents, schedule meetings, and build
                                meaningful partnerships.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-20 text-center">
                <Button variant="outline" size="lg" class="rounded-full">
                    Learn more about our process
                    <ArrowRightIcon class="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 lg:py-28 bg-muted/50">
        <div class="container mx-auto px-4 sm:px-6">
            <div class="text-center mb-16">
                <Badge variant="outline" class="mb-4">Platform Features</Badge>
                <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight"
                >
                    Powerful <span class="text-primary">Tools</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our comprehensive platform offers everything you need to
                    succeed in your fundraising or investment journey.
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each [{ title: "AI Smart Matching", description: "Our algorithm connects startups with the most relevant investors based on deep data analysis.", icon: SearchIcon, color: "bg-blue-500/10 text-blue-500" }, { title: "Verified Profiles", description: "Rigorous verification for all members builds trust and ensures quality connections.", icon: ShieldCheckIcon, color: "bg-green-500/10 text-green-500" }, { title: "Secure Communication", description: "End-to-end encrypted messaging and document sharing for confidential discussions.", icon: MessageSquareIcon, color: "bg-purple-500/10 text-purple-500" }, { title: "Advanced Analytics", description: "Track engagement, view interest trends, and optimize your strategy with our dashboard.", icon: BarChartIcon, color: "bg-orange-500/10 text-orange-500" }, { title: "Resource Hub", description: "Access guides, templates, and expert advice to navigate the startup journey.", icon: FileTextIcon, color: "bg-indigo-500/10 text-indigo-500" }, { title: "Community Forum", description: "Connect with peers, ask questions, and share insights within our exclusive member community.", icon: UsersIcon, color: "bg-pink-500/10 text-pink-500" }] as feature}
                    <Card.Root
                        class="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
                    >
                        <Card.Header class="flex items-start gap-4 p-6">
                            <div
                                class={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}
                            >
                                {#if feature.icon === SearchIcon}
                                    <SearchIcon class="h-6 w-6" />
                                {:else if feature.icon === ShieldCheckIcon}
                                    <ShieldCheckIcon class="h-6 w-6" />
                                {:else if feature.icon === MessageSquareIcon}
                                    <MessageSquareIcon class="h-6 w-6" />
                                {:else if feature.icon === BarChartIcon}
                                    <BarChartIcon class="h-6 w-6" />
                                {:else if feature.icon === FileTextIcon}
                                    <FileTextIcon class="h-6 w-6" />
                                {:else if feature.icon === UsersIcon}
                                    <UsersIcon class="h-6 w-6" />
                                {/if}
                            </div>
                            <div>
                                <Card.Title class="text-xl font-semibold"
                                    >{feature.title}</Card.Title
                                >
                                <p class="text-muted-foreground mt-2">
                                    {feature.description}
                                </p>
                            </div>
                        </Card.Header>
                    </Card.Root>
                {/each}
            </div>
        </div>
    </section>

    <!-- Featured Startups Section -->
    <section id="startups" class="py-20 lg:py-28">
        <div class="container mx-auto px-4 sm:px-6">
            <div
                class="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
            >
                <div class="text-center md:text-left">
                    <Badge variant="outline" class="mb-4"
                        >Innovative Ventures</Badge
                    >
                    <h2
                        class="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight"
                    >
                        Featured <span class="text-primary">Startups</span>
                    </h2>
                    <p class="text-lg text-muted-foreground max-w-2xl">
                        Discover promising ventures currently seeking investment
                        and connections on our platform.
                    </p>
                </div>
                <Button variant="outline" size="lg" class="rounded-full">
                    View All Startups <ArrowRightIcon class="h-4 w-4 ml-2" />
                </Button>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each featuredStartups as startup}
                    <Card.Root
                        class="group overflow-hidden border border-border/50 rounded-xl bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    >
                        <div class="h-56 overflow-hidden relative">
                            <img
                                src={startup.image}
                                alt={startup.name}
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            ></div>
                            <div class="absolute top-4 left-4 z-10">
                                <Badge variant="secondary" class="shadow-md">
                                    {startup.industry}
                                </Badge>
                            </div>
                            <div
                                class="absolute left-4 bottom-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                <h3 class="text-xl font-bold text-white">
                                    {startup.name}
                                </h3>
                                <p
                                    class="text-sm text-white/80 line-clamp-2 mt-1"
                                >
                                    {startup.description}
                                </p>
                            </div>
                        </div>
                        <Card.Content class="p-6 flex-grow flex flex-col">
                            <div class="flex justify-between items-center mb-4">
                                <Badge
                                    variant="outline"
                                    class="border-primary/30 text-primary"
                                    >{startup.stage}</Badge
                                >
                                <span class="text-lg font-semibold text-primary"
                                    >{startup.seeking}</span
                                >
                            </div>
                            <Button
                                variant="secondary"
                                class="w-full mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
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
        class="py-20 lg:py-28 bg-muted/50 relative overflow-hidden"
    >
        <div
            class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-background to-transparent"
        ></div>

        <!-- Background decorations -->
        <div
            class="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        ></div>
        <div
            class="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        ></div>

        <div class="container mx-auto px-4 sm:px-6 relative z-10">
            <div class="text-center mb-16">
                <Badge variant="outline" class="mb-4">Success Stories</Badge>
                <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight"
                >
                    What Our <span class="text-primary">Users Say</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Hear from founders and investors who've achieved their goals
                    with our platform.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {#each testimonials as testimonial}
                    <Card.Root
                        class="h-full bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                    >
                        <Card.Content class="p-6">
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
                                class="text-muted-foreground italic mb-6"
                            >
                                "{testimonial.quote}"
                            </blockquote>

                            <div class="flex items-center gap-3 mt-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    class="w-12 h-12 rounded-full object-cover border-2 border-primary/10"
                                />
                                <div>
                                    <p class="font-semibold">
                                        {testimonial.name}
                                    </p>
                                    <p class="text-sm text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </Card.Content>
                    </Card.Root>
                {/each}
            </div>
            <div class="flex justify-center mt-8 gap-2">
                <Button variant="outline" size="icon" class="rounded-full">
                    <ChevronRightIcon class="h-4 w-4 rotate-180" />
                </Button>
                <Button variant="outline" size="icon" class="rounded-full">
                    <ChevronRightIcon class="h-4 w-4" />
                </Button>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="py-20 lg:py-28">
        <div class="container mx-auto px-4 sm:px-6">
            <div class="text-center mb-16">
                <Badge variant="outline" class="mb-4">Questions & Answers</Badge
                >
                <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight"
                >
                    Frequently <span class="text-primary">Asked Questions</span>
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Everything you need to know about our platform and services.
                </p>
            </div>

            <div class="max-w-3xl mx-auto">
                {#each faqItems as faq, index}
                    <div class="mb-4">
                        <button
                            class="w-full flex items-center justify-between p-5 bg-card hover:bg-card/80 rounded-lg border border-border/50 text-left transition-colors"
                            onclick={() => toggleFaq(index)}
                        >
                            <span class="font-medium text-lg"
                                >{faq.question}</span
                            >
                            <ChevronDownIcon
                                class={`h-5 w-5 transition-transform ${activeFaqIndex === index ? "rotate-180" : ""}`}
                            />
                        </button>

                        {#if activeFaqIndex === index}
                            <div
                                class="px-5 pt-0 pb-5 bg-card rounded-b-lg border-x border-b border-border/50 -mt-px"
                            >
                                <p class="text-muted-foreground pt-4">
                                    {faq.answer}
                                </p>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>

            <div class="text-center mt-12">
                <p class="text-muted-foreground mb-6">Still have questions?</p>
                <Button variant="outline" size="lg" class="rounded-full">
                    Contact Support <MessageSquareIcon class="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section
        class="py-20 lg:py-28 bg-primary text-primary-foreground relative overflow-hidden"
    >
        <!-- Decorative elements -->
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,rgba(0,0,0,0.1),transparent_60%)]"
        ></div>
        <div
            class="absolute -right-24 top-0 w-96 h-96 rounded-full bg-primary-foreground/10 blur-2xl"
        ></div>
        <div
            class="absolute -left-24 bottom-0 w-96 h-96 rounded-full bg-primary-foreground/10 blur-2xl"
        ></div>

        <div class="container mx-auto px-4 sm:px-6 relative z-10 text-center">
            <RocketIcon
                class="h-16 w-16 mx-auto mb-8 opacity-90 animate-float"
            />

            <h2
                class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            >
                Ready to Transform Your Journey?
            </h2>

            <p class="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
                Join today and connect with the right partners to accelerate
                your success.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    size="lg"
                    class="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full shadow-lg shadow-black/20"
                >
                    Get Started Now
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    class="border-primary-foreground/40 rounded-full hover:bg-primary-foreground/10"
                >
                    Schedule a Demo
                </Button>
            </div>

            <p class="mt-8 text-sm opacity-80">
                No credit card required. Start with our free plan today.
            </p>
        </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 lg:py-24 bg-background border-t border-border">
        <div class="container mx-auto px-4 sm:px-6">
            <Card.Root
                class="max-w-2xl mx-auto shadow-md rounded-xl overflow-hidden border border-border/30"
            >
                <Card.Header class="text-center pb-4 pt-8">
                    <Card.Title class="text-2xl lg:text-3xl font-semibold mb-2">
                        Stay Updated
                    </Card.Title>
                    <Card.Description
                        class="text-muted-foreground max-w-sm mx-auto"
                    >
                        Subscribe to our newsletter for the latest news,
                        updates, and insights.
                    </Card.Description>
                </Card.Header>

                <Card.Content class="px-6 pb-8">
                    <form class="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            class="flex-grow h-12 sm:h-11"
                        />
                        <Button class="h-12 sm:h-11 rounded-md">
                            Subscribe
                        </Button>
                    </form>

                    <p class="text-xs text-muted-foreground text-center mt-4">
                        By subscribing, you agree to our <a
                            href="/privacy"
                            class="text-primary hover:underline"
                            >Privacy Policy</a
                        >. We respect your privacy.
                    </p>
                </Card.Content>
            </Card.Root>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-muted/30 border-t border-border py-12 lg:py-16">
        <div class="container mx-auto px-4 sm:px-6">
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8"
            >
                <div class="lg:col-span-1">
                    <a
                        href="/"
                        class="flex items-center text-xl font-bold mb-4"
                    >
                        <RocketIcon class="h-6 w-6 mr-2 text-primary" />
                        <span class="text-primary">Startup</span>Connect
                    </a>
                    <p class="text-sm text-muted-foreground mb-6 max-w-md">
                        Connecting visionary startups with strategic investors.
                        Building the future of innovation together.
                    </p>
                    <div class="flex space-x-3">
                        {#each [TwitterIcon, LinkedinIcon, FacebookIcon, InstagramIcon] as Icon}
                            <a
                                href="/"
                                class="w-9 h-9 flex items-center justify-center rounded-full bg-background border border-border hover:bg-primary/5 hover:border-primary/30 transition-colors"
                            >
                                <Icon class="h-4 w-4 text-muted-foreground" />
                            </a>
                        {/each}
                    </div>
                </div>

                <div>
                    <h4 class="font-semibold mb-4">Platform</h4>
                    <ul class="space-y-2">
                        {#each ["How It Works", "Features", "Pricing", "FAQ", "Support"] as item}
                            <li>
                                <a
                                    href="/"
                                    class="text-sm text-muted-foreground hover:text-foreground"
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
                                    class="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {item}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div>
                    <h4 class="font-semibold mb-4">Legal</h4>
                    <ul class="space-y-2">
                        {#each ["Terms of Service", "Privacy Policy", "Cookie Policy", "Data Processing", "Security"] as item}
                            <li>
                                <a
                                    href="/"
                                    class="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {item}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>

            <div
                class="pt-8 border-t border-border mt-4 flex flex-col md:flex-row justify-between items-center"
            >
                <p class="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} StartupConnect. All rights reserved.
                </p>
                <div class="flex items-center mt-4 md:mt-0">
                    <GlobeIcon class="h-4 w-4 mr-2 text-muted-foreground" />
                    <span class="text-xs text-muted-foreground"
                        >English (US)</span
                    >
                </div>
            </div>
        </div>
    </footer>
</div>

<style>
    /* Animation keyframes */
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
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    @keyframes sectionIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Animation classes */
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

    .animate-sectionIn {
        animation: sectionIn 0.8s ease-out forwards;
    }

    /* Animation delays */
    .animation-delay-200 {
        animation-delay: 0.2s;
    }

    .animation-delay-400 {
        animation-delay: 0.4s;
    }

    .animation-delay-500 {
        animation-delay: 0.5s;
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
</style>

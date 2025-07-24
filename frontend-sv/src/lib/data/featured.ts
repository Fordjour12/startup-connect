import {
   ActivityIcon,
   GlobeIcon,
   HandshakeIcon,
   LeafIcon,
   LockIcon,
   ZapIcon,
   BanknoteIcon,
   BarChartIcon,
   MessageSquareIcon,
   RocketIcon,
   SparklesIcon,
   UsersIcon,
   TargetIcon,
   ShieldCheckIcon,
   FileTextIcon,


} from "@lucide/svelte";



export const featuredStartups = [
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



export const testimonials = [
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


export const stats = [
   { value: "$180M+", label: "Total Funding Raised", icon: BanknoteIcon },
   { value: "94%", label: "Success Rate", icon: TargetIcon },
   { value: "2,500+", label: "Active Investors", icon: UsersIcon },
   { value: "350+", label: "Startups Funded", icon: RocketIcon },
];

export const features = [
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



<script lang="ts">
  import { onMount } from "svelte";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Input } from "$lib/components/ui/input";
  import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";

  interface KnowledgeArticle {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
    author: {
      name: string;
      avatar?: string;
    };
    status: 'draft' | 'published' | 'archived';
    views: number;
    helpful: number;
    totalFeedback: number;
    lastUpdated: Date;
    createdAt: Date;
    relatedArticles: string[];
  }

  interface Category {
    id: string;
    name: string;
    description: string;
    articleCount: number;
    color: string;
  }

  interface Props {
    searchQuery?: string;
    selectedCategory?: string;
    onArticleSelect?: (article: KnowledgeArticle) => void;
    onSearch?: (query: string) => void;
    onCategoryChange?: (categoryId: string) => void;
  }

  let {
    searchQuery = "",
    selectedCategory = "",
    onArticleSelect,
    onSearch,
    onCategoryChange
  }: Props = $props();

  let localSearchQuery = $state(searchQuery);
  let localSelectedCategory = $state(selectedCategory);
  let articles = $state<KnowledgeArticle[]>([]);
  let categories = $state<Category[]>([]);
  let filteredArticles = $state<KnowledgeArticle[]>([]);
  let isLoading = $state(true);
  let activeTab = $state("articles");

  // Mock data - replace with real API calls
  onMount(async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      categories = [
        {
          id: "for-founders",
          name: "For Founders",
          description: "Helpful resources for startup founders",
          articleCount: 45,
          color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
        },
        {
          id: "for-investors",
          name: "For Investors",
          description: "Investment process and due diligence guides",
          articleCount: 32,
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        },
        {
          id: "platform-guide",
          name: "Platform Guide",
          description: "How to use our platform effectively",
          articleCount: 28,
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        },
        {
          id: "troubleshooting",
          name: "Troubleshooting",
          description: "Common issues and solutions",
          articleCount: 19,
          color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
        },
        {
          id: "best-practices",
          name: "Best Practices",
          description: "Tips and recommendations",
          articleCount: 23,
          color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
        }
      ];

      articles = [
        {
          id: "investor-matching-101",
          title: "Investor Matching Best Practices",
          content: "Learn how to optimize your startup profile for better investor matches...",
          excerpt: "Maximize your chances of connecting with the right investors by following these proven strategies.",
          category: "for-founders",
          tags: ["investor-matching", "profile-optimization", "best-practices"],
          author: {
            name: "Sarah Johnson",
            avatar: ""
          },
          status: "published",
          views: 1247,
          helpful: 89,
          totalFeedback: 95,
          lastUpdated: new Date("2024-12-10T14:30:00Z"),
          createdAt: new Date("2024-11-15T09:00:00Z"),
          relatedArticles: ["profile-optimization", "investor-communication"]
        },
        {
          id: "due-diligence-checklist",
          title: "Due Diligence Checklist for Investors",
          content: "A comprehensive guide to conducting thorough due diligence on startup investments...",
          excerpt: "Ensure you have all the information you need before making investment decisions.",
          category: "for-investors",
          tags: ["due-diligence", "investment-process", "checklist"],
          author: {
            name: "Michael Chen",
            avatar: ""
          },
          status: "published",
          views: 892,
          helpful: 76,
          totalFeedback: 82,
          lastUpdated: new Date("2024-12-08T11:15:00Z"),
          createdAt: new Date("2024-11-20T10:30:00Z"),
          relatedArticles: ["investment-process", "startup-evaluation"]
        },
        {
          id: "platform-navigation",
          title: "Complete Platform Navigation Guide",
          content: "Master all the features and tools available on our platform...",
          excerpt: "Learn how to navigate and use all platform features effectively.",
          category: "platform-guide",
          tags: ["navigation", "features", "getting-started"],
          author: {
            name: "Emily Rodriguez",
            avatar: ""
          },
          status: "published",
          views: 2156,
          helpful: 94,
          totalFeedback: 102,
          lastUpdated: new Date("2024-12-12T16:45:00Z"),
          createdAt: new Date("2024-10-05T08:00:00Z"),
          relatedArticles: ["getting-started", "advanced-features"]
        },
        {
          id: "login-troubleshooting",
          title: "Common Login Issues and Solutions",
          content: "Troubleshoot the most common login problems and get back to using the platform...",
          excerpt: "Quick fixes for password reset, account lockouts, and verification issues.",
          category: "troubleshooting",
          tags: ["login", "password", "account-access", "troubleshooting"],
          author: {
            name: "David Park",
            avatar: ""
          },
          status: "published",
          views: 1876,
          helpful: 91,
          totalFeedback: 98,
          lastUpdated: new Date("2024-12-14T13:20:00Z"),
          createdAt: new Date("2024-11-08T14:15:00Z"),
          relatedArticles: ["password-reset", "account-security"]
        },
        {
          id: "pitch-deck-best-practices",
          title: "Creating Compelling Pitch Decks",
          content: "Learn how to create pitch decks that capture investor attention...",
          excerpt: "Essential elements and best practices for creating effective pitch presentations.",
          category: "best-practices",
          tags: ["pitch-deck", "presentation", "investor-pitch"],
          author: {
            name: "Lisa Wang",
            avatar: ""
          },
          status: "published",
          views: 1456,
          helpful: 87,
          totalFeedback: 92,
          lastUpdated: new Date("2024-12-06T09:30:00Z"),
          createdAt: new Date("2024-11-12T11:00:00Z"),
          relatedArticles: ["investor-pitch", "presentation-tips"]
        }
      ];

      filterArticles();
    } catch (error) {
      console.error("Error loading knowledge base:", error);
    } finally {
      isLoading = false;
    }
  });

  function filterArticles() {
    let filtered = articles;

    // Filter by category
    if (localSelectedCategory) {
      filtered = filtered.filter(article => article.category === localSelectedCategory);
    }

    // Filter by search query
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    filteredArticles = filtered;
  }

  function handleSearch() {
    filterArticles();
    onSearch?.(localSearchQuery);
  }

  function handleCategoryChange(categoryId: string) {
    localSelectedCategory = categoryId;
    filterArticles();
    onCategoryChange?.(categoryId);
  }

  function getCategoryInfo(categoryId: string): Category | undefined {
    return categories.find(cat => cat.id === categoryId);
  }

  function getHelpfulPercentage(article: KnowledgeArticle): number {
    if (article.totalFeedback === 0) return 0;
    return Math.round((article.helpful / article.totalFeedback) * 100);
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-2xl font-bold text-foreground">Knowledge Base</h2>
      <p class="text-muted-foreground">
        Find answers and resources to help support our users
      </p>
    </div>
    <div class="flex space-x-3">
      <Button variant="outline">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        New Article
      </Button>
    </div>
  </div>

  <!-- Search and Filters -->
  <Card>
    <CardContent class="pt-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              bind:value={localSearchQuery}
              placeholder="Search articles, topics, or keywords..."
              class="pl-10"
              onkeydown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <Select value={localSelectedCategory} onValueChange={(value: string) => handleCategoryChange(value)}>
            <SelectTrigger class="w-48">
              {localSelectedCategory ? categories.find(c => c.id === localSelectedCategory)?.name : "All Categories"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {#each categories as category}
                <SelectItem value={category.id}>{category.name}</SelectItem>
              {/each}
            </SelectContent>
          </Select>

          <Button onclick={handleSearch} disabled={!localSearchQuery.trim()}>
            Search
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  {#if isLoading}
    <!-- Loading State -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each Array(6) as _}
        <Card>
          <CardHeader class="pb-2">
            <div class="h-4 bg-muted rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <div class="h-4 bg-muted rounded animate-pulse"></div>
              <div class="h-3 bg-muted rounded animate-pulse w-3/4"></div>
              <div class="h-3 bg-muted rounded animate-pulse w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else}
    <!-- Categories Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {#each categories as category}
        <Card
          class="hover:shadow-md transition-shadow cursor-pointer {localSelectedCategory === category.id ? 'ring-2 ring-primary' : ''}"
          onclick={() => handleCategoryChange(category.id)}
        >
          <CardContent class="p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <Badge class={category.color} variant="secondary">
                {category.articleCount}
              </Badge>
            </div>
            <h3 class="font-semibold text-sm mb-1">{category.name}</h3>
            <p class="text-xs text-muted-foreground">{category.description}</p>
          </CardContent>
        </Card>
      {/each}
    </div>

    <!-- Articles List -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-lg">
            {localSelectedCategory
              ? `${getCategoryInfo(localSelectedCategory)?.name} Articles`
              : "All Articles"
            }
            <span class="text-sm font-normal text-muted-foreground ml-2">
              ({filteredArticles.length} articles)
            </span>
          </CardTitle>

          <div class="flex items-center space-x-2">
            <Select value={activeTab} onValueChange={(value: string) => activeTab = value}>
              <SelectTrigger class="w-32">
                {activeTab === "articles" ? "Articles" : activeTab === "recent" ? "Recent" : "Popular"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="articles">Articles</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {#if filteredArticles.length === 0}
          <div class="text-center py-12">
            <svg class="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 class="text-lg font-medium text-muted-foreground mb-2">No articles found</h3>
            <p class="text-sm text-muted-foreground">
              {localSearchQuery.trim()
                ? `No articles match your search for "${localSearchQuery}"`
                : "No articles available in this category"}
            </p>
          </div>
        {:else}
          <div class="space-y-4">
            {#each filteredArticles as article}
              <div
                class="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onclick={() => onArticleSelect?.(article)}
                onkeydown={(e) => e.key === 'Enter' && onArticleSelect?.(article)}
                role="button"
                tabindex="0"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h4 class="font-semibold text-lg hover:text-primary transition-colors">
                        {article.title}
                      </h4>
                      {#if article.status === 'draft'}
                        <Badge variant="outline" class="text-xs">Draft</Badge>
                      {/if}
                    </div>

                    <p class="text-muted-foreground mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div class="flex flex-wrap gap-1 mb-3">
                      {#each article.tags.slice(0, 3) as tag}
                        <Badge variant="outline" class="text-xs">
                          {tag}
                        </Badge>
                      {/each}
                      {#if article.tags.length > 3}
                        <Badge variant="outline" class="text-xs">
                          +{article.tags.length - 3} more
                        </Badge>
                      {/if}
                    </div>
                  </div>

                  <div class="flex flex-col items-end space-y-2 ml-4">
                    <div class="text-right">
                      <div class="text-sm font-medium text-green-600">
                        {getHelpfulPercentage(article)}% helpful
                      </div>
                      <div class="text-xs text-muted-foreground">
                        {article.helpful} of {article.totalFeedback} ratings
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="text-sm font-medium">{article.views.toLocaleString()}</div>
                      <div class="text-xs text-muted-foreground">views</div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <Avatar class="w-6 h-6">
                      <AvatarFallback class="text-xs">
                        {article.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span class="text-sm text-muted-foreground">
                      {article.author.name}
                    </span>
                    <span class="text-sm text-muted-foreground">•</span>
                    <span class="text-sm text-muted-foreground">
                      Updated {formatDate(article.lastUpdated)}
                    </span>
                  </div>

                  <div class="flex items-center space-x-2">
                    {#if getCategoryInfo(article.category)}
                      <Badge class="{getCategoryInfo(article.category)?.color} text-xs" variant="secondary">
                        {getCategoryInfo(article.category)?.name}
                      </Badge>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </CardContent>
    </Card>
  {/if}
</div>

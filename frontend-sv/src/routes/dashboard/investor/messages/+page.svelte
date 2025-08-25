<script lang="ts">
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import { Textarea } from "@/components/ui/textarea";
    import { cn } from "@/utils";
    import type { PageData } from "./$types";
    import type { Founder, Message } from "./+page.server";

    // Props and state
    let { data }: { data: PageData } = $props();

    // Client-side reactive state
    let messages = $state<Message[]>(data.messages || []);
    let selectedFounder = $state<Founder | undefined>(
        data.founders && data.founders.length > 0
            ? data.founders[0]
            : undefined,
    );
    let newMessage = $state("");
    let isTyping = $state(false);
    let searchQuery = $state("");
    let isSendingMessage = $state(false);

    // Derived states
    let filteredFounders = $derived.by(() => {
        if (!searchQuery.trim()) return data.founders ?? [];
        const query = searchQuery.toLowerCase();
        return (data.founders ?? []).filter(
            (f: Founder) =>
                f.name.toLowerCase().includes(query) ||
                f.company.toLowerCase().includes(query),
        );
    });

    let displayedMessages = $derived.by(() => {
        if (!selectedFounder || !selectedFounder.id) {
            return [] as Message[]; // Explicitly return empty Message array
        }
        const founderId = selectedFounder.id;
        const currentMessages = messages ?? []; // messages is already $state<Message[]> initialized with an array

        const filtered = currentMessages.filter(
            (m: Message) =>
                (m.senderId === founderId && m.receiverId === "investor") ||
                (m.senderId === "investor" && m.receiverId === founderId),
        );
        return filtered; // This is Message[]
    });

    // Debugging effect
    $effect(() => {
        console.log(
            "Debug: displayedMessages changed. Type:",
            typeof displayedMessages,
            "Value:",
            displayedMessages,
        );
        // You can also inspect if it has .slice property
        if (
            displayedMessages &&
            Array.isArray(displayedMessages) &&
            typeof displayedMessages.slice !== "function"
        ) {
            console.error(
                "Debug: displayedMessages does not have a .slice method!",
                displayedMessages,
            );
        }
    });

    // Message handling
    function sendMessage() {
        if (!newMessage.trim() || !selectedFounder || isSendingMessage) return;

        isSendingMessage = true;
        const tempId = crypto.randomUUID();

        const newMsg: Message = {
            id: tempId, // Use a temporary ID for optimistic update
            senderId: "investor",
            receiverId: selectedFounder.id,
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            isRead: false,
            status: "sent",
        };

        messages = [...messages, newMsg];
        newMessage = "";

        // Simulate message delivery status
        setTimeout(() => {
            messages = messages.map(
                (m) =>
                    m.id === tempId
                        ? { ...m, status: "delivered", id: crypto.randomUUID() }
                        : m, // Replace tempId with real one from server normally
            );
            isSendingMessage = false;
        }, 1000);
    }

    // Founder selection
    function selectFounder(founder: Founder) {
        selectedFounder = founder;
        // Mark messages as read
        messages = messages.map((m) =>
            m.senderId === founder.id ? { ...m, isRead: true } : m,
        );
    }

    // Message styling
    function getMessageClass(message: Message) {
        const isSelf = message.senderId === "investor";
        return cn(
            "max-w-[75%] md:max-w-[65%] rounded-xl p-2.5 px-3.5 text-sm shadow-sm transition-all hover:shadow-md",
            isSelf
                ? "bg-primary text-primary-foreground self-end"
                : "bg-muted text-muted-foreground self-start",
        );
    }

    // Typing indicator
    let typingTimeout: number;
    function handleTyping() {
        isTyping = true;
        clearTimeout(typingTimeout);
        typingTimeout = window.setTimeout(() => {
            isTyping = false;
        }, 1000);
    }

    // Cleanup
    $effect(() => {
        return () => {
            clearTimeout(typingTimeout);
        };
    });

    // Schedule a meeting (placeholder function)
    function scheduleMeeting() {
        if (!selectedFounder) return;
        // This would open a meeting scheduler modal in the real implementation
        alert(`Meeting scheduler for ${selectedFounder.name} would open here.`);
    }
</script>

<!-- Main layout for the messages page with subtle background pattern -->
<div
    class="flex flex-col h-[calc(100vh-var(--header-height,60px))] p-4 md:p-6 gap-6 bg-background bg-pattern"
>
    <!-- Page Header -->
    <header class="flex-shrink-0">
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Messages</h1>
        <p class="text-sm text-muted-foreground">
            Communicate directly with your portfolio company founders.
        </p>
    </header>

    <!-- Grid for founder list and chat area -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 flex-1 min-h-0">
        <!-- Founders List Column -->
        <div
            class="md:col-span-4 lg:col-span-3 border rounded-lg overflow-hidden flex flex-col bg-card shadow-sm"
        >
            <div class="p-3.5 border-b bg-muted/50 flex-shrink-0 space-y-2">
                <h3 class="font-semibold text-md">Portfolio Founders</h3>
                <div class="relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/70"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <input
                        type="search"
                        placeholder="Search founders..."
                        bind:value={searchQuery}
                        class="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border bg-background focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/30 outline-none transition-all"
                        aria-label="Search founders"
                    />
                </div>
            </div>
            <div class="divide-y overflow-y-auto flex-grow scrollbar-thin">
                {#each filteredFounders as founder (founder.id)}
                    <button
                        class="w-full p-3 flex items-start hover:bg-accent/50 focus-visible:bg-accent focus-visible:outline-none transition-colors text-left border-l-2 {selectedFounder?.id ===
                        founder.id
                            ? 'border-l-primary bg-accent/40 font-medium'
                            : 'border-l-transparent'}"
                        onclick={() => selectFounder(founder)}
                        aria-current={selectedFounder?.id === founder.id
                            ? "page"
                            : undefined}
                        aria-label={`Select conversation with ${founder.name}`}
                    >
                        <div class="relative flex-shrink-0 mr-3 pt-0.5">
                            <img
                                src={founder.avatar}
                                alt={founder.name}
                                class="w-10 h-10 rounded-full object-cover shadow-sm"
                            />
                            {#if founder.status === "online"}
                                <div
                                    class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card animate-pulse"
                                    title="Online"
                                ></div>
                            {/if}
                        </div>
                        <div class="flex-grow min-w-0">
                            <div class="flex justify-between items-center">
                                <h4 class="font-semibold truncate text-sm">
                                    {founder.name}
                                </h4>
                                <span
                                    class="text-xs text-muted-foreground whitespace-nowrap ml-2"
                                >
                                    {founder.lastMessageDate}
                                </span>
                            </div>
                            <p
                                class="text-xs text-muted-foreground/90 truncate"
                            >
                                {founder.company}
                            </p>
                            <p
                                class="text-xs text-muted-foreground/70 truncate mt-0.5"
                            >
                                {founder.lastMessage}
                            </p>
                        </div>
                        {#if founder.unread > 0}
                            <Badge
                                variant="default"
                                class="ml-2 flex-shrink-0 text-xs px-2 py-0.5 h-fit"
                                >{founder.unread}</Badge
                            >
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Chat Area Column -->
        <div
            class="md:col-span-8 lg:col-span-9 border rounded-lg flex flex-col min-h-0 bg-card"
        >
            {#if selectedFounder}
                <!-- Chat Header -->
                <div
                    class="border-b p-3.5 flex items-center flex-shrink-0 bg-muted/30"
                >
                    <div class="relative">
                        <img
                            src={selectedFounder.avatar}
                            alt={selectedFounder.name}
                            class="w-10 h-10 rounded-full mr-3 object-cover shadow-sm border border-border/30"
                        />
                        {#if selectedFounder.status === "online"}
                            <div
                                class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card animate-pulse"
                                title="Online"
                            ></div>
                        {/if}
                    </div>
                    <div>
                        <h4 class="font-medium text-md">
                            {selectedFounder.name}
                        </h4>
                        <p class="text-xs text-muted-foreground">
                            {selectedFounder.company} · {selectedFounder.status ===
                            "online"
                                ? "Online"
                                : "Offline"}
                        </p>
                    </div>
                    <div class="ml-auto flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onclick={scheduleMeeting}
                            title="Schedule a meeting with {selectedFounder.name}"
                            aria-label={`Schedule a meeting with ${selectedFounder.name}`}
                            class="transition-all hover:bg-primary/10"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="mr-0 md:mr-1.5"
                            >
                                <rect
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="4"
                                    rx="2"
                                    ry="2"
                                />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                            <span class="hidden md:inline">Schedule</span>
                        </Button>
                    </div>
                </div>

                <!-- Messages Area -->
                <div
                    class="flex-grow p-4 overflow-y-auto flex flex-col-reverse space-y-3 space-y-reverse scrollbar-thin bg-background/70"
                >
                    {#if isTyping}
                        <div
                            class="text-xs text-muted-foreground ml-4 mb-2 flex items-center"
                        >
                            <span class="mr-2"
                                >{selectedFounder?.name} is typing</span
                            >
                            <span class="flex">
                                <span
                                    class="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full mr-1 animate-bounce"
                                    style="animation-delay: 0ms"
                                ></span>
                                <span
                                    class="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full mr-1 animate-bounce"
                                    style="animation-delay: 150ms"
                                ></span>
                                <span
                                    class="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                                    style="animation-delay: 300ms"
                                ></span>
                            </span>
                        </div>
                    {/if}
                    {#each displayedMessages
                        .slice()
                        .reverse() as message, i (message.id)}
                        <div
                            class="flex flex-col {message.senderId ===
                            'investor'
                                ? 'items-end'
                                : 'items-start'}"
                        >
                            <div class={getMessageClass(message)}>
                                <p class="whitespace-pre-wrap">
                                    {message.text}
                                </p>
                            </div>
                            <span
                                class="text-xs text-muted-foreground/80 mt-1 px-1.5 flex items-center gap-1"
                            >
                                {message.timestamp}
                                {#if message.senderId === "investor"}
                                    <span class="text-xs opacity-70 ml-1">
                                        {#if message.status === "sent"}
                                            ✓
                                        {:else if message.status === "delivered"}
                                            <span class="text-blue-500">✓✓</span
                                            >
                                        {:else if message.status === "read"}
                                            <span class="text-green-500"
                                                >✓✓</span
                                            >
                                        {/if}
                                    </span>
                                {/if}
                            </span>
                        </div>
                    {/each}
                    {#if displayedMessages.length === 0}
                        <div
                            class="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-6"
                        >
                            <div
                                class="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="opacity-60"
                                >
                                    <path
                                        d="M17 9v9M7 9v9M17 9H7V7c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2Z"
                                    />
                                    <path
                                        d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h2"
                                    />
                                </svg>
                            </div>
                            <p class="text-sm font-medium mb-1">
                                No messages with {selectedFounder.name} yet.
                            </p>
                            <p
                                class="text-xs bg-muted/30 px-3 py-1 rounded-full inline-block"
                            >
                                Be the first to send a message!
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- Message Input Area -->
                <div class="border-t p-3 md:p-4 flex-shrink-0 bg-muted/20">
                    {#key selectedFounder.id}
                        <form
                            class="flex items-center gap-2 bg-background/50 p-1.5 rounded-lg shadow-sm border border-border/40"
                            onsubmit={(event) => {
                                event.preventDefault();
                                sendMessage();
                            }}
                        >
                            <Textarea
                                bind:value={newMessage}
                                placeholder={`Message ${selectedFounder.name}...`}
                                aria-label={`Message ${selectedFounder.name}`}
                                class="min-h-[40px] max-h-[120px] resize-none flex-1 text-sm p-2 rounded-lg border-0 bg-transparent focus:ring-0 focus-visible:ring-0"
                                oninput={handleTyping}
                                onkeydown={(e: KeyboardEvent) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                rows={1}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!newMessage.trim() ||
                                    !selectedFounder ||
                                    isSendingMessage}
                                title="Send Message"
                                aria-label="Send message"
                                class="h-9 w-9 flex-shrink-0 rounded-full transition-all group"
                            >
                                {#if isSendingMessage}
                                    <svg
                                        class="animate-spin h-4 w-4 text-primary-foreground"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            class="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            stroke-width="4"
                                        ></circle>
                                        <path
                                            class="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <span class="sr-only">Sending...</span>
                                {:else}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    >
                                        <line x1="22" x2="11" y1="2" y2="13" />
                                        <polygon
                                            points="22 2 15 22 11 13 2 9 22 2"
                                        />
                                    </svg>
                                    <span class="sr-only">Send Message</span>
                                {/if}
                            </Button>
                        </form>
                    {/key}
                </div>
            {:else}
                <!-- Enhanced placeholder when no founder is selected -->
                <div
                    class="flex-1 flex flex-col items-center justify-center bg-muted/10 p-8 text-center rounded-lg"
                >
                    <div
                        class="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-5 shadow-sm"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="text-muted-foreground/40"
                        >
                            <path
                                d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
                            /><path d="M12 20h4" /><path d="M12 20h-4" /><path
                                d="M4 8h4"
                            /><path d="M4 12h4" /><path d="M4 16h4" /><path
                                d="M20 8h-4"
                            /><path d="M20 12h-4" /><path d="M20 16h-4" />
                        </svg>
                    </div>
                    <h3
                        class="text-lg font-semibold mb-2 text-muted-foreground/80"
                    >
                        Select a Conversation
                    </h3>
                    <p class="text-muted-foreground/60 text-sm max-w-md">
                        Choose a founder from the list to view messages or start
                        a new chat.
                    </p>
                    <div
                        class="mt-4 bg-muted/20 px-4 py-2 rounded-full text-xs text-muted-foreground/50 inline-flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="mr-2"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="m12 8 4 4-4 4"></path>
                            <path d="M8 12h8"></path>
                        </svg>
                        Select from the sidebar
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    /* Message transitions and animations */
    .message-bubble {
        transition:
            transform 0.15s ease-out,
            box-shadow 0.15s ease-out;
    }

    .message-bubble:hover {
        transform: translateY(-1px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* Improved scrollbar styling */
    .scrollbar-thin::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb {
        background: hsl(var(--border) / 0.5);
        border-radius: 10px;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--border) / 0.8);
    }

    /* Subtle background pattern */
    .bg-pattern {
        background-image: radial-gradient(
                hsl(var(--primary) / 0.03) 1px,
                transparent 1px
            ),
            radial-gradient(hsl(var(--primary) / 0.03) 1px, transparent 1px);
        background-size: 20px 20px;
        background-position:
            0 0,
            10px 10px;
    }
</style>

<script setup lang="ts">
import MessageThread from '@/components/MessageThread.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-vue-next'

interface Thread {
  id: number
  participant: {
    id: number
    name: string
    avatar: string
    role: string
  }
  lastMessage: string
  unreadCount: number
  lastMessageTime: string
}

const threads = ref<Thread[]>([
  {
    id: 1,
    participant: {
      id: 2,
      name: "Sarah Chen",
      avatar: "https://picsum.photos/201",
      role: "Founder, TechFlow"
    },
    lastMessage: "What's your current funding stage?",
    unreadCount: 2,
    lastMessageTime: "10:33 AM"
  },
  {
    id: 2,
    participant: {
      id: 3,
      name: "Michael Rodriguez",
      avatar: "https://picsum.photos/202",
      role: "Investor, Sequoia Capital"
    },
    lastMessage: "I'd like to schedule a meeting to discuss potential investment.",
    unreadCount: 0,
    lastMessageTime: "Yesterday"
  },
  {
    id: 3,
    participant: {
      id: 4,
      name: "Emily Johnson",
      avatar: "https://picsum.photos/203",
      role: "Advisor, Startup Accelerator"
    },
    lastMessage: "Your pitch deck looks great! Let's refine the market analysis section.",
    unreadCount: 1,
    lastMessageTime: "2 days ago"
  }
])

const selectedThread = ref<Thread | null>(null)
const searchQuery = ref('')

const filteredThreads = computed(() => {
  if (!searchQuery.value) return threads.value
  const query = searchQuery.value.toLowerCase()
  return threads.value.filter(thread => 
    thread.participant.name.toLowerCase().includes(query) ||
    thread.participant.role.toLowerCase().includes(query) ||
    thread.lastMessage.toLowerCase().includes(query)
  )
})

const selectThread = (thread: Thread) => {
  selectedThread.value = thread
  // Mark messages as read
  thread.unreadCount = 0
}
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex flex-col gap-8">
      <div>
        <h1 class="text-3xl font-bold mb-2">Messages</h1>
        <p class="text-muted-foreground">Connect with founders, investors, and advisors</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        <Card class="lg:col-span-1">
          <CardHeader>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="searchQuery"
                placeholder="Search messages..."
                class="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent class="p-0">
            <div class="divide-y">
              <button
                v-for="thread in filteredThreads"
                :key="thread.id"
                class="w-full p-4 hover:bg-muted/50 transition-colors text-left"
                :class="{ 'bg-muted/50': selectedThread?.id === thread.id }"
                @click="selectThread(thread)"
              >
                <div class="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage :src="thread.participant.avatar" :alt="thread.participant.name" />
                    <AvatarFallback>{{ thread.participant.name[0] }}</AvatarFallback>
                  </Avatar>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="font-medium truncate">{{ thread.participant.name }}</p>
                      <span class="text-xs text-muted-foreground">{{ thread.lastMessageTime }}</span>
                    </div>
                    <p class="text-sm text-muted-foreground truncate">{{ thread.participant.role }}</p>
                    <div class="flex items-center justify-between mt-1">
                      <p class="text-sm truncate">{{ thread.lastMessage }}</p>
                      <span
                        v-if="thread.unreadCount > 0"
                        class="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {{ thread.unreadCount }}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <div class="lg:col-span-2">
          <MessageThread
            v-if="selectedThread"
            :thread="selectedThread"
          />
          <Card v-else class="h-full flex items-center justify-center">
            <CardContent class="text-center">
              <p class="text-muted-foreground">Select a conversation to start messaging</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template> 
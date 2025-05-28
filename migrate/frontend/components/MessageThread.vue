<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-vue-next'

interface Message {
  id: number
  content: string
  sender: {
    id: number
    name: string
    avatar: string
  }
  timestamp: string
  isRead: boolean
}

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

const props = defineProps<{
  thread: Thread
}>()

const messages = ref<Message[]>([
  {
    id: 1,
    content: "Hi! I'm interested in learning more about your startup.",
    sender: {
      id: 1,
      name: "John Doe",
      avatar: "https://picsum.photos/200"
    },
    timestamp: "10:30 AM",
    isRead: true
  },
  {
    id: 2,
    content: "Hello! I'd be happy to tell you more about our platform.",
    sender: {
      id: 2,
      name: props.thread.participant.name,
      avatar: props.thread.participant.avatar
    },
    timestamp: "10:32 AM",
    isRead: true
  },
  {
    id: 3,
    content: "What's your current funding stage?",
    sender: {
      id: 1,
      name: "John Doe",
      avatar: "https://picsum.photos/200"
    },
    timestamp: "10:33 AM",
    isRead: true
  }
])

const newMessage = ref('')

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  messages.value.push({
    id: messages.value.length + 1,
    content: newMessage.value,
    sender: {
      id: 1,
      name: "John Doe",
      avatar: "https://picsum.photos/200"
    },
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isRead: false
  })

  newMessage.value = ''
}
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader class="border-b">
      <div class="flex items-center gap-3">
        <Avatar>
          <AvatarImage :src="thread.participant.avatar" :alt="thread.participant.name" />
          <AvatarFallback>{{ thread.participant.name[0] }}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{{ thread.participant.name }}</CardTitle>
          <p class="text-sm text-muted-foreground">{{ thread.participant.role }}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-for="message in messages" :key="message.id" class="flex gap-3" :class="{ 'justify-end': message.sender.id === 1 }">
        <Avatar v-if="message.sender.id !== 1" class="h-8 w-8">
          <AvatarImage :src="message.sender.avatar" :alt="message.sender.name" />
          <AvatarFallback>{{ message.sender.name[0] }}</AvatarFallback>
        </Avatar>
        <div class="flex flex-col gap-1" :class="{ 'items-end': message.sender.id === 1 }">
          <div class="rounded-lg px-4 py-2 max-w-[80%]" :class="message.sender.id === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'">
            {{ message.content }}
          </div>
          <span class="text-xs text-muted-foreground">{{ message.timestamp }}</span>
        </div>
        <Avatar v-if="message.sender.id === 1" class="h-8 w-8">
          <AvatarImage :src="message.sender.avatar" :alt="message.sender.name" />
          <AvatarFallback>{{ message.sender.name[0] }}</AvatarFallback>
        </Avatar>
      </div>
    </CardContent>
    <CardFooter class="border-t p-4">
      <form @submit.prevent="sendMessage" class="flex gap-2 w-full">
        <Input
          v-model="newMessage"
          placeholder="Type your message..."
          class="flex-1"
        />
        <Button type="submit" size="icon">
          <Send class="h-4 w-4" />
        </Button>
      </form>
    </CardFooter>
  </Card>
</template> 
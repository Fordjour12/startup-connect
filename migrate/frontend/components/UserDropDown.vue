<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User } from '@/types/index'

defineProps<{
  user: User
  onProfile?: () => void
  onLogout?: () => void
}>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Avatar class="cursor-pointer">
        <AvatarImage :src="''" :alt="user.full_name" />
        <AvatarFallback>{{ user.full_name?.[0] ?? '?' }}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>
        <div class="font-medium">{{ user.full_name }}</div>
        <div class="text-xs text-muted-foreground">{{ user.email }}</div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="$emit('profile')">Profile</DropdownMenuItem>
      <DropdownMenuItem @click="$emit('logout')">Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

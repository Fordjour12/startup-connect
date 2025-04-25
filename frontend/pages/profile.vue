<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@/composables/useUser'
import { onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

const { user, isLoading, error, fetchUser, updateUser, updatePassword, uploadAvatar } = useUser()

// Form states
const newPassword = ref('')
const confirmPassword = ref('')
const selectedFile = ref<File | null>(null)

// Local form state
const formData = ref({
  name: '',
  email: '',
  bio: ''
})

onMounted(() => {
  fetchUser()
})

// Update form data when user data is loaded
watch(user, (newUser) => {
  if (newUser) {
    formData.value = {
      name: newUser.name,
      email: newUser.email,
      bio: newUser.bio
    }
  }
}, { immediate: true })

// Profile update handler
const updateProfile = async () => {
  if (!user.value) return
  
  const success = await updateUser({
    name: formData.value.name,
    email: formData.value.email,
    bio: formData.value.bio,
  })

  if (success) {
    toast.success('Profile Updated', {
      description: 'Your profile has been successfully updated.',
    })
  } else {
    toast.error('Error', {
      description: 'Failed to update profile. Please try again.',
    })
  }
}

// Password change handler
const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error('Error', {
      description: 'Passwords do not match.',
    })
    return
  }
  
  const success = await updatePassword('', newPassword.value)
  
  if (success) {
    toast.success('Password Updated', {
      description: 'Your password has been successfully changed.',
    })
    newPassword.value = ''
    confirmPassword.value = ''
  } else {
    toast.error('Error', {
      description: 'Failed to change password. Please try again.',
    })
  }
}

// Profile picture upload handler
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    selectedFile.value = input.files[0]
    const success = await uploadAvatar(selectedFile.value)
    
    if (success) {
      toast.success('Success', {
        description: 'Profile picture updated successfully.',
      })
    } else {
      toast.error('Error', {
        description: 'Failed to upload profile picture.',
      })
    }
  }
}
</script>

<template>
  <div class="container mx-auto py-8">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"/>
    </div>
    
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>
    
    <Tabs v-else default-value="profile" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your profile information and manage your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div class="flex items-center space-x-4">
                <img
                  :src="user?.avatar"
                  alt="Profile"
                  class="h-20 w-20 rounded-full object-cover"
                >
                <div>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload"
                  />
                  <Button @click="() => document.getElementById('avatar-upload')?.click()">
                    Change Photo
                  </Button>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium">Name</label>
                  <Input v-model="formData.name" class="mt-1" />
                </div>
                <div>
                  <label class="text-sm font-medium">Email</label>
                  <Input v-model="formData.email" type="email" class="mt-1" />
                </div>
                <div>
                  <label class="text-sm font-medium">Bio</label>
                  <Input v-model="formData.bio" class="mt-1" />
                </div>
                <Button @click="updateProfile">Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium">New Password</label>
                <Input
                  v-model="newPassword"
                  type="password"
                  class="mt-1"
                />
              </div>
              <div>
                <label class="text-sm font-medium">Confirm Password</label>
                <Input
                  v-model="confirmPassword"
                  type="password"
                  class="mt-1"
                />
              </div>
              <Button @click="changePassword">Change Password</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template> 
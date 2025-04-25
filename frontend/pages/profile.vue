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
const formData = ref({
  username: '',
  email: '',
  fullName: '',
  bio: '',
  location: '',
  website: '',
  phone: '',
  company: '',
  position: ''
})

// Password change states
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Profile picture states
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isUploading = ref(false)

onMounted(() => {
  fetchUser()
})

// Update form data when user data is loaded
watch(user, (newUser) => {
  if (newUser) {
    formData.value = {
      username: newUser.username || '',
      email: newUser.email || '',
      fullName: newUser.fullName || '',
      bio: newUser.bio || '',
      location: newUser.location || '',
      website: newUser.website || '',
      phone: newUser.phone || '',
      company: newUser.company || '',
      position: newUser.position || ''
    }
    previewUrl.value = newUser.avatar || null
  }
}, { immediate: true })

// Profile update handler
const updateProfile = async () => {
  if (!user.value) return
  
  const success = await updateUser({
    ...formData.value
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
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    toast.error('Error', {
      description: 'New passwords do not match.',
    })
    return
  }

  if (passwordData.value.newPassword.length < 8) {
    toast.error('Error', {
      description: 'Password must be at least 8 characters long.',
    })
    return
  }
  
  const success = await updatePassword(
    passwordData.value.currentPassword,
    passwordData.value.newPassword
  )
  
  if (success) {
    toast.success('Password Updated', {
      description: 'Your password has been successfully changed.',
    })
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } else {
    toast.error('Error', {
      description: 'Failed to change password. Please check your current password.',
    })
  }
}

// Profile picture upload handler
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Error', {
        description: 'Please upload an image file.',
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Error', {
        description: 'Image size should be less than 5MB.',
      })
      return
    }

    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

// Save profile picture
const saveProfilePicture = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  try {
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
  } finally {
    isUploading.value = false
  }
}

// Cancel profile picture upload
const cancelProfilePicture = () => {
  selectedFile.value = null
  previewUrl.value = user.value?.avatar || null
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
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      
      <!-- Profile Tab -->
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
              <!-- Profile Picture -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Profile Picture</h3>
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <img
                      :src="previewUrl || '/default-avatar.png'"
                      alt="Profile"
                      class="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                    >
                    <div class="absolute bottom-0 right-0">
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleFileUpload"
                      />
                      <Button 
                        size="sm"
                        @click="() => document.getElementById('avatar-upload')?.click()"
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                  <div v-if="selectedFile" class="space-x-2">
                    <Button 
                      size="sm"
                      :disabled="isUploading"
                      @click="saveProfilePicture"
                    >
                      {{ isUploading ? 'Uploading...' : 'Save' }}
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      @click="cancelProfilePicture"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Basic Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Basic Information</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium">Full Name</label>
                    <Input v-model="formData.fullName" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Username</label>
                    <Input v-model="formData.username" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Email</label>
                    <Input v-model="formData.email" type="email" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Phone</label>
                    <Input v-model="formData.phone" type="tel" class="mt-1" />
                  </div>
                </div>
              </div>

              <!-- Professional Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Professional Information</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium">Company</label>
                    <Input v-model="formData.company" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Position</label>
                    <Input v-model="formData.position" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Location</label>
                    <Input v-model="formData.location" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Website</label>
                    <Input v-model="formData.website" type="url" class="mt-1" />
                  </div>
                </div>
              </div>

              <!-- Bio -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Bio</h3>
                <div>
                  <label class="text-sm font-medium">About</label>
                  <Input v-model="formData.bio" class="mt-1" />
                </div>
              </div>

              <Button @click="updateProfile">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Account Tab -->
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <!-- Notification Preferences -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Notification Preferences</h3>
                <div class="space-y-2">
                  <div class="flex items-center space-x-2">
                    <input id="email-notifications" type="checkbox" class="rounded border-gray-300" >
                    <label for="email-notifications" class="text-sm">Email Notifications</label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input id="sms-notifications" type="checkbox" class="rounded border-gray-300" >
                    <label for="sms-notifications" class="text-sm">SMS Notifications</label>
                  </div>
                </div>
              </div>

              <!-- Privacy Settings -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Privacy Settings</h3>
                <div class="space-y-2">
                  <div class="flex items-center space-x-2">
                    <input id="profile-visibility" type="checkbox" class="rounded border-gray-300" >
                    <label for="profile-visibility" class="text-sm">Public Profile</label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input id="show-email" type="checkbox" class="rounded border-gray-300" >
                    <label for="show-email" class="text-sm">Show Email to Others</label>
                  </div>
                </div>
              </div>

              <!-- Language & Region -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Language & Region</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium">Language</label>
                    <select class="w-full rounded-md border border-gray-300 p-2">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-sm font-medium">Time Zone</label>
                    <select class="w-full rounded-md border border-gray-300 p-2">
                      <option value="UTC">UTC</option>
                      <option value="EST">EST</option>
                      <option value="PST">PST</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Security Tab -->
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <!-- Password Change -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Change Password</h3>
                <div class="space-y-4">
                  <div>
                    <label class="text-sm font-medium">Current Password</label>
                    <Input
                      v-model="passwordData.currentPassword"
                      type="password"
                      class="mt-1"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium">New Password</label>
                    <Input
                      v-model="passwordData.newPassword"
                      type="password"
                      class="mt-1"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Confirm New Password</label>
                    <Input
                      v-model="passwordData.confirmPassword"
                      type="password"
                      class="mt-1"
                    />
                  </div>
                  <Button @click="changePassword">Change Password</Button>
                </div>
              </div>

              <!-- Two-Factor Authentication -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Two-Factor Authentication</h3>
                <div class="space-y-2">
                  <div class="flex items-center space-x-2">
                    <input id="2fa" type="checkbox" class="rounded border-gray-300" >
                    <label for="2fa" class="text-sm">Enable Two-Factor Authentication</label>
                  </div>
                  <p class="text-sm text-gray-500">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                </div>
              </div>

              <!-- Session Management -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Active Sessions</h3>
                <div class="space-y-2">
                  <div class="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p class="font-medium">Current Session</p>
                      <p class="text-sm text-gray-500">Last active: Just now</p>
                    </div>
                    <Button variant="outline" size="sm">End Session</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template> 
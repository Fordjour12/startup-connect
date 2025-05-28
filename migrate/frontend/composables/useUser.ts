import { ref } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  bio: string
  avatar: string
}

export const useUser = () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchUser = async () => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      user.value = data
    } catch (e) {
      error.value = 'Failed to fetch user data'
    } finally {
      isLoading.value = false
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      const data = await response.json()
      user.value = { ...user.value, ...data } as User
      return true
    } catch (e) {
      error.value = 'Failed to update user data'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      })
      return true
    } catch (e) {
      error.value = 'Failed to update password'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const uploadAvatar = async (file: File) => {
    isLoading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (user.value) {
        user.value.avatar = data.avatarUrl
      }
      return true
    } catch (e) {
      error.value = 'Failed to upload avatar'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    error,
    fetchUser,
    updateUser,
    updatePassword,
    uploadAvatar,
  }
} 
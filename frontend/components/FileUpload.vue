<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, File, Upload, X } from 'lucide-vue-next'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  url?: string
}

const props = defineProps<{
  accept?: string
  maxSize?: number // in MB
  multiple?: boolean
}>()

const emit = defineEmits<{
  (e: 'upload', files: File[]): void
  (e: 'remove', fileId: string): void
}>()

const files = ref<UploadedFile[]>([])
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  const droppedFiles = e.dataTransfer?.files
  if (droppedFiles) {
    handleFiles(droppedFiles)
  }
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) {
    handleFiles(input.files)
  }
}

const handleFiles = (fileList: FileList) => {
  const newFiles = Array.from(fileList).map(file => ({
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    progress: 0,
    status: 'uploading' as const
  }))

  files.value.push(...newFiles)
  emit('upload', Array.from(fileList))

  // Simulate upload progress
  newFiles.forEach(file => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      const fileIndex = files.value.findIndex(f => f.id === file.id)
      if (fileIndex !== -1) {
        files.value[fileIndex].progress = progress
        if (progress >= 100) {
          files.value[fileIndex].status = 'success'
          files.value[fileIndex].url = URL.createObjectURL(fileList[0])
          clearInterval(interval)
        }
      }
    }, 200)
  })
}

const removeFile = (fileId: string) => {
  const fileIndex = files.value.findIndex(f => f.id === fileId)
  if (fileIndex !== -1) {
    const file = files.value[fileIndex]
    if (file.url) {
      URL.revokeObjectURL(file.url)
    }
    files.value.splice(fileIndex, 1)
    emit('remove', fileId)
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Upload Files</CardTitle>
      <CardDescription>Upload pitch decks, documents, or other files</CardDescription>
    </CardHeader>
    <CardContent>
      <div
        class="border-2 border-dashed rounded-lg p-8 text-center"
        :class="{ 'border-primary bg-primary/5': isDragging }"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          :accept="accept"
          :multiple="multiple"
          class="hidden"
          @change="handleFileSelect"
        />
        <div class="flex flex-col items-center gap-2">
          <Upload class="h-8 w-8 text-muted-foreground" />
          <p class="text-sm text-muted-foreground">
            Drag and drop files here, or
            <button
              class="text-primary hover:underline"
              @click="fileInput?.click()"
            >
              browse
            </button>
          </p>
          <p class="text-xs text-muted-foreground">
            Supported formats: PDF, DOC, DOCX, PPT, PPTX
            <template v-if="maxSize">
              (Max size: {{ maxSize }}MB)
            </template>
          </p>
        </div>
      </div>

      <!-- Uploaded Files -->
      <div v-if="files.length > 0" class="mt-4 space-y-4">
        <div v-for="file in files" :key="file.id" class="flex items-center gap-4 p-4 border rounded-lg">
          <File class="h-8 w-8 text-muted-foreground" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ file.name }}</p>
            <p class="text-xs text-muted-foreground">{{ formatFileSize(file.size) }}</p>
            <Progress v-if="file.status === 'uploading'" :value="file.progress" class="mt-2" />
          </div>
          <div class="flex items-center gap-2">
            <CheckCircle2 v-if="file.status === 'success'" class="h-5 w-5 text-green-500" />
            <Button
              v-if="file.status === 'success'"
              variant="ghost"
              size="icon"
              @click="removeFile(file.id)"
            >
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template> 
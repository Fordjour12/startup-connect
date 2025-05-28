<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const startupId = computed(() => route.params.id)

const isEditing = ref(false)
</script>

<template>
    <div>
        <h1>Startup Details</h1>
        <p>{{ startupId }}</p>
        <Button @click="isEditing = true">Edit</Button>
    </div>
</template>
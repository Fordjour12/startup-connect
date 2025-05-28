<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const startupId = computed(() => route.params.id)

const isEditing = ref(false)
</script>

<template>
    <div>
        <h1>Edit Startup</h1>
        <p>{{ isEditing }}</p>
        <p>{{ startupId }}</p>
    </div>
</template>
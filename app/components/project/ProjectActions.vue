<template>
    <div class="flex items-center gap-1">
        <Button
            as-child
            variant="ghost"
            size="icon"
            class="size-11 rounded-lg text-muted-foreground hover:text-foreground"
        >
            <NuxtLink :to="`/projects/${project.uuid}/edit`" :aria-label="`Edit ${project.project_name}`">
                <Pencil aria-hidden="true" />
            </NuxtLink>
        </Button>
        <Button
            variant="ghost"
            size="icon"
            class="size-11 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            :aria-label="`Delete ${project.project_name}`"
            @click="emit('delete', project)"
        >
            <Trash2 aria-hidden="true" />
        </Button>
    </div>
</template>

<script setup lang="ts">
import type { Project } from '@/components/api/project/ProjectService'
import { Pencil, Trash2 } from '@lucide/vue'

defineProps<{
    project: Project
}>()

const emit = defineEmits<{
    delete: [project: Project]
}>()
</script>

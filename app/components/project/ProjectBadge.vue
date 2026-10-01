<template>
    <span
        :class="cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset', option.badgeClass)"
    >
        <component :is="option.icon" aria-hidden="true" class="size-3.5" />
        <span v-if="type === 'priority'" class="sr-only">Priority:</span>
        {{ option.label }}
    </span>
</template>

<script setup lang="ts">
import type { ProjectPriority, ProjectStatus } from '@/components/api/project/ProjectService'
import { cn } from '@/lib/utils'
import { findPriority, findStatus } from '@/lib/project'

const props = defineProps<{
    type: 'status' | 'priority'
    value: ProjectStatus | ProjectPriority
}>()

const option = computed(() => {
    return props.type === 'status'
        ? findStatus(props.value as ProjectStatus)
        : findPriority(props.value as ProjectPriority)
})
</script>

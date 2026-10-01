<template>
    <span v-if="!project.due_date" class="text-muted-foreground">
        No due date
    </span>
    <span v-else-if="overdue" class="inline-flex items-center gap-1.5 font-medium text-destructive">
        <CalendarX2 aria-hidden="true" class="size-4 shrink-0" />
        {{ formatDate(project.due_date) }}
        <span class="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">Overdue</span>
    </span>
    <span v-else class="inline-flex items-center gap-1.5">
        <CalendarDays aria-hidden="true" class="size-4 shrink-0 text-muted-foreground" />
        {{ formatDate(project.due_date) }}
    </span>
</template>

<script setup lang="ts">
import type { Project } from '@/components/api/project/ProjectService'
import { CalendarDays, CalendarX2 } from '@lucide/vue'
import { formatDate, isOverdue } from '@/lib/project'

const props = defineProps<{
    project: Project
}>()

const overdue = computed(() => isOverdue(props.project))
</script>

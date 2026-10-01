<template>
    <th scope="col" :aria-sort="ariaSort" class="px-2 py-1.5 font-medium">
        <button
            type="button"
            :class="cn(
                'group/sort inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 uppercase tracking-wide outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
                active && 'text-foreground',
            )"
            @click="emit('sort', field)"
        >
            {{ label }}
            <ArrowUp v-if="active && direction === 'asc'" aria-hidden="true" class="size-3.5" />
            <ArrowDown v-else-if="active && direction === 'desc'" aria-hidden="true" class="size-3.5" />
            <ArrowUpDown v-else aria-hidden="true" class="size-3.5 opacity-40 transition-opacity group-hover/sort:opacity-100" />
        </button>
    </th>
</template>

<script setup lang="ts">
import type { ProjectSortField, SortDirection } from '@/components/api/project/ProjectService'
import { ArrowDown, ArrowUp, ArrowUpDown } from '@lucide/vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
    field: ProjectSortField
    label: string
    sortBy: ProjectSortField
    direction: SortDirection
}>()

const emit = defineEmits<{
    sort: [field: ProjectSortField]
}>()

const active = computed(() => props.sortBy === props.field)

const ariaSort = computed(() => {
    if (!active.value) {
        return 'none'
    }

    return props.direction === 'asc' ? 'ascending' : 'descending'
})
</script>

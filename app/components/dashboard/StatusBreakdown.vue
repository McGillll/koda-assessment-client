<template>
    <section class="rounded-2xl border bg-card p-5 shadow-xs sm:p-6" aria-labelledby="status-breakdown-title">
        <header class="flex items-baseline justify-between gap-4">
            <h2 id="status-breakdown-title" class="font-semibold">
                Status breakdown
            </h2>
            <p class="text-sm text-muted-foreground">
                {{ total }} {{ total === 1 ? 'project' : 'projects' }}
            </p>
        </header>

        <div class="relative mt-5">
            <div
                class="flex h-3 w-full gap-0.5 overflow-hidden rounded-full"
                role="img"
                :aria-label="summaryLabel"
            >
                <div
                    v-for="item in visibleItems"
                    :key="item.value"
                    :class="cn('h-full transition-[flex-grow] duration-500 first:rounded-l-full last:rounded-r-full', item.dotClass, hovered && hovered !== item.value && 'opacity-40')"
                    :style="{ flexGrow: item.count }"
                    @mouseenter="hovered = item.value"
                    @mouseleave="hovered = null"
                />
            </div>
        </div>

        <ul class="mt-5 grid gap-1 sm:grid-cols-2">
            <li v-for="item in items" :key="item.value">
                <NuxtLink
                    :to="{ path: '/projects', query: { status: item.value } }"
                    :class="cn(
                        'flex min-h-11 items-center gap-3 rounded-lg px-2 text-sm transition-colors hover:bg-muted',
                        hovered === item.value && 'bg-muted',
                    )"
                    @mouseenter="hovered = item.value"
                    @mouseleave="hovered = null"
                    @focus="hovered = item.value"
                    @blur="hovered = null"
                >
                    <span aria-hidden="true" :class="cn('size-2.5 shrink-0 rounded-full', item.dotClass)" />
                    <span class="flex-1 font-medium">{{ item.label }}</span>
                    <span class="tabular-nums text-foreground">{{ item.count }}</span>
                    <span class="w-12 text-right tabular-nums text-muted-foreground">{{ item.percent }}%</span>
                </NuxtLink>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import type { StatusSummaryItem } from '@/lib/project'
import { cn } from '@/lib/utils'

const props = defineProps<{
    items: StatusSummaryItem[]
    total: number
}>()

const hovered = ref<string | null>(null)

const visibleItems = computed(() => props.items.filter(item => item.count > 0))

const summaryLabel = computed(() => {
    const parts = props.items.map(item => `${item.label} ${item.count} (${item.percent}%)`)

    return `Projects by status: ${parts.join(', ')}`
})
</script>

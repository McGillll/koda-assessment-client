<template>
    <main class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <header class="space-y-1">
            <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                Dashboard
            </h1>
            <p class="text-sm text-muted-foreground">
                {{ greeting }}, {{ firstName }}. Here's where your client projects stand.
            </p>
        </header>

        <div v-if="loading && !summary" class="mt-8 space-y-6" aria-busy="true">
            <span class="sr-only">Loading summary</span>
            <div class="h-36 animate-pulse rounded-2xl bg-muted" />
            <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div v-for="tile in 4" :key="tile" class="h-32 animate-pulse rounded-2xl border bg-card" />
            </div>
        </div>

        <div v-else-if="loadError" class="mt-8 flex flex-col items-center rounded-2xl border bg-card px-6 py-14 text-center">
            <span class="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <CloudAlert aria-hidden="true" class="size-6" />
            </span>
            <h2 class="mt-4 font-semibold">
                Couldn't load the summary
            </h2>
            <p class="mt-1 max-w-sm text-sm text-muted-foreground">
                {{ loadError }}
            </p>
            <Button variant="outline" class="mt-6 min-h-11 rounded-lg" @click="fetchSummary">
                <RotateCw aria-hidden="true" />
                Try again
            </Button>
        </div>

        <div v-else-if="summary && summary.total === 0" class="mt-8 flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
            <span class="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FolderKanban aria-hidden="true" class="size-6" />
            </span>
            <h2 class="mt-4 font-semibold">
                No projects yet
            </h2>
            <p class="mt-1 max-w-sm text-sm text-muted-foreground">
                Once you add client projects, you'll see how they break down by status here.
            </p>
            <Button as-child class="mt-6 min-h-11 rounded-lg font-semibold">
                <NuxtLink to="/projects/create">
                    <Plus aria-hidden="true" />
                    Create project
                </NuxtLink>
            </Button>
        </div>

        <div v-else-if="summary" :class="cn('mt-8 space-y-6 animate-in fade-in duration-300 motion-reduce:animate-none', loading && 'opacity-60 transition-opacity')">
            <section class="relative overflow-hidden rounded-2xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
                <div aria-hidden="true" class="pointer-events-none absolute inset-0">
                    <div class="absolute -right-20 -top-24 size-72 rounded-full bg-indigo-600/40 blur-3xl" />
                    <div class="absolute -bottom-28 left-1/4 size-72 rounded-full bg-violet-600/25 blur-3xl" />
                </div>
                <div class="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p class="text-sm font-medium text-zinc-400">
                            Total projects
                        </p>
                        <p class="mt-1 text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">
                            {{ summary.total }}
                        </p>
                    </div>
                    <dl class="grid grid-cols-2 gap-x-8 gap-y-1 text-sm sm:text-right">
                        <dt class="text-zinc-400">
                            Active
                        </dt>
                        <dd class="font-semibold tabular-nums">
                            {{ activeCount }}
                        </dd>
                        <dt class="text-zinc-400">
                            Completion rate
                        </dt>
                        <dd class="font-semibold tabular-nums">
                            {{ completedPercent }}%
                        </dd>
                    </dl>
                </div>
            </section>

            <section aria-label="Projects by status" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <NuxtLink
                    v-for="item in summary.items"
                    :key="item.value"
                    :to="{ path: '/projects', query: { status: item.value } }"
                    class="group rounded-2xl border bg-card p-4 shadow-xs outline-none transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:hover:translate-y-0 sm:p-5"
                >
                    <div class="flex items-center justify-between gap-2">
                        <span class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <component :is="item.icon" aria-hidden="true" class="size-4" />
                            {{ item.label }}
                        </span>
                        <ArrowUpRight aria-hidden="true" class="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                    </div>
                    <p class="mt-3 text-3xl font-semibold tabular-nums tracking-tight">
                        {{ item.count }}
                    </p>
                    <div class="mt-3 flex items-center gap-2">
                        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                            <div :class="cn('h-full rounded-full transition-[width] duration-500', item.dotClass)" :style="{ width: `${item.percent}%` }" />
                        </div>
                        <span class="text-xs tabular-nums text-muted-foreground">{{ item.percent }}%</span>
                    </div>
                    <span class="sr-only">, {{ item.percent }} percent of all projects. View {{ item.label }} projects.</span>
                </NuxtLink>
            </section>

            <DashboardStatusBreakdown :items="summary.items" :total="summary.total" />
        </div>
    </main>
</template>

<script setup lang="ts">
import type { StatusSummaryItem } from '@/lib/project'
import { ArrowUpRight, CloudAlert, FolderKanban, Plus, RotateCw } from '@lucide/vue'
import { projectService } from '@/components/api/project/ProjectService'
import { parseAPIError } from '@/lib/apiError'
import { STATUS_OPTIONS } from '@/lib/project'
import { cn } from '@/lib/utils'

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard',
})

useHead({
    title: 'Dashboard · Koda',
})

interface Summary {
    total: number
    items: StatusSummaryItem[]
}

const { token, user, expireSession } = useAuth()

const summary = ref<Summary | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)

const firstName = computed(() => (user.value?.name || '').trim().split(/\s+/)[0] || 'there')

const greeting = computed(() => {
    const hour = new Date().getHours()

    if (hour < 12) {
        return 'Good morning'
    }

    return hour < 18 ? 'Good afternoon' : 'Good evening'
})

const countFor = (status: string) => summary.value?.items.find(item => item.value === status)?.count ?? 0

const activeCount = computed(() => countFor('planning') + countFor('in_progress') + countFor('on_hold'))

const completedPercent = computed(() => summary.value?.items.find(item => item.value === 'completed')?.percent ?? 0)

const fetchSummary = async () => {
    loading.value = true
    loadError.value = null

    try {
        const [all, ...byStatus] = await Promise.all([
            projectService.fetchProjects({ per_page: 1 }, token.value),
            ...STATUS_OPTIONS.map(option => projectService.fetchProjects({ status: option.value, per_page: 1 }, token.value)),
        ])

        const total = all.data?.meta.total ?? 0

        summary.value = {
            total,
            items: STATUS_OPTIONS.map((option, index) => {
                const count = byStatus[index]?.data?.meta.total ?? 0

                return {
                    ...option,
                    count,
                    percent: total ? Math.round((count / total) * 100) : 0,
                }
            }),
        }
    } catch (exception) {
        const parsed = parseAPIError(exception)

        if (parsed.status === 401) {
            await expireSession()

            return
        }

        loadError.value = parsed.message
    } finally {
        loading.value = false
    }
}

onMounted(fetchSummary)
</script>

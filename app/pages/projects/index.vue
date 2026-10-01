<template>
    <div>
        <main class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div class="space-y-1">
                    <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Projects
                    </h1>
                    <p class="text-sm text-muted-foreground">
                        <template v-if="meta">
                            {{ meta.total }} {{ meta.total === 1 ? 'project' : 'projects' }}{{ hasFilters ? ' match your filters' : ' across your clients' }}
                        </template>
                        <template v-else>
                            Track every client project in one place.
                        </template>
                    </p>
                </div>
                <Button as-child class="min-h-11 rounded-lg font-semibold shadow-lg shadow-primary/25">
                    <NuxtLink to="/projects/create">
                        <Plus aria-hidden="true" />
                        New project
                    </NuxtLink>
                </Button>
            </div>

            <div class="mt-6 flex items-center gap-3">
                <div class="group relative min-w-0 flex-1">
                    <Search
                        aria-hidden="true"
                        class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                    />
                    <label for="project-search" class="sr-only">Search projects</label>
                    <Input
                        id="project-search"
                        v-model="searchInput"
                        type="search"
                        class="h-11 rounded-lg bg-background pl-10"
                        placeholder="Search by client or project name"
                    />
                </div>

                <Button
                    variant="outline"
                    class="relative size-11 shrink-0 rounded-lg bg-background md:hidden"
                    :aria-label="activeFilterCount ? `Filter and sort, ${activeFilterCount} active` : 'Filter and sort'"
                    @click="filterSheetOpen = true"
                >
                    <SlidersHorizontal aria-hidden="true" class="size-5" />
                    <span
                        v-if="activeFilterCount"
                        aria-hidden="true"
                        class="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground ring-2 ring-background"
                    >
                        {{ activeFilterCount }}
                    </span>
                </Button>

                <div class="hidden gap-3 md:flex">
                    <Select v-model="filters.status">
                        <SelectTrigger class="h-11! w-44 rounded-lg bg-background" aria-label="Filter by status">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" class="min-h-11">
                                All statuses
                            </SelectItem>
                            <SelectItem v-for="option in STATUS_OPTIONS" :key="option.value" :value="option.value" class="min-h-11">
                                <span aria-hidden="true" :class="cn('size-2 rounded-full', option.dotClass)" />
                                {{ option.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select v-model="filters.priority">
                        <SelectTrigger class="h-11! w-44 rounded-lg bg-background" aria-label="Filter by priority">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" class="min-h-11">
                                All priorities
                            </SelectItem>
                            <SelectItem v-for="option in PRIORITY_OPTIONS" :key="option.value" :value="option.value" class="min-h-11">
                                <span aria-hidden="true" :class="cn('size-2 rounded-full', option.dotClass)" />
                                {{ option.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div v-if="hasFilters" class="mt-3">
                <Button
                    variant="ghost"
                    class="-ml-3 min-h-11 rounded-lg px-3 text-muted-foreground"
                    @click="clearFilters"
                >
                    <X aria-hidden="true" />
                    Clear filters
                </Button>
            </div>

            <section class="mt-6" aria-live="polite" :aria-busy="loading">
                <div v-if="loading && !projects.length" class="space-y-3">
                    <span class="sr-only">Loading projects</span>
                    <div v-for="row in 4" :key="row" class="animate-pulse rounded-2xl border bg-card p-5">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1 space-y-2.5">
                                <div class="h-3 w-24 rounded bg-muted" />
                                <div class="h-4 w-2/3 rounded bg-muted" />
                                <div class="h-3 w-1/2 rounded bg-muted" />
                            </div>
                            <div class="h-6 w-20 rounded-full bg-muted" />
                        </div>
                    </div>
                </div>

                <div v-else-if="loadError" class="flex flex-col items-center rounded-2xl border bg-card px-6 py-14 text-center">
                    <span class="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <CloudAlert aria-hidden="true" class="size-6" />
                    </span>
                    <h2 class="mt-4 font-semibold">
                        Couldn't load projects
                    </h2>
                    <p class="mt-1 max-w-sm text-sm text-muted-foreground">
                        {{ loadError }}
                    </p>
                    <Button variant="outline" class="mt-6 min-h-11 rounded-lg" @click="fetchProjects">
                        <RotateCw aria-hidden="true" />
                        Try again
                    </Button>
                </div>

                <div v-else-if="!projects.length" class="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
                    <span class="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <SearchX v-if="hasFilters" aria-hidden="true" class="size-6" />
                        <FolderKanban v-else aria-hidden="true" class="size-6" />
                    </span>
                    <h2 class="mt-4 font-semibold">
                        {{ hasFilters ? 'No matching projects' : 'No projects yet' }}
                    </h2>
                    <p class="mt-1 max-w-sm text-sm text-muted-foreground">
                        {{ hasFilters ? 'Try a different search or clear your filters.' : 'Create your first client project to start tracking progress and priorities.' }}
                    </p>
                    <Button v-if="hasFilters" variant="outline" class="mt-6 min-h-11 rounded-lg" @click="clearFilters">
                        Clear filters
                    </Button>
                    <Button v-else as-child class="mt-6 min-h-11 rounded-lg font-semibold">
                        <NuxtLink to="/projects/create">
                            <Plus aria-hidden="true" />
                            Create project
                        </NuxtLink>
                    </Button>
                </div>

                <template v-else>
                    <ul :class="cn('space-y-3 md:hidden', loading && 'opacity-60 transition-opacity')">
                        <li v-for="project in projects" :key="project.uuid" class="rounded-2xl border bg-card p-4 shadow-xs">
                            <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0 flex-1 space-y-1">
                                    <p class="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        {{ project.client_name }}
                                    </p>
                                    <h3 class="font-semibold leading-snug">
                                        {{ project.project_name }}
                                    </h3>
                                </div>
                                <ProjectActions :project="project" class="-mr-2 -mt-2" @delete="confirmDelete" />
                            </div>
                            <p v-if="project.description" class="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                {{ project.description }}
                            </p>
                            <div class="mt-4 flex flex-wrap items-center gap-2">
                                <ProjectBadge type="status" :value="project.status" />
                                <ProjectBadge type="priority" :value="project.priority" />
                            </div>
                            <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-sm">
                                <span class="text-muted-foreground">
                                    {{ project.start_date ? `Started ${formatDate(project.start_date)}` : 'No start date' }}
                                </span>
                                <ProjectDueDate :project="project" />
                            </div>
                        </li>
                    </ul>

                    <div :class="cn('hidden overflow-hidden rounded-2xl border bg-card shadow-xs md:block', loading && 'opacity-60 transition-opacity')">
                        <table class="w-full text-left text-sm">
                            <thead class="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <ProjectSortHeader
                                        field="project_name"
                                        label="Project"
                                        :sort-by="filters.sort_by"
                                        :direction="filters.sort_dir"
                                        @sort="sortByColumn"
                                    />
                                    <ProjectSortHeader
                                        field="status"
                                        label="Status"
                                        :sort-by="filters.sort_by"
                                        :direction="filters.sort_dir"
                                        @sort="sortByColumn"
                                    />
                                    <ProjectSortHeader
                                        field="priority"
                                        label="Priority"
                                        :sort-by="filters.sort_by"
                                        :direction="filters.sort_dir"
                                        @sort="sortByColumn"
                                    />
                                    <ProjectSortHeader
                                        field="start_date"
                                        label="Start date"
                                        class="hidden lg:table-cell"
                                        :sort-by="filters.sort_by"
                                        :direction="filters.sort_dir"
                                        @sort="sortByColumn"
                                    />
                                    <ProjectSortHeader
                                        field="due_date"
                                        label="Due date"
                                        :sort-by="filters.sort_by"
                                        :direction="filters.sort_dir"
                                        @sort="sortByColumn"
                                    />
                                    <th scope="col" class="px-5 py-3 text-right font-medium">
                                        <span class="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-for="project in projects" :key="project.uuid" class="transition-colors hover:bg-muted/40">
                                    <td class="max-w-sm px-5 py-4">
                                        <p class="truncate font-medium">
                                            {{ project.project_name }}
                                        </p>
                                        <p class="truncate text-muted-foreground">
                                            {{ project.client_name }}
                                        </p>
                                    </td>
                                    <td class="px-5 py-4">
                                        <ProjectBadge type="status" :value="project.status" />
                                    </td>
                                    <td class="px-5 py-4">
                                        <ProjectBadge type="priority" :value="project.priority" />
                                    </td>
                                    <td class="hidden whitespace-nowrap px-5 py-4 text-muted-foreground lg:table-cell">
                                        {{ formatDate(project.start_date) ?? '—' }}
                                    </td>
                                    <td class="whitespace-nowrap px-5 py-4">
                                        <ProjectDueDate :project="project" />
                                    </td>
                                    <td class="px-3 py-2">
                                        <ProjectActions :project="project" class="justify-end" @delete="confirmDelete" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <nav
                        v-if="meta && meta.last_page > 1"
                        class="mt-6 flex items-center justify-between gap-4"
                        aria-label="Pagination"
                    >
                        <Button
                            variant="outline"
                            class="min-h-11 rounded-lg"
                            :disabled="meta.current_page <= 1 || loading"
                            @click="goToPage(meta.current_page - 1)"
                        >
                            <ChevronLeft aria-hidden="true" />
                            Previous
                        </Button>
                        <p class="text-sm text-muted-foreground">
                            Page <span class="font-medium text-foreground">{{ meta.current_page }}</span> of {{ meta.last_page }}
                        </p>
                        <Button
                            variant="outline"
                            class="min-h-11 rounded-lg"
                            :disabled="meta.current_page >= meta.last_page || loading"
                            @click="goToPage(meta.current_page + 1)"
                        >
                            Next
                            <ChevronRight aria-hidden="true" />
                        </Button>
                    </nav>
                </template>
            </section>
        </main>

        <ProjectFilterSheet
            v-model:open="filterSheetOpen"
            :selection="sheetSelection"
            @apply="applySheet"
        />

        <ProjectDeleteDialog
            v-model:open="deleteOpen"
            :project="deleteTarget"
            :deleting="deleting"
            @confirm="deleteProject"
        />
    </div>
</template>

<script setup lang="ts">
import type { PaginationMeta, Project, ProjectListParams, ProjectPriority, ProjectSortField, ProjectStatus, SortDirection } from '@/components/api/project/ProjectService'
import type { ProjectFilterSelection } from '@/lib/project'
import { ChevronLeft, ChevronRight, CloudAlert, FolderKanban, Plus, RotateCw, Search, SearchX, SlidersHorizontal, X } from '@lucide/vue'
import { watchDebounced } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { projectService } from '@/components/api/project/ProjectService'
import { parseAPIError } from '@/lib/apiError'
import { DEFAULT_SORT, defaultDirectionFor, formatDate, PRIORITY_OPTIONS, SORT_FIELDS, STATUS_OPTIONS } from '@/lib/project'
import { cn } from '@/lib/utils'

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard',
})

useHead({
    title: 'Projects · Koda',
})

const route = useRoute()
const router = useRouter()
const { token, expireSession } = useAuth()

const queryString = (value: unknown) => (typeof value === 'string' ? value : '')

const filtersFromQuery = () => {
    const status = queryString(route.query.status)
    const priority = queryString(route.query.priority)
    const sortBy = queryString(route.query.sort_by) as ProjectSortField
    const sortDir = queryString(route.query.sort_dir)
    const validSort = SORT_FIELDS.includes(sortBy)

    return {
        search: queryString(route.query.search),
        status: STATUS_OPTIONS.some(option => option.value === status) ? status : 'all',
        priority: PRIORITY_OPTIONS.some(option => option.value === priority) ? priority : 'all',
        sort_by: validSort ? sortBy : DEFAULT_SORT.field,
        sort_dir: (validSort && (sortDir === 'asc' || sortDir === 'desc') ? sortDir : validSort ? defaultDirectionFor(sortBy) : DEFAULT_SORT.direction) as SortDirection,
        page: Math.max(1, Number(route.query.page) || 1),
    }
}

const filters = reactive(filtersFromQuery())

const searchInput = ref(filters.search)

const projects = ref<Project[]>([])
const meta = ref<PaginationMeta | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)

const deleteOpen = ref(false)
const deleteTarget = ref<Project | null>(null)
const deleting = ref(false)

const hasFilters = computed(() => Boolean(filters.search) || filters.status !== 'all' || filters.priority !== 'all')

const isDefaultSort = computed(() => filters.sort_by === DEFAULT_SORT.field && filters.sort_dir === DEFAULT_SORT.direction)

const filterSheetOpen = ref(false)

const activeFilterCount = computed(() => {
    return [filters.status !== 'all', filters.priority !== 'all', !isDefaultSort.value].filter(Boolean).length
})

const sheetSelection = computed<ProjectFilterSelection>(() => ({
    status: filters.status,
    priority: filters.priority,
    sortBy: filters.sort_by,
    sortDir: filters.sort_dir,
}))

const applySheet = (selection: ProjectFilterSelection) => {
    filters.status = selection.status
    filters.priority = selection.priority
    filters.sort_by = selection.sortBy
    filters.sort_dir = selection.sortDir
}

const sortByColumn = (field: ProjectSortField) => {
    if (filters.sort_by === field) {
        filters.sort_dir = filters.sort_dir === 'asc' ? 'desc' : 'asc'

        return
    }

    filters.sort_by = field
    filters.sort_dir = defaultDirectionFor(field)
}

const handleError = async (exception: unknown) => {
    const parsed = parseAPIError(exception)

    if (parsed.status === 401) {
        await expireSession()

        return null
    }

    return parsed
}

let latestRequest = 0

const fetchProjects = async () => {
    const requestId = ++latestRequest

    loading.value = true
    loadError.value = null

    const params: ProjectListParams = {
        page: filters.page,
        search: filters.search || undefined,
        status: filters.status !== 'all' ? filters.status as ProjectStatus : undefined,
        priority: filters.priority !== 'all' ? filters.priority as ProjectPriority : undefined,
        sort_by: filters.sort_by,
        sort_dir: filters.sort_dir,
    }

    try {
        const response = await projectService.fetchProjects(params, token.value)

        if (requestId !== latestRequest) {
            return
        }

        projects.value = response.data?.projects ?? []
        meta.value = response.data?.meta ?? null

        if (meta.value && filters.page > meta.value.last_page && meta.value.last_page > 0) {
            filters.page = meta.value.last_page
        }
    } catch (exception) {
        if (requestId !== latestRequest) {
            return
        }

        const parsed = await handleError(exception)

        if (parsed) {
            loadError.value = parsed.message
        }
    } finally {
        if (requestId === latestRequest) {
            loading.value = false
        }
    }
}

const syncQuery = () => {
    router.replace({
        query: {
            search: filters.search || undefined,
            status: filters.status !== 'all' ? filters.status : undefined,
            priority: filters.priority !== 'all' ? filters.priority : undefined,
            sort_by: isDefaultSort.value ? undefined : filters.sort_by,
            sort_dir: isDefaultSort.value ? undefined : filters.sort_dir,
            page: filters.page > 1 ? String(filters.page) : undefined,
        },
    })
}

watchDebounced(searchInput, (value) => {
    filters.search = value.trim()
}, { debounce: 300 })

watch(() => [filters.search, filters.status, filters.priority, filters.sort_by, filters.sort_dir], () => {
    filters.page = 1
})

let applyingQuery = false

watch(filters, () => {
    if (applyingQuery) {
        return
    }

    syncQuery()
    fetchProjects()
})

watch(() => route.query, () => {
    const next = filtersFromQuery()
    const changed = (Object.keys(next) as (keyof typeof next)[]).some(key => next[key] !== filters[key])

    if (!changed) {
        return
    }

    applyingQuery = true
    Object.assign(filters, next)
    searchInput.value = next.search

    nextTick(() => {
        applyingQuery = false
        fetchProjects()
    })
})

const goToPage = (page: number) => {
    filters.page = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
    searchInput.value = ''
    filters.search = ''
    filters.status = 'all'
    filters.priority = 'all'
}

const confirmDelete = (project: Project) => {
    deleteTarget.value = project
    deleteOpen.value = true
}

const deleteProject = async () => {
    if (!deleteTarget.value) {
        return
    }

    deleting.value = true

    try {
        await projectService.deleteProject(deleteTarget.value.uuid, token.value)

        toast.success('Project deleted', {
            description: `${deleteTarget.value.project_name} was removed.`,
        })
        deleteOpen.value = false

        if (projects.value.length === 1 && filters.page > 1) {
            filters.page -= 1
        } else {
            await fetchProjects()
        }
    } catch (exception) {
        const parsed = await handleError(exception)

        if (parsed) {
            toast.error('Couldn\'t delete project', {
                description: parsed.message,
            })

            if (parsed.status === 404) {
                deleteOpen.value = false
                await fetchProjects()
            }
        }
    } finally {
        deleting.value = false
    }
}

onMounted(fetchProjects)
</script>

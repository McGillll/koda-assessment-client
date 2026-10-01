import type { Component } from 'vue'
import type { Project, ProjectPriority, ProjectSortField, ProjectStatus, SortDirection } from '@/components/api/project/ProjectService'
import { CircleCheck, CirclePause, CircleDashed, CircleDot, SignalHigh, SignalLow, SignalMedium } from '@lucide/vue'

export interface ProjectOption<T extends string> {
    value: T
    label: string
    icon: Component
    badgeClass: string
    dotClass: string
}

export const STATUS_OPTIONS: ProjectOption<ProjectStatus>[] = [
    {
        value: 'planning',
        label: 'Planning',
        icon: CircleDashed,
        badgeClass: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/30',
        dotClass: 'bg-sky-500',
    },
    {
        value: 'in_progress',
        label: 'In Progress',
        icon: CircleDot,
        badgeClass: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/30',
        dotClass: 'bg-indigo-500',
    },
    {
        value: 'on_hold',
        label: 'On Hold',
        icon: CirclePause,
        badgeClass: 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/30',
        dotClass: 'bg-amber-500',
    },
    {
        value: 'completed',
        label: 'Completed',
        icon: CircleCheck,
        badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30',
        dotClass: 'bg-emerald-500',
    },
]

export const PRIORITY_OPTIONS: ProjectOption<ProjectPriority>[] = [
    {
        value: 'low',
        label: 'Low',
        icon: SignalLow,
        badgeClass: 'bg-zinc-50 text-zinc-700 ring-zinc-500/20 dark:bg-zinc-500/10 dark:text-zinc-300 dark:ring-zinc-400/30',
        dotClass: 'bg-zinc-400',
    },
    {
        value: 'medium',
        label: 'Medium',
        icon: SignalMedium,
        badgeClass: 'bg-orange-50 text-orange-800 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-400/30',
        dotClass: 'bg-orange-500',
    },
    {
        value: 'high',
        label: 'High',
        icon: SignalHigh,
        badgeClass: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/30',
        dotClass: 'bg-rose-500',
    },
]

export interface SortOption {
    field: ProjectSortField
    direction: SortDirection
    label: string
}

export interface StatusSummaryItem extends ProjectOption<ProjectStatus> {
    count: number
    percent: number
}

export interface ProjectFilterSelection {
    status: string
    priority: string
    sortBy: ProjectSortField
    sortDir: SortDirection
}

export const DEFAULT_SORT: { field: ProjectSortField, direction: SortDirection } = {
    field: 'due_date',
    direction: 'asc',
}

export const SORT_OPTIONS: SortOption[] = [
    { field: 'due_date', direction: 'asc', label: 'Due date: soonest first' },
    { field: 'due_date', direction: 'desc', label: 'Due date: latest first' },
    { field: 'priority', direction: 'desc', label: 'Priority: high to low' },
    { field: 'priority', direction: 'asc', label: 'Priority: low to high' },
    { field: 'status', direction: 'asc', label: 'Status: planning first' },
    { field: 'status', direction: 'desc', label: 'Status: completed first' },
    { field: 'start_date', direction: 'asc', label: 'Start date: earliest first' },
    { field: 'start_date', direction: 'desc', label: 'Start date: latest first' },
    { field: 'project_name', direction: 'asc', label: 'Project name: A to Z' },
    { field: 'project_name', direction: 'desc', label: 'Project name: Z to A' },
    { field: 'client_name', direction: 'asc', label: 'Client name: A to Z' },
    { field: 'client_name', direction: 'desc', label: 'Client name: Z to A' },
    { field: 'created_at', direction: 'desc', label: 'Date added: newest first' },
    { field: 'created_at', direction: 'asc', label: 'Date added: oldest first' },
]

export const SORT_FIELDS = [...new Set(SORT_OPTIONS.map(option => option.field))]

export const defaultDirectionFor = (field: ProjectSortField): SortDirection => {
    return field === 'priority' || field === 'created_at' ? 'desc' : 'asc'
}

export const findStatus =(value: ProjectStatus) => STATUS_OPTIONS.find(option => option.value === value) ?? STATUS_OPTIONS[0]!

export const findPriority = (value: ProjectPriority) => PRIORITY_OPTIONS.find(option => option.value === value) ?? PRIORITY_OPTIONS[0]!

export const formatDate = (value: string | null) => {
    if (!value) {
        return null
    }

    const [year, month, day] = value.split('-').map(Number)

    return new Date(year!, month! - 1, day!).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export const todayDate = () => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    return `${now.getFullYear()}-${month}-${day}`
}

export const isOverdue = (project: Project) => {
    return Boolean(project.due_date) && project.status !== 'completed' && project.due_date! < todayDate()
}

<template>
    <div class="flex h-full flex-col">
        <div class="flex h-16 shrink-0 items-center px-5">
            <AppLogo />
        </div>

        <div class="px-4 pt-2">
            <Button as-child class="min-h-11 w-full rounded-lg font-semibold shadow-lg shadow-primary/25">
                <NuxtLink to="/projects/create">
                    <Plus aria-hidden="true" />
                    New project
                </NuxtLink>
            </Button>
        </div>

        <nav class="mt-6 flex-1 space-y-1 overflow-y-auto px-3 pb-6" aria-label="Main">
            <NuxtLink
                to="/dashboard"
                :class="navItemClass(onDashboard)"
                :aria-current="onDashboard ? 'page' : undefined"
            >
                <LayoutDashboard aria-hidden="true" class="size-4.5 shrink-0" />
                Dashboard
            </NuxtLink>
            <NuxtLink
                to="/projects"
                :class="navItemClass(onProjectsList)"
                :aria-current="onProjectsList ? 'page' : undefined"
            >
                <FolderKanban aria-hidden="true" class="size-4.5 shrink-0" />
                All projects
            </NuxtLink>
        </nav>

        <div class="shrink-0 border-t p-3">
            <div class="flex items-center gap-3 rounded-xl px-2 py-2">
                <span
                    aria-hidden="true"
                    class="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white"
                >
                    {{ initials }}
                </span>
                <div class="min-w-0 flex-1 leading-tight">
                    <p class="truncate text-sm font-medium">
                        {{ user?.name }}
                    </p>
                    <p class="truncate text-xs text-muted-foreground">
                        {{ user?.email }}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    class="size-11 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
                    :disabled="loggingOut"
                    :aria-label="loggingOut ? 'Signing out' : 'Sign out'"
                    @click="submitLogout"
                >
                    <LoaderCircle v-if="loggingOut" aria-hidden="true" class="animate-spin" />
                    <LogOut v-else aria-hidden="true" />
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderKanban, LayoutDashboard, LoaderCircle, LogOut, Plus } from '@lucide/vue'
import { cn } from '@/lib/utils'

const route = useRoute()
const { user, logout } = useAuth()
const loggingOut = ref(false)

const onDashboard = computed(() => route.path === '/dashboard')

const onProjectsList = computed(() => route.path === '/projects')

const navItemClass = (active: boolean) => cn(
    'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
    active
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
)

const initials = computed(() => {
    const parts = (user.value?.name || '').trim().split(/\s+/).filter(Boolean)

    return parts.slice(0, 2).map(part => part[0]!.toUpperCase()).join('') || '?'
})

const submitLogout = async () => {
    loggingOut.value = true

    try {
        await logout()
    } catch {
    } finally {
        loggingOut.value = false
        await navigateTo('/login')
    }
}
</script>

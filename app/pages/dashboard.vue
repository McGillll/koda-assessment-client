<template>
    <div class="min-h-screen bg-muted/40">
        <header class="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
            <div class="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
                <AppLogo />
                <Button class="min-h-11 rounded-lg" variant="ghost" :disabled="loggingOut" @click="submitLogout">
                    <LoaderCircle v-if="loggingOut" aria-hidden="true" class="animate-spin" />
                    <LogOut v-else aria-hidden="true" />
                    {{ loggingOut ? 'Signing out...' : 'Sign out' }}
                </Button>
            </div>
        </header>

        <main class="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <section class="relative overflow-hidden rounded-2xl bg-zinc-950 p-6 text-white shadow-xl sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
                <div aria-hidden="true" class="pointer-events-none absolute inset-0">
                    <div class="absolute -right-20 -top-20 size-72 rounded-full bg-indigo-600/40 blur-3xl" />
                    <div class="absolute -bottom-24 left-1/3 size-72 rounded-full bg-violet-600/25 blur-3xl" />
                </div>

                <div class="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                    <span
                        aria-hidden="true"
                        class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-2xl font-semibold ring-1 ring-white/20"
                    >
                        {{ initials }}
                    </span>
                    <div class="min-w-0 space-y-1">
                        <p class="text-sm text-zinc-400">
                            Welcome back
                        </p>
                        <h1 class="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                            {{ user?.name }}
                        </h1>
                        <p class="flex items-center gap-2 truncate text-sm text-zinc-300">
                            <Mail aria-hidden="true" class="size-4 shrink-0" />
                            {{ user?.email }}
                        </p>
                    </div>
                </div>
            </section>

            <section class="mt-6 grid gap-4 sm:grid-cols-2">
                <Card class="rounded-2xl">
                    <CardHeader>
                        <span class="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShieldCheck aria-hidden="true" class="size-5" />
                        </span>
                        <CardTitle>Account secured</CardTitle>
                        <CardDescription>You're signed in with a secure session token.</CardDescription>
                    </CardHeader>
                </Card>
                <Card class="rounded-2xl">
                    <CardHeader>
                        <span class="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CalendarDays aria-hidden="true" class="size-5" />
                        </span>
                        <CardTitle>Member since</CardTitle>
                        <CardDescription>{{ memberSince }}</CardDescription>
                    </CardHeader>
                </Card>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { CalendarDays, LoaderCircle, LogOut, Mail, ShieldCheck } from '@lucide/vue'

definePageMeta({
    middleware: 'auth',
})

const { user, logout } = useAuth()
const loggingOut = ref(false)

const initials = computed(() => {
    const parts = (user.value?.name || '').trim().split(/\s+/).filter(Boolean)

    return parts.slice(0, 2).map(part => part[0]!.toUpperCase()).join('') || '?'
})

const memberSince = computed(() => {
    if (!user.value?.created_at) {
        return 'Unknown'
    }

    return new Date(user.value.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
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

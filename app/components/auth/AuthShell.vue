<template>
    <div class="flex min-h-screen bg-background">
        <aside class="relative hidden w-1/2 overflow-hidden bg-zinc-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
            <div aria-hidden="true" class="pointer-events-none absolute inset-0">
                <div class="absolute -left-32 -top-32 size-112 rounded-full bg-indigo-600/30 blur-3xl" />
                <div class="absolute -bottom-40 -right-24 size-128 rounded-full bg-violet-600/20 blur-3xl" />
                <div class="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
            </div>

            <AppLogo class="relative self-start text-white" />

            <div class="relative max-w-md space-y-10">
                <h2 class="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                    Every client project,
                    <span class="bg-linear-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                        on track and on time.
                    </span>
                </h2>

                <ul class="space-y-5">
                    <li v-for="feature in features" :key="feature.title" class="flex gap-4">
                        <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                            <component :is="feature.icon" aria-hidden="true" class="size-5 text-indigo-300" />
                        </span>
                        <div class="space-y-1">
                            <p class="font-medium">
                                {{ feature.title }}
                            </p>
                            <p class="text-sm text-zinc-400">
                                {{ feature.description }}
                            </p>
                        </div>
                    </li>
                </ul>
            </div>

            <p class="relative text-sm text-zinc-500">
                &copy; {{ year }} Koda. All rights reserved.
            </p>
        </aside>

        <main class="flex flex-1 flex-col px-4 py-6 sm:px-8 lg:px-12">
            <AppLogo class="self-start lg:hidden" />

            <div class="flex flex-1 items-center justify-center py-10">
                <div class="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
                    <header class="mb-8 space-y-2">
                        <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                            {{ title }}
                        </h1>
                        <p class="text-sm text-muted-foreground sm:text-base">
                            {{ description }}
                        </p>
                    </header>

                    <slot />

                    <div v-if="$slots.footer" class="mt-8 text-center text-sm text-muted-foreground">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { BriefcaseBusiness, ChartNoAxesColumnIncreasing, Flag } from '@lucide/vue'

defineProps<{
    title: string
    description: string
}>()

const year = new Date().getFullYear()

const features = [
    {
        icon: BriefcaseBusiness,
        title: 'Every client in one place',
        description: 'Keep each client project organized and easy to find.',
    },
    {
        icon: ChartNoAxesColumnIncreasing,
        title: 'Progress at a glance',
        description: 'See which projects are moving and which need attention.',
    },
    {
        icon: Flag,
        title: 'Priorities that stay clear',
        description: 'Rank what matters so your team works on the right thing.',
    },
]
</script>

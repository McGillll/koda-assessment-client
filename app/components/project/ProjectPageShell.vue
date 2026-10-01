<template>
    <div>
        <main class="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
            <NuxtLink
                to="/projects"
                class="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft aria-hidden="true" class="size-4" />
                Back to projects
            </NuxtLink>

            <header class="mb-6 mt-2 space-y-1">
                <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {{ title }}
                </h1>
                <p class="text-sm text-muted-foreground">
                    {{ description }}
                </p>
            </header>

            <div class="animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'

defineProps<{
    title: string
    description: string
}>()
</script>

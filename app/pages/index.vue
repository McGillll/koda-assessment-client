<template>
    <AuthShell title="Welcome to Koda" description="Track client projects, monitor progress, and manage priorities, all in one place.">
        <div class="flex flex-col gap-3">
            <Button as-child class="h-11 w-full rounded-lg text-sm font-semibold shadow-lg shadow-primary/25">
                <NuxtLink to="/login">
                    Sign in
                    <ArrowRight aria-hidden="true" class="transition-transform group-hover/button:translate-x-0.5" />
                </NuxtLink>
            </Button>
            <Button as-child variant="outline" class="h-11 w-full rounded-lg text-sm font-semibold">
                <NuxtLink to="/register">
                    Create an account
                </NuxtLink>
            </Button>
        </div>
    </AuthShell>
</template>

<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
</script>

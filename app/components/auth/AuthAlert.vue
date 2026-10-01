<template>
    <div
        role="alert"
        class="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive animate-in fade-in duration-200 motion-reduce:animate-none"
    >
        <CircleAlert aria-hidden="true" class="mt-0.5 size-4 shrink-0" />
        <p>
            <slot />
        </p>
    </div>
</template>

<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'
</script>

<template>
    <div class="space-y-2">
        <div class="flex items-baseline justify-between gap-3">
            <Label :for="id">
                {{ label }}
                <span v-if="required" aria-hidden="true" class="text-destructive">*</span>
                <span v-else class="text-xs font-normal text-muted-foreground">(optional)</span>
            </Label>
            <slot name="label-end" />
        </div>

        <slot />

        <p v-if="error" :id="`${id}-error`" class="flex items-center gap-1.5 text-sm text-destructive">
            <CircleAlert aria-hidden="true" class="size-3.5 shrink-0" />
            {{ error }}
        </p>
        <p v-else-if="hint" :id="`${id}-hint`" class="text-xs text-muted-foreground">
            {{ hint }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'

defineProps<{
    id: string
    label: string
    required?: boolean
    error?: string
    hint?: string
}>()
</script>

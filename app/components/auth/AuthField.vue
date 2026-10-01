<template>
    <div class="space-y-2">
        <Label :for="id">
            {{ label }}
        </Label>

        <div class="group relative">
            <component
                :is="icon"
                v-if="icon"
                aria-hidden="true"
                class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
            />
            <Input
                :id="id"
                :model-value="model"
                :type="inputType"
                :autocomplete="autocomplete"
                :placeholder="placeholder"
                :aria-invalid="error ? true : undefined"
                :aria-describedby="error ? `${id}-error` : undefined"
                :class="cn('h-11 rounded-lg bg-background px-3.5', icon && 'pl-10', isPassword && 'pr-11')"
                @update:model-value="model = String($event)"
                @blur="emit('blur')"
            />
            <button
                v-if="isPassword"
                type="button"
                class="absolute right-0 top-0 flex size-11 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                :aria-label="visible ? 'Hide password' : 'Show password'"
                :aria-pressed="visible"
                @click="visible = !visible"
            >
                <EyeOff v-if="visible" class="size-4" />
                <Eye v-else class="size-4" />
            </button>
        </div>

        <p v-if="error" :id="`${id}-error`" class="flex items-center gap-1.5 text-sm text-destructive">
            <CircleAlert aria-hidden="true" class="size-3.5 shrink-0" />
            {{ error }}
        </p>

        <slot name="hint" />
    </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { CircleAlert, Eye, EyeOff } from '@lucide/vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
    id: string
    label: string
    type?: string
    autocomplete?: string
    placeholder?: string
    icon?: Component
    error?: string
}>(), {
    type: 'text',
})

const emit = defineEmits<{
    blur: []
}>()

const model = defineModel<string>({ required: true })

const visible = ref(false)

const isPassword = computed(() => props.type === 'password')

const inputType = computed(() => (isPassword.value && visible.value ? 'text' : props.type))
</script>

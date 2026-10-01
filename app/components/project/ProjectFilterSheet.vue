<template>
    <DialogRoot v-model:open="open">
        <DialogPortal>
            <DialogOverlay
                class="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 md:hidden"
            />
            <DialogContent
                class="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-3xl border-t bg-background shadow-2xl outline-none duration-300 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom motion-reduce:animate-none md:hidden"
            >
                <div aria-hidden="true" class="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-muted-foreground/30" />

                <div class="flex shrink-0 items-center justify-between gap-4 px-5 pb-1 pt-2">
                    <DialogTitle class="text-lg font-semibold">
                        Filter and sort
                    </DialogTitle>
                    <DialogClose
                        class="-mr-2 flex size-11 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                        aria-label="Close"
                    >
                        <X aria-hidden="true" class="size-5" />
                    </DialogClose>
                </div>
                <DialogDescription class="sr-only">
                    Narrow projects by status and priority, and choose how they are ordered.
                </DialogDescription>

                <div class="flex-1 space-y-6 overflow-y-auto px-5 py-4">
                    <section class="space-y-3">
                        <h3 id="sheet-status" class="text-sm font-medium">
                            Status
                        </h3>
                        <RadioGroupRoot v-model="draft.status" aria-labelledby="sheet-status" class="flex flex-wrap gap-2">
                            <RadioGroupItem value="all" :class="chipClass">
                                All
                            </RadioGroupItem>
                            <RadioGroupItem v-for="option in STATUS_OPTIONS" :key="option.value" :value="option.value" :class="chipClass">
                                <span aria-hidden="true" :class="cn('size-2 rounded-full', option.dotClass)" />
                                {{ option.label }}
                            </RadioGroupItem>
                        </RadioGroupRoot>
                    </section>

                    <section class="space-y-3">
                        <h3 id="sheet-priority" class="text-sm font-medium">
                            Priority
                        </h3>
                        <RadioGroupRoot v-model="draft.priority" aria-labelledby="sheet-priority" class="flex flex-wrap gap-2">
                            <RadioGroupItem value="all" :class="chipClass">
                                All
                            </RadioGroupItem>
                            <RadioGroupItem v-for="option in PRIORITY_OPTIONS" :key="option.value" :value="option.value" :class="chipClass">
                                <span aria-hidden="true" :class="cn('size-2 rounded-full', option.dotClass)" />
                                {{ option.label }}
                            </RadioGroupItem>
                        </RadioGroupRoot>
                    </section>

                    <section class="space-y-3 border-t pt-6">
                        <h3 id="sheet-sort" class="text-sm font-medium">
                            Sort by
                        </h3>
                        <RadioGroupRoot
                            :model-value="draft.sortBy"
                            aria-labelledby="sheet-sort"
                            class="flex flex-wrap gap-2"
                            @update:model-value="selectSortField($event as ProjectSortField)"
                        >
                            <RadioGroupItem v-for="field in sortFields" :key="field.value" :value="field.value" :class="chipClass">
                                {{ field.label }}
                            </RadioGroupItem>
                        </RadioGroupRoot>

                        <RadioGroupRoot
                            v-model="draft.sortDir"
                            aria-label="Sort order"
                            class="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1"
                        >
                            <RadioGroupItem
                                v-for="direction in directions"
                                :key="direction.value"
                                :value="direction.value"
                                class="flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm"
                            >
                                <ArrowUp v-if="direction.value === 'asc'" aria-hidden="true" class="size-4" />
                                <ArrowDown v-else aria-hidden="true" class="size-4" />
                                {{ direction.label }}
                            </RadioGroupItem>
                        </RadioGroupRoot>
                    </section>
                </div>

                <div class="flex shrink-0 gap-3 border-t px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                    <Button variant="outline" class="min-h-11 flex-1 rounded-lg" @click="reset">
                        Reset
                    </Button>
                    <Button class="min-h-11 flex-2 rounded-lg font-semibold shadow-lg shadow-primary/25" @click="apply">
                        Show results
                    </Button>
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>

<script setup lang="ts">
import type { ProjectSortField, SortDirection } from '@/components/api/project/ProjectService'
import type { ProjectFilterSelection } from '@/lib/project'
import { ArrowDown, ArrowUp, X } from '@lucide/vue'
import { useMediaQuery } from '@vueuse/core'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { DEFAULT_SORT, defaultDirectionFor, PRIORITY_OPTIONS, SORT_FIELDS, SORT_OPTIONS, STATUS_OPTIONS } from '@/lib/project'
import { cn } from '@/lib/utils'

const props = defineProps<{
    selection: ProjectFilterSelection
}>()

const emit = defineEmits<{
    apply: [selection: ProjectFilterSelection]
}>()

const open = defineModel<boolean>('open', { required: true })

const draft = reactive<ProjectFilterSelection>({ ...props.selection })

const isDesktop = useMediaQuery('(min-width: 768px)')

watch(isDesktop, (desktop) => {
    if (desktop) {
        open.value = false
    }
})

watch(open, (isOpen) => {
    if (isOpen) {
        Object.assign(draft, props.selection)
    }
})

const chipClass = 'inline-flex min-h-11 items-center gap-2 rounded-full border bg-background px-4 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary'

const labelParts = (field: ProjectSortField, direction: SortDirection) => {
    const option = SORT_OPTIONS.find(item => item.field === field && item.direction === direction)

    return (option?.label ?? '').split(': ')
}

const sortFields = SORT_FIELDS.map(field => ({
    value: field,
    label: labelParts(field, 'asc')[0],
}))

const directions = computed(() => (['asc', 'desc'] as SortDirection[]).map(direction => ({
    value: direction,
    label: labelParts(draft.sortBy, direction)[1],
})))

const selectSortField = (field: ProjectSortField) => {
    draft.sortBy = field
    draft.sortDir = defaultDirectionFor(field)
}

const reset = () => {
    draft.status = 'all'
    draft.priority = 'all'
    draft.sortBy = DEFAULT_SORT.field
    draft.sortDir = DEFAULT_SORT.direction
}

const apply = () => {
    emit('apply', { ...draft })
    open.value = false
}
</script>

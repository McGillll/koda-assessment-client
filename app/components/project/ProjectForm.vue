<template>
    <form class="space-y-6" novalidate @submit.prevent="submit">
        <AuthAlert v-if="message">
            {{ message }}
        </AuthAlert>

        <section class="rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
            <header class="mb-5 space-y-1">
                <h2 class="font-semibold">
                    Project details
                </h2>
                <p class="text-sm text-muted-foreground">
                    Who the work is for and what it covers.
                </p>
            </header>

            <div class="grid gap-5 sm:grid-cols-2">
                <ProjectField id="client_name" label="Client name" required :error="errorFor('client_name')">
                    <Input
                        id="client_name"
                        v-model="form.client_name"
                        class="h-11 rounded-lg"
                        autocomplete="organization"
                        placeholder="e.g. Acme Corporation"
                        maxlength="255"
                        :aria-invalid="errorFor('client_name') ? true : undefined"
                        :aria-describedby="errorFor('client_name') ? 'client_name-error' : undefined"
                        @blur="touch('client_name')"
                    />
                </ProjectField>

                <ProjectField id="project_name" label="Project name" required :error="errorFor('project_name')">
                    <Input
                        id="project_name"
                        v-model="form.project_name"
                        class="h-11 rounded-lg"
                        autocomplete="off"
                        placeholder="e.g. Website redesign"
                        maxlength="255"
                        :aria-invalid="errorFor('project_name') ? true : undefined"
                        :aria-describedby="errorFor('project_name') ? 'project_name-error' : undefined"
                        @blur="touch('project_name')"
                    />
                </ProjectField>

                <ProjectField
                    id="description"
                    class="sm:col-span-2"
                    label="Description"
                    :error="errorFor('description')"
                    hint="Scope, deliverables, or anything the team should know."
                >
                    <template #label-end>
                        <span class="text-xs tabular-nums text-muted-foreground" aria-live="polite">
                            {{ form.description.length }}/{{ DESCRIPTION_MAX }}
                        </span>
                    </template>
                    <textarea
                        id="description"
                        v-model="form.description"
                        rows="4"
                        :maxlength="DESCRIPTION_MAX"
                        placeholder="What does this project involve?"
                        :aria-invalid="errorFor('description') ? true : undefined"
                        :aria-describedby="errorFor('description') ? 'description-error' : 'description-hint'"
                        class="w-full min-w-0 resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30"
                        @blur="touch('description')"
                    />
                </ProjectField>
            </div>
        </section>

        <section class="rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
            <header class="mb-5 space-y-1">
                <h2 class="font-semibold">
                    Status and schedule
                </h2>
                <p class="text-sm text-muted-foreground">
                    Where the project stands and when it needs to land.
                </p>
            </header>

            <div class="grid gap-5 sm:grid-cols-2">
                <ProjectField id="status" label="Status" required :error="errorFor('status')">
                    <Select v-model="form.status">
                        <SelectTrigger
                            id="status"
                            class="h-11! w-full rounded-lg"
                            :aria-invalid="errorFor('status') ? true : undefined"
                            :aria-describedby="errorFor('status') ? 'status-error' : undefined"
                        >
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="option in STATUS_OPTIONS"
                                :key="option.value"
                                :value="option.value"
                                class="min-h-11"
                            >
                                <span aria-hidden="true" :class="cn('size-2 rounded-full', option.dotClass)" />
                                {{ option.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </ProjectField>

                <ProjectField id="priority" label="Priority" required :error="errorFor('priority')">
                    <Select v-model="form.priority">
                        <SelectTrigger
                            id="priority"
                            class="h-11! w-full rounded-lg"
                            :aria-invalid="errorFor('priority') ? true : undefined"
                            :aria-describedby="errorFor('priority') ? 'priority-error' : undefined"
                        >
                            <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="option in PRIORITY_OPTIONS"
                                :key="option.value"
                                :value="option.value"
                                class="min-h-11"
                            >
                                <span aria-hidden="true" :class="cn('size-2 rounded-full', option.dotClass)" />
                                {{ option.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </ProjectField>

                <ProjectField id="start_date" label="Start date" :error="errorFor('start_date')">
                    <Input
                        id="start_date"
                        v-model="form.start_date"
                        type="date"
                        class="h-11 rounded-lg"
                        :aria-invalid="errorFor('start_date') ? true : undefined"
                        :aria-describedby="errorFor('start_date') ? 'start_date-error' : undefined"
                        @blur="touch('start_date')"
                    />
                </ProjectField>

                <ProjectField
                    id="due_date"
                    label="Due date"
                    :error="errorFor('due_date')"
                    hint="Can't be earlier than the start date."
                >
                    <Input
                        id="due_date"
                        v-model="form.due_date"
                        type="date"
                        class="h-11 rounded-lg"
                        :min="form.start_date || undefined"
                        :aria-invalid="errorFor('due_date') ? true : undefined"
                        :aria-describedby="errorFor('due_date') ? 'due_date-error' : 'due_date-hint'"
                        @blur="touch('due_date')"
                    />
                </ProjectField>
            </div>
        </section>

        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button as-child variant="outline" class="min-h-11 rounded-lg sm:min-w-28">
                <NuxtLink to="/projects">
                    Cancel
                </NuxtLink>
            </Button>
            <Button
                type="submit"
                class="min-h-11 rounded-lg font-semibold shadow-lg shadow-primary/25 sm:min-w-40"
                :disabled="submitting || !isValid"
            >
                <LoaderCircle v-if="submitting" aria-hidden="true" class="animate-spin" />
                <Check v-else aria-hidden="true" />
                {{ submitting ? submittingLabel : submitLabel }}
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import type { Project, ProjectPayload, ProjectPriority, ProjectStatus } from '@/components/api/project/ProjectService'
import { Check, LoaderCircle } from '@lucide/vue'
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/lib/project'
import { cn } from '@/lib/utils'

type FieldName = keyof ProjectPayload

const DESCRIPTION_MAX = 5000
const TEXT_MAX = 255

const props = defineProps<{
    project?: Project | null
    submitting: boolean
    message?: string | null
    submitLabel: string
    submittingLabel: string
}>()

const emit = defineEmits<{
    submit: [payload: ProjectPayload]
}>()

const serverErrors = defineModel<Record<string, string[]>>('errors', { default: () => ({}) })

const form = reactive({
    client_name: props.project?.client_name ?? '',
    project_name: props.project?.project_name ?? '',
    description: props.project?.description ?? '',
    status: (props.project?.status ?? 'planning') as ProjectStatus,
    priority: (props.project?.priority ?? 'medium') as ProjectPriority,
    start_date: props.project?.start_date ?? '',
    due_date: props.project?.due_date ?? '',
})

const touched = reactive<Record<FieldName, boolean>>({
    client_name: false,
    project_name: false,
    description: false,
    status: false,
    priority: false,
    start_date: false,
    due_date: false,
})

const fieldNames = Object.keys(touched) as FieldName[]

fieldNames.forEach((field) => {
    watch(() => form[field], () => {
        if (serverErrors.value[field]) {
            const { [field]: _removed, ...remaining } = serverErrors.value
            serverErrors.value = remaining
        }
    })
})

watch(() => form.start_date, () => {
    if (serverErrors.value.due_date) {
        const { due_date: _removed, ...remaining } = serverErrors.value
        serverErrors.value = remaining
    }
})

const touch = (field: FieldName) => {
    touched[field] = true
}

const clientErrors = computed<Record<FieldName, string>>(() => {
    const statusValid = STATUS_OPTIONS.some(option => option.value === form.status)
    const priorityValid = PRIORITY_OPTIONS.some(option => option.value === form.priority)
    const dueBeforeStart = Boolean(form.start_date && form.due_date && form.due_date < form.start_date)

    return {
        client_name: !form.client_name.trim()
            ? 'Client name is required.'
            : form.client_name.length > TEXT_MAX ? `Client name must be ${TEXT_MAX} characters or fewer.` : '',
        project_name: !form.project_name.trim()
            ? 'Project name is required.'
            : form.project_name.length > TEXT_MAX ? `Project name must be ${TEXT_MAX} characters or fewer.` : '',
        description: form.description.length > DESCRIPTION_MAX ? `Description must be ${DESCRIPTION_MAX} characters or fewer.` : '',
        status: statusValid ? '' : 'Choose a valid status.',
        priority: priorityValid ? '' : 'Choose a valid priority.',
        start_date: '',
        due_date: dueBeforeStart ? 'Due date cannot be earlier than the start date.' : '',
    }
})

const errorFor = (field: FieldName) => {
    if (serverErrors.value[field]?.[0]) {
        return serverErrors.value[field][0]
    }

    const alwaysShow = field === 'due_date' && clientErrors.value.due_date

    return touched[field] || alwaysShow ? clientErrors.value[field] : ''
}

const isValid = computed(() => fieldNames.every(field => !clientErrors.value[field]))

const submit = () => {
    fieldNames.forEach(touch)

    if (!isValid.value || props.submitting) {
        return
    }

    emit('submit', {
        client_name: form.client_name.trim(),
        project_name: form.project_name.trim(),
        description: form.description.trim() || null,
        status: form.status,
        priority: form.priority,
        start_date: form.start_date || null,
        due_date: form.due_date || null,
    })
}
</script>

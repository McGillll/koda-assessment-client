<template>
    <ProjectPageShell
        title="Edit project"
        :description="project ? `${project.project_name} · ${project.client_name}` : 'Update the project details below.'"
    >
        <div v-if="loading" class="space-y-6" aria-busy="true">
            <span class="sr-only">Loading project</span>
            <div v-for="section in 2" :key="section" class="animate-pulse rounded-2xl border bg-card p-6">
                <div class="h-4 w-32 rounded bg-muted" />
                <div class="mt-2 h-3 w-56 rounded bg-muted" />
                <div class="mt-6 grid gap-5 sm:grid-cols-2">
                    <div v-for="field in 4" :key="field" class="space-y-2">
                        <div class="h-3 w-20 rounded bg-muted" />
                        <div class="h-11 rounded-lg bg-muted" />
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="loadError" class="flex flex-col items-center rounded-2xl border bg-card px-6 py-14 text-center">
            <span class="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <FileQuestionMark v-if="notFound" aria-hidden="true" class="size-6" />
                <CloudAlert v-else aria-hidden="true" class="size-6" />
            </span>
            <h2 class="mt-4 font-semibold">
                {{ notFound ? 'Project not found' : 'Couldn\'t load project' }}
            </h2>
            <p class="mt-1 max-w-sm text-sm text-muted-foreground">
                {{ notFound ? 'It may have been deleted, or the link is incorrect.' : loadError }}
            </p>
            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button v-if="!notFound" variant="outline" class="min-h-11 rounded-lg" @click="fetchProject">
                    <RotateCw aria-hidden="true" />
                    Try again
                </Button>
                <Button as-child class="min-h-11 rounded-lg">
                    <NuxtLink to="/projects">
                        Back to projects
                    </NuxtLink>
                </Button>
            </div>
        </div>

        <ProjectForm
            v-else-if="project"
            v-model:errors="fieldErrors"
            :project="project"
            :submitting="submitting"
            :message="message"
            submit-label="Save changes"
            submitting-label="Saving..."
            @submit="updateProject"
        />
    </ProjectPageShell>
</template>

<script setup lang="ts">
import type { Project, ProjectPayload } from '@/components/api/project/ProjectService'
import { CloudAlert, FileQuestionMark, RotateCw } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { projectService } from '@/components/api/project/ProjectService'
import { parseAPIError } from '@/lib/apiError'

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard',
})

useHead({
    title: 'Edit project · Koda',
})

const route = useRoute()
const { token, expireSession } = useAuth()

const projectUuid = String(route.params.uuid)

const project = ref<Project | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)
const notFound = ref(false)

const submitting = ref(false)
const message = ref<string | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})

const fetchProject = async () => {
    loading.value = true
    loadError.value = null
    notFound.value = false

    try {
        const response = await projectService.fetchProject(projectUuid, token.value)

        project.value = response.data?.project ?? null
    } catch (exception) {
        const parsed = parseAPIError(exception)

        if (parsed.status === 401) {
            await expireSession()

            return
        }

        notFound.value = parsed.status === 404
        loadError.value = parsed.message
    } finally {
        loading.value = false
    }
}

const updateProject = async (payload: ProjectPayload) => {
    submitting.value = true
    message.value = null
    fieldErrors.value = {}

    try {
        await projectService.updateProject(projectUuid, payload, token.value)

        toast.success('Changes saved', {
            description: `${payload.project_name} was updated.`,
        })
        await navigateTo('/projects')
    } catch (exception) {
        const parsed = parseAPIError(exception)

        if (parsed.status === 401) {
            await expireSession()

            return
        }

        if (parsed.status === 404) {
            notFound.value = true
            loadError.value = parsed.message

            return
        }

        fieldErrors.value = parsed.fieldErrors
        message.value = Object.keys(parsed.fieldErrors).length ? null : parsed.message
    } finally {
        submitting.value = false
    }
}

onMounted(fetchProject)
</script>

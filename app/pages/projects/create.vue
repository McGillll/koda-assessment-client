<template>
    <ProjectPageShell title="New project" description="Add a client project to start tracking its progress.">
        <ProjectForm
            v-model:errors="fieldErrors"
            :submitting="submitting"
            :message="message"
            submit-label="Create project"
            submitting-label="Creating..."
            @submit="createProject"
        />
    </ProjectPageShell>
</template>

<script setup lang="ts">
import type { ProjectPayload } from '@/components/api/project/ProjectService'
import { toast } from 'vue-sonner'
import { projectService } from '@/components/api/project/ProjectService'
import { parseAPIError } from '@/lib/apiError'

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard',
})

useHead({
    title: 'New project · Koda',
})

const { token, expireSession } = useAuth()

const submitting = ref(false)
const message = ref<string | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})

const createProject = async (payload: ProjectPayload) => {
    submitting.value = true
    message.value = null
    fieldErrors.value = {}

    try {
        const response = await projectService.createProject(payload, token.value)

        toast.success('Project created', {
            description: `${response.data?.project.project_name ?? payload.project_name} is now being tracked.`,
        })
        await navigateTo('/projects')
    } catch (exception) {
        const parsed = parseAPIError(exception)

        if (parsed.status === 401) {
            await expireSession()

            return
        }

        fieldErrors.value = parsed.fieldErrors
        message.value = Object.keys(parsed.fieldErrors).length ? null : parsed.message
    } finally {
        submitting.value = false
    }
}
</script>

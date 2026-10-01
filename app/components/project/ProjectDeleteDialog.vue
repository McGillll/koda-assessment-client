<template>
    <AlertDialog v-model:open="open">
        <AlertDialogContent class="rounded-2xl">
            <AlertDialogHeader>
                <AlertDialogMedia class="rounded-xl bg-destructive/10 text-destructive">
                    <Trash2 aria-hidden="true" />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                <AlertDialogDescription>
                    <span class="font-medium text-foreground">{{ project?.project_name }}</span>
                    for {{ project?.client_name }} will be permanently removed from your project list.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel class="min-h-11 rounded-lg" :disabled="deleting">
                    Cancel
                </AlertDialogCancel>
                <Button
                    class="min-h-11 rounded-lg bg-destructive text-white hover:bg-destructive/90"
                    :disabled="deleting"
                    @click="emit('confirm')"
                >
                    <LoaderCircle v-if="deleting" aria-hidden="true" class="animate-spin" />
                    {{ deleting ? 'Deleting...' : 'Delete project' }}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>

<script setup lang="ts">
import type { Project } from '@/components/api/project/ProjectService'
import { LoaderCircle, Trash2 } from '@lucide/vue'

defineProps<{
    project: Project | null
    deleting: boolean
}>()

const emit = defineEmits<{
    confirm: []
}>()

const open = defineModel<boolean>('open', { required: true })
</script>

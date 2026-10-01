<template>
    <AuthShell title="Welcome back" description="Sign in to check on your client projects.">
        <form class="space-y-5" novalidate @submit.prevent="submit">
            <AuthField
                id="email"
                v-model="form.email"
                label="Email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                :icon="Mail"
                :error="emailError"
                @blur="touched.email = true"
            />

            <AuthField
                id="password"
                v-model="form.password"
                label="Password"
                type="password"
                autocomplete="current-password"
                placeholder="Enter your password"
                :icon="Lock"
                :error="passwordError"
                @blur="touched.password = true"
            />

            <AuthAlert v-if="formError">
                {{ formError }}
            </AuthAlert>

            <Button
                class="h-11 w-full rounded-lg text-sm font-semibold shadow-lg shadow-primary/25"
                type="submit"
                :disabled="!canSubmit || loading"
            >
                <LoaderCircle v-if="loading" aria-hidden="true" class="animate-spin" />
                {{ loading ? 'Signing in...' : 'Sign in' }}
                <ArrowRight v-if="!loading" aria-hidden="true" class="transition-transform group-hover/button:translate-x-0.5" />
            </Button>
        </form>

        <template #footer>
            Don't have an account?
            <NuxtLink
                class="inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline"
                to="/register"
            >
                Create one
            </NuxtLink>
        </template>
    </AuthShell>
</template>

<script setup lang="ts">
import { ArrowRight, LoaderCircle, Lock, Mail } from '@lucide/vue'

definePageMeta({
    middleware: 'guest',
})

const { login, loading, error, fieldErrors, clearErrors } = useAuth()

const form = reactive({
    email: '',
    password: '',
})

watch(form, () => clearErrors())

const touched = reactive({
    email: false,
    password: false,
})

const formError = computed(() => error.value || Object.values(fieldErrors.value)[0]?.[0] || '')

const emailError = computed(() => {
    if (!touched.email) {
        return ''
    }

    if (!form.email) {
        return 'Email is required.'
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email.'
})

const passwordError = computed(() => {
    if (!touched.password) {
        return ''
    }

    return form.password ? '' : 'Password is required.'
})

const canSubmit = computed(() => form.email && form.password && !emailError.value && !passwordError.value)

const submit = async () => {
    touched.email = true
    touched.password = true

    if (!canSubmit.value) {
        return
    }

    try {
        await login(form)
        await navigateTo('/projects')
    } catch {
    }
}
</script>

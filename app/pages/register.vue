<template>
    <AuthShell title="Create your account" description="Start tracking your agency's client projects.">
        <form class="space-y-5" novalidate @submit.prevent="submit">
            <AuthField
                id="name"
                v-model="form.name"
                label="Full name"
                autocomplete="name"
                placeholder="Jane Doe"
                :icon="User"
                :error="nameError"
                @blur="touched.name = true"
            />

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
                autocomplete="new-password"
                placeholder="At least 8 characters"
                :icon="Lock"
                :error="passwordError"
                @blur="touched.password = true"
            >
                <template #hint>
                    <div v-if="form.password" class="space-y-1.5" aria-live="polite">
                        <div class="grid grid-cols-4 gap-1.5" aria-hidden="true">
                            <span
                                v-for="segment in 4"
                                :key="segment"
                                :class="cn('h-1 rounded-full transition-colors', segment <= strength.score ? strength.color : 'bg-muted')"
                            />
                        </div>
                        <p class="text-xs text-muted-foreground">
                            Password strength: <span class="font-medium text-foreground">{{ strength.label }}</span>
                        </p>
                    </div>
                </template>
            </AuthField>

            <AuthField
                id="password_confirmation"
                v-model="form.password_confirmation"
                label="Confirm password"
                type="password"
                autocomplete="new-password"
                placeholder="Re-enter your password"
                :icon="LockKeyhole"
                :error="passwordConfirmationError"
                @blur="touched.password_confirmation = true"
            />

            <AuthAlert v-if="error">
                {{ error }}
            </AuthAlert>

            <Button
                class="h-11 w-full rounded-lg text-sm font-semibold shadow-lg shadow-primary/25"
                type="submit"
                :disabled="!canSubmit || loading"
            >
                <LoaderCircle v-if="loading" aria-hidden="true" class="animate-spin" />
                {{ loading ? 'Creating account...' : 'Create account' }}
                <ArrowRight v-if="!loading" aria-hidden="true" class="transition-transform group-hover/button:translate-x-0.5" />
            </Button>
        </form>

        <template #footer>
            Already have an account?
            <NuxtLink
                class="inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline"
                to="/login"
            >
                Sign in
            </NuxtLink>
        </template>
    </AuthShell>
</template>

<script setup lang="ts">
import { ArrowRight, LoaderCircle, Lock, LockKeyhole, Mail, User } from '@lucide/vue'
import { cn } from '@/lib/utils'

definePageMeta({
    middleware: 'guest',
})

const { register, loading, error, fieldErrors, clearErrors } = useAuth()

const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
})

watch(() => form.name, () => clearErrors('name'))
watch(() => form.email, () => clearErrors('email'))
watch(() => form.password, () => clearErrors('password'))
watch(() => form.password_confirmation, () => clearErrors('password_confirmation'))

const touched = reactive({
    name: false,
    email: false,
    password: false,
    password_confirmation: false,
})

const strength = computed(() => {
    const checks = [
        form.password.length >= 8,
        /[a-z]/.test(form.password) && /[A-Z]/.test(form.password),
        /\d/.test(form.password),
        /[^A-Za-z0-9]/.test(form.password),
    ]
    const score = checks.filter(Boolean).length
    const levels = [
        { label: 'Too weak', color: 'bg-destructive' },
        { label: 'Weak', color: 'bg-destructive' },
        { label: 'Fair', color: 'bg-amber-500' },
        { label: 'Good', color: 'bg-indigo-500' },
        { label: 'Strong', color: 'bg-emerald-500' },
    ]

    return { score, ...levels[score]! }
})

const nameError = computed(() => {
    if (fieldErrors.value.name?.[0]) {
        return fieldErrors.value.name[0]
    }

    if (!touched.name) {
        return ''
    }

    return form.name ? '' : 'Name is required.'
})

const emailError = computed(() => {
    if (fieldErrors.value.email?.[0]) {
        return fieldErrors.value.email[0]
    }

    if (!touched.email) {
        return ''
    }

    if (!form.email) {
        return 'Email is required.'
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email.'
})

const passwordError = computed(() => {
    if (fieldErrors.value.password?.[0]) {
        return fieldErrors.value.password[0]
    }

    if (!touched.password) {
        return ''
    }

    return form.password.length >= 8 ? '' : 'Password must be at least 8 characters.'
})

const passwordConfirmationError = computed(() => {
    if (fieldErrors.value.password_confirmation?.[0]) {
        return fieldErrors.value.password_confirmation[0]
    }

    if (!touched.password_confirmation) {
        return ''
    }

    return form.password_confirmation === form.password ? '' : 'Passwords must match.'
})

const canSubmit = computed(() => {
    return form.name
        && form.email
        && form.password
        && form.password_confirmation
        && !nameError.value
        && !emailError.value
        && !passwordError.value
        && !passwordConfirmationError.value
})

const submit = async () => {
    touched.name = true
    touched.email = true
    touched.password = true
    touched.password_confirmation = true

    if (!canSubmit.value) {
        return
    }

    try {
        await register(form)
        await navigateTo('/projects')
    } catch {
    }
}
</script>

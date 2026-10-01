import type { AuthUser, LoginPayload, RegisterPayload } from '@/components/api/auth/AuthService'
import { authService } from '@/components/api/auth/AuthService'

interface APIError {
    data?: {
        message?: string
        data?: Record<string, string[]>
    }
}

export const useAuth = () => {
    const token = useCookie<string | null>('auth_token', {
        sameSite: 'lax',
        secure: false,
    })
    const user = useState<AuthUser | null>('auth.user', () => null)
    const loading = useState<boolean>('auth.loading', () => false)
    const error = useState<string | null>('auth.error', () => null)
    const fieldErrors = useState<Record<string, string[]>>('auth.fieldErrors', () => ({}))

    const setError = (exception: unknown) => {
        const apiError = exception as APIError

        error.value = apiError.data?.message || 'Something went wrong.'
        fieldErrors.value = apiError.data?.data || {}
    }

    const clearErrors = (field?: string) => {
        error.value = null

        if (!field) {
            fieldErrors.value = {}

            return
        }

        const { [field]: _removed, ...remaining } = fieldErrors.value
        fieldErrors.value = remaining
    }

    const setSession = (authToken: string, authUser: AuthUser) => {
        token.value = authToken
        user.value = authUser
        error.value = null
        fieldErrors.value = {}
    }

    const register = async (payload: RegisterPayload) => {
        loading.value = true
        error.value = null
        fieldErrors.value = {}

        try {
            const response = await authService.register(payload)

            if (response.data) {
                setSession(response.data.token, response.data.user)
            }
        } catch (exception) {
            setError(exception)
            throw exception
        } finally {
            loading.value = false
        }
    }

    const login = async (payload: LoginPayload) => {
        loading.value = true
        error.value = null
        fieldErrors.value = {}

        try {
            const response = await authService.login(payload)

            if (response.data) {
                setSession(response.data.token, response.data.user)
            }
        } catch (exception) {
            setError(exception)
            throw exception
        } finally {
            loading.value = false
        }
    }

    const fetchUser = async () => {
        if (!token.value) {
            user.value = null

            return
        }

        try {
            const response = await authService.me(token.value)
            user.value = response.data?.user || null
        } catch {
            token.value = null
            user.value = null
        }
    }

    const logout = async () => {
        const currentToken = token.value

        try {
            if (currentToken) {
                await authService.logout(currentToken)
            }
        } finally {
            token.value = null
            user.value = null
        }
    }

    return {
        token,
        user,
        loading,
        error,
        fieldErrors,
        clearErrors,
        register,
        login,
        fetchUser,
        logout,
    }
}

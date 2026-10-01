import BaseAPIService from '@/components/api/BaseAPIService'

export interface AuthUser {
    uuid: string
    name: string
    email: string
    created_at: string | null
}

export interface AuthPayload {
    user: AuthUser
    token: string
}

export interface UserPayload {
    user: AuthUser
}

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    name: string
    email: string
    password: string
    password_confirmation: string
}

class AuthService extends BaseAPIService {
    async register(payload: RegisterPayload) {
        return await this.request<AuthPayload>('/auth/register', 'POST', payload)
    }

    async login(payload: LoginPayload) {
        return await this.request<AuthPayload>('/auth/login', 'POST', payload)
    }

    async me(token: string) {
        return await this.request<UserPayload>('/auth/me', 'GET', undefined, token)
    }

    async logout(token: string) {
        return await this.request<null>('/auth/logout', 'POST', undefined, token)
    }
}

export const authService = new AuthService()

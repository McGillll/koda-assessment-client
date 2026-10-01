export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface APIResponse<T> {
    success: boolean
    message: string
    data: T | null
}

export default class BaseAPIService {
    protected async request<T>(url: string, method: HTTPMethod, params?: object, token?: string | null): Promise<APIResponse<T>> {
        const config = useRuntimeConfig()
        const headers: Record<string, string> = {
            Accept: 'application/json',
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        return await $fetch<APIResponse<T>>(url, {
            baseURL: config.public.apiBaseUrl,
            method,
            headers,
            query: method === 'GET' ? params : undefined,
            body: method === 'GET' ? undefined : params,
        })
    }
}

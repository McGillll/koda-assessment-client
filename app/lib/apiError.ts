interface FetchErrorLike {
    status?: number
    statusCode?: number
    data?: {
        message?: string
        data?: Record<string, string[]> | null
    }
}

export interface ParsedAPIError {
    status: number | null
    message: string
    fieldErrors: Record<string, string[]>
}

export const parseAPIError = (exception: unknown): ParsedAPIError => {
    const error = exception as FetchErrorLike
    const status = error?.status ?? error?.statusCode ?? null

    if (status === null) {
        return {
            status,
            message: 'Unable to reach the server. Check your connection and try again.',
            fieldErrors: {},
        }
    }

    return {
        status,
        message: error.data?.message || 'Something went wrong. Please try again.',
        fieldErrors: error.data?.data || {},
    }
}

import BaseAPIService from '@/components/api/BaseAPIService'

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed'

export type ProjectPriority = 'low' | 'medium' | 'high'

export interface Project {
    uuid: string
    client_name: string
    project_name: string
    description: string | null
    status: ProjectStatus
    status_label: string
    priority: ProjectPriority
    priority_label: string
    start_date: string | null
    due_date: string | null
    created_at: string | null
    updated_at: string | null
}

export interface ProjectPayload {
    client_name: string
    project_name: string
    description: string | null
    status: ProjectStatus
    priority: ProjectPriority
    start_date: string | null
    due_date: string | null
}

export type ProjectSortField = 'client_name' | 'project_name' | 'status' | 'priority' | 'start_date' | 'due_date' | 'created_at'

export type SortDirection = 'asc' | 'desc'

export interface ProjectListParams {
    search?: string
    status?: ProjectStatus
    priority?: ProjectPriority
    sort_by?: ProjectSortField
    sort_dir?: SortDirection
    page?: number
    per_page?: number
}

export interface PaginationMeta {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export interface ProjectListPayload {
    projects: Project[]
    meta: PaginationMeta
}

export interface ProjectItemPayload {
    project: Project
}

class ProjectService extends BaseAPIService {
    async fetchProjects(params: ProjectListParams, token: string | null) {
        return await this.request<ProjectListPayload>('/projects', 'GET', params, token)
    }

    async fetchProject(projectUuid: string, token: string | null) {
        return await this.request<ProjectItemPayload>(`/projects/${projectUuid}`, 'GET', undefined, token)
    }

    async createProject(payload: ProjectPayload, token: string | null) {
        return await this.request<ProjectItemPayload>('/projects', 'POST', payload, token)
    }

    async updateProject(projectUuid: string, payload: ProjectPayload, token: string | null) {
        return await this.request<ProjectItemPayload>(`/projects/${projectUuid}`, 'PUT', payload, token)
    }

    async deleteProject(projectUuid: string, token: string | null) {
        return await this.request<null>(`/projects/${projectUuid}`, 'DELETE', undefined, token)
    }
}

export const projectService = new ProjectService()

export interface User {
    id: string
    full_name: string
    email: string
    is_admin: boolean
    avatar: string
    role_id: string
    role_name: string
    avatar_url: string
    employee_id: string
    employee_name: string
}
export interface UserReq {
    full_name: string
    email: string
    password?: string
    is_admin?: boolean
    avatar?: string
    avatar_url?: string
    role_id?: string | null
    employee_id?: string | null
}

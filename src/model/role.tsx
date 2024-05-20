export interface Role {
  id: string
  name: string
  description: string
  is_super_admin: boolean
  permissions: string[]
}
export interface RoleReq {
  name: string
  description: string
  is_super_admin: boolean
  permissions: string[]
}

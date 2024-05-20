export interface Organization {
  id: string
  name: string
  description: string
  code: string
  parent_id?: string
  parent?: string
  sub_organizations?: Organization[]
}
export interface OrganizationReq {
  name: string
  description: string
  code: string
  parent_id?: string | null | undefined | number
}

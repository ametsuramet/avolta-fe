import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getPermissions = async (pagination: PaginationReq) => {
    const params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/permission?${new URLSearchParams(params)}`)

} 

export const getPermissionsDetail = async (id: string) => {
    return await customFetch(`admin/permission/${id}`)
}
import { RoleReq } from "@/model/role";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getRoles = async (pagination: PaginationReq) => {
    const params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/role?${new URLSearchParams(params)}`)

} 




export const addRole = async (req: RoleReq) => {
    return await customFetch(`admin/role`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editRole = async (id:string, req: RoleReq) => {
    return await customFetch(`admin/role/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteRole = async (id:string) => {
    return await customFetch(`admin/role/${id}`, {
        method: "DELETE",
    })
}

export const getRoleDetail = async (id: string) => {
    return await customFetch(`admin/role/${id}`)
}
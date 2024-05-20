import { OrganizationReq } from "@/model/organization";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getOrganizations = async (pagination: PaginationReq) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/organization?${new URLSearchParams(params)}`)

} 




export const addOrganization = async (req: OrganizationReq) => {
    return await customFetch(`admin/organization`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editOrganization = async (id:string, req: OrganizationReq) => {
    return await customFetch(`admin/organization/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteOrganization = async (id:string) => {
    return await customFetch(`admin/organization/${id}`, {
        method: "DELETE",
    })
}

export const getOrganizationDetail = async (id: string) => {
    return await customFetch(`admin/organization/${id}`)
}
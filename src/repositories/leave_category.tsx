import { LeaveCategoryReq } from "@/model/leave_category";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getLeaveCategories = async (pagination: PaginationReq) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/leaveCategory?${new URLSearchParams(params)}`)

} 


export const addLeaveCategory = async (req: LeaveCategoryReq) => {
    return await customFetch(`admin/leaveCategory`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editLeaveCategory = async (id:string, req: LeaveCategoryReq) => {
    return await customFetch(`admin/leaveCategory/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteLeaveCategory = async (id:string) => {
    return await customFetch(`admin/leaveCategory/${id}`, {
        method: "DELETE",
    })
}

export const getLeaveCategoryDetail = async (id: string) => {
    return await customFetch(`admin/leaveCategory/${id}`)
}
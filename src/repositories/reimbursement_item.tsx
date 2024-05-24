import { ReimbursementItemReq } from "@/model/reimbursement";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getReimbursementItems = async (pagination: PaginationReq) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/reimbursementItem?${new URLSearchParams(params)}`)

} 

export const addReimbursementItem = async (req: ReimbursementItemReq) => {
    return await customFetch(`admin/reimbursementItem`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editReimbursementItem = async (id:string, req: ReimbursementItemReq) => {
    return await customFetch(`admin/reimbursementItem/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteReimbursementItem = async (id:string) => {
    return await customFetch(`admin/reimbursementItem/${id}`, {
        method: "DELETE",
    })
}

export const getReimbursementItemDetail = async (id: string) => {
    return await customFetch(`admin/reimbursementItem/${id}`)
}
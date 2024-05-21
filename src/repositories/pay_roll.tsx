import { PayRollReq } from "@/model/pay_roll";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getPayRolls = async (pagination: PaginationReq) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/payRoll?${new URLSearchParams(params)}`)

} 




export const addPayRoll = async (req: PayRollReq) => {
    return await customFetch(`admin/payRoll`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editPayRoll = async (id:string, req: PayRollReq) => {
    return await customFetch(`admin/payRoll/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deletePayRoll = async (id:string) => {
    return await customFetch(`admin/payRoll/${id}`, {
        method: "DELETE",
    })
}

export const getPayRollDetail = async (id: string) => {
    return await customFetch(`admin/payRoll/${id}`)
}
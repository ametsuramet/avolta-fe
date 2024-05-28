import { BankReq } from "@/model/bank";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getBanks = async (pagination: PaginationReq) => {
    const params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/bank?${new URLSearchParams(params)}`)

} 




export const addBank = async (req: BankReq) => {
    return await customFetch(`admin/bank`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editBank = async (id:string, req: BankReq) => {
    return await customFetch(`admin/bank/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteBank = async (id:string) => {
    return await customFetch(`admin/bank/${id}`, {
        method: "DELETE",
    })
}

export const getBankDetail = async (id: string) => {
    return await customFetch(`admin/bank/${id}`)
}
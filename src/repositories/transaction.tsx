import { TransactionReq } from "@/model/transaction";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getTransactions = async (pagination: PaginationReq) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/transaction?${new URLSearchParams(params)}`)

} 




export const addTransaction = async (req: TransactionReq) => {
    return await customFetch(`admin/transaction`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editTransaction = async (id:string, req: TransactionReq) => {
    return await customFetch(`admin/transaction/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteTransaction = async (id:string) => {
    return await customFetch(`admin/transaction/${id}`, {
        method: "DELETE",
    })
}

export const getTransactionDetail = async (id: string) => {
    return await customFetch(`admin/transaction/${id}`)
}
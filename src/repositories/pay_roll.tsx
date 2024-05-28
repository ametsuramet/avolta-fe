import { PayRollPaymentReq, PayRollReq } from "@/model/pay_roll";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getPayRolls = async (pagination: PaginationReq) => {
    const params: Record<string, string> = {
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

export const editPayRoll = async (id: string, req: PayRollReq) => {
    return await customFetch(`admin/payRoll/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}
export const processPayRoll = async (id: string) => {
    return await customFetch(`admin/payRoll/${id}/Process`, {
        method: "PUT",
    })
}
export const finishPayRoll = async (id: string) => {
    return await customFetch(`admin/payRoll/${id}/Finish`, {
        method: "PUT",
    })
}
export const paymentPayRoll = async (id: string, req: PayRollPaymentReq) => {
    return await customFetch(`admin/payRoll/${id}/Payment`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deletePayRoll = async (id: string) => {
    return await customFetch(`admin/payRoll/${id}`, {
        method: "DELETE",
    })
}

export const getPayRollDetail = async (id: string) => {
    return await customFetch(`admin/payRoll/${id}`)
}
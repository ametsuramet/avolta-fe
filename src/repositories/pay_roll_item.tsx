import { PayRollItemReq } from "@/model/pay_roll";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"



export const addPayRollItem = async (req: PayRollItemReq) => {
    return await customFetch(`admin/payRollItem`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editPayRollItem = async (id:string, req: PayRollItemReq) => {
    return await customFetch(`admin/payRollItem/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deletePayRollItem = async (id:string) => {
    return await customFetch(`admin/payRollItem/${id}`, {
        method: "DELETE",
    })
}

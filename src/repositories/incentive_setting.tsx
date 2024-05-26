import { IncentiveSettingFilter, IncentiveSettingReq } from "@/model/incentive_setting";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getIncentiveSettings = async (pagination: PaginationReq, filter?: IncentiveSettingFilter) => {
    const params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }

    if (filter) {
        if (filter.product_category_id) {
            params["product_category_id"] = filter.product_category_id
        }
        if (filter.shop_id) {
            params["shop_id"] = filter.shop_id
        }
     
        if (filter.download) {
            params["download"] = "1"
        }

       
    }
    return await customFetch(`admin/incentiveSetting?${new URLSearchParams(params)}`)

} 




export const addIncentiveSetting = async (req: IncentiveSettingReq) => {
    return await customFetch(`admin/incentiveSetting`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editIncentiveSetting = async (id:string, req: IncentiveSettingReq) => {
    return await customFetch(`admin/incentiveSetting/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteIncentiveSetting = async (id:string) => {
    return await customFetch(`admin/incentiveSetting/${id}`, {
        method: "DELETE",
    })
}

export const getIncentiveSettingDetail = async (id: string) => {
    return await customFetch(`admin/incentiveSetting/${id}`)
}
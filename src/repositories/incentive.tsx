import { IncentiveFilter, IncentiveReq } from "@/model/incentive";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getIncentives = async (pagination: PaginationReq, filter?: IncentiveFilter) => {
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
        if (filter.incentive_report_id) {
            params["incentive_report_id"] = filter.incentive_report_id
        }
     
        if (filter.download) {
            params["download"] = "1"
        }

       
    }
    return await customFetch(`admin/incentive?${new URLSearchParams(params)}`)

} 

export const addIncentive = async (req: IncentiveReq) => {
    return await customFetch(`admin/incentive`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editIncentive = async (id:string, req: IncentiveReq) => {
    return await customFetch(`admin/incentive/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}
export const addEmployeeIncentive = async (id:string, employee_id: string) => {
    return await customFetch(`admin/incentive/${id}/AddEmployee`, {
        method: "PUT",
        body: JSON.stringify({employee_id})
    })
}

export const deleteIncentive = async (id:string) => {
    return await customFetch(`admin/incentive/${id}`, {
        method: "DELETE",
    })
}

export const getIncentiveDetail = async (id: string) => {
    return await customFetch(`admin/incentive/${id}`)
}
import { EditIncentiveReportReq, IncentiveEditItemReq, IncentiveReportFilter, IncentiveReportReq } from "@/model/incentive_report";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getIncentiveReports = async (pagination: PaginationReq, filter?: IncentiveReportFilter) => {
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
    return await customFetch(`admin/incentiveReport?${new URLSearchParams(params)}`)

} 

export const addIncentiveReport = async (req: IncentiveReportReq) => {
    return await customFetch(`admin/incentiveReport`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editIncentiveReport = async (id:string, req: EditIncentiveReportReq) => {
    return await customFetch(`admin/incentiveReport/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const updateItemIncentiveReport = async (id:string, itemId: string, req: IncentiveEditItemReq) => {
    return await customFetch(`admin/incentiveReport/${id}/EditIncentive/${itemId}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}
export const addEmployeeIncentiveReport = async (id:string, employee_id: string) => {
    return await customFetch(`admin/incentiveReport/${id}/AddEmployee`, {
        method: "PUT",
        body: JSON.stringify({employee_id})
    })
}

export const deleteIncentiveReport = async (id:string) => {
    return await customFetch(`admin/incentiveReport/${id}`, {
        method: "DELETE",
    })
}

export const getIncentiveReportDetail = async (id: string) => {
    return await customFetch(`admin/incentiveReport/${id}`)
}
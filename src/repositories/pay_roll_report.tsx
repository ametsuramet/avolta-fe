import { EditPayRollReportReq, PayRollReportFilter, PayRollReportReq } from "@/model/pay_roll_report";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getPayRollReports = async (pagination: PaginationReq, filter?: PayRollReportFilter) => {
    const params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }

    if (filter) {
        if (filter.download) {
            params["download"] = "1"
        }
       
    }
    return await customFetch(`admin/payRollReport?${new URLSearchParams(params)}`)

} 

export const addPayRollReport = async (req: PayRollReportReq) => {
    return await customFetch(`admin/payRollReport`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editPayRollReport = async (id:string, req: EditPayRollReportReq) => {
    return await customFetch(`admin/payRollReport/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}
export const addItemPayRollReport = async (id:string, payRollId: string) => {
    return await customFetch(`admin/payRollReport/${id}/AddItem/${payRollId}`, {
        method: "PUT",
    })
}
export const payrollBankDownload = async (id:string) => {
    return await customFetch(`admin/payRollReport/${id}/PayRolllBankDownLoad`, {
    })
}

// export const updateItemPayRollReport = async (id:string, itemId: string, req: IncentiveEditItemReq) => {
//     return await customFetch(`admin/payRollReport/${id}/EditIncentive/${itemId}`, {
//         method: "PUT",
//         body: JSON.stringify(req)
//     })
// }
// export const addEmployeePayRollReport = async (id:string, employee_id: string) => {
//     return await customFetch(`admin/payRollReport/${id}/AddEmployee`, {
//         method: "PUT",
//         body: JSON.stringify({employee_id})
//     })
// }

export const deletePayRollReport = async (id:string) => {
    return await customFetch(`admin/payRollReport/${id}`, {
        method: "DELETE",
    })
}

export const getPayRollReportDetail = async (id: string) => {
    return await customFetch(`admin/payRollReport/${id}`)
}
import { ReimbursementFilter, ReimbursementReq } from "@/model/reimbursement";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getReimbursements = async (pagination: PaginationReq, filter?: ReimbursementFilter) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }

    if (filter) {
       
        if (filter.dateRange) {
            params["start_date"] = filter.dateRange[0].toISOString()
            params["end_date"] = filter.dateRange[1].toISOString()
        }
        if (filter.jobTitleID) {
            params["job_title_id"] = filter.jobTitleID
        }
        if (filter.employeeIDs) {
            params["employee_ids"] = filter.employeeIDs
        }
        if (filter.employeeID) {
            params["employee_id"] = filter.employeeID
        }
        if (filter.status) {
            params["status"] = filter.status
        }
        
        if (filter.download) {
            params["download"] = "1"
        }
    }
    return await customFetch(`admin/reimbursement?${new URLSearchParams(params)}`)

}

export const addReimbursement = async (req: ReimbursementReq) => {
    return await customFetch(`admin/reimbursement`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editReimbursement = async (id: string, req: ReimbursementReq) => {
    return await customFetch(`admin/reimbursement/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}
export const approvalReimbursement = async (id: string, type: string, remarks: string) => {
    return await customFetch(`admin/reimbursement/${id}/Approval/${type}`, {
        method: "PUT",
        body: JSON.stringify({ remarks })
    })
}
export const paymentReimbursement = async (id: string, amount: number,  remarks: string, account_id: string, files: string) => {
    return await customFetch(`admin/reimbursement/${id}/Payment`, {
        method: "PUT",
        body: JSON.stringify({ remarks, amount, files, account_id })
    })
}

export const deleteReimbursement = async (id: string) => {
    return await customFetch(`admin/reimbursement/${id}`, {
        method: "DELETE",
    })
}

export const getReimbursementDetail = async (id: string) => {
    return await customFetch(`admin/reimbursement/${id}`)
}
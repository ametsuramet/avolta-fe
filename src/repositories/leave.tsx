import { LeaveFilter, LeaveReq } from "@/model/leave";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getLeaves = async (pagination: PaginationReq, filter?: LeaveFilter) => {
    const params: Record<string, string> = {
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
       
        if (filter.employeeIDs) {
            params["employee_ids"] = filter.employeeIDs
        }
        if (filter.employeeID) {
            params["employee_id"] = filter.employeeID
        }
       
        if (filter.status) {
            params["status"] = filter.status
        }
       
    }
    return await customFetch(`admin/leave?${new URLSearchParams(params)}`)

}




export const addLeave = async (req: LeaveReq) => {
    return await customFetch(`admin/leave`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editLeave = async (id: string, req: LeaveReq) => {
    return await customFetch(`admin/leave/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}
export const approveLeave = async (id: string, remarks: string) => {
    return await customFetch(`admin/leave/${id}/Approve`, {
        method: "PUT",
        body: JSON.stringify({ remarks })
    })
}
export const rejectLeave = async (id: string, remarks: string) => {
    return await customFetch(`admin/leave/${id}/Reject`, {
        method: "PUT",
        body: JSON.stringify({ remarks })
    })
}
export const reviewLeave = async (id: string, remarks: string) => {
    return await customFetch(`admin/leave/${id}/Review`, {
        method: "PUT",
        body: JSON.stringify({ remarks })
    })
}

export const deleteLeave = async (id: string) => {
    return await customFetch(`admin/leave/${id}`, {
        method: "DELETE",
    })
}

export const getLeaveDetail = async (id: string) => {
    return await customFetch(`admin/leave/${id}`)
}
import { AttendanceFilter, AttendanceReq } from "@/model/attendance";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getAttendances = async  (pagination: PaginationReq, filter?: AttendanceFilter) => {
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
        if (filter.gender) {
            params["gender"] = filter.gender
        }
        
        if (filter.download) {
            params["download"] = "1"
        }
    }
    return await customFetch(`admin/attendance?${new URLSearchParams(params)}`)
} 


export const addAttendance = async (req: AttendanceReq) => {
    return await customFetch(`admin/attandance`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editAttendance = async (id:string, req: AttendanceReq) => {
    return await customFetch(`admin/attandance/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const getAttendanceDetail = async (id: string) => {
    return await customFetch(`admin/attandance/${id}`)
}
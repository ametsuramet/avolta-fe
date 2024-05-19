import { ScheduleFilter, ScheduleReq } from "@/model/schedule";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"
import moment from "moment";


export const getSchedules = async (pagination: PaginationReq, filter?: ScheduleFilter) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    if (filter) {
        if (filter.dateRange) {
            params["date_range"] = `${moment(filter.dateRange[0]).format("YYYY-MM-DD")},${moment(filter.dateRange[1]).format("YYYY-MM-DD 23:59:59")}`
        }
    }
    return await customFetch(`admin/schedule?${new URLSearchParams(params)}`)

} 




export const addSchedule = async (req: ScheduleReq) => {
    return await customFetch(`admin/schedule`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editSchedule = async (id:string, req: ScheduleReq) => {
    return await customFetch(`admin/schedule/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const addEmployeeSchedule = async (id:string, employeeId: string) => {
    return await customFetch(`admin/schedule/${id}/AddEmployee`, {
        method: "PUT",
        body: JSON.stringify({
            employee_id: employeeId
        })
    })
}

export const deleteSchedule = async (id:string) => {
    return await customFetch(`admin/schedule/${id}`, {
        method: "DELETE",
    })
}
export const deleteEmployeeSchedule = async (id:string, employeeId:string) => {
    return await customFetch(`admin/schedule/${id}/DeleteEmployee/${employeeId}`, {
        method: "DELETE",
    })
}

export const getScheduleDetail = async (id: string) => {
    return await customFetch(`admin/schedule/${id}`)
}
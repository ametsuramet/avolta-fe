import { Employee, EmployeeFilter, EmployeeReq } from "@/model/employee";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getEmployees = async (pagination: PaginationReq, filter?: EmployeeFilter) => {
    const params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    if (filter) {
        if (filter.ageRange) {
            params["age_start_date"] = filter.ageRange![0].toISOString()
            params["age_end_date"] = filter.ageRange![1].toISOString()
        }
        if (filter.jobTitleID) {
            params["job_title_id"] = filter.jobTitleID
        }
        if (filter.gender) {
            params["gender"] = filter.gender
        }
        if (filter.startedWork) {
            params["started_work"] = filter.startedWork.toISOString()
        }
        if (filter.startedWorkEnd) {
            params["started_work_end"] = filter.startedWorkEnd.toISOString()
        }
        if (filter.download) {
            params["download"] = "1"
        }
        if (filter.skipLinked) {
            params["skip_linked"] = "1"
        }
        if (filter.employee_id) {
            params["employee_id"] = filter.employee_id
        }
    }
    return await customFetch(`admin/employee?${new URLSearchParams(params)}`)

}

export const addEmployee = async (req: EmployeeReq) => {
    return await customFetch(`admin/employee`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editEmployee = async (id:string, req: EmployeeReq) => {
    return await customFetch(`admin/employee/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const getEmployeeDetail = async (id: string) => {
    return await customFetch(`admin/employee/${id}`)
}
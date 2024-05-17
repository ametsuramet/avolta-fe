import { EmployeeFilter } from "@/model/employee";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getEmployees = async (pagination: PaginationReq, filter?: EmployeeFilter) => {
    var params: Record<string, string> = {
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
    }
    return await customFetch(`admin/employee?${new URLSearchParams(params)}`)

} 
import { JobTitleReq } from "@/model/job_title";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getJobTitles = async (pagination: PaginationReq) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/jobTitle?${new URLSearchParams(params)}`)

} 




export const addJobTitle = async (req: JobTitleReq) => {
    return await customFetch(`admin/jobTitle`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editJobTitle = async (id:string, req: JobTitleReq) => {
    return await customFetch(`admin/jobTitle/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deletetJobTitle = async (id:string) => {
    return await customFetch(`admin/jobTitle/${id}`, {
        method: "DELETE",
    })
}

export const getJobTitleDetail = async (id: string) => {
    return await customFetch(`admin/jobTitle/${id}`)
}
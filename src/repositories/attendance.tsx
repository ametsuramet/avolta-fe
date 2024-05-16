import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getAttendances = async  (pagination: PaginationReq) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/attendance?${new URLSearchParams(params)}`)
} 
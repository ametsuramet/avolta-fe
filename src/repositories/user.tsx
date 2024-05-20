import { UserReq } from "@/model/user";
import { PaginationReq } from "@/objects/pagination";
import { customFetch } from "@/utils/helper";


export const getUsers = async (pagination: PaginationReq) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/user?${new URLSearchParams(params)}`)

}


export const addUser = async (req: UserReq) => {
    return await customFetch(`admin/user`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editUser = async (id: string, req: UserReq) => {
    return await customFetch(`admin/user/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteUser = async (id: string) => {
    return await customFetch(`admin/user/${id}`, {
        method: "DELETE",
    })
}

export const getUserDetail = async (id: string) => {
    return await customFetch(`admin/user/${id}`)
}
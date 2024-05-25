import { ShopReq } from "@/model/shop";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getShops = async (pagination: PaginationReq) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/shop?${new URLSearchParams(params)}`)

} 




export const addShop = async (req: ShopReq) => {
    return await customFetch(`admin/shop`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editShop = async (id:string, req: ShopReq) => {
    return await customFetch(`admin/shop/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteShop = async (id:string) => {
    return await customFetch(`admin/shop/${id}`, {
        method: "DELETE",
    })
}

export const getShopDetail = async (id: string) => {
    return await customFetch(`admin/shop/${id}`)
}
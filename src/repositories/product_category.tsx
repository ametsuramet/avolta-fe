import { ProductCategoryReq } from "@/model/product_category";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getProductCategories = async (pagination: PaginationReq) => {
    var params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    return await customFetch(`admin/productCategory?${new URLSearchParams(params)}`)

} 

export const addProductCategory = async (req: ProductCategoryReq) => {
    return await customFetch(`admin/productCategory`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editProductCategory = async (id:string, req: ProductCategoryReq) => {
    return await customFetch(`admin/productCategory/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteProductCategory = async (id:string) => {
    return await customFetch(`admin/productCategory/${id}`, {
        method: "DELETE",
    })
}

export const getProductCategoryDetail = async (id: string) => {
    return await customFetch(`admin/productCategory/${id}`)
}
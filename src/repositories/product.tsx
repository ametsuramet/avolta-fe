import { ProductFilter, ProductReq } from "@/model/product";
import { ProductCategory } from "@/model/product_category";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"


export const getProducts = async (pagination: PaginationReq, filter?: ProductFilter) => {
    const params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search && pagination.search != "") {
        params["search"] = pagination.search
    }
    if (filter) {
        if (filter.product_category_id) {
            params["product_category_id"] = filter.product_category_id
        }
        if (filter.download) {
            params["download"] = "1"
        }
        if (filter.product_id) {
            params["product_id"] = filter.product_id
        }
    }
    return await customFetch(`admin/product?${new URLSearchParams(params)}`)

}




export const addProduct = async (req: ProductReq) => {
    return await customFetch(`admin/product`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editProduct = async (id: string, req: ProductReq) => {
    return await customFetch(`admin/product/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteProduct = async (id: string) => {
    return await customFetch(`admin/product/${id}`, {
        method: "DELETE",
    })
}

export const getProductDetail = async (id: string) => {
    return await customFetch(`admin/product/${id}`)
}
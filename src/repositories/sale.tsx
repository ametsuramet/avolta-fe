import { SaleFilter, SaleReq } from "@/model/sale";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"
import moment from "moment";


export const getSales = async (pagination: PaginationReq, filter?: SaleFilter) => {
    var params: Record<string, string> = {
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
        if (filter.shop_id) {
            params["shop_id"] = filter.shop_id
        }
        if (filter.employee_id) {
            params["employee_id"] = filter.employee_id
        }
        if (filter.download) {
            params["download"] = "1"
        }

        if (filter.dateRange) {
            params["start_date"] = filter.dateRange[0].toISOString()
            params["end_date"] = moment(filter.dateRange[1]).add(1, 'days').toISOString()
        }
    }
    return await customFetch(`admin/sale?${new URLSearchParams(params)}`)

} 




export const addSale = async (req: SaleReq) => {
    return await customFetch(`admin/sale`, {
        method: "POST",
        body: JSON.stringify(req)
    })
}

export const editSale = async (id:string, req: SaleReq) => {
    return await customFetch(`admin/sale/${id}`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteSale = async (id:string) => {
    return await customFetch(`admin/sale/${id}`, {
        method: "DELETE",
    })
}

export const getSaleDetail = async (id: string) => {
    return await customFetch(`admin/sale/${id}`)
}
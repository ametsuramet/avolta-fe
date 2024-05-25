import { AccountFilter, AccountReq } from "@/model/account";
import { PaginationReq } from "@/objects/pagination";
import { customFetch } from "@/utils/helper";
import moment from "moment";
import { DateRange } from "rsuite/esm/DateRangePicker";

export const deleteAccount = async (uuid: string) => {
    return await customFetch(`admin/account${uuid}`, {
        method: "DELETE",
    })
}

export const getAccountDetail = async (uuid: string) => {
    return await customFetch(`admin/account${uuid}`)

}
export const getAccounts = async (pagination: PaginationReq, filter?: AccountFilter) => {
    const params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),

    };
    if (pagination.search) {
        params["search"] = pagination.search
    }

    if (filter) {
        if (filter.type) {
            params["type"] = filter.type
        }
    
        if (filter.isTax != null) {
            params["is_tax"] = filter.isTax ? "1" : "0"
        }
        if (filter.cashflowGroup) {
            params["cashflow_group"] = filter.cashflowGroup
        }
        if (filter.cashflowSubgroup) {
            params["cashflow_sub_group"] = filter.cashflowSubgroup
        }
        if (filter.category) {
            params["category"] = filter.category
        }
    }
 
    return await customFetch(`admin/account?${new URLSearchParams(params)}`)
}
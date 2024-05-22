import { CompanyReq } from "@/model/company";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"





export const editCompany = async (req: CompanyReq) => {
    return await customFetch(`admin/company`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteCompany = async (id:string) => {
    return await customFetch(`admin/company`, {
        method: "DELETE",
    })
}

export const getCompanyDetail = async () => {
    return await customFetch(`admin/company`)
}
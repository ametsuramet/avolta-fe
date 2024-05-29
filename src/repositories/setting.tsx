import { SettingReq } from "@/model/setting";
import { PaginationReq } from "@/objects/pagination"
import { customFetch } from "@/utils/helper"





export const editSetting = async (req: SettingReq) => {
    return await customFetch(`admin/setting`, {
        method: "PUT",
        body: JSON.stringify(req)
    })
}

export const deleteSetting = async (id:string) => {
    return await customFetch(`admin/setting`, {
        method: "DELETE",
    })
}

export const getSettingDetail = async () => {
    return await customFetch(`admin/setting`)
}
export const getAutoNumber = async () => {
    return await customFetch(`admin/setting/autonumber`)
}
export const getIncentiveAutoNumber = async () => {
    return await customFetch(`admin/setting/incentive/autonumber`)
}
export const getPayRollReportAutoNumber = async () => {
    return await customFetch(`admin/setting/pay_roll_report/autonumber`)
}
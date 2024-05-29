import { PayRoll } from "./pay_roll"

export interface PayRollReport {
    id: string
    description: string
    report_number: string
    user_id: string
    user_name: string
    start_date: string
    end_date: string
    status: string
    grand_total_take_home_pay: number
    items: PayRollItem[]
}
export interface PayRollReportReq {
    description: string
    report_number: string
    user_id?: string
    start_date: string
    shop_ids: string[]
    end_date: string
    status?: string
}
export interface EditPayRollReportReq {
    description: string
    status?: string
}
// export interface IncentiveEditItemReq {
//     sick_leave: number
//     other_leave: number
//     absent: number

// }

export interface PayRollReportFilter {

    download?: boolean | null
}


export interface PayRollItem {
    id: string
    total_take_home_pay: number
    total_reimbursement: number
    employee_name: string
    employee_id: string
    employee_phone: string
    employee_email: string
    employee_identity_number: string
    bank_account_number: string
    bank_name: string
    bank_code: string
    bank_id: string
    pay_roll: PayRoll
    status: string
}
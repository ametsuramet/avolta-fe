import { DateRange } from "rsuite/esm/DateRangePicker"
import { Transaction } from "./transaction"

export interface Reimbursement {
    id: string
    name: string
    date: string
    notes: string
    remarks: string
    total: number
    balance: number
    status: string
    employee_id: string
    employee_name: string
    attachment: string
    items: ReimbursementItem[]
    transactions: Transaction[]
    attachments: string[]
}
export interface ReimbursementItem {
    id: string
    amount: number
    notes: string
    attachments: string[]
}
export interface ReimbursementItemReq {
    amount: number
    notes: string
    reimbursement_id: string
    files: string
}
export interface ReimbursementReq {
    name: string
    date: string
    employee_id: string
}




export interface ReimbursementFilter  {
    dateRange?: DateRange | null
    jobTitleID?: string | null
    employeeIDs?: string | null
    employeeID?: string | null
    download?: boolean  | null
    status?: string | null
  }
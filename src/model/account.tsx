import { Transaction } from "./transaction"

export interface Account {
    id: string
    name: string
    type: string
    category: string
    cashflow_group: string
    cashflow_subgroup: string
    code: string
    color?: string
    credit: number
    debit: number
    balance: number
    is_tax: boolean
    is_deletable: boolean
    cashflow_group_label: string
    cashflow_subgroup_label: string
    type_label?: string
    is_cogs?: boolean
}

export interface AccountReq {
    name: string
    type: string
    category: string
    cashflow_group: string
    cashflow_subgroup: string
    code: string
    is_tax: boolean
}

export interface AccountFilter {
    type?: string
    order?: string
    category?: string
    categoryId?: string
    cashflowGroup?: string
    cashflowSubgroup?: string
    isTax?: boolean
}

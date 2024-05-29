import { DateRange } from "rsuite/esm/DateRangePicker"
import { Transaction } from "./transaction"

export interface PayRoll {
  id: string
  pay_roll_number: string
  title: string
  notes: string
  employee_id: string
  employee_name: string
  start_date: string
  end_date: string
  items: PayRollItem[]
  is_gross_up: boolean
  is_effective_rate_average: boolean
  total_income: number
  total_reimbursement: number
  total_deduction: number
  total_tax: number
  tax_cost: number
  net_income: number
  net_income_before_tax_cost: number
  take_home_pay: number
  total_payable: number
  tax_allowance: number
  take_home_pay_counted: string
  take_home_pay_reimbursement_counted: string
  status: string
  transactions: Transaction[]
  costs: PayRollCost[]
}
export interface PayRollReq {
  title: string
  notes: string
  pay_roll_number: string
  employee_id: string
  start_date: string
  end_date: string
  is_gross_up?: boolean
  is_effective_rate_average?: boolean
}

export interface PayRollItem {
  id: string
  item_type: string
  title: string
  notes: string
  is_default: boolean
  is_deductible: boolean
  is_tax: boolean
  tax_auto_count: boolean
  is_tax_cost: boolean
  is_tax_allowance: boolean
  amount: number
  tariff: number

}
export interface PayRollItemReq {
  pay_roll_id: string
  reimbursement_id?: string
  item_type: string
  title: string
  notes: string
  is_default: boolean
  is_deductible: boolean
  is_tax: boolean
  tax_auto_count: boolean
  is_tax_cost: boolean
  is_tax_allowance: boolean
  amount: number
}
export interface PayRollPaymentReq{
  transaction_ref_id: string
  date: string
  amount: number
  account_destination_id: string
  description: string
}


export interface PayRollCost {
  id: string
  description: string
  amount: number
  tariff: number
  bpjs_tk_jht: boolean
  bpjs_tk_jp: boolean
  debt_deposit: boolean
}


export interface PayRollFilter {
  dateRange?: DateRange | null
  employeeIDs?: string | null
  employeeID?: string | null
  download?: boolean | null
  skip_items?: boolean | null
  unreported?: boolean | null
  orderBy?: string | null
}
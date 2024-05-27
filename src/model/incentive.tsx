import { IncentiveShop } from "./incentive_shop"
import { Sale } from "./sale"

export interface Incentive {
    id: string
    incentive_report_id: string
    employee_id: string
    employee_name: string
    total_sales: number
    total_included_sales: number
    total_excluded_sales: number
    total_incentive: number
    total_incentive_bruto: number
    sick_leave: number
    other_leave: number
    absent: number
    sales: Sale[]
    summaries: IncentiveSummary[]
    incentive_shops: IncentiveShop[]
}
export interface IncentiveReq {
    incentive_report_id: string
    employee_id: string
    employee_name: string
    total_sales: string
    total_included_sales: string
    total_excluded_sales: string
    total_incentive: string
    total_incentive_bruto: string
    sick_leave: string
    other_leave: string
    absent: string
}

export interface IncentiveFilter {
    product_category_id?: string | null
    shop_id?: string | null
    incentive_report_id?: string | null
    download?: boolean | null
}

export interface IncentiveSummary {
    id: string
    shop_id: string
    name: string
    shop_name: string
    total: number
    commission_percent: number
    total_comission: number
  }
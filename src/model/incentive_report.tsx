import { Incentive } from "./incentive"

export interface IncentiveReport {
    id: string
    description: string
    report_number: string
    user_id: string
    user_name: string
    start_date: string
    end_date: string
    status: string
    incentives: Incentive[]
}
export interface IncentiveReportReq {
    description: string
    report_number: string
    user_id?: string
    start_date: string
    shop_ids: string[]
    end_date: string
    status?: string
}

export interface IncentiveReportFilter {
    product_category_id?: string | null
    shop_id?: string | null
    download?: boolean | null
}
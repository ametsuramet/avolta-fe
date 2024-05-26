import { Sale } from "./sale"

export interface IncentiveShop {
    id: string
    shop_id: string
    shop_name: string
    incentive_id: string
    total_sales: number
    total_included_sales: number
    total_excluded_sales: number
    total_incentive: number
}
export interface IncentiveShopReq {
    shop_id: string
    shop_name: string
    incentive_id: string
    total_sales: number
    total_included_sales: number
    total_excluded_sales: number
    total_incentive: number
}

export interface IncentiveShopFilter {
    product_category_id?: string | null
    shop_id?: string | null
    download?: boolean | null
}
export interface IncentiveSetting {
  category_name: any
  id: string
  shop_id: string
  shop_name: string
  product_category_id: string
  product_category_name: string
  minimum_sales_target: number
  maximum_sales_target: number
  minimum_sales_commission: number
  maximum_sales_commission: number
  sick_leave_threshold: number
  other_leave_threshold: number
  absent_threshold: number
}
export interface IncentiveSettingReq {
    shop_id: string
    product_category_id: string
    minimum_sales_target: number
    maximum_sales_target: number
    minimum_sales_commission: number
    maximum_sales_commission: number
    sick_leave_threshold: number
    other_leave_threshold: number
    absent_threshold: number
}

export interface IncentiveSettingFilter {
    product_category_id?: string | null
    shop_id?: string | null
    download?: boolean | null
}
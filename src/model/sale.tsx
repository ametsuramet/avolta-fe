import { DateRange } from "rsuite/esm/DateRangePicker"

export interface Sale {
    id: string
    date: string
    code: string
    product_id: string
    product_name: string
    product_sku: string
    shop_id: string
    shop_name: string
    qty: number
    price: number
    sub_total: number
    discount: number
    discount_amount: number
    total: number
    employee_id: string
    employee_name: string
    employee_picture: string
}

export interface SaleReq {
    date: string
    code?: string
    product_id: string
    shop_id: string
    qty: number
    price: number
    sub_total: number
    discount: number
    discount_amount: number
    total: number
    employee_id: string
}


export interface SaleFilter {
    dateRange?: DateRange | null
    product_category_id?: string | null
    employee_id?: string | null
    shop_id?: string | null
    download?: boolean | null
}


import { DateRange } from "rsuite/esm/DateRangePicker"

export interface Pagination {
    next: number
    page: number
    prev: number
    total_pages: number
    total_records: number
}

export interface PaginationReq {
    page: number
    limit: number
    search?: string
    type?: string
    order?: string
    category?: string
    categoryId?: string
    cashflowGroup?: string
    cashflowSubgroup?: string
    product_id?: string | null | undefined
    store_id?: string | null | undefined
    merchant_id?: string | null | undefined
    dateRange?: DateRange | null
    isTax?: boolean
    isSell?: boolean
    isBuy?: boolean
    isMaterial?: boolean | null
    isManufacture?: boolean
}
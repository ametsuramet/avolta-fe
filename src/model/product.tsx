export interface Product {
  id: string
  name: string
  product_category_name: string
  product_category_id: string
  selling_price: number
  sku: string
  barcode: string
}
export interface ProductReq {
  name: string
  sku: string
  barcode: string
  selling_price: number
  product_category_id?: string | null
}
export interface ProductFilter {
  product_category_id?: string | null
  product_id?: string | null
  download?: boolean | null
}

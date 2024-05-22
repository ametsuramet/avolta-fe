import { NullString } from "@/objects/null_object"

export interface Transaction {
  date: string
  uuid: string
  code?: string
  description: string
  notes: string
  credit: number
  debit: number
  amount: number
  sum?: number
  is_income: boolean
  is_expense: boolean
  is_journal: boolean
  is_account_receivable: boolean
  is_account_payable: boolean
  account_source_id: string
  account_destination_id: string
  account_source_name: string
  account_destination_name: string
  journal_id: string
  invoice_id: string
  process_id: string
  return_id: string
  process_item_id: string
  process_output_id: string
  bill_id: string
  is_deleted: boolean
  is_edited: boolean
  is_invoice_payment: boolean
  is_bill_payment: boolean
  employee_id: string
  images: TransactionImage[]
  account_source_type: string
  account_destination_type: string
  account_payment_debt_id: string
  merchant_sale_report_id: string
  merchant_id: string
  tax_payment_id: string
  pay_roll_id: string
  reimbursement_id: string
  is_source_tax: boolean
  is_destination_tax: boolean
  pay_roll_payable_id: string
  is_editable: boolean
  tags: any[]
  product_serial_number_id: string
  is_secondary_tax: boolean
  
}


export interface PaymentReq {
  description: string
  notes: string
  credit: number
  debit: number
  amount: number
  date: string
  is_income: boolean
  is_expense: boolean
  account_source_id: NullString
  account_destination_id: NullString
  invoice_id: NullString
  bill_id: NullString
  is_invoice_payment: boolean
  is_bill_payment: boolean
}
export interface TransactionReq {
  uuid?: NullString | null
  description: string
  notes: string
  credit: number
  debit: number
  amount: number
  date: string
  is_income: boolean
  is_expense: boolean
  is_journal: boolean
  is_account_receivable: boolean
  is_account_payable: boolean
  is_edited?: boolean
  is_deleted?: boolean
  account_source_id: NullString
  account_destination_id: NullString
  journal_id: NullString
  invoice_id: NullString
  process_id: NullString
  process_item_id: NullString
  process_output_id: NullString
  bill_id: NullString
  is_invoice_payment: boolean
  is_bill_payment: boolean
  employee_id: NullString
  account_source_type: string
  account_destination_type: string
  account_payment_debt_id: NullString
  merchant_sale_report_id: NullString
  tax_payment_id: NullString
  pay_roll_id: NullString
  reimbursement_id: NullString
  is_source_tax: boolean
  is_destination_tax: boolean
  pay_roll_payable_id: NullString
  product_serial_number_id: NullString
  is_secondary_tax: boolean
  transaction_type?: string
}

export interface TransactionImage {
  uuid: string
  path: string
  url: string
  description: string
  transaction_id: string
}

export interface Setting {
    id: string
    pay_roll_auto_number: boolean
    pay_roll_auto_format: string
    pay_roll_static_character: string
    pay_roll_auto_number_character_length: number
    pay_roll_payable_account_id: string | null
    pay_roll_expense_account_id: string | null
    pay_roll_asset_account_id: string | null
    pay_roll_tax_account_id: string | null
    is_effective_rate_average: boolean
    is_gross_up: boolean
}


export interface SettingReq {
    pay_roll_auto_number: boolean
    pay_roll_auto_format: string
    pay_roll_static_character: string
    pay_roll_auto_number_character_length: number
    pay_roll_payable_account_id: string
    pay_roll_expense_account_id: string
    pay_roll_asset_account_id: string
    pay_roll_tax_account_id: string
    is_effective_rate_average: boolean
    is_gross_up: boolean
}

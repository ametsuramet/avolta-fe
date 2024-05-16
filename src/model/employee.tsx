import { DateRange } from "rsuite/esm/DateRangePicker"

export interface Employee {
  id: string
  email: string
  first_name: string
  middle_name: string
  last_name: string
  username: string
  phone: string
  job_title: string
  grade: string
  address: string
  picture?: string
  cover: string
  date_of_birth?: string
  employee_identity_number: string
  full_name: string
  basic_salary: number
  positional_allowance: number
  transport_allowance: number
  meal_allowance: number
  non_taxable_income_level_code: string
  tax_payer_number: string
  gender: string
  organization_name: string
  started_work?: string
}

export interface EmployeeFilter  {
  ageRange?: DateRange | null
  jobTitleID?: string | null
  gender?: string | null
  startedWork?: Date  | null
}
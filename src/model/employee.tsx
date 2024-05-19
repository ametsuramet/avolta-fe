import { NullString, NullTime } from "@/objects/null_object"
import { DateRange } from "rsuite/esm/DateRangePicker"
import { Schedule } from "./schedule"

export interface Employee {
  id: string
  email: string
  first_name: string
  middle_name: string
  last_name: string
  username: string
  phone: string
  job_title: string
  job_title_id: string
  grade: string
  address: string
  picture?: string
  picture_url?: string
  cover: string
  date_of_birth?: string
  employee_identity_number: string
  employee_code: string
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
  schedules:  Schedule[]
}

export interface EmployeeFilter  {
  ageRange?: DateRange | null
  jobTitleID?: string | null
  gender?: string | null
  startedWork?: Date  | null
  startedWorkEnd?: Date  | null
  download?: boolean  | null
}


export interface EmployeeReq {
  email: string
  full_name: string
  phone: string
  picture?: NullString
  job_title_id: NullString
  address: string
  date_of_birth?: NullTime
  employee_identity_number: string
  employee_code?: string
  basic_salary: number
  positional_allowance: number
  transport_allowance: number
  meal_allowance: number
  non_taxable_income_level_code: string
  tax_payer_number: string
  gender: string
  started_work?: NullTime
}


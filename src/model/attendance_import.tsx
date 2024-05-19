import { Profile } from "./auth"

export interface AttendanceBulkImport {
  id: string
  file_name: string
  user: Profile
  date_imported_at: string
  data: AttendanceImport[]
  status: string
}


export interface AttendanceImport {
  id: string
  sequence_number: number
  fingerprint_id: string
  employee_code: string
  employee_name: string
  system_employee_name: string
  system_employee_id: string
  items: AttendanceImportItem[]
}

export interface AttendanceImportItem {
  id: string
  sequence_number: number
  day: string
  date: string
  working_hour: string
  activity: string
  duty_on: string
  duty_off: string
  late_in: string
  early_departure: string
  effective_hour: string
  overtime: string
  notes: string
}

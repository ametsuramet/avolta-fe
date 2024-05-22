import { DateRange } from "rsuite/esm/DateRangePicker"

export interface Leave {
  id: string
  name: string
  request_type: string
  leave_category_id: string
  leave_category: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  employee_id: string
  employee_name: string
  employee_picture: string
  attachment_url: string
  description: string
  status: string
  remarks: string
}

export interface LeaveReq {
  name?: string
  request_type: string
  leave_category_id: string
  start_date: string
  end_date?: string | null
  start_time?: string | null
  end_time?: string | null
  employee_id: string
  description: string
  attachment?: string | null
  status?: string | null
}


export interface LeaveFilter  {
  dateRange?: DateRange | null
  status?: string | null
  employeeIDs?: string | null
  employeeID?: string | null
  download?: boolean  | null
}
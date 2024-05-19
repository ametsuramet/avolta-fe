import { DateRange } from "rsuite/esm/DateRangePicker"
import { Employee } from "./employee"

export interface Schedule {
    id: string
    name: string
    schedule_type: string
    week_day: string
    week_days: string[]
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    sunday: boolean
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    employees: Employee[]
}
export interface ScheduleReq {
    name?: string
    schedule_type: string
    week_day?: string
    start_date?: string
    end_date?: string
    start_time?: string
    end_time?: string
    sunday?: boolean
    monday?: boolean
    tuesday?: boolean
    wednesday?: boolean
    thursday?: boolean
    friday?: boolean
    saturday?: boolean
    employee_ids?: string[]
}



export interface ScheduleFilter {
    dateRange?: DateRange | null
}



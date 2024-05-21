export interface PayRoll {
  id: string
  title: string
  notes: string
  employee_id: string
  employee_name: string
  start_date: string
  end_date: string
}
export interface PayRollReq {
  title: string
  notes: string
  employee_id: string
  start_date: string
  end_date: string
}

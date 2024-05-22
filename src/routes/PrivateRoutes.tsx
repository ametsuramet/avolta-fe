import { FC, useEffect, useState } from "react"
import { Route, Routes, useParams } from "react-router-dom"
import Home from "../pages/Home"
import EmployeePage from "@/pages/Employee"
import NotFound from "@/pages/NotFound"
import EmployeeDetail from "@/pages/EmployeeDetail"
import AttendancePage from "@/pages/Attendance"
import SchedulePage from "@/pages/Schedule"
import JobTitlePage from "@/pages/JobTitle"
import AttendanceImportDetail from "@/pages/AttendanceImportDetail"
import OrganizationPage from "@/pages/Organization"
import LeaveCategoryPage from "@/pages/LeaveCategory"
import RolePage from "@/pages/Role"
import UserPage from "@/pages/User"
import LeavePage from "@/pages/Leave"
import PayRollPage from "@/pages/PayRoll"
import PayRollDetail from "@/pages/PayRollDetail"
import CompanyPage from "@/pages/Company"
import SystemPage from "@/pages/System"


interface PrivateRoutesProps { }

const PrivateRoutes: FC<PrivateRoutesProps> = ({ }) => {
   
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/employee' element={<EmployeePage />} />
            <Route path='/employee/:employeeId' element={<EmployeeDetail />} />
            <Route path='/attendance' element={<AttendancePage />} />
            <Route path='/schedule' element={<SchedulePage />} />
            <Route path='/job_title' element={<JobTitlePage />} />
            <Route path='/attendance/import/:importId' element={<AttendanceImportDetail />} />
            <Route path='/organization' element={<OrganizationPage />} />
            <Route path='/leave_category' element={<LeaveCategoryPage />} />
            <Route path='/pay_roll' element={<PayRollPage />} />
            <Route path='/pay_roll/:payRollId' element={<PayRollDetail />} />
            <Route path='/leave' element={<LeavePage />} />
            <Route path='/role' element={<RolePage />} />
            <Route path='/user' element={<UserPage />} />
            <Route path='/company' element={<CompanyPage />} />
            <Route path='/system' element={<SystemPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default PrivateRoutes
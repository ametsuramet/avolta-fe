import { FC, useEffect, useState } from "react"
import { Route, Routes, useParams } from "react-router-dom"
import Home from "../pages/Home"
import EmployeePage from "@/pages/Employee"
import NotFound from "@/pages/NotFound"
import EmployeeDetail from "@/pages/EmployeeDetail"
import AttendancePage from "@/pages/Attendance"
import SchedulePage from "@/pages/Schedule"
import JobTitlePage from "@/pages/JobTitle"


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
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default PrivateRoutes
import { FC } from "react"
import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import EmployeePage from "@/pages/Employee"


interface PrivateRoutesProps { }

const PrivateRoutes: FC<PrivateRoutesProps> = ({ }) => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/employee' element={<EmployeePage />} />
        </Routes>
    )
}

export default PrivateRoutes
import DashboardLayout from '@/components/dashboard_layout';
import type { FC } from 'react';
import { LuContact } from 'react-icons/lu';

interface EmployeePageProps { }

const EmployeePage: FC<EmployeePageProps> = ({ }) => {
    return (
        <DashboardLayout>
            <h1><LuContact /> HOME</h1>
        </DashboardLayout>
    );
}
export default EmployeePage;
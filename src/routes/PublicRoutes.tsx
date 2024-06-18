import type { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import NotFound from '@/pages/NotFound';
import Register from '@/pages/Register';
import Verification from '@/pages/Verification';

interface PublicRoutesProps { }

const PublicRoutes: FC<PublicRoutesProps> = ({ }) => {
    return (
        <Routes>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='verification/:token' element={<Verification />} />
            {/* <Route path="*"  element={<NotFound />} /> */}
            <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
    );
}
export default PublicRoutes;
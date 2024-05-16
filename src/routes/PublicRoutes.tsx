import type { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import NotFound from '@/pages/NotFound';

interface PublicRoutesProps { }

const PublicRoutes: FC<PublicRoutesProps> = ({ }) => {
    return (
        <Routes>
            <Route path='login' element={<Login />} />
            {/* <Route path="*"  element={<NotFound />} /> */}
            <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
    );
}
export default PublicRoutes;
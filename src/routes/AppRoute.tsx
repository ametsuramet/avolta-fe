import { type FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';


interface AppRouteProps { }

export const AppRoute: FC<AppRouteProps> = ({ }) => {

    const token = localStorage.getItem("token");
    return (<BrowserRouter>
        <Routes>
                {token
                    ? <Route path="/*" element={<PrivateRoutes />} />
                    : <Route path="/*" element={<PublicRoutes />} />}
        </Routes>
    </BrowserRouter>);
};

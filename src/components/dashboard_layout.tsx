import { useEffect, useState, type FC, type ReactNode } from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import Footer from './footer';
import { getStoragePermissions } from '@/utils/helper';
import NoAccess from './no_access';

interface DashboardLayoutProps {
    children: ReactNode
    noPadding?: boolean
    permission?: string;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, noPadding, permission }) => {
    const [permissions, setPermissions] = useState<string[]>([]);

    useEffect(() => {
        getStoragePermissions()
            .then(v => setPermissions(v))
    }, []);

    return (<section className="content-wrapper flex h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
            <Topbar />
            <div className="flex-1 overflow-y-auto">
                <div className={noPadding ? `` : 'p-6'}>
                    {(permission != null && !permissions.includes(permission!) ? <NoAccess /> : children)}
                </div>
            </div>
            <Footer />
        </div>
    </section>);
}
export default DashboardLayout;
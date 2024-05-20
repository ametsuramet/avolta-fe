import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';

interface NoAccessProps { }

const NoAccess: FC<NoAccessProps> = ({ }) => {
    const nav = useNavigate()
    return (
        <div className='flex h-screen bg-white flex-col justify-center items-center' >
            <img src="/images/denied.gif" alt="" />
            <small className='text-right mb-4'>Anda tidak punya akses ke halaman ini, silakan hubungi admin utama</small>
            <Button className='w-60' onClick={() => nav(-1)}>Kembali</Button>
        </div>
    );
}
export default NoAccess;
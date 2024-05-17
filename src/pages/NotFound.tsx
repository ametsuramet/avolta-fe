import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';

interface NotFoundProps { }

const NotFound: FC<NotFoundProps> = ({ }) => {
    const nav = useNavigate()
    return (
        <div className='flex h-screen bg-white flex-col justify-center items-center' >
            <img src="/images/404.gif" alt="" />
            <Button className='w-60' onClick={() => nav(-1)}>Kembali</Button>
        </div>
    );
}
export default NotFound;
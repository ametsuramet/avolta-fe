import { LoadingContext } from '@/objects/loading_context';
import { verification } from '@/repositories/auth';
import { errorToast } from '@/utils/helperUi';
import { useContext, useEffect, useState, type FC } from 'react';
import { Link, useParams } from 'react-router-dom';

interface VerificationProps { }

const Verification: FC<VerificationProps> = ({ }) => {
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const { token } = useParams()
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (token) {
            setIsLoading(true)
            verification(token)
                .then(v => v.json())
                .then(v => setMsg(v.message))
                .catch(err => errorToast(`${err}`))
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, []);

    return (
        <div className='relative bg-gradient-to-b from-white to-blue-300'>
            <img src="/images/bg.jpg" className='absolute h-full w-full object-cover opacity-40' />
            <img src="/images/logo araya.png" className='absolute top-8 left-8 w-36' />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className='text-center w-[450px] p-12 min-h-10 bg-white shadow-sm z-50 rounded-lg'>
                    <h3 className=' text-3xl font-bold mb-4 text-black' >Verifikasi User</h3>
                    {isLoading &&
                        <p>
                            Silahkan Menunggu ....
                        </p>
                    }
                    {msg && <div>
                        <h3>{msg}</h3>
                        <Link className='text-blue-400' to="/login">Kembali ke Login</Link>
                    </div>}
                </div>
            </div>
        </div>
    );
}
export default Verification;
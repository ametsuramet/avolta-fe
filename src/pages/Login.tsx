import { login } from '@/repositories/auth';
import { asyncSetStorage } from '@/utils/helper';
import { useState, type FC } from 'react';
import Swal from "sweetalert2";

interface LoginProps { }

const Login: FC<LoginProps> = ({ }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fcmToken, setFcmToken] = useState("");
    const [device, setDevice] = useState("web");
    return (
        <div className='relative bg-gradient-to-b from-white to-blue-300'>
            <img src="/images/bg.jpg" className='absolute h-full w-full object-cover opacity-40' />
            <img src="/images/logo-avolta.png" className='absolute top-8 left-8 w-36' />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className='text-center w-[450px] p-12 min-h-10 bg-white shadow-sm z-50 rounded-lg'>
                    <h3 className=' text-3xl font-bold mb-4 text-black' >Masuk</h3>
                    <p className=' text-gray-400'>Silakan masuk menggunakan akun perusahaan sebagai Admin atau Supervisor.</p>
                    <div className='text-left  mt-4'>
                        <label htmlFor="email" className='px-2'>Email <span className='required'>*</span></label>
                        <input value={email} onChange={(el) => setEmail(el.target.value)} type="text" className='form-control' placeholder='email@company.com' />
                    </div>
                    <div className='text-left  mt-4'>
                        <label htmlFor="password" className='px-2'>Password <span className='required'>*</span></label>
                        <input value={password} onChange={(el) => setPassword(el.target.value)} type="password" className='form-control' placeholder='****************' />
                    </div>

                    <button onClick={() =>
                        asyncSetStorage({ token: "INI TOKEN", permissions: [] })
                            .then(() => location.href = "/")
                        // login({ email, password, fcmToken, device })
                        //     .then(v => v.json())
                        //     .then(v => {
                        //         asyncSetStorage({token: v.token, permissions: []}).then(() => location.href = "/")
                        //     })
                        //     .catch(error => Swal.fire(`Attention`, `${error}`, 'error'))
                    } className='text-white mt-16 bg-blue-300 hover:bg-blue-700 py-2 px-8 w-full font-semibold rounded-xl'>Login</button>
                </div>
            </div>
        </div>
    );
}
export default Login;
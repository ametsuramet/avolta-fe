import { LoadingContext } from '@/objects/loading_context';
import { register } from '@/repositories/auth';
import { errorToast, successToast } from '@/utils/helperUi';
import { useContext, useState, type FC } from 'react';
import { FaCircleNotch } from 'react-icons/fa6';
import Swal from 'sweetalert2';

interface RegisterProps { }

const Register: FC<RegisterProps> = ({ }) => {
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    return (
        <div className='relative bg-gradient-to-b from-white to-blue-300'>
            <img src="/images/bg.jpg" className='absolute h-full w-full object-cover opacity-40' />
            <img src="/images/logo-avolta.png" className='absolute top-8 left-8 w-36' />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className='text-center w-[450px] p-12 min-h-10 bg-white shadow-sm z-50 rounded-lg'>
                    <h3 className=' text-3xl font-bold mb-4 text-black' >Daftar</h3>
                    <p className=' text-gray-400'>Silakan isi data diri anda sebagai super admin perusahaan.</p>
                    <div className='text-left  mt-4'>
                        <label htmlFor="fullName" className='px-2'>Nama Lengkap <span className='required'>*</span></label>
                        <input value={fullName} onChange={(el) => setFullName(el.target.value)} type="text" className='form-control' placeholder='Nama Lengkap' />
                    </div>
                    <div className='text-left  mt-4'>
                        <label htmlFor="email" className='px-2'>Email <span className='required'>*</span></label>
                        <input value={email} onChange={(el) => setEmail(el.target.value)} type="email" className='form-control' placeholder='email@company.com' />
                    </div>
                    <div className='text-left  mt-4'>
                        <label htmlFor="password" className='px-2'>Password <span className='required'>*</span></label>
                        <input value={password} onChange={(el) => setPassword(el.target.value)} type="password" className='form-control' placeholder='****************' />
                    </div>
                    <button
                        disabled={isLoading}
                        onClick={async () => {
                            try {
                                setIsLoading(true)
                                await register({
                                    full_name: fullName,
                                    email: email,
                                    password: password,
                                    fcmToken: '',
                                    device: 'web'
                                })
                                successToast("Pendaftaran berhasil, Silakan cek email anda")
                            } catch (error) {
                                errorToast( `${error}`)
                            } finally {
                                setIsLoading(false)
                            }


                        }
                        } className={`text-white mt-16 inline-flex items-center justify-center bg-blue-300 hover:bg-blue-700 py-2 px-8 w-full font-semibold rounded-xl ${isLoading && 'disabled:cursor-not-allowed'}`}>{isLoading && <FaCircleNotch className='animate-spin mr-2' />} Kirim Data Pendaftaran</button>

                </div>
            </div>
        </div>
    );
}
export default Register;
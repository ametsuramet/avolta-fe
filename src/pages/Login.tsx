import InlineForm from '@/components/inline_form';
import { Profile } from '@/model/auth';
import { Company } from '@/model/company';
import { LoadingContext } from '@/objects/loading_context';
import { createCompany, getProfile, login } from '@/repositories/auth';
import { asyncSetCompanyIDStorage, asyncSetStorage } from '@/utils/helper';
import { useContext, useState, type FC } from 'react';
import { FaCircleNotch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

interface LoginProps { }

const Login: FC<LoginProps> = ({ }) => {
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [password, setPassword] = useState("");
    const [fcmToken, setFcmToken] = useState("");
    const [device, setDevice] = useState("web");
    const [token, setToken] = useState("");

    const [name, setName] = useState("")
    const [logo, setLogo] = useState("")
    const [cover, setCover] = useState("")
    const [legalEntity, setLegalEntity] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [fax, setFax] = useState("")
    const [address, setAddress] = useState("")
    const [contactPerson, setContactPerson] = useState("")
    const [contactPersonPosition, setContactPersonPosition] = useState("")
    const [createCompanyShow, setCreateCompanyShow] = useState(false);
    const [companyID, setCompanyID] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectCompanyShow, setSelectCompanyShow] = useState(false);

    const renderCompany = () => (<div>
        <InlineForm title="Nama Perusahaan" >
            <input className='form-control' value={name ?? ""} onChange={(el) => {
                setName(el.target.value)
            }} />
        </InlineForm>
        <InlineForm title="Alamat Perusahaan" style={{ alignItems: 'start' }} >
            <textarea className='form-control' value={address ?? ""} rows={9} onChange={(el) => {
                setAddress(el.target.value)
            }} />
        </InlineForm>
        <InlineForm title="Email" >
            <input className='form-control' value={email ?? ""} onChange={(el) => {
                setEmail(el.target.value)
            }} />
        </InlineForm>
        <InlineForm title="Telepon" >
            <input className='form-control' value={phone ?? ""} onChange={(el) => {
                setPhone(el.target.value)
            }} />
        </InlineForm>
        <InlineForm title="Fax" >
            <input className='form-control' value={fax ?? ""} onChange={(el) => {
                setFax(el.target.value)
            }} />
        </InlineForm>
        <InlineForm title="Penanggung Jawab" >
            <input className='form-control' value={contactPerson ?? ""} onChange={(el) => {
                setContactPerson(el.target.value)
            }} />
        </InlineForm>
        <InlineForm title="Jabatan Penanggung Jawab" >
            <input className='form-control' value={contactPersonPosition ?? ""} onChange={(el) => {
                setContactPersonPosition(el.target.value)
            }} />
        </InlineForm>
        <button
            disabled={isLoading}
            onClick={async () => {
                try {
                    setIsLoading(true)
                    let resp = await createCompany({
                        name,
                        logo,
                        cover,
                        legal_entity: '',
                        email,
                        phone,
                        fax,
                        address,
                        contact_person: contactPerson,
                        contact_person_position: contactPersonPosition,
                        tax_payer_number: ''
                    }, token)
                    let respJson = await resp.json()
                    await asyncSetCompanyIDStorage(respJson.last_id)
                    saveToken()
                } catch (error) {
                    Swal.fire(`Attention`, `${error}`, 'error')
                } finally {
                    setIsLoading(false)
                }


            }
            } className={`text-white mt-16 inline-flex items-center justify-center bg-blue-300 hover:bg-blue-700 py-2 px-8 w-full font-semibold rounded-xl ${isLoading && 'disabled:cursor-not-allowed'}`}>{isLoading && <FaCircleNotch className='animate-spin mr-2' />} Simpan</button>
    </div>)

    const saveToken = async () => {
        await asyncSetStorage({ token, permissions: [], profile: null })
        const profileRes = await getProfile()
        const profileResJson = await profileRes.json()
        const permissions = profileResJson.data.permissions as string[]
        const profile = profileResJson.data as Profile[]
        await asyncSetStorage({ token, permissions, profile })
        location.href = "/"
    }

    const renderLogin = () => {
        if (createCompanyShow) {
            return (<div className=' w-[600px] p-12 min-h-10 bg-white shadow-sm z-50 rounded-lg'>
                <h6 className=' text-xl font-bold  text-black' >Anda Belum Mempunyai Data Perusahaan</h6>
                <p className='mb-4'>Silakan lengkapi data perusahaan anda</p>
                {renderCompany()}
            </div>)
        }
        if (selectCompanyShow) {
            return <div className=' w-[600px] p-12 min-h-10 bg-white shadow-sm z-50 rounded-lg'>
                 <h6 className=' text-xl font-bold  text-black mb-4' >Pilih Perusahaan</h6>
                 <ul>
                    {companies.map(e => (<li className=' hover:bg-gray-100 cursor-pointer py-2 px-4 rounded-lg'  onClick={async() => {
                        await asyncSetCompanyIDStorage(e.id)
                        saveToken()
                    }} key={e.id}>
                       <h4>{e.name}</h4> 
                       <p>{e.address}</p>
                    </li>))}
                 </ul>
            </div>
        }
        return <div className='text-center w-[450px] p-12 min-h-10 bg-white shadow-sm z-50 rounded-lg'>
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

            <button
                disabled={isLoading}
                onClick={async () => {
                    try {
                        setIsLoading(true)
                        const loginRes = await login({ email, password, fcmToken, device })

                        const loginResJson = await loginRes.json()
                        // console.log("loginResJson", loginResJson)
                        // return
                        setToken(loginResJson.token)

                        if (loginResJson.companies.length == 0) {
                            setCreateCompanyShow(true)
                        } else {
                            setCompanies(loginResJson.companies)
                            setSelectCompanyShow(true)
                        }

                    } catch (error) {
                        Swal.fire(`Attention`, `${error}`, 'error')
                    } finally {
                        setIsLoading(false)
                    }


                }
                } className={`text-white mt-16 inline-flex items-center justify-center bg-blue-300 hover:bg-blue-700 py-2 px-8 w-full font-semibold rounded-xl ${isLoading && 'disabled:cursor-not-allowed'}`}>{isLoading && <FaCircleNotch className='animate-spin mr-2' />} Login</button>

            <div className='mt-4'>  atau <Link className='text-blue-400' to="/register">Daftar disini</Link></div>
        </div>
    }
    return (
        <div className='relative bg-gradient-to-b from-white to-blue-300'>
            <img src="/images/bg.jpg" className='absolute h-full w-full object-cover opacity-40' />
            <img src="/images/logo araya.png" className='absolute top-8 left-8 w-36' />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                {renderLogin()}
            </div>
        </div>
    );
}
export default Login;
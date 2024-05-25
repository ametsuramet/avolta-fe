import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Company } from '@/model/company';
import { LoadingContext } from '@/objects/loading_context';
import { editCompany, getCompanyDetail } from '@/repositories/company';
import { TOKEN } from '@/utils/constant';
import { asyncLocalStorage } from '@/utils/helper';
import { successToast } from '@/utils/helperUi';
import { CameraIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { PiPictureInPictureThin } from 'react-icons/pi';
import { Button, Message, Panel, Uploader, toaster } from 'rsuite';
import Swal from 'sweetalert2';

interface CompanyPageProps { }

const CompanyPage: FC<CompanyPageProps> = ({ }) => {
    const [company, setCompany] = useState<Company | null>(null);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [editable, setEditable] = useState(false);


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
    const [taxPayerNumber, setTaxPayerNumber] = useState("")
    const [token, setToken] = useState("");

    useEffect(() => {
        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
        getDetail()
        setEditable(true)

    }, []);

    const getDetail = async () => {
        try {
            const resp = await getCompanyDetail()
            const respJson = await resp.json()
            setCompany(respJson.data)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (company) {
            setName(company.name)
            setAddress(company.address)
            setEmail(company.email)
            setPhone(company.phone)
            setFax(company.fax)
            setContactPerson(company.contact_person)
            setContactPersonPosition(company.contact_person_position)
            setTaxPayerNumber(company.tax_payer_number)
            setLegalEntity(company.legal_entity)
        }

    }, [company]);

    const update = async () => {
        try {
            const resp = await editCompany({
                ...company!,
                name,
                logo,
                cover,
                legal_entity: legalEntity,
                email,
                phone,
                fax,
                address,
                contact_person: contactPerson,
                contact_person_position: contactPersonPosition,
                tax_payer_number: taxPayerNumber,
            })
            const respJson = await resp.json()
            setCompany(respJson.data)
            successToast("Perusahaan berhasil diupdate")
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <DashboardLayout permission='menu_company'>
            <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Perusahaan"}</h3>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <Panel header="Data Perusahaan" bordered>
                        <InlineForm title="Nama Perusahaan" >
                            <input disabled={!editable} className='form-control' value={name ?? ""} onChange={(el) => {
                                setName(el.target.value)
                            }} />
                        </InlineForm>
                        <InlineForm title="Alamat Perusahaan" style={{ alignItems: 'start' }} >
                            <textarea disabled={!editable} className='form-control' value={address ?? ""} rows={9} onChange={(el) => {
                                setAddress(el.target.value)
                            }} />
                        </InlineForm>
                        <InlineForm title="Email" >
                            <input disabled={!editable} className='form-control' value={email ?? ""} onChange={(el) => {
                                setEmail(el.target.value)
                            }} />
                        </InlineForm>
                        <InlineForm title="Telepon" >
                            <input disabled={!editable} className='form-control' value={phone ?? ""} onChange={(el) => {
                                setPhone(el.target.value)
                            }} />
                        </InlineForm>
                        <InlineForm title="Fax" >
                            <input disabled={!editable} className='form-control' value={fax ?? ""} onChange={(el) => {
                                setFax(el.target.value)
                            }} />
                        </InlineForm>
                        <InlineForm title="Penanggung Jawab" >
                            <input disabled={!editable} className='form-control' value={contactPerson ?? ""} onChange={(el) => {
                                setContactPerson(el.target.value)
                            }} />
                        </InlineForm>
                        <InlineForm title="Jabatan Penanggung Jawab" >
                            <input disabled={!editable} className='form-control' value={contactPersonPosition ?? ""} onChange={(el) => {
                                setContactPersonPosition(el.target.value)
                            }} />
                        </InlineForm>
                        <InlineForm title="NPWP Perusahaan" >
                            <input disabled={!editable} className='form-control' value={taxPayerNumber ?? ""} onChange={(el) => {
                                setTaxPayerNumber(el.target.value)
                            }} />
                        </InlineForm>
                        <InlineForm title="NIB / SIUP / Izin Lainnya" >
                            <input disabled={!editable} className='form-control' value={legalEntity ?? ""} onChange={(el) => {
                                setLegalEntity(el.target.value)
                            }} />
                        </InlineForm>



                        <Button onClick={async () => {
                            update()
                        }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
                    </Panel>
                    <Panel header="Foto & Logo" bordered>
                        <InlineForm title="Foto" style={{ alignItems: 'start' }}>
                            <Uploader
                                fileListVisible={false}
                                listType="picture"
                                action={`${import.meta.env.VITE_API_URL}/admin/file/upload`}
                                onUpload={file => {
                                    setIsLoading(true);

                                }}
                                headers={{
                                    authorization: `Bearer ${token}`
                                }}
                                accept='image/*'
                                onSuccess={(response, file) => {
                                    setIsLoading(true);
                                    editCompany({
                                        ...company!,
                                        cover: response.data.path
                                    })
                                        .then(() => getDetail())
                                        .finally(() => {
                                            setIsLoading(false);
                                        })
                                    // toaster.push(<Message type="success">Uploaded successfully</Message>);
                                }}
                                onError={() => {
                                    setIsLoading(false);
                                    toaster.push(<Message type="error">Upload failed</Message>);
                                }}
                            >
                                <button style={{ width: 300, height: 300 }}>

                                    {company?.cover_url ? (
                                        <img src={company?.cover_url} width="100%" height="100%" />
                                    ) : (
                                        <CameraIcon className='w-36' style={{ fontSize: 80 }} />
                                    )}
                                </button>
                            </Uploader>
                        </InlineForm>
                        <InlineForm title="Logo" style={{ alignItems: 'start' }}>
                            <Uploader
                                fileListVisible={false}
                                listType="picture"
                                action={`${import.meta.env.VITE_API_URL}/admin/file/upload`}
                                onUpload={file => {
                                    setIsLoading(true);

                                }}
                                headers={{
                                    authorization: `Bearer ${token}`
                                }}
                                accept='image/*'
                                onSuccess={(response, file) => {
                                    setIsLoading(true);
                                    editCompany({
                                        ...company!,
                                        logo: response.data.path
                                    })
                                        .then(() => getDetail())
                                        .finally(() => {
                                            setIsLoading(false);
                                        })
                                    // toaster.push(<Message type="success">Uploaded successfully</Message>);
                                }}
                                onError={() => {
                                    setIsLoading(false);
                                    toaster.push(<Message type="error">Upload failed</Message>);
                                }}
                            >
                                <button style={{ width: 300, height: 300 }}>

                                    {company?.logo_url ? (
                                        <img src={company?.logo_url} width="100%" height="100%" />
                                    ) : (
                                        <CameraIcon className='w-36' style={{ fontSize: 80 }} />
                                    )}
                                </button>
                            </Uploader>
                        </InlineForm>
                    </Panel>
                </div>
            </div>

        </DashboardLayout>
    );
}
export default CompanyPage;
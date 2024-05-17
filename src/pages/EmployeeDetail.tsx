import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Employee } from '@/model/employee';
import { JobTitle } from '@/model/job_title';
import { LoadingContext } from '@/objects/loading_context';
import { editEmployee, getEmployeeDetail, getEmployees } from '@/repositories/employee';
import { getJobTitles } from '@/repositories/job_title';
import { asyncLocalStorage, getFullName, getStoragePermissions, setNullString, setNullTime } from '@/utils/helper';
import moment from 'moment';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { Button, Col, DatePicker, Message, Panel, Row, SelectPicker, Uploader, toaster } from 'rsuite';
import Swal from 'sweetalert2';
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
import { NON_TAXABLE_CODES, TOKEN } from '@/utils/constant';
import { successToast } from '@/utils/helperUi';
import { constants } from 'buffer';

interface EmployeeDetailProps { }

const EmployeeDetail: FC<EmployeeDetailProps> = ({ }) => {
    const [mounted, setMounted] = useState(false);
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const { employeeId } = useParams()
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [editable, setEditable] = useState(false);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [token, setToken] = useState("");

    const getAllJobTitles = async (s: string) => {
        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
        getJobTitles({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setJobTitles(v.data))
    }

    useEffect(() => {
        getStoragePermissions().then(v => setPermissions(v))
        setMounted(true)
    }, []);

    useEffect(() => {
        if (!mounted) return
        getDetail()
        getAllJobTitles("")
    }, [mounted]);


    useEffect(() => {
        setEditable(permissions.includes("update_employee"))
    }, [permissions]);

    const getDetail = async () => {
        try {
            setIsLoading(true)
            var resp = await getEmployeeDetail(employeeId!)
            var respJson = await resp.json()
            setEmployee(respJson.data)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const update = async () => {
        try {
            setIsLoading(true)
            await editEmployee(employeeId!, {
                email: employee?.email ?? "",
                full_name: getFullName(employee?.first_name, employee?.middle_name, employee?.last_name),
                phone: employee?.phone ?? "",
                job_title_id: setNullString(employee?.job_title_id),
                address: employee?.address ?? "",
                employee_identity_number: employee?.employee_identity_number ?? "",
                basic_salary: employee?.basic_salary ?? 0,
                positional_allowance: employee?.positional_allowance ?? 0,
                transport_allowance: employee?.transport_allowance ?? 0,
                meal_allowance: employee?.meal_allowance ?? 0,
                non_taxable_income_level_code: employee?.non_taxable_income_level_code ?? "",
                tax_payer_number: employee?.tax_payer_number ?? "",
                gender: employee?.gender ?? "",
                date_of_birth: setNullTime(employee?.date_of_birth ? employee?.date_of_birth : null),
                started_work: setNullTime(employee?.started_work ? employee?.started_work : null),
                picture: setNullString(employee?.picture),
            })
            getDetail()
            successToast("Data karyawan berhasil di update")

        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return (<DashboardLayout permission='read_employee'>
        <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
            <div className='flex justify-between'>
                <h3 className='font-bold mb-4 text-black text-lg'>{employee?.full_name}</h3>
            </div>
            <div className='grid grid-cols-2 gap-4'>

                <Panel header="Data Karyawan" bordered>
                    <InlineForm title="Nama Depan" >
                        <input disabled={!editable} className='form-control' value={employee?.first_name ?? ""} onChange={(el) => {
                            setEmployee({
                                ...employee!,
                                first_name: el.target.value
                            })
                        }} />
                    </InlineForm>
                    <InlineForm title="Nama Tengah" >
                        <input disabled={!editable} className='form-control' value={employee?.middle_name ?? ""} onChange={(el) => {
                            setEmployee({
                                ...employee!,
                                middle_name: el.target.value
                            })
                        }} />
                    </InlineForm>
                    <InlineForm title="Nama Belakang" >
                        <input disabled={!editable} className='form-control' value={employee?.last_name ?? ""} onChange={(el) => {
                            setEmployee({
                                ...employee!,
                                last_name: el.target.value
                            })
                        }} />
                    </InlineForm>
                    <InlineForm title="Tgl Lahir" >
                        <DatePicker className='w-full' value={moment(employee?.date_of_birth).toDate()} onChange={(val) => {
                            setEmployee({
                                ...employee!,
                                date_of_birth: val?.toISOString()
                            })
                        }} format='dd/MM/yyyy' />
                    </InlineForm>
                    <InlineForm title="Tgl Masuk" >
                        <DatePicker className='w-full' value={moment(employee?.started_work).toDate()} onChange={(val) => {
                            setEmployee({
                                ...employee!,
                                started_work: val?.toISOString()
                            })
                        }} format='dd/MM/yyyy' />
                    </InlineForm>
                    <InlineForm title="Jenis Kelamin">
                        <SelectPicker placeholder="Jenis Kelamin" searchable={false} data={[{ value: "m", label: "Laki-laki" }, { value: "f", label: "Perempuan" }]} value={employee?.gender} onSelect={(val) => {
                            setEmployee({
                                ...employee!,
                                date_of_birth: val,
                            })
                        }} block />
                    </InlineForm>
                    <InlineForm title="Email" >
                        <input disabled={!editable} className='form-control' value={employee?.email ?? ""} onChange={(el) => {
                            setEmployee({
                                ...employee!,
                                email: el.target.value
                            })
                        }} />
                    </InlineForm>
                    <InlineForm title="Telp" >
                        <input disabled={!editable} className='form-control' value={employee?.phone ?? ""} onChange={(el) => {
                            setEmployee({
                                ...employee!,
                                phone: el.target.value
                            })
                        }} />
                    </InlineForm>

                    <InlineForm title="Alamat" style={{ alignItems: 'start' }}>
                        <textarea rows={5} disabled={!editable} className='form-control' value={employee?.address} onChange={(el) => {
                            setEmployee({
                                ...employee!,
                                address: el.target.value
                            })
                        }} />
                    </InlineForm>
                    <InlineForm title={'NIP/NIK'}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder={"NIP/NIK"}
                            value={employee?.employee_identity_number ?? ""}
                            onChange={(el) => {
                                setEmployee({
                                    ...employee!,
                                    employee_identity_number: el.target.value
                                })
                            }}
                        />
                    </InlineForm>
                    <InlineForm title={'Jabatan'}>
                        <SelectPicker placeholder="Jabatan" searchable={false} data={jobTitles.map(e => ({ value: e.id, label: e.name }))} value={employee?.job_title_id} onSelect={(val) => {
                            setEmployee({
                                ...employee!,
                                job_title_id: val
                            })
                        }} block />
                    </InlineForm>


                    <Button onClick={async () => {
                        update()
                    }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>

                </Panel>

                <div>
                    <Panel header="Foto" bordered className='mb-4'>
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
                                setIsLoading(false);
                                setEmployee({
                                    ...employee!,
                                    picture: response.data.path,
                                    picture_url: response.data.url,
                                })

                                // toaster.push(<Message type="success">Uploaded successfully</Message>);
                            }}
                            onError={() => {
                                setIsLoading(false);
                                toaster.push(<Message type="error">Upload failed</Message>);
                            }}
                        >
                            <button style={{ width: 300, height: 300 }}>

                                {employee?.picture_url ? (
                                    <img src={employee?.picture_url} width="100%" height="100%" />
                                ) : (
                                    <AvatarIcon style={{ fontSize: 80 }} />
                                )}
                            </button>
                        </Uploader>
                    </Panel>

                    <Panel header="Data Payroll" bordered>
                        <InlineForm title="NPWP" >
                            <input disabled={!editable} className='form-control' value={employee?.tax_payer_number ?? ""} onChange={(el) => {
                                setEmployee({
                                    ...employee!,
                                    tax_payer_number: el.target.value
                                })
                            }} />
                        </InlineForm>
                        <InlineForm title="Gaji Pokok" >
                            <input disabled={!editable} className='form-control' value={employee?.basic_salary ?? ""} onChange={(el) => {
                                setEmployee({
                                    ...employee!,
                                    basic_salary: parseFloat(el.target.value)
                                })
                            }} />
                        </InlineForm>
                        <InlineForm title="Tunjangan Jabatan" >
                            <input disabled={!editable} className='form-control' value={employee?.positional_allowance ?? ""} onChange={(el) => {
                                setEmployee({
                                    ...employee!,
                                    positional_allowance: parseFloat(el.target.value)
                                })
                            }} />
                        </InlineForm>
                        <InlineForm title="Uang Transport" >
                            <input disabled={!editable} className='form-control' value={employee?.transport_allowance ?? ""} onChange={(el) => {
                                setEmployee({
                                    ...employee!,
                                    transport_allowance: parseFloat(el.target.value)
                                })
                            }} />
                        </InlineForm>
                        <InlineForm title="Uang Makan" >
                            <input disabled={!editable} className='form-control' value={employee?.meal_allowance ?? ""} onChange={(el) => {
                                setEmployee({
                                    ...employee!,
                                    meal_allowance: parseFloat(el.target.value)
                                })
                            }} />
                        </InlineForm>
                        <InlineForm title="Kode PTKP">
                            <SelectPicker placeholder="Kode PTKP" searchable={false} data={NON_TAXABLE_CODES} value={employee?.non_taxable_income_level_code} onSelect={(val) => {
                                setEmployee({
                                    ...employee!,
                                    non_taxable_income_level_code: val,
                                })
                            }} block />
                        </InlineForm>

                        <Button onClick={async () => {
                            update()
                        }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
                    </Panel>

                </div>
            </div>


        </div>

    </DashboardLayout>);
}
export default EmployeeDetail;
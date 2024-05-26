import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Attendance } from '@/model/attendance';
import { Employee } from '@/model/employee';
import { JobTitle } from '@/model/job_title';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { getAttendances } from '@/repositories/attendance';
import { editEmployee, getEmployeeDetail } from '@/repositories/employee';
import { getJobTitles } from '@/repositories/job_title';
import { NON_TAXABLE_CODES, TOKEN } from '@/utils/constant';
import { asyncLocalStorage, countOverTime, getDays, getFullName, getStoragePermissions, initials, money, numberToDuration, setNullString, setNullTime } from '@/utils/helper';
import { successToast } from '@/utils/helperUi';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
import saveAs from 'file-saver';
import moment from 'moment';


import { useContext, useEffect, useState, type FC } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { BsFloppy2 } from 'react-icons/bs';
import { RiFileDownloadFill } from 'react-icons/ri';
import Moment from 'react-moment';
import { useParams } from 'react-router-dom';
import { Avatar, Button, DatePicker, DateRangePicker, Message, Panel, SelectPicker, Uploader, toaster } from 'rsuite';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import Swal from 'sweetalert2';
import Select, { SingleValue } from 'react-select';
import { SelectOption } from '@/objects/select_option';
import { colourStyles } from '@/utils/style';
import { getUsers } from '@/repositories/user';
import { User } from '@/model/user';

interface EmployeeDetailProps { }

const EmployeeDetail: FC<EmployeeDetailProps> = ({ }) => {
    const [mounted, setMounted] = useState(false);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const { employeeId } = useParams()
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [editable, setEditable] = useState(false);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [token, setToken] = useState("");
    const [detailExpanded, setDetailExpanded] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | null>([moment().subtract(1, 'months').toDate(), moment().toDate()]);
    const [userId, setUserId] = useState<SelectOption>({ value: "", label: "Pilih User" });
    const [users, setUsers] = useState<User[]>([]);
    const [totalWorkingDays, setTotalWorkingDays] = useState(0);
    const [totalWorkingHours, setTotalWorkingHours] = useState(0);



    const getAllJobTitles = async (s: string) => {
        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
        getJobTitles({ page: 1, limit: 100, search: s })
            .then(v => v.json())
            .then(v => setJobTitles(v.data))

        getUsers({ page: 1, limit: 5 })
            .then(v => v.json())
            .then(v => setUsers(v.data))

    }

    useEffect(() => {
        getStoragePermissions().then(v => setPermissions(v))
        setMounted(true)
    }, []);

    useEffect(() => {
        if (employee) {
            setUserId({ value: employee?.user_id ?? "", label: employee?.username })
            setTotalWorkingHours(employee.total_working_hours)
            setTotalWorkingDays(employee.total_working_days)
        }

    }, [employee]);

    useEffect(() => {
        if (!mounted) return
        getDetail()
        getAllJobTitles("")
    }, [mounted]);


    useEffect(() => {
        setEditable(permissions.includes("update_employee"))
    }, [permissions]);

    useEffect(() => {
        getEmployeAttendances()
    }, [page, limit, dateRange]);

    const getDetail = async () => {
        try {
            setIsLoading(true)
            const resp = await getEmployeeDetail(employeeId!)
            const respJson = await resp.json()
            setEmployee(respJson.data)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const getEmployeAttendances = async () => {
        try {
            setIsLoading(true)
            const resp = await getAttendances({ page, limit }, {
                employeeID: employeeId,
                dateRange
            })
            const respJson = await resp.json()
            setAttendances(respJson.data)
            setPagination(respJson.pagination)
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
                employee_code: employee?.employee_code ?? "",
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
                user_id: userId?.value != "" ? userId?.value : null,
                total_working_days: totalWorkingDays,
                total_working_hours: totalWorkingHours,
                daily_working_hours: employee?.daily_working_hours ?? 0,
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
        <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-8'>
            <div className='flex justify-between items-center'>
                <h3 className='font-bold mb-4 text-black text-lg '>{employee?.full_name}</h3>
                {detailExpanded ? <ChevronDownIcon className='cursor-pointer w-5' onClick={() => setDetailExpanded(!detailExpanded)} /> : <ChevronUpIcon className='cursor-pointer w-5' onClick={() => setDetailExpanded(!detailExpanded)} />}
            </div>
            {detailExpanded &&
                <div className='grid grid-cols-2 gap-4'>

                    <Panel header="Data Karyawan" bordered>
                        <InlineForm title={'Link Ke User'}>

                            <Select< SelectOption, false> styles={colourStyles}
                                options={[{ value: "", label: "Pilih User" }, ...users.map(e => ({ value: e.id, label: e.full_name }))]}
                                value={userId}
                                onChange={(option: SingleValue<SelectOption>): void => {
                                    setUserId(option!)
                                }}
                                onInputChange={(val) => {
                                    getUsers({ page: 1, limit: 5, search: val })
                                        .then(v => v.json())
                                        .then(v => {
                                            setUsers(v.data)
                                        })
                                }}
                            />
                        </InlineForm>
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
                        <InlineForm title={'Kode Karyawan'} hints="Gunakan kode ini untuk mapping ke mesin biometrik/fingerprint">
                            <input
                                className="form-control"
                                type="text"
                                placeholder={"Kode Karyawan"}
                                value={employee?.employee_code ?? ""}
                                onChange={(el) => {
                                    setEmployee({
                                        ...employee!,
                                        employee_code: el.target.value
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
                                {editable ?
                                    <CurrencyInput
                                        className='form-control'
                                        groupSeparator="."
                                        decimalSeparator=","
                                        value={employee?.basic_salary}
                                        onValueChange={(value, _, values) => {
                                            setEmployee({
                                                ...employee!,
                                                basic_salary: values?.float ?? 0
                                            })
                                        }}

                                    />
                                    : <div className='form-control'> {money(employee?.basic_salary)}</div>}
                            </InlineForm>
                            <InlineForm title="Tunjangan Jabatan" >
                                {editable ?
                                    <CurrencyInput
                                        className='form-control'
                                        groupSeparator="."
                                        decimalSeparator=","
                                        value={employee?.positional_allowance}
                                        onValueChange={(value, _, values) => {
                                            setEmployee({
                                                ...employee!,
                                                positional_allowance: values?.float ?? 0
                                            })
                                        }}

                                    />
                                    : <div className='form-control'> {money(employee?.positional_allowance)}</div>}

                            </InlineForm>
                            <InlineForm title="Uang Transport" >
                                {editable ?
                                    <CurrencyInput
                                        className='form-control'
                                        groupSeparator="."
                                        decimalSeparator=","
                                        value={employee?.transport_allowance}
                                        onValueChange={(value, _, values) => {
                                            setEmployee({
                                                ...employee!,
                                                transport_allowance: values?.float ?? 0
                                            })
                                        }}

                                    />
                                    : <div className='form-control'> {money(employee?.transport_allowance)}</div>}

                            </InlineForm>
                            <InlineForm title="Uang Makan" >
                                {editable ?
                                    <CurrencyInput
                                        className='form-control'
                                        groupSeparator="."
                                        decimalSeparator=","
                                        value={employee?.meal_allowance}
                                        onValueChange={(value, _, values) => {
                                            setEmployee({
                                                ...employee!,
                                                meal_allowance: values?.float ?? 0
                                            })
                                        }}

                                    />
                                    : <div className='form-control'> {money(employee?.meal_allowance)}</div>}
                            </InlineForm>
                            <InlineForm title="Kode PTKP">
                                <SelectPicker placeholder="Kode PTKP" searchable={false} data={NON_TAXABLE_CODES} value={employee?.non_taxable_income_level_code} onSelect={(val) => {
                                    setEmployee({
                                        ...employee!,
                                        non_taxable_income_level_code: val,
                                    })
                                }} block />
                            </InlineForm>
                            <InlineForm title="Total Hari Kerja">
                                {editable ?
                                    <CurrencyInput
                                        className='form-control'
                                        groupSeparator="."
                                        decimalSeparator=","
                                        value={employee?.total_working_days}
                                        onValueChange={(value, _, values) => {
                                            setEmployee({
                                                ...employee!,
                                                total_working_days: values?.float ?? 0
                                            })
                                        }}

                                    />
                                    : <div className='form-control'> {money(employee?.total_working_days)}</div>}
                            </InlineForm>
                            <InlineForm title="Total Jam Kerja">
                                {editable ?
                                    <CurrencyInput
                                        className='form-control'
                                        groupSeparator="."
                                        decimalSeparator=","
                                        value={employee?.total_working_hours}
                                        onValueChange={(value, _, values) => {
                                            setEmployee({
                                                ...employee!,
                                                total_working_hours: values?.float ?? 0
                                            })
                                        }}

                                    />
                                    : <div className='form-control'> {money(employee?.total_working_hours)}</div>}
                            </InlineForm>
                            <InlineForm title="Jam Kerja per hari">
                                {editable ?
                                    <CurrencyInput
                                        className='form-control'
                                        groupSeparator="."
                                        decimalSeparator=","
                                        value={employee?.daily_working_hours}
                                        onValueChange={(value, _, values) => {
                                            setEmployee({
                                                ...employee!,
                                                daily_working_hours: values?.float ?? 0
                                            })
                                        }}

                                    />
                                    : <div className='form-control'> {money(employee?.daily_working_hours)}</div>}
                            </InlineForm>

                            <Button onClick={async () => {
                                update()
                            }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
                        </Panel>

                    </div>
                </div>
            }

        </div>
        <div className='grid grid-cols-4 gap-4  '>
            <div className=' bg-white rounded-xl p-6 hover:shadow-lg col-span-3'>
                <div className='flex justify-between mb-2'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Absensi"}</h3>
                    <div className=' flex items-center'>
                        <DateRangePicker className='w-60 mr-4' value={dateRange} onChange={(val) => setDateRange(val)} placement="bottomEnd" format='dd/MM/yyyy' />
                        <Button onClick={async () => {

                            try {
                                setIsLoading(true)
                                const resp = await getAttendances({ page, limit }, {
                                    dateRange: dateRange,
                                    employeeIDs: employeeId,

                                    download: true
                                })
                                const filename = resp.headers.get("Content-Description")
                                const respBlob = await resp.blob()

                                saveAs(respBlob, filename ?? "download.xlsx")

                            } catch (error) {
                                Swal.fire(`Perhatian`, `${error}`, 'error')
                            } finally {
                                setIsLoading(false)

                            }


                        }} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 '><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Laporan</Button>
                    </div>
                </div>
                <CustomTable className=''
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Tgl", "Absensi", "Durasi", "Overtime", "Keterangan"]} headerClasses={["", "", "", "", "", "w-64"]} datasets={attendances.map(e => ({
                        cells: [{ data: attendances.indexOf(e) + 1 },
                        { data: <Moment format='DD MMM YYYY'>{e.clock_in}</Moment> },
                        {
                            data: <div className='flex '>

                                <Moment format='HH:mm'>{e.clock_in}</Moment>
                                {e.clock_out &&
                                    <span>{' '}{' ~ '}<Moment format='HH:mm'>{e.clock_out}</Moment></span>
                                }


                            </div>
                        },
                        {
                            data:
                                e.clock_out &&
                                <div>
                                    {numberToDuration(moment(e.clock_out).diff(moment(e.clock_in), 'minutes'))}
                                </div>


                        },
                        {
                            data: e.overtime &&
                                <div>
                                    {`${countOverTime(e)}`}
                                </div>
                        },
                        {
                            data:
                                <div>
                                    <div>
                                        <p className='font-bold'>Masuk :</p>
                                        <div>
                                            {e.clock_in_picture &&
                                                <Avatar size='lg' src={e.clock_in_picture} alt={employee?.full_name} />
                                            }
                                        </div>
                                        <a className=' hover:font-bold' href={`https://www.google.com/maps/place/${e.clock_in_lat},${e.clock_in_lng}`} target='_blank'>
                                            <p>{e.clock_in_notes}</p>
                                        </a>
                                    </div>
                                    {e.clock_out &&
                                        <div>
                                            <p className='font-bold'>Keluar :</p>
                                            <div>
                                                {e.clock_out_picture &&
                                                    <Avatar size='lg' src={e.clock_out_picture} alt={employee?.full_name} />
                                                }
                                            </div>
                                            <a className=' hover:font-bold' href={`https://www.google.com/maps/place/${e.clock_out_lat},${e.clock_out_lng}`} target='_blank'>
                                                <p>{e.clock_out_notes}</p>
                                            </a>
                                        </div>
                                    }
                                </div>
                        },


                        ], className: "hover:bg-gray-50 border-b last:border-b-0"
                    }))} />
            </div>
            <div className=' bg-white rounded-xl p-6 hover:shadow-lg col-span-1'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Jadwal Kerja"}</h3>

                </div>
                <ul>
                    {(employee?.schedules ?? []).map(e => <li className='p-2 border-b hover:bg-gray-50 last:border-b-0' key={e.id}>
                        <h3 className=' font-bold text-sm'>{e.name}</h3>
                        <p>
                            {e.schedule_type == "WEEKLY" && getDays(e)}
                            {e.schedule_type == "SINGLE_DATE" && moment(e.start_date).format("DD MMM YYYY")}
                            {e.schedule_type == "DATERANGE" && `${moment(e.start_date).format("DD MMM YYYY")} ~ ${moment(e.end_date).format("DD MMM YYYY")}`}
                        </p>
                        <p>
                            {e.start_time} ~ {e.end_time}
                        </p>

                    </li>)}
                </ul>
            </div>
        </div>

    </DashboardLayout>);
}
export default EmployeeDetail;


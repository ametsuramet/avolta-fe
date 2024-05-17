import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Attendance } from '@/model/attendance';
import { JobTitle } from '@/model/job_title';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { getAttendances } from '@/repositories/attendance';
import { getJobTitles } from '@/repositories/job_title';
import { TOKEN } from '@/utils/constant';
import { asyncLocalStorage } from '@/utils/helper';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFunnel } from 'react-icons/bs';
import { IoAddCircleOutline } from 'react-icons/io5';
import { PiFloppyDiskFill } from 'react-icons/pi';
import { RiFileDownloadFill } from 'react-icons/ri';
import Moment from 'react-moment';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, DatePicker, DateRangePicker, Drawer, Modal, SelectPicker, Uploader } from 'rsuite';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import Swal from 'sweetalert2';


interface AttendancePageProps { }

const AttendancePage: FC<AttendancePageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [openWithHeader, setOpenWithHeader] = useState(false)
    const [token, setToken] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    const [dateBirth, setDateBirth] = useState<Date | null>(null);
    const [dateStarted, setDateStarted] = useState<Date | null>(null);
    const [inputGender, setInputGender] = useState(null);
    const [inputAge, setInputAge] = useState(null);
    const [inputJobTitleID, setInputJobTitleID] = useState(null);
    const [open, setOpen] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [attendanceIdentityNumber, setAttendanceIdentityNumber] = useState("")
    const [jobTitleID, setJobTitleID] = useState("")
    const [gender, setGender] = useState("");


    useEffect(() => {
        getAllAttendance()
        getAllJobTitles("")
        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
    }, [page, limit, search, date, dateRange, inputGender, inputAge, inputJobTitleID]);

    const getAllJobTitles = async (s: string) => {
        getJobTitles({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setJobTitles(v.data))
    }

    const getAllAttendance = async () => {
        try {
            setIsLoading(true)
            let r = await getAttendances({ page, limit, search }, {
                dateRange: dateRange,
                jobTitleID: inputJobTitleID,
                gender: inputGender,
                download: true

            })
            let rJson = await r.json()
            setAttendances(rJson.data)
            setPagination(rJson.pagination)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const clearForm = () => {
        setEmail("")
        setFirstName("")
        setMiddleName("")
        setLastName("")
        setJobTitleID("")
        setAttendanceIdentityNumber("")
        setGender("")
        setAddress("")
        setPhone("")
        setDateBirth(null)
        setDateStarted(null)
    }
    return (
        <DashboardLayout permission='read_attendance'>
            <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Absensi"}</h3>
                    <div>

                        <Button onClick={() => setOpen(true)} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-2'><IoAddCircleOutline className='text-blue-600 mr-2' /> Tambah</Button>
                        <Button onClick={() => setOpenWithHeader(true)} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800'><BsFunnel className='text-blue-600 mr-2' /> Filter</Button>

                    </div>
                </div>
                <hr className='h-line' />
                <div className='p-6 rounded-lg border'>
                    <div className=' flex justify-between mb-4'>
                        <div>
                            <h3 className='font-semibold  text-black text-base'>{"Total Data Absensi"}</h3>
                            <span>{pagination?.total_records} Data Absensi</span>
                        </div>
                        <div className="relative">
                            <div className="absolute top-2.5 start-0 flex items-center ps-3 pointer-events-none">
                                <MagnifyingGlassIcon
                                    className=" h-5 w-5 text-violet-200 hover:text-violet-100"
                                    aria-hidden="true"
                                />
                            </div>
                            <input

                                autoComplete='off'
                                value={search}
                                type="search"
                                id="default-search"
                                className="block  outline-1  outline-blue-300  w-full py-2 px-4 text-sm ps-10  text-gray-900 border rounded-full bg-transparent   "
                                placeholder={'Search ...'}
                                onChange={(val) => setSearch(val.target.value)}
                            />
                        </div>

                    </div>
                    <CustomTable className=''
                        pagination
                        total={pagination?.total_records}
                        limit={limit}
                        activePage={page}
                        setActivePage={(v) => setPage(v)}
                        changeLimit={(v) => setLimit(v)}
                        headers={["No", "Nama Karyawan", "Jabatan", "Jam Masuk", "Jam Keluar"]} headerClasses={[]} datasets={attendances.map(e => ({
                            cells: [{ data: attendances.indexOf(e) + 1 }, {
                                data: <div className=' items-center flex' >
                                    <Avatar circle size='sm' bordered src={e.employee_picture}
                                        alt={e.employee_name} />
                                    <span className='ml-4  hover:font-bold cursor-pointer' onClick={() => nav(`/employee/${e.employee_id}`)}>
                                        {e.employee_name}
                                    </span>
                                </div>
                            }, { data: e.employee_job_title }, {
                                data: <div className='flex flex-col'>
                                    <Moment format='DD MMM YYYY'>{e.clock_in}</Moment>
                                    <small><Moment format='HH:mm'>{e.clock_in}</Moment></small>
                                </div>
                            }, {
                                data: <div className='flex flex-col'>
                                    <Moment format='DD MMM YYYY'>{e.clock_out}</Moment>
                                    <small><Moment format='HH:mm'>{e.clock_out}</Moment></small>
                                </div>
                            }], className: "hover:bg-gray-50 border-b last:border-b-0"
                        }))} />

                </div>
            </div>
            <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
                <Drawer.Header>
                    <Drawer.Title>Filter & Tool</Drawer.Title>
                    <Drawer.Actions>
                        <Button onClick={() => {
                            setOpenWithHeader(false)
                            setInputAge(null)
                            setInputGender(null)
                            setInputJobTitleID(null)
                            setDate(null)
                            setDateRange(null)
                        }} >
                            <XMarkIcon className='w-4 mr-2' />
                            Clear Filter
                        </Button>
                    </Drawer.Actions>
                </Drawer.Header>
                <Drawer.Body className='p-8'>
                    <h3 className=' text-2xl text-black'>Filter</h3>
                    <InlineForm title="Jenis Kelamin">
                        <SelectPicker placeholder="Jenis Kelamin" searchable={false} data={[{ value: "m", label: "Laki-laki" }, { value: "f", label: "Perempuan" }]} value={inputGender} onSelect={(val) => setInputGender(val)} block />
                    </InlineForm>
                    {/* <InlineForm title="Umur">
                        <SelectPicker placeholder="Umur" searchable={false} data={[...Array(43).keys()].map(n => n + 18).map(e => ({ value: e, label: `${e} thn` }))} value={inputAge} onSelect={(val) => setInputAge(val)} block />
                    </InlineForm> */}
                    <InlineForm title="Jabatan">
                        <SelectPicker placeholder="Jabatan" searchable={false} data={jobTitles.map(e => ({ value: e.id, label: e.name }))} value={inputJobTitleID} onSelect={(val) => setInputJobTitleID(val)} block />
                    </InlineForm>
                    <InlineForm title="Rentang Tanggal">
                        <DateRangePicker className='w-full' value={dateRange} onChange={(val) => setDateRange(val)} placement="bottomEnd" format='dd/MM/yyyy' />
                    </InlineForm>
                    <Button onClick={async () => {

                        try {
                            setIsLoading(true)
                            var resp = await getAttendances({ page, limit, search }, {
                                dateRange: dateRange,
                                jobTitleID: inputJobTitleID,
                                gender:inputGender,
                                download: true
                            })
                            let filename = resp.headers.get("Content-Description")
                            var respBlob = await resp.blob()

                            saveAs(respBlob, filename ?? "download.xlsx")
                            getAllAttendance()
                        } catch (error) {
                            Swal.fire(`Perhatian`, `${error}`, 'error')
                        } finally {
                            setIsLoading(false)

                        }


                    }} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-4'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Laporan</Button>
                    <div className='mb-4'></div>

                    <hr className='h-line' />
                    <h3 className=' text-2xl text-black'>Unggah Data Karyawan</h3>
                    <p className='mb-4'>Silakan download terlebih dahulu templat data karyawan</p>
                    <Uploader
                        onSuccess={async (resp) => {
                            Swal.fire("Perhatian", "Unggah File Berhasil", "success")

                            console.log(resp)
                        }}
                        headers={{
                            authorization: `Bearer ${token}`
                        }}
                        onChange={(files) => {
                        }} draggable action={`${import.meta.env.VITE_API_URL}/admin/attendance/import`}>
                        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span>Click or Drag files to this area to upload</span>
                        </div>
                    </Uploader>
                    <Button onClick={() => window.open(`/file/sample_attendance.xlsx`)} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-4'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Template</Button>
                    {/* <Button className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800'><RiFileUploadFill className='text-blue-600 mr-2' /> Unggah Data Karyawan</Button> */}
                </Drawer.Body>
            </Drawer>

            <Modal size={"lg"} open={open} onClose={() => setOpen(false)}>
                <Modal.Header>
                    <Modal.Title>Form Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InlineForm title={'Nama Depan'}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder={"Nama Depan"}
                            value={firstName}
                            onChange={(el) => setFirstName(el.target.value)}
                        />
                    </InlineForm>
                    <InlineForm title={'Nama Tengah'}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder={"Nama Tengah"}
                            value={middleName}
                            onChange={(el) => setMiddleName(el.target.value)}
                        />
                    </InlineForm>
                    <InlineForm title={'Nama Belakang'}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder={"Nama Belakang"}
                            value={lastName}
                            onChange={(el) => setLastName(el.target.value)}
                        />
                    </InlineForm>
                    <InlineForm title="Tgl Lahir">
                        <DatePicker className='w-full' value={dateBirth} onChange={(val) => setDateBirth(val)} format='dd/MM/yyyy' />
                    </InlineForm>
                    <InlineForm title="Tgl Masuk">
                        <DatePicker className='w-full' value={dateStarted} onChange={(val) => setDateStarted(val)} format='dd/MM/yyyy' />
                    </InlineForm>
                    <InlineForm title="Jenis Kelamin">
                        <SelectPicker placeholder="Jenis Kelamin" searchable={false} data={[{ value: "m", label: "Laki-laki" }, { value: "f", label: "Perempuan" }]} value={gender} onSelect={(val) => setGender(val)} block />
                    </InlineForm>
                    <InlineForm title={'Email'}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder={"Email"}
                            value={email}
                            onChange={(el) => setEmail(el.target.value)}
                        />
                    </InlineForm>
                    <InlineForm title={'Telp'}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder={"Telepon"}
                            value={phone}
                            onChange={(el) => setPhone(el.target.value)}
                        />
                    </InlineForm>
                    <InlineForm title={'Alamat'} style={{ alignItems: 'start' }}>
                        <textarea
                            className="form-control"
                            rows={5}
                            placeholder={"Alamat"}
                            value={address}
                            onChange={(el) => setAddress(el.target.value)}
                        />
                    </InlineForm>

                    <InlineForm title={'NIP/NIK'}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder={"NIP/NIK"}
                            value={attendanceIdentityNumber}
                            onChange={(el) => setAttendanceIdentityNumber(el.target.value)}
                        />
                    </InlineForm>
                    <InlineForm title={'Jabatan'}>
                        <SelectPicker placeholder="Jabatan" searchable={false} data={jobTitles.map(e => ({ value: e.id, label: e.name }))} value={jobTitleID} onSelect={(val) => setJobTitleID(val)} block />
                    </InlineForm>




                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        setOpen(false)
                    }} appearance="subtle">
                        Cancel
                    </Button>
                    <Button onClick={async () => {
                        try {
                            setIsLoading(true)
                            // await addAttendance({
                            //     email: email,
                            //     full_name: getFullName(firstName, middleName, lastName),
                            //     phone: phone,
                            //     job_title_id: setNullString(jobTitleID),
                            //     address: address,
                            //     attendance_identity_number: attendanceIdentityNumber,
                            //     basic_salary: 0,
                            //     positional_allowance: 0,
                            //     transport_allowance: 0,
                            //     meal_allowance: 0,
                            //     non_taxable_income_level_code: '',
                            //     tax_payer_number: '',
                            //     gender: gender,
                            //     date_of_birth: setNullTime(dateBirth ? dateBirth!.toISOString() : null),
                            //     started_work: setNullTime(dateStarted ? dateStarted!.toISOString() : null),
                            // })
                            getAllAttendance()
                            setOpen(false)
                            clearForm()
                        } catch (error) {
                            Swal.fire(`Perhatian`, `${error}`, 'error')
                        } finally {
                            setIsLoading(false)

                        }
                    }} appearance="primary">
                        <PiFloppyDiskFill className='mr-2' /> Simpan
                    </Button>
                </Modal.Footer>
            </Modal>
        </DashboardLayout>
    );
}
export default AttendancePage;
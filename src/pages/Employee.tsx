import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Employee } from '@/model/employee';
import { JobTitle } from '@/model/job_title';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { getEmployees } from '@/repositories/employee';
import { getJobTitles } from '@/repositories/job_title';
import { TOKEN } from '@/utils/constant';
import { asyncLocalStorage } from '@/utils/helper';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFunnel } from 'react-icons/bs';
import { RiFileDownloadFill, RiFileUploadFill } from 'react-icons/ri';
import Moment from 'react-moment';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, DatePicker, DateRangePicker, Drawer, Placeholder, SelectPicker, Uploader } from 'rsuite';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import Swal from 'sweetalert2';

interface EmployeePageProps { }

const EmployeePage: FC<EmployeePageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [openWithHeader, setOpenWithHeader] = useState(false)
    const [token, setToken] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | null>([moment().subtract(1, "days").toDate(), moment().toDate()]);
    const [date, setDate] = useState<Date|null>(moment().toDate());
    const [inputGender, setInputGender] = useState(null);
    const [inputAge, setInputAge] = useState(null);
    const [inputJobTitleID, setInputJobTitleID] = useState(null);



    useEffect(() => {
        getAllEmployee()
        getAllJobTitles("")
        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
    }, [page, limit, search, date, inputGender, inputAge, inputJobTitleID]);

    const getAllJobTitles = async (s: string) => {
        getJobTitles({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setJobTitles(v.data))
    }

    const getAllEmployee = async () => {
        try {
            setIsLoading(true)
            let r = await getEmployees({ page, limit, search }, {
                ageRange: inputAge != null ? [moment().subtract(inputAge, "years").toDate(), moment().subtract(inputAge + 1, "years").toDate()] : null,
                jobTitleID: inputJobTitleID,
                gender: inputGender,
                startedWork: date,
            })
            let rJson = await r.json()
            setEmployees(rJson.data)
            setPagination(rJson.pagination)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <DashboardLayout>
            <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Karyawan"}</h3>
                    <div>

                        <Button onClick={() => setOpenWithHeader(true)} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800'><BsFunnel className='text-blue-600 mr-2' /> Filter</Button>

                    </div>
                </div>
                <hr className='h-line' />
                <div className='p-6 rounded-lg border'>
                    <div className=' flex justify-between mb-4'>
                        <div>
                            <h3 className='font-semibold  text-black text-base'>{"Total Karyawan"}</h3>
                            <span>{pagination?.total_records} Karyawan</span>
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
                    <CustomTable
                        pagination
                        total={pagination?.total_records}
                        limit={limit}
                        activePage={page}
                        setActivePage={(v) => setPage(v)}
                        changeLimit={(v) => setLimit(v)}
                        headers={["No", "Nama Karyawan", "NIK", "Jenis Kelamin", "Umur", "Jabatan", "Tanggal Masuk"]} headerClasses={[]} datasets={employees.map(e => ({
                            cells: [
                                { data: ((page - 1) * limit) + (employees.indexOf(e) + 1) },
                                {
                                    data: <div className='flex items-center'>
                                        <Avatar circle size='sm' bordered src={e.picture}
                                            alt={e.full_name} />
                                        <span className='ml-4'>
                                            {e.full_name}
                                        </span>
                                    </div>
                                },
                                { data: e.employee_identity_number },
                                { data: e.gender == "m" ? "Laki-Laki" : "Perempuan" },
                                { data: e.date_of_birth ? moment().diff(moment(e.date_of_birth), 'years') : '' },
                                { data: e.job_title },
                                { data: <Moment format='DD MMM YYYY'>{e.started_work}</Moment> },
                            ]
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
                    <InlineForm title="Umur">
                        <SelectPicker placeholder="Umur" searchable={false} data={[...Array(43).keys()].map(n => n + 18).map(e => ({ value: e, label: `${e} thn` }))} value={inputAge} onSelect={(val) => setInputAge(val)} block />
                    </InlineForm>
                    <InlineForm title="Jabatan">
                        <SelectPicker placeholder="Jabatan" searchable={false} data={jobTitles.map(e => ({ value: e.id, label: e.name }))} value={inputJobTitleID} onSelect={(val) => setInputJobTitleID(val)} block />
                    </InlineForm>
                    <InlineForm title="Tgl Masuk">
                        <DatePicker className='w-full' value={date} onChange={(val) => setDate(val)} placement="bottomEnd" format='dd/MM/yyyy' />
                    </InlineForm>

                    <div className='mb-4'></div>

                    <hr className='h-line' />
                    <h3 className=' text-2xl text-black'>Unggah Data Karyawan</h3>
                    <p className='mb-4'>Silakan download terlebih dahulu templat data karyawan</p>
                    <Uploader
                        headers={{
                            authorization: `Bearer ${token}`
                        }}
                        onChange={(files) => {
                        }} draggable action={`${import.meta.env.VITE_API_URL}/admin/employee/import`}>
                        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span>Click or Drag files to this area to upload</span>
                        </div>
                    </Uploader>
                    <Button onClick={() => window.open(`/file/sample_employee.xlsx`)} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-4'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Template</Button>
                    {/* <Button className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800'><RiFileUploadFill className='text-blue-600 mr-2' /> Unggah Data Karyawan</Button> */}
                </Drawer.Body>
            </Drawer>
        </DashboardLayout>
    );
}
export default EmployeePage;
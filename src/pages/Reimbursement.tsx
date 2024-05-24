import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Reimbursement, ReimbursementReq } from '@/model/reimbursement';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { getEmployees } from '@/repositories/employee';
import { addReimbursement, deleteReimbursement, editReimbursement, getReimbursements } from '@/repositories/reimbursement';
import { confirmDelete } from '@/utils/helper';
import { EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdAddCircleOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, DatePicker } from 'rsuite';
import Swal from 'sweetalert2';
import Select, { SingleValue } from 'react-select';
import { SelectOption } from '@/objects/select_option';
import { Employee } from '@/model/employee';
import { colourStyles } from '@/utils/style';
import moment from 'moment';

interface ReimbursementPageProps { }

const ReimbursementPage: FC<ReimbursementPageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const [jobTitles, setReimbursements] = useState<Reimbursement[]>([]);
    const [selectedReimbursement, setSelectedReimbursement] = useState<Reimbursement | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setselectedEmployee] = useState<SingleValue<SelectOption>>();

    useEffect(() => {
        getAllEmployees("")

    }, []);

    useEffect(() => {
        getAllReimbursements()

    }, [page, limit, search]);


    const getAllEmployees = (s: string) => {
        getEmployees({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setEmployees(v.data))
    }


    const getAllReimbursements = async () => {
        setIsLoading(true)
        getReimbursements({ page, limit, search })
            .then(v => v.json())
            .then(v => {
                setReimbursements(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const save = async () => {
        try {
            setIsLoading(true)

            if (selectedReimbursement) {
                await editReimbursement(selectedReimbursement!.id, {
                    name: '',
                    date: '',
                    employee_id: ''
                })
            } else {
                var resp = await addReimbursement({
                    name: `Reimbursement ${selectedEmployee?.label} - ${moment(date).format("DD/MM/YYYY")}`,
                    date: date.toISOString(),
                    employee_id: selectedEmployee?.value!
                })
                var respJson = await resp.json()
                nav(`/reimbursement/${respJson.data.last_id}`)
            }
            getAllReimbursements()
            setSelectedReimbursement(null)
            setName("")
            setDescription("")
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }


    return (<DashboardLayout permission='read_reimbursement'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Reimbursement"}</h3>
                </div>
                <CustomTable
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Tgl", "Reimbursement", "Status", ""]} headerClasses={[]} datasets={jobTitles.map(e => ({
                        cells: [
                            { data: ((page - 1) * limit) + (jobTitles.indexOf(e) + 1) },
                            { data: e.date },
                            { data: e.name },
                            {
                                data: <div>
                                    {e?.status == "DRAFT" && <Badge className='text-center' color='yellow' content={e?.status} />}
                                    {e?.status == "REQUEST" && <Badge className='text-center' color='violet' content={e?.status} />}
                                    {e?.status == "PROCESSING" && <Badge className='text-center' color='green' content={e?.status} />}
                                    {e?.status == "APPROVED" && <Badge className='text-center' color='blue' content={e?.status} />}
                                    {e?.status == "REJECTED" && <Badge className='text-center' color='red' content={e?.status} />}
                                    {e?.status == "PAID" && <Badge className='text-center' color='green' content={e?.status} />}
                                    {e?.status == "FINISHED" && <Badge className='text-center' color='green' content={e?.status} />}
                                    {e?.status == "CANCELED" && <Badge className='text-center' color='red' content={e?.status} />}
                                </div>
                            },
                            {
                                data: <div className='flex cursor-pointer'>
                                    <EyeIcon onClick={() => {
                                       nav(`/reimbursement/${e.id}`)
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                    <TrashIcon
                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                        aria-hidden="true"
                                        onClick={() => {
                                            confirmDelete(() => {
                                                deleteReimbursement(e.id).then(v => getAllReimbursements())
                                            })
                                        }}
                                    />
                                </div>
                            }
                        ]
                    }))} />
            </div>
            <div className='col-span-1'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{selectedReimbursement ? "Edit Jabatan / Posisi" : "Tambah Jabatan / Posisi"}</h3>
                    <InlineForm title="Tgl Lahir">
                        <DatePicker className='w-full' value={date} onChange={(val) => setDate(val!)} format='dd/MM/yyyy' />
                    </InlineForm>
                    <InlineForm title="Pilih Karyawan">
                        <Select< SelectOption, false> styles={colourStyles}
                            options={employees.map(e => ({ value: e.id, label: e.full_name }))}
                            value={selectedEmployee!}
                            onChange={(option: SingleValue<SelectOption>): void => {
                                setselectedEmployee(option!)
                            }}
                            onInputChange={(val) => {
                                getAllEmployees(val)
                            }}

                        />
                    </InlineForm>
                    <Button className='mr-2' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    {selectedReimbursement &&
                        <Button onClick={async () => {
                            setSelectedReimbursement(null)
                            setName("")
                            setDescription("")
                        }}>
                            <XMarkIcon className='mr-2 w-5' /> Batal
                        </Button>
                    }
                </div>
            </div>
        </div>

    </DashboardLayout>);
}
export default ReimbursementPage;
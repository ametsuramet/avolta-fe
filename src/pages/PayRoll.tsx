import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { PayRoll } from '@/model/pay_roll';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { addPayRoll, deletePayRoll, editPayRoll, getPayRolls } from '@/repositories/pay_roll';
import { confirmDelete } from '@/utils/helper';
import { EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdAddCircleOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Button, DateRangePicker } from 'rsuite';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import Swal from 'sweetalert2';
import Select, { MultiValue, SingleValue } from 'react-select';
import { SelectOption } from '@/objects/select_option';
import { colourStyles } from '@/utils/style';
import { getEmployees } from '@/repositories/employee';
import { Employee } from '@/model/employee';


interface PayRollPageProps { }

const PayRollPage: FC<PayRollPageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const [payRolls, setPayRolls] = useState<PayRoll[]>([]);
    const [selectedPayRoll, setSelectedPayRoll] = useState<PayRoll | null>(null);
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>([moment().subtract(1, "months").startOf('month').toDate(), moment().subtract(1, "months").endOf('month').toDate()]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setselectedEmployee] = useState<SingleValue<SelectOption>>();

    useEffect(() => {
        getAllEmployees("")
    }, []);
    useEffect(() => {
        getAllPayRolls()

    }, [page, limit, search]);

    useEffect(() => {
        setNotes(`Pay Roll ${selectedEmployee?.label ?? ''} ${moment(selectedDateRange[0]).format("DD/MM/YYYY")}~${moment(selectedDateRange[1]).format("DD/MM/YYYY")}`)
    }, [selectedDateRange, selectedEmployee]);


    const getAllEmployees = (s: string) => {
        getEmployees({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setEmployees(v.data))
    }

    const getAllPayRolls = async () => {
        setIsLoading(true)
        getPayRolls({ page, limit, search })
            .then(v => v.json())
            .then(v => {
                setPayRolls(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const save = async () => {
        try {
            setIsLoading(true)
            if (selectedPayRoll) {
                // await editPayRoll(selectedPayRoll!.id, { name, description })
            } else {
                var resp = await addPayRoll({
                    title,
                    notes,
                    start_date: moment(selectedDateRange[0]).toISOString(),
                    end_date: moment(selectedDateRange[1]).toISOString(),
                    employee_id: selectedEmployee?.value!
                })
                var respJson = await resp.json()
                nav(`/pay_roll/${respJson.data.last_id}`)
            }
            getAllPayRolls()
            setSelectedPayRoll(null)
            setTitle("")
            setNotes("")
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }


    return (<DashboardLayout permission='read_pay_roll'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Pay Roll"}</h3>
                </div>
                <CustomTable
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Pay Roll", "Karyawan", ""]} headerClasses={[]} datasets={payRolls.map(e => ({
                        cells: [
                            { data: ((page - 1) * limit) + (payRolls.indexOf(e) + 1) },
                            { data: e.notes },
                            {
                                data: <div className=' hover:font-bold cursor-pointer' onClick={() => {
                                    nav(`/employee/${e.employee_id}`)
                                }}>
                                    {e.employee_name}
                                </div>
                            },
                            {
                                data: <div className='flex cursor-pointer'>
                                    <EyeIcon onClick={() => {
                                        nav(`/pay_roll/${e.id}`)
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                    <TrashIcon
                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                        aria-hidden="true"
                                        onClick={() => {
                                            confirmDelete(() => {
                                                deletePayRoll(e.id).then(v => getAllPayRolls())
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
                    <h3 className='font-bold mb-4 text-black text-lg'>{selectedPayRoll ? "Edit Pay Roll" : "Tambah Pay Roll"}</h3>
                    {/* <InlineForm title="Pay Roll">
                        <input placeholder='ex: Manager Produksi' value={name} onChange={(el) => setName(el.target.value)} type="text" className="form-control" />
                    </InlineForm> */}
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
                    <InlineForm title="Rentang Tanggal">
                        <DateRangePicker className='w-full' value={selectedDateRange} onChange={(val) => setSelectedDateRange(val!)} placement="bottomEnd" format='dd/MM/yyyy' />
                    </InlineForm>
                    <InlineForm title="Keterangan" style={{ alignItems: 'start' }}>
                        <textarea placeholder='ex: Manager produksi pabrik ....' rows={5} value={notes} onChange={(el) => setNotes(el.target.value)} className="form-control" />
                    </InlineForm>
                    <Button className='mr-2' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    {selectedPayRoll &&
                        <Button onClick={async () => {
                            setSelectedPayRoll(null)
                            setNotes("")
                        }}>
                            <XMarkIcon className='mr-2 w-5' /> Batal
                        </Button>
                    }
                </div>
            </div>
        </div>

    </DashboardLayout>);
}
export default PayRollPage;
import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Account } from '@/model/account';
import { Attendance, AttendanceReq, AttendanceSummary } from '@/model/attendance';
import { Employee } from '@/model/employee';
import { Leave } from '@/model/leave';
import { PayRoll, PayRollItemReq } from '@/model/pay_roll';
import { Reimbursement } from '@/model/reimbursement';
import { Transaction } from '@/model/transaction';
import { LoadingContext } from '@/objects/loading_context';
import { getAccounts } from '@/repositories/account';
import { addAttendance, deleteAttendance, editAttendance, getAttendanceSummaries, getAttendances } from '@/repositories/attendance';
import { getEmployeeDetail } from '@/repositories/employee';
import { getLeaves } from '@/repositories/leave';
import { editPayRoll, finishPayRoll, getPayRollDetail, paymentPayRoll, processPayRoll } from '@/repositories/pay_roll';
import { addPayRollItem, deletePayRollItem, editPayRollItem } from '@/repositories/pay_roll_item';
import { getReimbursements } from '@/repositories/reimbursement';
import { getSettingDetail } from '@/repositories/setting';
import { addTransaction, getTransactionDetail } from '@/repositories/transaction';
import { NON_TAXABLE_CODES } from '@/utils/constant';
import { confirmDelete, getDays, getStoragePermissions, initials, money, numberToDuration, parseAmount, stringHourToNumber } from '@/utils/helper';
import { toolTip } from '@/utils/helperUi';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import { CheckIcon, PlusIcon, RocketLaunchIcon, TrashIcon } from '@heroicons/react/24/outline';
import saveAs from 'file-saver';
import moment from 'moment';
import 'moment/locale/id';
import { useContext, useEffect, useState, type FC } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { BsFloppy2 } from 'react-icons/bs';
import { LuWallet2 } from 'react-icons/lu';
import { RiFileDownloadFill } from 'react-icons/ri';
import Moment from 'react-moment';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Badge, Button, DatePicker, Modal, Panel, SelectPicker, Toggle } from 'rsuite';
import Swal from 'sweetalert2';

interface PayRollDetailProps { }

const PayRollDetail: FC<PayRollDetailProps> = ({ }) => {
    const nav = useNavigate()
    const { payRollId } = useParams()
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [payRoll, setPayRoll] = useState<PayRoll | null>(null);
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [detailExpanded, setDetailExpanded] = useState(true);
    const [attendanceExpanded, setAttendanceExpanded] = useState(true);
    const [transactionExpanded, setTransactionExpanded] = useState(true);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [dateAttendanceRanges, setDateAttendanceRanges] = useState<moment.Moment[]>([]);
    const [totalDays, setTotalDays] = useState(0);
    const [totalHours, setTotalHours] = useState(0);
    const [totalOvertime, setTotalOvertime] = useState(0);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [absents, setAbsents] = useState<Leave[]>([]);
    const [itemExpanded, setItemExpanded] = useState(true);
    const [editable, setEditable] = useState(true);
    const [mountedInput, setMountedInput] = useState(true);
    const [modalIncome, setModalIncome] = useState(false);
    const [modalExpense, setModalExpense] = useState(false);
    const [inputItem, setInputItem] = useState<PayRollItemReq | null>(null);
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
    const [transactionPayment, setTransactionPayment] = useState<Transaction | null>(null);
    const [date, setDate] = useState<Date>(moment().toDate());
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [paid, setPaid] = useState(0);
    const [assetAccounts, setAssetAccounts] = useState<Account[]>([]);
    const [selectedAssetAccount, setSelectedAssetAccount] = useState("")
    const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);



    useEffect(() => {
        getDetail()
        getlAssetAccounts()
        getAllSetting()
        getStoragePermissions()
            .then(v => {
                setPermissions(v)
            })
    }, []);

    const getAllSetting = async () => {
        try {

            const resp = await getSettingDetail()
            const respJson = await resp.json()
            setSelectedAssetAccount(respJson.data.pay_roll_asset_account_id)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const getlAssetAccounts = async () => {
        try {
            setIsLoading(true)
            const resp = await getAccounts({ page: 1, limit: 20 }, { type: "Asset", cashflowSubgroup: "cash_bank" })
            const respJson = await resp.json()
            setAssetAccounts(respJson.data)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (transactionPayment) {
            setDescription(`Pembayaran ${transactionPayment.description}`)
            const totalPaid = transactionPayment.transaction_refs.map(e => e.debit).reduce((a, b) => a + b, 0)
            setPaid(totalPaid)
            setAmount(transactionPayment.credit - totalPaid)
        }
    }, [transactionPayment]);

    useEffect(() => {
        // console.log(payRoll)
        if (payRoll) {
            setEditable(payRoll.status == "DRAFT")
            getAttendances({ page: 1, limit: 1000 }, {
                employeeID: payRoll.employee_id,
                dateRange: [moment(payRoll.start_date).toDate(), moment(payRoll.end_date + " 23:59:59").toDate()]
            })
                .then(v => v.json())
                .then(v => setAttendances(v.data))
            getEmployeeDetail(payRoll.employee_id)
                .then(v => v.json())
                .then(v => setEmployee(v.data))

            getAllLeaves()
            setMountedInput(false)
            setTimeout(() => {
                setMountedInput(true)
            }, 60);

            getReimbursements({ page: 1, limit: 100 }, { employeeID: payRoll?.employee_id, status: "REQUEST" })
                .then(v => v.json())
                .then(v => setReimbursements(v.data))
            getAttendanceSummaries(payRoll.employee_id, { page: 1, limit: 0 }, { dateRange: [moment(payRoll.start_date).toDate(), moment(payRoll.end_date + " 23:59:59").toDate()] })
                .then(v => v.json())
                .then(v => setAttendanceSummary(v.data))
        }
    }, [payRoll]);

    useEffect(() => {
        if ((employee?.schedules ?? []).length > 0) {

        }
    }, [employee]);

    const getAllLeaves = async () => {
        try {
            setIsLoading(true)
            getLeaves({ page: 1, limit: 100 }, {
                employeeID: payRoll!.employee_id,
                status: "APPROVED",

                dateRange: [moment(payRoll!.start_date).toDate(), moment(payRoll!.end_date + " 23:59:59").toDate()]
            })
                .then(v => v.json())
                .then(v => setLeaves(v.data))
            getLeaves({ page: 1, limit: 100 }, {
                employeeID: payRoll!.employee_id,
                absent: true,
                dateRange: [moment(payRoll!.start_date).toDate(), moment(payRoll!.end_date + " 23:59:59").toDate()]
            })
                .then(v => v.json())
                .then(v => setAbsents(v.data))
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (payRoll) {
            const firstDay = moment(payRoll.start_date).startOf('month').date()
            const endDay = moment(payRoll.end_date).endOf('month').date()
            const ranges = []
            let totalDays = 0
            let totalHours = 0
            let totalOvertime = 0
            for (let index = firstDay; index <= endDay; index++) {
                const day = moment(payRoll.start_date).startOf('month').add(index - 1, 'day')
                ranges.push(day)
                const att = getAttendancesFromRange(day)
                for (const a of att) {
                    if (a.clock_out && a.clock_in)
                        totalHours += (moment(a.clock_out).diff(moment(a.clock_in), "minutes"))
                    if (a.overtime) totalOvertime += stringHourToNumber(a.overtime)
                }
                if (att.length) {
                    totalDays++
                }

            }
            setTotalDays(totalDays)
            setTotalHours(totalHours)
            setTotalOvertime(totalOvertime)
            setDateAttendanceRanges(ranges)
        }

    }, [payRoll, attendances]);
    const getDetail = async () => {
        try {
            setIsLoading(true)
            const resp = await getPayRollDetail(payRollId!)
            const respJson = await resp.json()
            setPayRoll(respJson.data)


        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const getAttendancesFromRange = (date: moment.Moment): Attendance[] => {
        return attendances.filter(e => moment(e.clock_in).format("DD-MM-YYYY") == date.format("DD-MM-YYYY"))
    }

    const countPercentage = (from: number, to: number) => {
        if (to == 0) return null
        const percent = from / to * 100
        if (percent < 50) return <Badge content={`${money(percent)} %`} />
        if (percent >= 50 && percent < 70) return <Badge color='orange' content={`${money(percent)} %`} />
        return <Badge color='green' content={`${money(percent)} %`} />
    }

    const newAttendance = async (item: AttendanceReq) => {
        try {
            addAttendance(item)
            getDetail()
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const updateAttendance = (id: string, item: AttendanceReq) => {
        try {
            editAttendance(id, item)
            getDetail()
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }


    const runPayroll = async () => {
        try {
            await processPayRoll(payRollId!)
            getDetail()
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }


    return (<DashboardLayout permission='read_pay_roll'>
        <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-8'>
            <div className='flex justify-between items-center'>
                <h3 className='font-bold mb-4 text-black text-lg '>Pay Roll Detail</h3>
                {detailExpanded ? <ChevronDownIcon className='cursor-pointer w-5' onClick={() => setDetailExpanded(!detailExpanded)} /> : <ChevronUpIcon className='cursor-pointer w-5' onClick={() => setDetailExpanded(!detailExpanded)} />}
            </div>
            {detailExpanded &&
                <div className='grid grid-cols-4 gap-4'>
                    <Panel bordered header="Info Payroll" className='col-span-2'>
                        <InlineForm title="No. Pay Roll" style={{ marginBottom: 15 }}>
                            {payRoll?.pay_roll_number}
                        </InlineForm>
                        <InlineForm title="Periode" style={{ marginBottom: 15 }}>
                            <Moment format='DD MMM YYYY'>{payRoll?.start_date}</Moment> ~ <Moment format='DD MMM YYYY'>{payRoll?.end_date}</Moment>
                        </InlineForm>
                        <InlineForm title="Jumlah hari kerja" style={{ marginBottom: 15 }}>
                            {totalDays} Hari {countPercentage(totalDays, (employee?.total_working_days ?? 0))}
                        </InlineForm>

                        <InlineForm title="Jumlah Jam kerja" style={{ marginBottom: 15 }}>
                            {numberToDuration(totalHours)} {countPercentage(totalHours / 60, (employee?.total_working_hours ?? 0))}
                        </InlineForm>

                        <InlineForm title="Total Overtime" style={{ marginBottom: 15 }}>
                            {numberToDuration(totalOvertime)}
                        </InlineForm>
                        <InlineForm title="TER" style={{ marginBottom: 15 }} hints='(Tarif Efektif Rata-Rata) digunakan untuk menentukan tarif pajak efektif yang akan dikenakan pada penghasilan karyawan atau individu, berlaku dari Januari 2024'>
                            <Toggle disabled={!editable} onChange={(checked) => {
                                setPayRoll({
                                    ...payRoll!,
                                    is_effective_rate_average: checked
                                })
                                setIsLoading(true)
                                editPayRoll(payRoll!.id, {
                                    pay_roll_number: payRoll?.pay_roll_number ?? "",
                                    title: payRoll?.title ?? "",
                                    notes: payRoll?.notes ?? "",
                                    employee_id: payRoll?.employee_id!,
                                    start_date: moment(payRoll?.start_date).toISOString(),
                                    end_date: moment(payRoll?.end_date).toISOString(),
                                    is_effective_rate_average: checked,
                                    is_gross_up: payRoll!.is_gross_up,
                                }).then(v => getDetail())
                                    .finally(() => setIsLoading(false))

                            }} checked={payRoll?.is_effective_rate_average} />
                        </InlineForm>
                        <InlineForm title="Gross Up" style={{ marginBottom: 15 }} hints='metode dimana perusahaan memberikan tunjangan pajak yang besarnya sama dengan PPh 21 terutang.'>
                            <Toggle disabled={!editable} onChange={(checked) => {
                                setPayRoll({
                                    ...payRoll!,
                                    is_gross_up: checked
                                })
                                setIsLoading(true)
                                editPayRoll(payRoll!.id, {
                                    pay_roll_number: payRoll?.pay_roll_number ?? "",
                                    title: payRoll?.title ?? "",
                                    notes: payRoll?.notes ?? "",
                                    employee_id: payRoll?.employee_id!,
                                    start_date: moment(payRoll?.start_date).toISOString(),
                                    end_date: moment(payRoll?.end_date).toISOString(),
                                    is_effective_rate_average: payRoll!.is_effective_rate_average,
                                    is_gross_up: checked
                                }).then(v => getDetail())
                                    .finally(() => setIsLoading(false))

                            }} checked={payRoll?.is_gross_up} />
                        </InlineForm>
                        <InlineForm title="Status" style={{ marginBottom: 15 }} >
                            {payRoll?.status == "DRAFT" && <Badge className='text-center' color='yellow' content={payRoll?.status} />}
                            {payRoll?.status == "RUNNING" && <Badge className='text-center' color='violet' content={payRoll?.status} />}
                            {payRoll?.status == "FINISHED" && <Badge className='text-center' color='green' content={payRoll?.status} />}
                        </InlineForm>


                        <InlineForm title="Total Sakit" style={{ marginBottom: 10 }}>{money(leaves.filter(e => e.sick).map(e => e.diff).reduce((a, b) => a + b, 0))}</InlineForm>
                        <InlineForm title="Total Izin" style={{ marginBottom: 10 }}>{money(leaves.filter(e => !e.sick).map(e => e.diff).reduce((a, b) => a + b, 0))}</InlineForm>
                        <InlineForm title="Total Alpa" style={{ marginBottom: 10 }}>{money(absents.length)}</InlineForm>

                        {payRoll?.status == "DRAFT" &&
                            <Button onClick={async () => {
                                confirmDelete(() => {
                                    runPayroll()
                                }, 'Perhatian', 'Pastikan semua data telah diperiksa', 'Ya Lanjutkan')

                            }} appearance='primary' color='violet' className='w-48 h-10 mt-12'><RocketLaunchIcon className='mr-2 text-white w-4' /> Proses Payroll</Button>
                        }
                        {payRoll?.status == "RUNNING" &&
                            <Button onClick={async () => {
                                confirmDelete(() => {
                                    setIsLoading(true)
                                    finishPayRoll(payRollId!)
                                        .then(() => getDetail())
                                        .catch((error) => Swal.fire(`Perhatian`, `${error}`, 'error'))
                                        .finally(() => {
                                            setIsLoading(true)
                                        })
                                }, 'Perhatian', 'Pastikan semua data telah diperiksa', 'Ya Lanjutkan')

                            }} appearance='primary' color='green' className='w-48 h-10 mt-12'><CheckIcon className='mr-2 text-white w-4' /> Selesai</Button>
                        }
                    </Panel>
                    <Panel bordered header="Info Karyawan" className='col-span-2'>
                        <div className="grid  grid-cols-4 gap-4">
                            <div className='col-span-3'>
                                <InlineForm title="Nama" style={{ marginBottom: 15 }}>
                                    <div onClick={() => nav(`/employee/${employee?.id}`)}>
                                        {employee?.full_name}

                                    </div>
                                </InlineForm>
                                <InlineForm title="NIP/NIK" style={{ marginBottom: 15 }}>
                                    {employee?.employee_identity_number}
                                </InlineForm>
                                <InlineForm title="Jabatan" style={{ marginBottom: 15 }}>
                                    {employee?.job_title}
                                </InlineForm>
                                <InlineForm title="PTKP" style={{ marginBottom: 15 }}>
                                    {NON_TAXABLE_CODES.find(e => e.value == employee?.non_taxable_income_level_code)?.label}
                                </InlineForm>
                                <InlineForm title="Jumlah hari kerja wajib" style={{ marginBottom: 15 }}>
                                    {employee?.total_working_days} Hari
                                </InlineForm>
                                <InlineForm title="Jumlah Jam kerja wajib" style={{ marginBottom: 15 }}>
                                    {employee?.total_working_hours} Jam
                                </InlineForm>
                                <InlineForm title="Jam Kerja per Hari" style={{ marginBottom: 15 }}>
                                    {numberToDuration((employee?.daily_working_hours ?? 0) * 60)}
                                </InlineForm>
                            </div>
                            <div className='col-span-1 flex justify-center '>
                                <Avatar className='mr-2' bordered size={'xxl'} circle src={employee?.picture_url}
                                    alt={initials(employee?.full_name)} />
                            </div>
                        </div>

                    </Panel>
                </div>
            }
        </div>
        <div className='grid grid-cols-4 gap-4  '>
            <div className=' col-span-3'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-4'>
                    <div className='flex justify-between mb-2'>
                        <h3 className='font-bold mb-4 text-black text-lg'>{"Uraian"}</h3>
                        {itemExpanded ? <ChevronDownIcon className='cursor-pointer w-5' onClick={() => setItemExpanded(!itemExpanded)} /> : <ChevronUpIcon className='cursor-pointer w-5' onClick={() => setItemExpanded(!itemExpanded)} />}
                    </div>
                    {itemExpanded &&
                        <div className=' overflow-auto'>
                            <table className="w-full h-full text-sm text-left rtl:text-right text-gray-700">
                                <thead>
                                    <tr>
                                        <td colSpan={3}>
                                            <h3 className='p-2 text-xl font-bold'>Pendapatan</h3>
                                        </td>
                                        <td className='text-right'>
                                            {editable &&
                                                <Button size='sm' onClick={() => {
                                                    setInputItem({
                                                        pay_roll_id: payRollId!,
                                                        item_type: "SALARY",
                                                        title: "",
                                                        notes: "",
                                                        is_default: false,
                                                        is_deductible: false,
                                                        is_tax: false,
                                                        tax_auto_count: false,
                                                        is_tax_cost: false,
                                                        is_tax_allowance: false,
                                                        amount: 0,
                                                    })
                                                    setModalIncome(true)
                                                }} appearance='ghost' ><PlusIcon className='w-4 mr-2' /> Tambah</Button>
                                            }
                                        </td>
                                    </tr>
                                </thead>
                                <thead className="text-base text-gray-700 font-semibold " >
                                    <tr>
                                        <th scope="col" className={`px-6 py-3 `}>Keterangan</th>
                                        <th scope="col" className={`px-6 py-3 `}>Catatan</th>
                                        <th scope="col" className={`px-6 py-3 text-right`}>Jumlah</th>
                                        <th scope="col" className={`px-6 py-3 text-right w-16`}></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {(payRoll?.items ?? []).filter(e => e.item_type != "DEDUCTION").map(e => (<tr key={e.id}>
                                        <td scope="col" className={`px-6 py-3 `}>{e.title}</td>
                                        <td scope="col" className={`px-6 py-3 `}>
                                            {editable ?
                                                <input placeholder='catatan ...' className='w-full' id={`notes-${e.id}`} type="text" defaultValue={e.notes} onBlur={(el) => {
                                                    setIsLoading(true)
                                                    editPayRollItem(e.id, {
                                                        pay_roll_id: payRollId!,
                                                        item_type: e.item_type,
                                                        title: e.title,
                                                        notes: el.target.value,
                                                        is_default: e.is_default,
                                                        is_deductible: e.is_deductible,
                                                        is_tax: e.is_tax,
                                                        tax_auto_count: e.tax_auto_count,
                                                        is_tax_cost: e.is_tax_cost,
                                                        is_tax_allowance: e.is_tax_allowance,
                                                        amount: e.amount,
                                                    })
                                                        .then(() => getDetail())
                                                        .finally(() => {
                                                            setIsLoading(false)
                                                        })
                                                }} onKeyUp={(el) => {
                                                    if (el.key == "Enter") {
                                                        document.getElementById(`notes-${e.id}`)!.blur();
                                                    }
                                                }} />
                                                : <small>{e.notes}</small>}
                                        </td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {editable && !e.is_default && mountedInput ?
                                                <CurrencyInput
                                                    decimalsLimit={0}
                                                    id={`item-${e.id}`}
                                                    className='text-right'
                                                    groupSeparator="."
                                                    decimalSeparator=","
                                                    defaultValue={e.amount ?? 0}
                                                    onBlur={(el) => {
                                                        setIsLoading(true)
                                                        editPayRollItem(e.id, {
                                                            pay_roll_id: payRollId!,
                                                            item_type: e.item_type,
                                                            title: e.title,
                                                            notes: e.notes,
                                                            is_default: e.is_default,
                                                            is_deductible: e.is_deductible,
                                                            is_tax: e.is_tax,
                                                            tax_auto_count: e.tax_auto_count,
                                                            is_tax_cost: e.is_tax_cost,
                                                            is_tax_allowance: e.is_tax_allowance,
                                                            amount: parseAmount(el.target.value),
                                                        })
                                                            .then(() => getDetail())
                                                            .finally(() => {
                                                                setIsLoading(false)
                                                            })
                                                    }} onKeyUp={(el) => {
                                                        if (el.key == "Enter") {
                                                            document.getElementById(`item-${e.id}`)!.blur();
                                                        }
                                                    }}
                                                />
                                                : money(e.amount)}
                                        </td>
                                        <td>
                                            {!e.is_default && editable &&
                                                <TrashIcon
                                                    className=" h-5 w-5 text-red-400 hover:text-red-600"
                                                    aria-hidden="true"
                                                    onClick={() => {
                                                        confirmDelete(() => {
                                                            deletePayRollItem(e.id).then(v => getDetail())
                                                        })
                                                    }}
                                                />
                                            }
                                        </td>
                                    </tr>))}
                                    {(payRoll?.tax_allowance ?? 0) > 0 &&
                                        <tr>
                                            <td scope="col" className={`px-6 py-3 `} colSpan={2}>Tunjangan PPH</td>
                                            <td scope="col" className={`px-6 py-3 text-right`}>
                                                {money(payRoll?.tax_allowance, 0)}  </td>
                                            <td></td>
                                        </tr>
                                    }
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`} colSpan={2}>Total Pendapatan</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money(payRoll?.total_income, 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-sm`} colSpan={2}>Total Reimbursement</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money(payRoll?.total_reimbursement, 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                    {payRoll?.costs.filter(e => !e.debt_deposit).map(e => <tr key={e.id}>
                                        <td scope="col" className={`px-6 py-3  text-sm`} colSpan={2}>{e.description}{` (${money(e.tariff * 100)}%)`}</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money(e.amount, 0)}
                                        </td>
                                        <td></td>
                                    </tr>)}
                                </tbody>
                                <thead>
                                    <tr>
                                        <td colSpan={3}>
                                            <h3 className='p-2 text-xl font-bold'>Potongan</h3>

                                        </td>
                                        <td className='text-right'>
                                            {editable &&
                                                <Button
                                                    onClick={() => {
                                                        setInputItem({
                                                            pay_roll_id: payRollId!,
                                                            item_type: "DEDUCTION",
                                                            title: "",
                                                            notes: "",
                                                            is_default: false,
                                                            is_deductible: false,
                                                            is_tax: false,
                                                            tax_auto_count: false,
                                                            is_tax_cost: false,
                                                            is_tax_allowance: false,
                                                            amount: 0,
                                                        })
                                                        setModalExpense(true)
                                                    }}
                                                    size='sm' appearance='ghost' ><PlusIcon className='w-4 mr-2' /> Tambah</Button>
                                            }
                                        </td>
                                    </tr>
                                </thead>
                                <thead className="text-base text-gray-700 font-semibold " >
                                    <tr>
                                        <th scope="col" className={`px-6 py-3 `}>Keterangan</th>
                                        <th scope="col" className={`px-6 py-3 `}>Catatan</th>
                                        <th scope="col" className={`px-6 py-3 text-right`}>Jumlah</th>
                                        <th scope="col" className={`px-6 py-3 text-right w-16`}></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {(payRoll?.items ?? []).filter(e => e.item_type == "DEDUCTION" && !e.is_tax_cost && !e.is_tax).map(e => (<tr key={e.id}>
                                        <td scope="col" className={`px-6 py-3 `}>{e.title}</td>
                                        <td scope="col" className={`px-6 py-3 `}>
                                            {editable ?
                                                <input placeholder='catatan ...' className='w-full' id={`notes-${e.id}`} type="text" defaultValue={e.notes} onBlur={(el) => {
                                                    setIsLoading(true)
                                                    editPayRollItem(e.id, {
                                                        pay_roll_id: payRollId!,
                                                        item_type: e.item_type,
                                                        title: e.title,
                                                        notes: el.target.value,
                                                        is_default: e.is_default,
                                                        is_deductible: e.is_deductible,
                                                        is_tax: e.is_tax,
                                                        tax_auto_count: e.tax_auto_count,
                                                        is_tax_cost: e.is_tax_cost,
                                                        is_tax_allowance: e.is_tax_allowance,
                                                        amount: e.amount,
                                                    })
                                                        .then(() => getDetail())
                                                        .finally(() => {
                                                            setIsLoading(false)
                                                        })
                                                }} onKeyUp={(el) => {
                                                    if (el.key == "Enter") {
                                                        document.getElementById(`notes-${e.id}`)!.blur();
                                                    }
                                                }} />
                                                : <small>{e.notes}</small>}
                                        </td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {editable && !e.is_default && !e.is_tax && mountedInput ?
                                                <CurrencyInput
                                                    decimalsLimit={0}
                                                    id={`item-${e.id}`}
                                                    className='text-right'
                                                    groupSeparator="."
                                                    decimalSeparator=","
                                                    defaultValue={e.amount}
                                                    onBlur={(el) => {
                                                        setIsLoading(true)
                                                        editPayRollItem(e.id, {
                                                            pay_roll_id: payRollId!,
                                                            item_type: e.item_type,
                                                            title: e.title,
                                                            notes: e.notes,
                                                            is_default: e.is_default,
                                                            is_deductible: e.is_deductible,
                                                            is_tax: e.is_tax,
                                                            tax_auto_count: e.tax_auto_count,
                                                            is_tax_cost: e.is_tax_cost,
                                                            is_tax_allowance: e.is_tax_allowance,
                                                            amount: parseAmount(el.target.value),
                                                        })
                                                            .then(() => getDetail())
                                                            .finally(() => {
                                                                setIsLoading(false)
                                                            })
                                                    }} onKeyUp={(el) => {
                                                        if (el.key == "Enter") {
                                                            document.getElementById(`item-${e.id}`)!.blur();
                                                        }
                                                    }}
                                                />
                                                : money(e.amount, 0)}
                                        </td>
                                        <td>
                                            {!e.is_default && !e.is_tax && !e.is_tax_allowance && !e.is_tax_cost && editable &&
                                                <TrashIcon
                                                    className=" h-5 w-5 text-red-400 hover:text-red-600"
                                                    aria-hidden="true"
                                                    onClick={() => {
                                                        confirmDelete(() => {
                                                            deletePayRollItem(e.id).then(v => getDetail())
                                                        })
                                                    }}
                                                />
                                            }
                                        </td>
                                    </tr>))}
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`} colSpan={2}>Total Potongan</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money(payRoll?.total_deduction, 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`} colSpan={2}>PPH</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money(payRoll?.total_tax, 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`} colSpan={2}>Biaya Jabatan</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money(payRoll?.tax_cost, 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`} colSpan={2}>Take Home Pay + Reimbursement</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money((payRoll?.take_home_pay ?? 0) + (payRoll?.total_reimbursement ?? 0), 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`} colSpan={2}>Terbilang</td>
                                        <td scope="col" className={`px-6 py-3 text-right text-lg`} colSpan={2}>
                                            {(payRoll?.take_home_pay_reimbursement_counted)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    }


                </div>

                {(payRoll?.transactions ?? []).length > 0 &&
                    <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-4'>
                        <div className='flex justify-between mb-2'>
                            <h3 className='font-bold mb-4 text-black text-lg'>{"Riwayat Transaksi"}</h3>
                            {transactionExpanded ? <ChevronDownIcon className='cursor-pointer w-5' onClick={() => setTransactionExpanded(!transactionExpanded)} /> : <ChevronUpIcon className='cursor-pointer w-5' onClick={() => setTransactionExpanded(!transactionExpanded)} />}
                        </div>
                        {transactionExpanded &&
                            <div className=' overflow-auto'>
                                <CustomTable

                                    headers={["No", "Tgl", "Keterangan", "Kategori", "Jumlah", ""]} headerClasses={["", "", "", "", "text-right"]} datasets={[
                                        ...(payRoll?.transactions ?? []).filter(e => !e.is_expense && !e.is_pay_roll_payment).map(e => ({
                                            cells: [
                                                { data: payRoll!.transactions!.filter(e => !e.is_expense && !e.is_pay_roll_payment).indexOf(e) + 1 },
                                                { data: <Moment format='DD/MM/YYYY'>{e.date}</Moment> },
                                                { data: e.description },
                                                { data: e.account_destination_name },
                                                { data: money(e.credit - e.debit, 0), className: "text-right" },
                                                {
                                                    data: permissions.includes("payment_pay_roll") && !e.is_pay_roll_payment && payRoll?.status == "RUNNING" && <div>
                                                        {toolTip("Pembayaran", <LuWallet2 onClick={() => {
                                                            getTransactionDetail(e.id)
                                                                .then(v => v.json())
                                                                .then(v => {
                                                                    setTransactionPayment(v.data)

                                                                })
                                                        }} className='w-6 cursor-pointer text-blue-400 hover:text-blue-600' />)}

                                                    </div>, className: "text-right"
                                                },
                                            ]
                                        })),
                                        {
                                            cells: [
                                                { data: "" },
                                                { data: <div className=' font-bold'>Total</div> },
                                                { data: "" },
                                                { data: "" },
                                                { data: money((payRoll?.transactions ?? []).filter(s => !s.is_expense && !s.is_pay_roll_payment).map(s => s.credit).reduce((a, b) => a + b, 0), 0), className: "text-right" },
                                            ]
                                        },
                                        {
                                            cells: [
                                                { data: <h3 className='font-bold text-black text-base'>Riwayat Pembayaran</h3>, colSpan: 3 },
                                            ]
                                        },


                                        ...(payRoll?.transactions ?? []).filter(e => e.is_pay_roll_payment).map(e => ({
                                            cells: [
                                                { data: payRoll!.transactions!.filter(e => e.is_pay_roll_payment).indexOf(e) + 1 },
                                                { data: <Moment format='DD/MM/YYYY'>{e.date}</Moment> },
                                                { data: e.description },
                                                { data: e.account_destination_name },
                                                { data: money(e.debit - e.credit, 0), className: "text-right" },
                                                {
                                                    data: !e.is_pay_roll_payment && <div>
                                                        {toolTip("Pembayaran", <LuWallet2 onClick={() => {
                                                            getTransactionDetail(e.id)
                                                                .then(v => v.json())
                                                                .then(v => {
                                                                    setTransactionPayment(v.data)

                                                                })
                                                        }} className='w-6 cursor-pointer text-blue-400 hover:text-blue-600' />)}

                                                    </div>, className: "text-right"
                                                },
                                            ]
                                        })),
                                        {
                                            cells: [
                                                { data: "" },
                                                { data: <div className=' font-bold'>Total</div> },
                                                { data: "" },
                                                { data: "" },
                                                { data: money((payRoll?.transactions ?? []).filter(s => s.is_pay_roll_payment).map(s => s.debit).reduce((a, b) => a + b, 0), 0), className: "text-right" },
                                            ]
                                        },
                                        {
                                            cells: [
                                                { data: <h3 className='font-bold text-black text-base'>Sisa Pembayaran</h3>, colSpan: 3 },
                                                { data: "" },
                                                {
                                                    data: money(
                                                        (
                                                            (payRoll?.transactions ?? []).filter(s => !s.is_expense && !s.is_pay_roll_payment).map(s => s.credit).reduce((a, b) => a + b, 0) -
                                                            (payRoll?.transactions ?? []).filter(s => s.is_pay_roll_payment).map(s => s.debit).reduce((a, b) => a + b, 0)
                                                        ), 0
                                                    ), className: "text-right"
                                                },
                                            ]
                                        },
                                    ]} />
                            </div>
                        }



                    </div>
                }
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                    <div className='flex justify-between mb-2'>
                        <h3 className='font-bold mb-4 text-black text-lg'>{"Data Absensi"}</h3>
                        <div className=' flex items-center'>
                            <Button onClick={async () => {

                                try {
                                    setIsLoading(true)
                                    const resp = await getAttendances({ page: 1, limit: 1000 }, {
                                        dateRange: [moment(payRoll?.start_date).toDate(), moment(payRoll?.end_date + " 23:59:59").toDate()],
                                        employeeIDs: payRoll?.employee_id,

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


                            }} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-2'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Laporan</Button>
                            {attendanceExpanded ? <ChevronDownIcon className='cursor-pointer w-5' onClick={() => setAttendanceExpanded(!attendanceExpanded)} /> : <ChevronUpIcon className='cursor-pointer w-5' onClick={() => setAttendanceExpanded(!attendanceExpanded)} />}
                        </div>
                    </div>
                    {attendanceExpanded &&
                        <CustomTable className=''

                            headers={["No", "Tgl", "Jam Masuk", "Jam Keluar", "Durasi", "Overtime", ""]} headerClasses={["w-8"]} datasets={dateAttendanceRanges.map(e => {
                                const selAtt = getAttendancesFromRange(e)
                                return ({
                                    cells: [{ data: dateAttendanceRanges.indexOf(e) + 1, className: 'w-8' },
                                    {
                                        data:
                                            <div className={`${e.isoWeekday() == 7 ? 'text-red-400' : ''} flex flex-col`}>
                                                <p className=' text-sm'><Moment locale='id' format='dddd'>{e}</Moment></p>
                                                <Moment locale='id' format='DD MMM YYYY'>{e}</Moment>
                                            </div>
                                    }, {
                                        data: <div className='flex flex-col'>
                                            {selAtt.map(a => (<div className='mb-4' key={a.id}>
                                                <input disabled={!editable} className='w-24' id={`clockin-${a.id}`} type="time" defaultValue={moment(a.clock_in).format("HH:mm")} onBlur={(el) => {
                                                    const att = moment(moment(`${a.clock_in}`).format(`YYYY-MM-DD`) + " " + el.target.value).toISOString()
                                                    if (att) {
                                                        updateAttendance(a.id, {
                                                            clock_in: att
                                                        })
                                                    }
                                                }} onKeyUp={(el) => {
                                                    if (el.key == "Enter") {
                                                        document.getElementById(`clockin-${a.id}`)!.blur();
                                                    }
                                                }} />
                                            </div>))}
                                            {selAtt.length == 0 && <input disabled={!editable} className='w-24' id={`new-clockin-${e.toISOString()}`} type="time" defaultValue={undefined} onBlur={(el) => {
                                                const att = moment(moment(`${e}`).format(`YYYY-MM-DD`) + " " + el.target.value).toISOString()
                                                if (att) {
                                                    newAttendance({
                                                        clock_in: att,
                                                        employee_id: employee?.id!
                                                    })
                                                }
                                            }} onKeyUp={(el) => {
                                                if (el.key == "Enter") {
                                                    document.getElementById(`new-clockin-${e.toISOString()}`)!.blur();
                                                }
                                            }} />}
                                        </div>
                                    }, {
                                        data: <div className='flex flex-col'>
                                            {selAtt.map(a => (<div className='mb-4' key={a.id}>
                                                <input disabled={!editable} className='w-24' id={`clockout-${a.id}`} type="time" defaultValue={!a.clock_out ? "" : moment(a.clock_out).format("HH:mm")} onBlur={(el) => {
                                                    const att = moment(moment(`${e}`).format(`YYYY-MM-DD`) + " " + el.target.value).toISOString()
                                                    // if (!a.clock_out) {
                                                    //     att = moment(moment(`${e}`).format(`YYYY-MM-DD`) + " " + el.target.value).toISOString()
                                                    // }
                                                    if (att) {
                                                        updateAttendance(a.id, {
                                                            clock_in: a.clock_in,
                                                            clock_out: att,
                                                        })
                                                    }
                                                }} onKeyUp={(el) => {
                                                    if (el.key == "Enter") {
                                                        document.getElementById(`clockout-${a.id}`)!.blur();
                                                    }
                                                }} />
                                            </div>))}
                                        </div>
                                    },
                                    {
                                        data: <div>
                                            {selAtt.map(a => (<div className='mb-4' key={a.id}>
                                                {a.clock_in && a.clock_out &&
                                                    <div className={stringHourToNumber(a.working_duration) >= ((employee?.daily_working_hours ?? 0) * 60) ? '' : 'text-red-400'}>
                                                        {/* {numberToDuration(moment(a.clock_out).diff(moment(a.clock_in), 'minutes'))} */}
                                                        {a.working_duration}
                                                        <br />

                                                    </div>
                                                }
                                            </div>))}
                                        </div>
                                    },
                                    {
                                        data: <div>
                                            {selAtt.map(a => (<div className='mb-4' key={a.id}>
                                                {/* {`${countOverTime(a)}`} */}
                                                {a.overtime}
                                            </div>))}
                                        </div>
                                    },
                                    {
                                        data:
                                            <div>
                                                {selAtt.map(a => (<div className='mb-4' key={a.id}>
                                                    {editable &&
                                                        <TrashIcon
                                                            className=" h-5 w-5 text-red-400 hover:text-red-600"
                                                            aria-hidden="true"
                                                            onClick={() => {
                                                                confirmDelete(() => {
                                                                    deleteAttendance(a.id).then(v => getDetail())
                                                                })
                                                            }}
                                                        />
                                                    }
                                                </div>))}
                                            </div>
                                    }
                                    ], className: "hover:bg-gray-50 border-b last:border-b-0"
                                });
                            })} />
                    }
                </div>
            </div>
            <div className='col-span-1'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-4'>
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
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-4 '>
                    <div className='flex justify-between'>
                        <h3 className='font-bold mb-4 text-black text-lg'>{"Cuti & Izin"}</h3>

                    </div>
                    <ul className='mb-8'>
                        {leaves.map(e => (<li key={e.id} className='mt-4'>
                            <h3 className=' text-lg text-gray-800 leading-5'>{e.description}</h3>
                            {e.request_type == "FULL_DAY" && <div className='text-sm mt-2'> <Moment format='DD/MM/YYYY'>{e.start_date}</Moment> ~ <Moment format='DD/MM/YYYY'>{e.end_date}</Moment></div>}
                        </li>))}
                    </ul>

                </div>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg '>
                    <div className='flex justify-between'>
                        <h3 className='font-bold mb-4 text-black text-lg'>{"Alpa"}</h3>

                    </div>
                    <ul className='mb-8'>
                        {absents.map(e => (<li key={e.id} className='mt-4'>
                            <h3 className=' text-lg text-gray-800 leading-5'>{e.description}</h3>
                            {e.request_type == "FULL_DAY" && <div className='text-sm mt-2'> <Moment format='DD/MM/YYYY'>{e.start_date}</Moment> ~ <Moment format='DD/MM/YYYY'>{e.end_date}</Moment></div>}
                        </li>))}
                    </ul>

                </div>
            </div>
        </div>
        <Modal className='custom-modal' size={"md"} open={modalIncome} onClose={() => setModalIncome(false)}>
            <Modal.Header>
                <Modal.Title>Form Pendapatan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InlineForm title="Tipe">
                    <SelectPicker value={inputItem?.item_type!}
                        onSelect={(val) => {
                            setInputItem({
                                ...inputItem!,
                                item_type: val,
                            })
                        }}
                        block placeholder="Pilih Tipe" data={[{ value: "SALARY", label: "Gaji/Upah" }, { value: "ALLOWANCE", label: "Tunjangan" }, { value: "OVERTIME", label: "Lembur" }, { value: "REIMBURSEMENT", label: "Reimbursement" }]}></SelectPicker>
                </InlineForm>
                {inputItem?.item_type == "REIMBURSEMENT" &&
                    <InlineForm title="Reimbursement">
                        <SelectPicker value={inputItem?.reimbursement_id!}
                            onSelect={(val) => {

                                setInputItem({
                                    ...inputItem!,
                                    reimbursement_id: val,
                                    amount: reimbursements.find(e => e.id == `${val}`)?.total ?? 0,
                                    title: reimbursements.find(e => e.id == `${val}`)?.name ?? "",
                                })
                            }}
                            block placeholder="Pilih Reimbursement" data={reimbursements.map(e => ({ value: e.id, label: `${e.name} - ${money(e.total)}` }))}></SelectPicker>
                    </InlineForm>
                }
                <InlineForm title="Keterangan" style={{ alignItems: 'start' }}>
                    <input placeholder='ex: Tunjangan Pendidikan ....' value={inputItem?.title} onChange={(el) => setInputItem({
                        ...inputItem!,
                        title: el.target.value,
                    })} className="form-control" />
                </InlineForm>

                <InlineForm title="Catatan" style={{ alignItems: 'start' }}>
                    <textarea placeholder='ex: Tunjangan Pendidikan  ....' rows={5} value={inputItem?.notes} onChange={(el) => setInputItem({
                        ...inputItem!,
                        notes: el.target.value,
                    })} className="form-control" />
                </InlineForm>
                <InlineForm title="Jumlah" style={{ alignItems: 'start' }}>
                    <CurrencyInput
                        className='form-control'
                        groupSeparator="."
                        decimalSeparator=","
                        value={inputItem?.amount}
                        onValueChange={(_, __, val) => {
                            setInputItem({
                                ...inputItem!,
                                amount: val?.float ?? 0,
                            })
                        }}
                    />
                </InlineForm>

            </Modal.Body>
            <Modal.Footer>
                <Button className='mr-2' appearance='primary' onClick={async () => {
                    try {
                        setIsLoading(true)
                        await addPayRollItem(inputItem!)
                        setInputItem(null)
                        setModalIncome(false)
                        getDetail()
                    } catch (error) {
                        Swal.fire(`Perhatian`, `${error}`, 'error')
                    } finally {
                        setIsLoading(false)
                    }


                }}>
                    <BsFloppy2 className='mr-2' /> Simpan
                </Button>
            </Modal.Footer>
        </Modal>


        <Modal className='custom-modal' size={"md"} open={modalExpense} onClose={() => setModalExpense(false)}>
            <Modal.Header>
                <Modal.Title>Form Potongan</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <InlineForm title="Keterangan" style={{ alignItems: 'start' }}>
                    <input placeholder='ex: Potongan Tidak Masuk ....' value={inputItem?.title} onChange={(el) => setInputItem({
                        ...inputItem!,
                        title: el.target.value,
                    })} className="form-control" />
                </InlineForm>

                <InlineForm title="Catatan" style={{ alignItems: 'start' }}>
                    <textarea placeholder='ex: Potongan Tidak Masuk  ....' rows={5} value={inputItem?.notes} onChange={(el) => setInputItem({
                        ...inputItem!,
                        notes: el.target.value,
                    })} className="form-control" />
                </InlineForm>

                <InlineForm title="Non Deductible" style={{ alignItems: 'start' }} hints='Non-Deductible Expenses adalah biaya-biaya yang tidak dapat dikurangkan dari penghasilan bruto dalam hal perhitungan Penghasilan Kena Pajak. Contoh Non Deductible Expense adalah pembayaran imbalan dalam bentuk natura, sumbangan, pengeluaran untuk kepentingan pribadi pemilik, cadangan atau pemupukan dana cadangan, pajak penghasilan, dan biaya lainnya yang tidak diperbolehkan'>
                    <Toggle disabled={!editable} onChange={(checked) => {
                        setInputItem({
                            ...inputItem!,
                            is_deductible: !checked,
                        })
                    }} checked={!(inputItem?.is_deductible ?? false)} />
                </InlineForm>
                <InlineForm title="Jumlah" style={{ alignItems: 'start' }}>
                    <CurrencyInput
                        className='form-control'
                        groupSeparator="."
                        decimalSeparator=","
                        value={inputItem?.amount}
                        onValueChange={(_, __, val) => {
                            setInputItem({
                                ...inputItem!,
                                amount: val?.float ?? 0,
                            })
                        }}
                    />
                </InlineForm>

            </Modal.Body>
            <Modal.Footer>
                <Button className='mr-2' appearance='primary' onClick={async () => {
                    try {
                        setIsLoading(true)
                        await addPayRollItem(inputItem!)
                        setInputItem(null)
                        setModalExpense(false)
                        getDetail()
                    } catch (error) {
                        Swal.fire(`Perhatian`, `${error}`, 'error')
                    } finally {
                        setIsLoading(false)
                    }


                }}>
                    <BsFloppy2 className='mr-2' /> Simpan
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal className='custom-modal' size={"md"} open={transactionPayment != null} onClose={() => setTransactionPayment(null)}>
            <Modal.Header>
                <Modal.Title>Pembayaran {transactionPayment?.description}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InlineForm title="Tanggal">
                    <DatePicker className='w-full' value={date} onChange={(val) => setDate(val!)} placement="bottomEnd" format='dd/MM/yyyy' />
                </InlineForm>
                <InlineForm title="Keterangan" style={{ alignItems: 'start' }}>
                    <textarea placeholder='Keterangan ....' rows={5} value={description} onChange={(el) => setDescription(el.target.value)} className="form-control" />
                </InlineForm>
                <InlineForm title="Akun Kas">
                    <SelectPicker searchable={true} data={assetAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedAssetAccount} onSelect={(val) => setSelectedAssetAccount(val)} block />
                </InlineForm>

                <InlineForm title="Jumlah">
                    {mountedInput && amount > 0 ?
                        <CurrencyInput
                            decimalsLimit={0}
                            id={`payment-${transactionPayment?.id}`}
                            className='form-control'
                            groupSeparator="."
                            decimalSeparator=","
                            value={amount}
                            onValueChange={(_, __, val) => {
                                setAmount(val?.float ?? 0)
                            }}

                        />
                        : money(amount)
                    }
                </InlineForm>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={amount == 0} appearance='primary' color='orange' onClick={() => {
                    setIsLoading(true)
                    paymentPayRoll(payRollId!, {
                        transaction_ref_id: transactionPayment!.id,
                        date: date.toISOString(),
                        amount: amount,
                        account_destination_id: selectedAssetAccount,
                        description: description
                    })
                        .then((v) => {
                            setTransactionPayment(null)
                            setDescription("")
                            setAmount(0)
                            getDetail()
                        })
                        .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
                        .finally(() => setIsLoading(false))
                }}>
                    <LuWallet2 className='w-6' /> Simpan Pembayaran
                </Button>
            </Modal.Footer>
        </Modal>

    </DashboardLayout>);
}
export default PayRollDetail;